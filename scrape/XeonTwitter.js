const axios = require('axios');
const bochil = require('@bochilteam/scraper');
const btch = require('btch-downloader');
const path = require('path');
const { spawnSync } = require('child_process');

const YTDLP_PATH = path.join(__dirname, '..', 'bin', 'yt-dlp');

async function XeonTwitter(url) {
    if (!url) throw new Error('Twitter/X URL is required');

    // 1. Try btch-downloader
    try {
        const b = await btch.twitter(url);
        if (b?.status && Array.isArray(b.url) && b.url.length > 0) {
            return {
                url: b.url.map((u, i) => ({ url: u, subname: i === 0 ? 'HD' : 'SD' }))
            };
        }
    } catch (e) {}

    // 2. Try fxtwitter API (blazing fast, full HD direct MP4 link)
    try {
        const clean = url.replace(/(?:twitter\.com|x\.com)/i, 'api.fxtwitter.com');
        const { data } = await axios.get(clean, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CheemsBot/8.0)' },
            timeout: 10000
        });
        const video = data?.tweet?.media?.videos?.[0];
        if (video?.url) {
            return {
                url: [
                    { url: video.url, subname: `${video.width || ''}x${video.height || ''}`.replace(/^x$/, 'HD') }
                ]
            };
        }
    } catch (e) {}

    // 3. Try bochil twitterdl / snapsave
    try {
        const b = await bochil.twitterdlv2(url);
        if (Array.isArray(b) && b.length > 0 && b[0].url) {
            return {
                url: [
                    { url: b[0].url, subname: b[0].quality || 'HD' }
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

    throw new Error('Failed to extract Twitter/X video');
}

module.exports = { XeonTwitter };
