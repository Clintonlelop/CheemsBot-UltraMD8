const fs = require('fs')
const path = require('path')
const os = require('os')
const crypto = require('crypto')
const axios = require('axios')
const FormData = require('form-data')
const ffmpeg = require('fluent-ffmpeg')
const yts = require('yt-search')

/**
 * Extracts a 12-second MP3 snippet from an audio or video buffer for music recognition
 */
async function extractAudioSnippet(mediaBuffer, isVideo = false) {
    const tmpDir = os.tmpdir()
    const inputExt = isVideo ? '.mp4' : '.bin'
    const tmpInput = path.join(tmpDir, `find_in_${crypto.randomBytes(6).toString('hex')}${inputExt}`)
    const tmpOutput = path.join(tmpDir, `find_out_${crypto.randomBytes(6).toString('hex')}.mp3`)

    fs.writeFileSync(tmpInput, mediaBuffer)

    await new Promise((resolve, reject) => {
        ffmpeg(tmpInput)
            .setStartTime(0)
            .setDuration(12)
            .audioCodec('libmp3lame')
            .audioBitrate('128k')
            .audioChannels(2)
            .audioFrequency(44100)
            .format('mp3')
            .on('end', () => resolve(true))
            .on('error', (err) => reject(err))
            .save(tmpOutput)
    })

    const audioSnippet = fs.readFileSync(tmpOutput)
    try { fs.unlinkSync(tmpInput) } catch (_) {}
    try { fs.unlinkSync(tmpOutput) } catch (_) {}
    return audioSnippet
}

function formatDuration(ms) {
    if (!ms || isNaN(ms)) return 'N/A'
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/**
 * Identifies music from an audio or video buffer using AudD / recognition APIs
 * and enriches results with YouTube and streaming platform links.
 */
async function identifyMusic(mediaBuffer, isVideo = false) {
    let snippet = null
    try {
        snippet = await extractAudioSnippet(mediaBuffer, isVideo)
    } catch (e) {
        // Fallback: use raw buffer if ffmpeg snippet conversion failed
        snippet = mediaBuffer
    }

    const token = process.env.AUDD_API_KEY || 'test'
    const form = new FormData()
    form.append('api_token', token)
    form.append('file', snippet, { filename: 'sample.mp3', contentType: 'audio/mpeg' })
    form.append('return', 'apple_music,spotify')

    let data = null
    try {
        const response = await axios.post('https://api.audd.io/', form, {
            headers: form.getHeaders(),
            timeout: 25000
        })
        data = response.data
    } catch (err) {
        throw new Error(err.response?.data?.error?.error_message || err.message || 'Recognition service unavailable')
    }

    if (!data || data.status !== 'success' || !data.result) {
        const errDetail = data?.error?.error_message || 'No matching song found in database'
        throw new Error(errDetail)
    }

    const res = data.result
    const title = res.title || 'Unknown Title'
    const artist = res.artist || 'Unknown Artist'
    const album = res.album || res.spotify?.album?.name || 'Single / Unknown Album'
    const releaseDate = res.release_date || res.spotify?.album?.release_date || res.apple_music?.releaseDate || 'N/A'
    const duration = formatDuration(res.spotify?.duration_ms || res.apple_music?.durationInMillis)
    const genre = res.apple_music?.genreNames?.join(', ') || 'Music'
    const label = res.label || res.spotify?.album?.label || 'N/A'

    // Banner image resolution
    let banner = null
    if (res.spotify?.album?.images?.length) {
        banner = res.spotify.album.images[0].url
    } else if (res.apple_music?.artwork?.url) {
        banner = res.apple_music.artwork.url.replace('{w}x{h}', '600x600')
    }

    // Direct streaming links
    const spotifyLink = res.spotify?.external_urls?.spotify || `https://open.spotify.com/search/${encodeURIComponent(artist + ' ' + title)}`
    const appleLink = res.apple_music?.url || null
    const songLink = res.song_link || `https://lis.tn/search?q=${encodeURIComponent(artist + ' ' + title)}`
    const ytMusicLink = `https://music.youtube.com/search?q=${encodeURIComponent(artist + ' ' + title)}`

    // Search YouTube video directly via yt-search
    let ytVideoLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(artist + ' ' + title)}`
    try {
        const ytResults = await yts(`${artist} - ${title}`)
        if (ytResults?.videos?.length) {
            ytVideoLink = ytResults.videos[0].url
            if (!banner) {
                banner = ytResults.videos[0].thumbnail || ytResults.videos[0].image
            }
        }
    } catch (_) {}

    return {
        title,
        artist,
        album,
        releaseDate,
        duration,
        genre,
        label,
        banner: banner || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        links: {
            spotify: spotifyLink,
            youtube: ytVideoLink,
            ytMusic: ytMusicLink,
            appleMusic: appleLink,
            allPlatforms: songLink
        }
    }
}

module.exports = {
    identifyMusic,
    extractAudioSnippet
}
