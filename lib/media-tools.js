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

/**
 * Convert audio bytes (mp3 etc.) to OGG/Opus for WhatsApp push-to-talk voice notes.
 */
async function audioToPttOgg(audioBuffer) {
    const tmpIn = tmpName('.mp3');
    const tmpOut = tmpName('.ogg');
    try {
        fs.writeFileSync(tmpIn, audioBuffer);
        await runFfmpeg(['-y', '-i', tmpIn, '-ar', '48000', '-ac', '1', '-b:a', '64k', '-c:a', 'libopus', tmpOut]);
        const out = fs.readFileSync(tmpOut);
        if (out.length < 1000) throw new Error('ffmpeg produced empty ogg');
        return out;
    } finally {
        try { fs.unlinkSync(tmpIn); } catch (e) {}
        try { fs.unlinkSync(tmpOut); } catch (e) {}
    }
}

module.exports = { gifToMp4, audioToPttOgg, getFfmpeg };
