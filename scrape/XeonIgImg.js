const bochil = require('@bochilteam/scraper');
const btch = require('btch-downloader');
const path = require('path');
const { spawnSync } = require('child_process');

const YTDLP_PATH = path.join(__dirname, '..', 'bin', 'yt-dlp');

async function XeonIgImg(match) {
    if (!match) throw new Error('Instagram URL is required');
    const result = [];

    // 1. Try btch-downloader (fast, direct, no cookies required)
    try {
        const b = await btch.igdl(match);
        if (b?.status && Array.isArray(b.result) && b.result.length > 0) {
            for (const item of b.result) {
                const img = item.thumbnail || (!item.url?.includes('.mp4') ? item.url : null);
                if (img && !result.includes(img)) result.push(img);
            }
            if (result.length > 0) return result;
        }
    } catch (e) {}

    // 2. Try bochil snapsave
    try {
        const snap = await bochil.snapsave(match);
        if (Array.isArray(snap) && snap.length > 0) {
            for (const item of snap) {
                const img = item.thumbnail || item.url;
                if (img && !result.includes(img)) result.push(img);
            }
            if (result.length > 0) return result;
        }
    } catch (e) {}

    // 3. Fallback: yt-dlp -j
    try {
        const res = spawnSync(YTDLP_PATH, ['-j', '--no-playlist', match], { encoding: 'utf8', timeout: 15000 });
        if (res.status === 0 && res.stdout) {
            const info = JSON.parse(res.stdout);
            if (info.thumbnail) result.push(info.thumbnail);
            if (Array.isArray(info.thumbnails)) {
                for (const t of info.thumbnails) {
                    if (t.url && !result.includes(t.url)) result.push(t.url);
                }
            }
            if (result.length > 0) return result;
        }
    } catch (e) {}

    return result;
}

module.exports = { XeonIgImg };
