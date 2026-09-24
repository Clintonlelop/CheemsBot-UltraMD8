const bochil = require('@bochilteam/scraper');
const fg = require('api-dylux');
const btch = require('btch-downloader');
const path = require('path');
const { spawnSync } = require('child_process');

const YTDLP_PATH = path.join(__dirname, '..', 'bin', 'yt-dlp');

async function XeonFb(url) {
    if (!url) throw new Error('Facebook URL is required');

    // 1. Try btch-downloader (fast, direct, no cookies)
    try {
        const b = await btch.fbdown(url);
        if (b?.status && (b.HD || b.Normal_video)) {
            const list = [];
            if (b.HD) list.push({ url: b.HD, subname: 'HD' });
            if (b.Normal_video) list.push({ url: b.Normal_video, subname: 'SD' });
            if (list.length > 0) return { url: list };
        }
    } catch (e) {}

    // 2. Try bochil snapsave
    try {
        const snap = await bochil.snapsave(url);
        if (Array.isArray(snap) && snap.length > 0) {
            const best = snap.find(s => s.resolution && s.resolution.includes('HD')) || snap[0];
            if (best && best.url) {
                return {
                    url: [
                        { url: best.url, subname: best.resolution || 'HD' }
                    ]
                };
            }
        }
    } catch (e) {}

    // 3. Try api-dylux facebook
    try {
        const dylux = await fg.facebook(url);
        const direct = dylux?.hd || dylux?.sd || dylux?.url;
        if (direct) {
            return {
                url: [
                    { url: direct, subname: dylux?.hd ? 'HD' : 'SD' }
                ]
            };
        }
    } catch (e) {}

    // 4. Fallback: yt-dlp -j
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

    throw new Error('Failed to extract Facebook video');
}

module.exports = { XeonFb };
