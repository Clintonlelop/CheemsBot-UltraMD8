const axios = require('axios');
const fs = require('fs');
const yts = require('youtube-yts');
const YT = require('./ytdl2');

class Spotify {
    constructor(urlOrQuery) {
        this.input = (urlOrQuery || '').trim();
    }

    async getInfo() {
        try {
            if (!this.input) return { error: true };
            
            // Check if valid Spotify link
            const isSpotify = /spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist)\/([a-zA-Z0-9]+)/i.test(this.input);
            if (!isSpotify && !this.input.startsWith('http')) {
                // If it's a song query, construct track name
                return {
                    name: this.input,
                    artists: ['Spotify Artist'],
                    album_name: 'Single',
                    release_date: new Date().getFullYear().toString(),
                    cover_url: 'https://i.scdn.co/image/ab67616d0000b273b0a70196ba98993f4eec35d3'
                };
            }
            if (!isSpotify) return { error: true };

            // Fetch oEmbed metadata
            const cleanUrl = this.input.split('?')[0];
            const { data } = await axios.get(`https://open.spotify.com/oembed?url=${encodeURIComponent(cleanUrl)}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 8000
            });

            let trackName = data.title || 'Unknown Track';
            let artistName = 'Spotify Artist';

            // Spotify oEmbed title is often "Track Name" or "Track Name by Artist"
            if (trackName.includes(' by ')) {
                const parts = trackName.split(' by ');
                trackName = parts[0].trim();
                artistName = parts.slice(1).join(' by ').trim();
            }

            this.title = trackName;
            this.artist = artistName;

            return {
                name: trackName,
                artists: [artistName],
                album_name: 'Spotify Music',
                release_date: new Date().getFullYear().toString(),
                cover_url: data.thumbnail_url || 'https://i.scdn.co/image/ab67616d0000b273b0a70196ba98993f4eec35d3'
            };
        } catch (e) {
            return { error: true };
        }
    }

    async download() {
        try {
            const query = `${this.title || this.input} ${this.artist || ''} official audio`.trim();
            const search = await yts(query);
            const video = search?.videos?.[0];
            if (!video?.url) throw new Error('Could not find matching audio track');

            const result = await YT.mp3(video.url, {
                Title: this.title || video.title,
                Artist: this.artist || video.author?.name
            });

            if (result?.path && fs.existsSync(result.path)) {
                const buffer = fs.readFileSync(result.path);
                try { fs.unlinkSync(result.path); } catch (e) {}
                return buffer;
            }
            throw new Error('Failed to generate Spotify audio stream');
        } catch (e) {
            throw e;
        }
    }
}

module.exports = Spotify;
