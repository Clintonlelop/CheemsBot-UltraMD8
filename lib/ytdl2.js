const yts = require('youtube-yts');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const NodeID3 = require('node-id3');
const { randomBytes, createDecipheriv } = require('crypto');
const { spawnSync } = require('child_process');
const { fetchBuffer } = require("./myfunc2");
const btch = require('btch-downloader');
const vreden = require('@vreden/youtube_scraper');

const ytIdRegex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,11})/;

async function streamToFile(streamUrl, targetFilePath, timeoutMs = 45000) {
    const writer = fs.createWriteStream(targetFilePath);
    const resp = await axios({
        url: streamUrl,
        method: 'GET',
        responseType: 'stream',
        timeout: timeoutMs,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    resp.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(targetFilePath));
        writer.on('error', (err) => {
            try { if (fs.existsSync(targetFilePath)) fs.unlinkSync(targetFilePath); } catch (e) {}
            reject(err);
        });
    });
}

function btchDl(url, timeoutMs = 8000) {
    return Promise.race([
        (async () => {
            const bRes = await btch.youtube(url);
            if (bRes?.status && (bRes?.mp4 || bRes?.mp3)) {
                return {
                    title: bRes.title || 'YouTube Media',
                    channel: bRes.author || 'YouTube',
                    thumbnail: bRes.thumbnail || '',
                    mp4: bRes.mp4 || null,
                    mp3: bRes.mp3 || null
                };
            }
            throw new Error('BTCH did not return valid media');
        })(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('BTCH timeout')), timeoutMs))
    ]);
}

function decodeSavetube(enc) {
    try {
        const secret_key = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = Buffer.from(secret_key, 'hex');
        const decipher = createDecipheriv('aes-128-cbc', key, iv);
        return JSON.parse(Buffer.concat([decipher.update(content), decipher.final()]).toString());
    } catch (e) {
        return null;
    }
}

async function savetubeDl(url, targetQuality = 720) {
    const regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{6,11})/;
    const m = url.match(regex);
    const id = m ? m[1] : null;
    const watchUrl = id ? ('https://www.youtube.com/watch?v=' + id) : url;

    const cdn = (await axios.get('https://media.savetube.vip/api/random-cdn', { timeout: 8000 })).data.cdn;
    const infoget = (await axios.post('https://' + cdn + '/v2/info', { url: watchUrl }, {
        timeout: 10000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://save-tube.com/'
        }
    })).data;
    if (!infoget?.data) throw new Error('Savetube metadata extraction failed');
    const info = decodeSavetube(infoget.data);
    if (!info) throw new Error('Failed to decode Savetube metadata');

    const availableQualities = (info.video_formats || []).map(f => Number(f.quality)).filter(q => !isNaN(q));
    const targetQNum = Number(String(targetQuality).replace(/[^0-9]/g, '')) || 720;
    let chosenQuality = 720;
    if (availableQualities.includes(targetQNum)) {
        chosenQuality = targetQNum;
    } else if (availableQualities.includes(720)) {
        chosenQuality = 720;
    } else if (availableQualities.includes(1080)) {
        chosenQuality = 1080;
    } else if (availableQualities.includes(480)) {
        chosenQuality = 480;
    } else if (availableQualities.includes(360)) {
        chosenQuality = 360;
    } else if (availableQualities.length > 0) {
        chosenQuality = Math.max(...availableQualities);
    }

    const dlRes = (await axios.post('https://' + cdn + '/download', {
        downloadType: 'video',
        quality: String(chosenQuality),
        key: info.key
    }, {
        timeout: 15000,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://save-tube.com/'
        }
    })).data;

    if (!dlRes?.data?.downloadUrl) throw new Error('Savetube returned no download URL');
    return {
        title: info.title || 'YouTube Video',
        duration: info.duration || 0,
        channel: info.author || 'YouTube',
        quality: `${chosenQuality}p`,
        videoUrl: dlRes.data.downloadUrl,
        thumb: info.thumbnail || ''
    };
}

class YT {
    constructor() { }

    static isYTUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        return ytIdRegex.test(url);
    }

    static getVideoID = (url) => {
        if (!this.isYTUrl(url)) throw new Error('is not YouTube URL');
        const match = ytIdRegex.exec(url);
        return match ? match[1] : '';
    }

    static WriteTags = async (filePath, Metadata) => {
        try {
            let imageBuffer;
            if (Metadata.Image) {
                try {
                    const fetched = await fetchBuffer(Metadata.Image);
                    imageBuffer = fetched.buffer;
                } catch (e) {}
            }
            const tags = {
                title: Metadata.Title,
                artist: Metadata.Artist,
                originalArtist: Metadata.Artist,
                album: Metadata.Album,
                year: Metadata.Year ? String(Metadata.Year) : ''
            };
            if (imageBuffer) {
                tags.image = {
                    mime: 'jpeg',
                    type: { id: 3, name: 'front cover' },
                    imageBuffer: imageBuffer,
                    description: `Cover of ${Metadata.Title}`
                };
            }
            NodeID3.write(tags, filePath);
        } catch (e) {
            // Non-critical tag write error
        }
    }

    static search = async (query, options = {}) => {
        const search = await yts.search({ query, hl: 'id', gl: 'ID', ...options });
        return search.videos;
    }

    static searchTrack = async (query) => {
        const search = await yts.search(query);
        return (search.videos || []).map(v => ({
            isYtMusic: false,
            title: v.title,
            artist: v.author?.name || 'Unknown',
            id: v.videoId,
            url: v.url,
            album: v.title,
            duration: { seconds: v.seconds, label: v.timestamp },
            image: v.thumbnail
        }));
    }

    /**
     * Download YouTube video to MP4 (Full 720p HD + WhatsApp Playable Engine)
     */
    static mp4 = async (query, quality = '720') => {
        if (!query) throw new Error('Video ID or YouTube Url is required');
        const cleanUrl = this.isYTUrl(query) 
            ? 'https://www.youtube.com/watch?v=' + this.getVideoID(query) 
            : (query.startsWith('http') ? query : 'https://www.youtube.com/watch?v=' + query);

        let title = 'YouTube Video';
        let channel = 'YouTube';
        let thumb = '';
        let duration = 0;
        let finalQuality = '720p';
        let videoUrl = null;

        // Fetch basic metadata quickly in parallel
        try {
            const vidId = this.getVideoID(cleanUrl);
            if (vidId) {
                const s = await yts({ videoId: vidId });
                if (s) {
                    title = s.title || title;
                    channel = s.author?.name || channel;
                    thumb = s.thumbnail || thumb;
                    duration = s.seconds || duration;
                }
            }
        } catch (e) {}

        const targetQNum = Number(String(quality).replace(/[^0-9]/g, '')) || 720;

        // 1. Primary: Direct 720p Savetube engine
        try {
            const sRes = await savetubeDl(cleanUrl, targetQNum);
            if (sRes?.videoUrl) {
                videoUrl = sRes.videoUrl;
                finalQuality = sRes.quality || '720p';
                if (sRes.title) title = sRes.title;
                if (sRes.channel) channel = sRes.channel;
                if (sRes.duration) duration = sRes.duration;
                if (sRes.thumb) thumb = sRes.thumb;
            }
        } catch (e) {
            console.log('[Savetube DL Error]', e.message || e);
        }

        // 2. Secondary fallback: @vreden/youtube_scraper (720p)
        if (!videoUrl) {
            try {
                const vRes = await vreden.ytmp4(cleanUrl, targetQNum);
                if (vRes?.status && vRes?.download?.url) {
                    videoUrl = vRes.download.url;
                    finalQuality = vRes.download?.quality || `${targetQNum}p`;
                    if (vRes.metadata?.title) title = vRes.metadata.title;
                    if (vRes.metadata?.author?.name) channel = vRes.metadata.author.name;
                    if (vRes.metadata?.seconds) duration = vRes.metadata.seconds;
                    if (vRes.metadata?.image) thumb = vRes.metadata.image;
                }
            } catch (e) {
                console.log('[Vreden DL Error]', e.message || e);
            }
        }

        // 3. Third fallback: BTCH
        if (!videoUrl) {
            try {
                const bRes = await btchDl(cleanUrl, 10000);
                if (bRes?.mp4) {
                    videoUrl = bRes.mp4;
                    finalQuality = '360p';
                    if (bRes.title) title = bRes.title;
                    if (bRes.channel) channel = bRes.channel;
                    if (bRes.thumbnail) thumb = bRes.thumbnail;
                }
            } catch (e) {
                console.log('[BTCH DL Error]', e.message || e);
            }
        }

        if (!videoUrl) {
            throw new Error('Failed to extract YouTube video download URL');
        }

        // Download and convert/remux into WhatsApp-native playable MP4 (H.264 + AAC + faststart)
        const videoDir = path.join(__dirname, '..', 'XeonMedia', 'video');
        if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

        const randHex = randomBytes(4).toString('hex');
        const rawPath = path.join(videoDir, `raw_${randHex}.mp4`);
        const finalPath = path.join(videoDir, `${randHex}.mp4`);

        let finalUsablePath = null;
        try {
            await streamToFile(videoUrl, rawPath, 50000);

            if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 1024) {
                let probeCodec = 'unknown';
                try {
                    const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name', '-of', 'json', rawPath], { encoding: 'utf8', timeout: 6000 });
                    const parsed = JSON.parse(probe.stdout);
                    probeCodec = parsed.streams?.[0]?.codec_name || 'unknown';
                } catch (_) {}

                if (probeCodec === 'h264') {
                    // Already H.264: Instant faststart remux
                    spawnSync('ffmpeg', ['-y', '-i', rawPath, '-c', 'copy', '-movflags', '+faststart', finalPath], { timeout: 15000 });
                } else {
                    // Transcode AV1 / VP9 to ultrafast universal H.264 for WhatsApp native playback
                    spawnSync('ffmpeg', [
                        '-y', '-i', rawPath,
                        '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '26',
                        '-pix_fmt', 'yuv420p', '-c:a', 'copy',
                        '-movflags', '+faststart', finalPath
                    ], { timeout: 60000 });
                }

                if (fs.existsSync(finalPath) && fs.statSync(finalPath).size > 1024) {
                    finalUsablePath = finalPath;
                    try { if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath); } catch (_) {}
                } else if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 1024) {
                    finalUsablePath = rawPath;
                }
            }
        } catch (e) {
            console.log('[Video Download/Conversion Error]', e.message || e);
            if (fs.existsSync(finalPath) && fs.statSync(finalPath).size > 1024) {
                finalUsablePath = finalPath;
                try { if (fs.existsSync(rawPath)) fs.unlinkSync(rawPath); } catch (_) {}
            } else if (fs.existsSync(rawPath) && fs.statSync(rawPath).size > 1024) {
                finalUsablePath = rawPath;
            }
        }

        return {
            title,
            channel,
            duration,
            quality: finalQuality,
            thumb,
            videoUrl,
            path: finalUsablePath,
            size: finalUsablePath && fs.existsSync(finalUsablePath) ? fs.statSync(finalUsablePath).size : 0
        };
    }

    /**
     * Download YouTube audio to MP3 (Fast VIP CDN + safe fallbacks)
     */
    static mp3 = async (url, metadata = {}, autoWriteTags = false) => {
        if (!url) throw new Error('Video ID or YouTube Url is required');
        const cleanUrl = this.isYTUrl(url) 
            ? 'https://www.youtube.com/watch?v=' + this.getVideoID(url) 
            : (url.startsWith('http') ? url : 'https://www.youtube.com/watch?v=' + url);

        const outputDir = path.join(__dirname, '..', 'XeonMedia', 'audio');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const randHex = randomBytes(4).toString('hex');
        const finalMp3Path = path.join(outputDir, `${randHex}.mp3`);

        let downloaded = false;
        let title = metadata.Title || 'YouTube Audio';
        let channel = metadata.Artist || 'YouTube';
        let image = metadata.Image || '';
        let seconds = 0;

        // 1. Try @vreden/youtube_scraper (Ultra fast ~1.5s resolution, ~300ms direct download)
        try {
            const vRes = await vreden.ytmp3(cleanUrl);
            if (vRes?.status && vRes?.download?.url) {
                await streamToFile(vRes.download.url, finalMp3Path, 35000);
                if (fs.existsSync(finalMp3Path) && fs.statSync(finalMp3Path).size > 1024) {
                    downloaded = true;
                    if (vRes.metadata?.title) title = vRes.metadata.title;
                    if (vRes.metadata?.author?.name) channel = vRes.metadata.author.name;
                    if (vRes.metadata?.image) image = vRes.metadata.image;
                    if (vRes.metadata?.seconds) seconds = vRes.metadata.seconds;
                }
            }
        } catch (e) {}

        // 2. Fallback: Savetube or BTCH
        if (!downloaded) {
            try {
                // Try Savetube audio
                try {
                    const cdn = (await axios.get('https://media.savetube.vip/api/random-cdn', { timeout: 8000 })).data.cdn;
                    const infoget = (await axios.post('https://' + cdn + '/v2/info', { url: cleanUrl }, {
                        timeout: 10000,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            'Referer': 'https://save-tube.com/'
                        }
                    })).data;
                    const info = decodeSavetube(infoget?.data);
                    if (info?.key) {
                        const dlRes = (await axios.post('https://' + cdn + '/download', {
                            downloadType: 'audio',
                            quality: '128',
                            key: info.key
                        }, {
                            timeout: 15000,
                            headers: {
                                'Content-Type': 'application/json',
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                                'Referer': 'https://save-tube.com/'
                            }
                        })).data;
                        if (dlRes?.data?.downloadUrl) {
                            await streamToFile(dlRes.data.downloadUrl, finalMp3Path, 35000);
                            if (fs.existsSync(finalMp3Path) && fs.statSync(finalMp3Path).size > 1024) {
                                downloaded = true;
                                if (info.title) title = info.title;
                                if (info.author) channel = info.author;
                                if (info.thumbnail) image = info.thumbnail;
                                if (info.duration) seconds = info.duration;
                            }
                        }
                    }
                } catch (e) {}

                // Try BTCH audio fallback
                if (!downloaded) {
                    const b = await btchDl(cleanUrl, 10000);
                    if (b?.mp3) {
                        await streamToFile(b.mp3, finalMp3Path, 35000);
                        if (fs.existsSync(finalMp3Path) && fs.statSync(finalMp3Path).size > 1024) {
                            downloaded = true;
                            if (b.title) title = b.title;
                            if (b.channel) channel = b.channel;
                            if (b.thumbnail) image = b.thumbnail;
                        }
                    }
                }
            } catch (e) {}
        }

        if (!downloaded || !fs.existsSync(finalMp3Path)) {
            throw new Error('Failed to download MP3 from YouTube');
        }

        if (Object.keys(metadata).length !== 0) {
            await this.WriteTags(finalMp3Path, metadata);
        } else if (autoWriteTags) {
            await this.WriteTags(finalMp3Path, {
                Title: title,
                Artist: channel,
                Album: channel,
                Image: image
            });
        }

        return {
            meta: {
                title: title,
                channel: channel,
                seconds: seconds,
                image: image
            },
            path: finalMp3Path,
            size: fs.statSync(finalMp3Path).size
        };
    }
}

module.exports = YT;
