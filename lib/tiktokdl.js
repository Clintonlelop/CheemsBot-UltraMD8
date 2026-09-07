const axios = require('axios');

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36'
];

async function fetchBufferWithHeaders(url, customReferer = 'https://www.tikwm.com/') {
    if (!url) return null;
    const referers = [customReferer, 'https://www.tiktok.com/', 'https://lovetik.com/'];
    
    for (const ref of referers) {
        for (const ua of USER_AGENTS) {
            try {
                const res = await axios.get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': ua,
                        'Referer': ref,
                        'Accept': '*/*'
                    },
                    timeout: 25000,
                    maxRedirects: 5
                });
                if (res.data && res.data.length > 5000) {
                    return Buffer.from(res.data);
                }
            } catch (err) {
                // Continue to next header configuration
            }
        }
    }
    return null;
}

/**
 * Downloads TikTok video (no watermark) and audio
 * @param {string} url 
 */
async function downloadTikTok(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('Please provide a valid TikTok URL');
    }

    const cleanUrl = url.trim();
    let result = null;

    // Engine 1: TikWM API
    try {
        const res = await axios.post('https://www.tikwm.com/api/', { url: cleanUrl }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': USER_AGENTS[0]
            },
            timeout: 15000
        });

        if (res.data?.code === 0 && res.data?.data) {
            const d = res.data.data;
            const videoUrl = d.play || d.hdplay || d.wmplay;
            if (videoUrl) {
                const fullVideoUrl = videoUrl.startsWith('http') ? videoUrl : `https://www.tikwm.com${videoUrl}`;
                const fullAudioUrl = d.music ? (d.music.startsWith('http') ? d.music : `https://www.tikwm.com${d.music}`) : null;
                const fullCoverUrl = d.cover ? (d.cover.startsWith('http') ? d.cover : `https://www.tikwm.com${d.cover}`) : null;

                result = {
                    title: d.title || 'TikTok Video',
                    author: d.author?.nickname || d.author?.unique_id || 'TikTok Creator',
                    authorUsername: d.author?.unique_id || '',
                    videoUrl: fullVideoUrl,
                    videoHd: d.hdplay ? (d.hdplay.startsWith('http') ? d.hdplay : `https://www.tikwm.com${d.hdplay}`) : null,
                    audioUrl: fullAudioUrl,
                    musicTitle: d.music_info?.title || 'Original Sound',
                    musicAuthor: d.music_info?.author || '',
                    coverUrl: fullCoverUrl,
                    duration: d.duration || 0,
                    stats: {
                        views: d.play_count || 0,
                        likes: d.digg_count || 0,
                        comments: d.comment_count || 0,
                        shares: d.share_count || 0
                    }
                };
            }
        }
    } catch (err) {
        console.log('[TikTokDL TikWM error]', err?.message || err);
    }

    // Engine 2: Lovetik API Fallback
    if (!result) {
        try {
            const res = await axios.post('https://lovetik.com/api/ajax/search', new URLSearchParams({ query: cleanUrl }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': USER_AGENTS[0]
                },
                timeout: 15000
            });

            if (res.data && Array.isArray(res.data.links)) {
                const d = res.data;
                const noWm = d.links.find(l => l.t && /no watermark|nowm/i.test(l.t))?.a || d.links[0]?.a;
                const audio = d.links.find(l => l.t && /mp3|audio/i.test(l.t))?.a;
                if (noWm) {
                    result = {
                        title: d.desc || 'TikTok Video',
                        author: d.author || 'TikTok Creator',
                        authorUsername: '',
                        videoUrl: noWm,
                        videoHd: null,
                        audioUrl: audio || null,
                        musicTitle: 'Original Sound',
                        coverUrl: d.cover || null,
                        duration: 0,
                        stats: { views: 0, likes: 0, comments: 0, shares: 0 }
                    };
                }
            }
        } catch (err) {
            console.log('[TikTokDL Lovetik error]', err?.message || err);
        }
    }

    if (!result) {
        throw new Error('Unable to extract TikTok video. Please ensure the TikTok link is public and active.');
    }

    // Download video buffer directly so Baileys does not run into 503/403 errors
    try {
        const videoBuffer = await fetchBufferWithHeaders(result.videoUrl);
        if (videoBuffer) {
            result.videoBuffer = videoBuffer;
        }
    } catch (e) {
        console.log('[TikTokDL buffer fetch error]', e?.message || e);
    }

    // Download audio buffer
    if (result.audioUrl) {
        try {
            const audioBuffer = await fetchBufferWithHeaders(result.audioUrl);
            if (audioBuffer) {
                result.audioBuffer = audioBuffer;
            }
        } catch (e) {
            console.log('[TikTokDL audio buffer fetch error]', e?.message || e);
        }
    }

    return result;
}

module.exports = {
    downloadTikTok,
    fetchBufferWithHeaders
};

