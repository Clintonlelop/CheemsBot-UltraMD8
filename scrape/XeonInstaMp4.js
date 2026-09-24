const bochil = require('@bochilteam/scraper');
const btch = require('btch-downloader');
const path = require('path');
const { spawnSync } = require('child_process');

const YTDLP_PATH = path.join(__dirname, '..', 'bin', 'yt-dlp');

async function XeonInstaMp4(url) {
    if (!url) throw new Error('Instagram URL is required');

    // 1. Try btch-downloader (fast, direct, no cookies required)
    try {
        const b = await btch.igdl(url);
        if (b?.status && Array.isArray(b.result) && b.result.length > 0) {
            const vid = b.result.find(r => r.url && (r.url.includes('.mp4') || r.url.includes('video'))) || b.result[0];
            if (vid?.url) {
                return {
                    url: [
                        { url: vid.url, subname: 'HD' }
                    ]
                };
            }
        }
    } catch (e) {}

    // 2. Try bochil snapsave
    try {
        const snap = await bochil.snapsave(url);
        if (Array.isArray(snap) && snap.length > 0) {
            const vid = snap.find(s => s.url && (s.url.includes('.mp4') || s.resolution)) || snap[0];
            if (vid && vid.url) {
                return {
                    url: [
                        { url: vid.url, subname: vid.resolution || 'HD' }
                    ]
                };
            }
        }
    } catch (e) {}

    // 3. Fallback: yt-dlp -j
    try {
        const res = spawnSync(YTDLP_PATH, ['-j', '--no-playlist', url], { encoding: 'utf8', timeout: 15000 });
        if (res.status === 0 && res.stdout) {
            const info = JSON.parse(res.stdout);
            const formats = info.formats || [];
            const direct = formats.reverse().find(f => f.vcodec !== 'none' && f.acodec !== 'none' && f.ext === 'mp4' && f.url) ||
                           formats.find(f => f.url);
            if (direct?.url) {
                return {
                    url: [
                        { url: direct.url, subname: direct.format_note || 'HD' }
                    ]
                };
            }
        }
    } catch (e) {}

    throw new Error('Failed to extract Instagram video');
}

module.exports = { XeonInstaMp4 };
