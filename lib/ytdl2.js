const yts = require('youtube-yts');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const NodeID3 = require('node-id3');
const { randomBytes } = require('crypto');
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

async function loaderDl(url, format = '360') {
    const init = await axios.get(`https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${format}&url=${encodeURIComponent(url)}`, {
        timeout: 6000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    if (!init.data || !init.data.id) throw new Error('Loader.to initialization failed');
    const id = init.data.id;
    for (let i = 0; i < 15; i++) {
        await new Promise(r => setTimeout(r, 1000));
        const p = await axios.get(`https://loader.to/ajax/progress.php?id=${id}`, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (p.data?.success && p.data?.download_url) {
            return {
                title: p.data.title || init.data.title || 'YouTube Media',
                downloadUrl: p.data.download_url,
                thumbnail: p.data.thumbnail_url || init.data.thumbnail_url || ''
            };
        }
    }
    throw new Error('Loader.to download timed out');
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
     * Download YouTube video to MP4 (Ultra fast racing engine)
     */
    static mp4 = async (query, quality = '360') => {
        if (!query) throw new Error('Video ID or YouTube Url is required');
        const cleanUrl = this.isYTUrl(query) 
            ? 'https://www.youtube.com/watch?v=' + this.getVideoID(query) 
            : (query.startsWith('http') ? query : 'https://www.youtube.com/watch?v=' + query);

        // Fetch basic metadata quickly in parallel
        let title = 'YouTube Video';
        let channel = 'YouTube';
        let thumb = '';
        let duration = 0;

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

        // Race Loader.to and BTCH concurrently for the absolute fastest response
        try {
            const winner = await Promise.any([
                (async () => {
                    const l = await loaderDl(cleanUrl, quality === '720' ? '720' : '360');
                    if (l?.downloadUrl) {
                        return {
                            title: l.title || title,
                            thumb: l.thumbnail || thumb,
                            duration: duration,
                            channel: channel,
                            quality: (quality === '720' ? '720p' : '360p'),
                            videoUrl: l.downloadUrl
                        };
                    }
                    throw new Error('Loader empty');
                })(),
                (async () => {
                    const b = await btchDl(cleanUrl, 8000);
                    if (b?.mp4) {
                        return {
                            title: b.title || title,
                            thumb: b.thumbnail || thumb,
                            duration: duration,
                            channel: b.channel || channel,
                            quality: '360p',
                            videoUrl: b.mp4
                        };
                    }
                    throw new Error('BTCH empty');
                })()
            ]);
            return winner;
        } catch (e) {}

        // Secondary fallback: @vreden/youtube_scraper
        try {
            const vRes = await vreden.ytmp4(cleanUrl, 360);
            if (vRes?.status && vRes?.download?.url) {
                return {
                    title: vRes.metadata?.title || title,
                    thumb: vRes.metadata?.image || thumb,
                    duration: vRes.metadata?.seconds || duration,
                    channel: vRes.metadata?.author?.name || channel,
                    quality: vRes.download?.quality || '360p',
                    videoUrl: vRes.download.url
                };
            }
        } catch (e) {}

        throw new Error('Failed to extract YouTube video download URL');
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

        // 2. Fallback: Race Loader.to and BTCH
        if (!downloaded) {
            try {
                const streamUrl = await Promise.any([
                    (async () => {
                        const l = await loaderDl(cleanUrl, 'mp3');
                        if (l?.downloadUrl) {
                            if (l.title) title = l.title;
                            if (l.thumbnail) image = l.thumbnail;
                            return l.downloadUrl;
                        }
                        throw new Error('Loader empty');
                    })(),
                    (async () => {
                        const b = await btchDl(cleanUrl, 8000);
                        if (b?.mp3) {
                            if (b.title) title = b.title;
                            if (b.channel) channel = b.channel;
                            if (b.thumbnail) image = b.thumbnail;
                            return b.mp3;
                        }
                        throw new Error('BTCH empty');
                    })()
                ]);

                if (streamUrl) {
                    await streamToFile(streamUrl, finalMp3Path, 35000);
                    if (fs.existsSync(finalMp3Path) && fs.statSync(finalMp3Path).size > 1024) {
                        downloaded = true;
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
