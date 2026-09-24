const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

let ffmpegBin = null;
function getFfmpeg() {
    if (ffmpegBin) return ffmpegBin;
    // Prefer system ffmpeg, fall back to the bundled ffmpeg-static binary
    try {
        require('child_process').execSync('ffmpeg -version', { stdio: 'ignore' });
        ffmpegBin = 'ffmpeg';
    } catch (e) {
        try {
            const staticPath = require('ffmpeg-static');
            if (staticPath && fs.existsSync(staticPath)) ffmpegBin = staticPath;
        } catch (e2) {}
    }
    if (!ffmpegBin) throw new Error('ffmpeg is not available on this system');
    return ffmpegBin;
}

function runFfmpeg(args, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
        const proc = spawn(getFfmpeg(), args, { stdio: ['ignore', 'ignore', 'pipe'] });
        let stderr = '';
        proc.stderr.on('data', (d) => { stderr += d.toString(); });
        const timer = setTimeout(() => {
            proc.kill('SIGKILL');
            reject(new Error('ffmpeg timed out'));
        }, timeoutMs);
        proc.on('close', (code) => {
            clearTimeout(timer);
            if (code === 0) resolve();
            else reject(new Error(`ffmpeg exited ${code}: ${stderr.slice(-300)}`));
        });
        proc.on('error', (err) => { clearTimeout(timer); reject(err); });
    });
}

const tmpName = (ext) => path.join(os.tmpdir(), `xeon_${Date.now()}_${Math.floor(Math.random() * 1e6)}${ext}`);

/**
 * Convert GIF bytes to an MP4 that WhatsApp can play with gifPlayback.
 * Uses -movflags faststart so the moov atom is up front (streamable).
 */
async function gifToMp4(gifBuffer) {
    const tmpIn = tmpName('.gif');
    const tmpOut = tmpName('.mp4');
    try {
        fs.writeFileSync(tmpIn, gifBuffer);
        await runFfmpeg(['-y', '-i', tmpIn, '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', 'scale=512:-2:flags=lanczos', '-an', tmpOut]);
        const out = fs.readFileSync(tmpOut);
        if (out.length < 1000) throw new Error('ffmpeg produced empty mp4');
        return out;
    } finally {
        try { fs.unlinkSync(tmpIn); } catch (e) {}
        try { fs.unlinkSync(tmpOut); } catch (e) {}
    }
}

const axios = require('axios');

/**
 * Generate a visual audio waveform for WhatsApp voice note preview
 */
function generateWaveform(audioBuf, length = 64) {
    const wave = new Uint8Array(length);
    if (audioBuf && audioBuf.length > 0) {
        const step = Math.floor(audioBuf.length / length) || 1;
        for (let i = 0; i < length; i++) {
            const byte = audioBuf[Math.min(i * step + 24, audioBuf.length - 1)] || 0;
            wave[i] = Math.max(10, Math.min(95, Math.floor((byte / 255) * 80 + 15)));
        }
    } else {
        for (let i = 0; i < length; i++) {
            wave[i] = Math.floor(20 + Math.sin(i / 2) * 20 + Math.random() * 15);
        }
    }
    return wave;
}

/**
 * Convert audio bytes (mp3, wav, etc.) to 100% compliant OGG/Opus (Mono, 48kHz, zero timestamp)
 * strictly required for WhatsApp Push-to-Talk (PTT) voice note playback.
 */
async function audioToPttOgg(audioBuffer) {
    if (!audioBuffer || !audioBuffer.length) throw new Error('No audio buffer provided to audioToPttOgg');
    const tmpIn = tmpName('.mp3');
    const tmpOut = tmpName('.ogg');
    try {
        fs.writeFileSync(tmpIn, audioBuffer);
        await runFfmpeg([
            '-y',
            '-i', tmpIn,
            '-vn',
            '-c:a', 'libopus',
            '-b:a', '64k',
            '-vbr', 'on',
            '-compression_level', '10',
            '-ar', '48000',
            '-ac', '1',
            '-avoid_negative_ts', 'make_zero',
            '-f', 'ogg',
            tmpOut
        ]);
        const out = fs.readFileSync(tmpOut);
        if (out.length < 50) throw new Error('ffmpeg produced empty ogg');
        return out;
    } finally {
        try { fs.unlinkSync(tmpIn); } catch (e) {}
        try { fs.unlinkSync(tmpOut); } catch (e) {}
    }
}

/**
 * Convert text into a WhatsApp-playable PTT voice note (OGG Opus Mono + waveform)
 */
async function textToPttVoiceNote(text, lang = 'en') {
    if (!text) return null;
    const cleanText = text
        .replace(/https?:\/\/\S+/gi, '')
        .replace(/[*_~`]/g, '')
        .trim()
        .slice(0, 300);
    if (!cleanText) return null;

    const urls = [
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${lang}&client=tw-ob`,
        `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${lang}&client=gtx`
    ];

    let audioRaw = null;
    for (const u of urls) {
        try {
            const res = await axios.get(u, {
                responseType: 'arraybuffer',
                timeout: 12000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Referer': 'https://translate.google.com/'
                }
            });
            if (res.data && res.data.length > 200) {
                audioRaw = Buffer.from(res.data);
                break;
            }
        } catch (e) {}
    }

    if (!audioRaw) return null;
    const oggBuffer = await audioToPttOgg(audioRaw);
    const waveform = generateWaveform(oggBuffer, 64);
    return { buffer: oggBuffer, waveform };
}

module.exports = { gifToMp4, audioToPttOgg, generateWaveform, textToPttVoiceNote, getFfmpeg };
