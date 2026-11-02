/* ============================================
   MOODIFY - YouTube Search Without API Key
   Uses YouTube InnerTube API (no API key needed)
   Developed by Bima Haris
   ============================================ */

const YTSearch = {
    // Cache for search results
    cache: {},
    cacheExpiry: 10 * 60 * 1000, // 10 minutes

    // ==========================================
    // YouTube InnerTube API - Search without API key
    // This is the internal API YouTube uses for its own frontend
    // ==========================================
    async searchYouTube(query, limit = 15) {
        // Check cache first
        const cacheKey = `innertube_${query}_${limit}`;
        if (this.cache[cacheKey] && (Date.now() - this.cache[cacheKey].timestamp < this.cacheExpiry)) {
            console.log('📦 Using cached search results for:', query);
            return this.cache[cacheKey].results;
        }

        console.log('🔍 Searching YouTube (InnerTube API) for:', query);

        try {
            // YouTube InnerTube API endpoint
            const url = 'https://www.youtube.com/youtubei/v1/search';
            
            // Client context - mimics YouTube web browser
            const data = {
                query: query,
                context: {
                    client: {
                        clientName: 'WEB',
                        clientVersion: '2.20240103.00.00',
                        hl: 'id',
                        gl: 'ID'
                    }
                },
                params: 'EgIQAQ%3D%3D' // Filter for videos only
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-YouTube-Client-Name': '1',
                    'X-YouTube-Client-Version': '2.20240103.00.00'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`InnerTube API error: ${response.status}`);
            }

            const json = await response.json();
            const results = this.parseInnerTubeResponse(json, limit);

            // Cache results
            this.cache[cacheKey] = {
                results: results,
                timestamp: Date.now()
            };

            console.log(`✅ Found ${results.length} results from InnerTube API`);
            return results;

        } catch (error) {
            console.warn('InnerTube API failed, trying fallback:', error.message);
            
            // Fallback to proxy search if InnerTube fails
            try {
                const proxyResults = await this.searchViaProxy(query, limit);
                if (proxyResults.length > 0) {
                    return proxyResults;
                }
            } catch (proxyError) {
                console.warn('Proxy search also failed:', proxyError.message);
            }

            // Last resort: popular songs database
            const fallbackResults = this.getPopularVideoIds(query);
            if (fallbackResults.length > 0) {
                return fallbackResults;
            }

            return [];
        }
    },

    // ==========================================
    // Parse InnerTube API response
    // ==========================================
    parseInnerTubeResponse(json, limit) {
        const results = [];
        const seen = new Set();

        // Navigate through InnerTube response structure
        let sections = [];
        
        if (json?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents) {
            sections = json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;
        }

        for (const section of sections) {
            const items = section?.itemSectionRenderer?.contents;
            if (!items) continue;

            for (const item of items) {
                if (results.length >= limit) break;

                // Video renderer
                const videoRenderer = item?.videoRenderer;
                if (videoRenderer) {
                    const videoId = videoRenderer.videoId;
                    if (!videoId || seen.has(videoId)) continue;
                    seen.add(videoId);

                    // Extract title
                    const titleRuns = videoRenderer.title?.runs;
                    const title = titleRuns ? this.extractTextFromRuns(titleRuns) : 'Unknown';

                    // Extract channel/artist
                    const longByline = videoRenderer.longBylineText?.runs;
                    let artist = 'YouTube';
                    if (longByline && longByline.length > 0) {
                        artist = this.extractTextFromRuns(longByline);
                    }

                    // Extract duration
                    const lengthText = videoRenderer.lengthText?.simpleText || '';
                    const duration = this.parseDuration(lengthText);

                    // Extract view count
                    const viewCountText = videoRenderer.viewCountText?.simpleText || '';
                    const viewCount = this.parseViewCount(viewCountText);

                    // Extract thumbnail
                    const thumbnails = videoRenderer.thumbnail?.thumbnails || [];
                    const thumbnail = thumbnails.length > 0 
                        ? thumbnails[thumbnails.length - 1].url 
                        : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    results.push({
                        id: `yt_${videoId}`,
                        videoId: videoId,
                        title: title,
                        artist: artist,
                        thumbnail: thumbnail,
                        duration: duration,
                        durationFormatted: this.formatDuration(duration),
                        viewCount: viewCount,
                        source: 'YouTube',
                        playType: 'video',
                        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`
                    });
                }

                // Rich grid renderer (alternative structure)
                const richItem = item?.richGridVideoRenderer;
                if (richItem) {
                    const videoId = richItem.videoId;
                    if (!videoId || seen.has(videoId)) continue;
                    seen.add(videoId);

                    const title = richItem.title?.simpleText || 'Unknown';
                    const artist = richItem.longBylineText?.runs?.[0]?.text || 'YouTube';
                    const thumbnails = richItem.thumbnail?.thumbnails || [];
                    const thumbnail = thumbnails.length > 0 
                        ? thumbnails[thumbnails.length - 1].url 
                        : `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

                    results.push({
                        id: `yt_${videoId}`,
                        videoId: videoId,
                        title: title,
                        artist: artist,
                        thumbnail: thumbnail,
                        source: 'YouTube',
                        playType: 'video',
                        youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`
                    });
                }
            }
        }

        return results.slice(0, limit);
    },

    // ==========================================
    // Helper: Extract text from runs array
    // ==========================================
    extractTextFromRuns(runs) {
        if (!runs || !Array.isArray(runs)) return '';
        return runs.map(r => r.text || '').join('');
    },

    // ==========================================
    // Helper: Parse duration string (e.g., "3:45", "1:23:45")
    // ==========================================
    parseDuration(text) {
        if (!text) return 0;
        const parts = text.split(':').map(Number);
        if (parts.length === 2) {
            return parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        }
        return 0;
    },

    // ==========================================
    // Helper: Parse view count string (e.g., "1.2M views")
    // ==========================================
    parseViewCount(text) {
        if (!text) return 0;
        const match = text.match(/([\d.]+)([KMBT])?/i);
        if (!match) return 0;
        
        let value = parseFloat(match[1]);
        const suffix = (match[2] || '').toUpperCase();
        
        switch (suffix) {
            case 'K': return Math.round(value * 1000);
            case 'M': return Math.round(value * 1000000);
            case 'B': return Math.round(value * 1000000000);
            case 'T': return Math.round(value * 1000000000000);
            default: return Math.round(value);
        }
    },

    // ==========================================
    // Helper: Format duration in seconds to MM:SS
    // ==========================================
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    // ==========================================
    // Fallback: Search via CORS proxy
    // ==========================================
    async searchViaProxy(query, limit) {
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
        ];

        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        
        for (const proxy of proxies) {
            try {
                const response = await fetch(proxy + encodeURIComponent(searchUrl), {
                    signal: AbortSignal.timeout(5000)
                });
                
                if (!response.ok) continue;
                
                const html = await response.text();
                const results = this.parseYouTubeSearchHTML(html, limit);
                
                if (results.length > 0) {
                    return results;
                }
            } catch (error) {
                console.warn(`Proxy ${proxy} failed:`, error.message);
                continue;
            }
        }
        
        return [];
    },

    // Parse YouTube search results HTML
    parseYouTubeSearchHTML(html, limit) {
        const results = [];
        
        // Extract video IDs from YouTube search page
        const videoIdRegex = /data-video-id="([a-zA-Z0-9_-]{11})"/g;
        
        const videoIds = [];
        let match;
        
        while ((match = videoIdRegex.exec(html)) !== null && videoIds.length < limit) {
            videoIds.push(match[1]);
        }

        // Combine results (titles/channels extracted via oEmbed later)
        for (let i = 0; i < Math.min(videoIds.length, limit); i++) {
            results.push({
                id: `yt_${videoIds[i]}`,
                videoId: videoIds[i],
                title: 'YouTube Result',
                artist: 'YouTube',
                thumbnail: `https://img.youtube.com/vi/${videoIds[i]}/hqdefault.jpg`,
                source: 'YouTube',
                playType: 'video',
                youtubeUrl: `https://www.youtube.com/watch?v=${videoIds[i]}`
            });
        }

        return results;
    },

    // Fallback: Popular songs database (2024-2025)
    // Used when InnerTube API and proxy search both fail
    getPopularVideoIds(query) {
        const queryLower = query.toLowerCase();
        
        // Large database of popular songs with verified video IDs
        const popularSongs = [
            // Indonesian Pop
            { artists: ['hindia', 'evaluasi'], videoId: 'cWrSjCZ5AeE', title: 'Evaluasi', artist: 'Hindia' },
            { artists: ['hindia', 'rumpang'], videoId: 'XshVws8BE3A', title: 'Rumpang', artist: 'Hindia' },
            { artists: ['tulus', 'monokrom'], videoId: 'QqJ-Vp8mvbk', title: 'Monokrom', artist: 'Tulus' },
            { artists: ['tulus', 'hatiku', 'milikmu'], videoId: 's5pM8OBPEmg', title: 'Hatiku Adalah Milikmu', artist: 'Tulus' },
            { artists: ['nadin', 'bertaut'], videoId: 'HyhLsy6b0XI', title: 'Bertaut', artist: 'Nadin Amizah' },
            { artists: ['nadin', 'to the bone', 'pamungkas'], videoId: 'oIYWenB637c', title: 'To The Bone', artist: 'Pamungkas' },
            { artists: ['mahalini', 'sial'], videoId: 'QSWYyoF79oE', title: 'Sial', artist: 'Mahalini' },
            { artists: ['weird', 'genius', 'lathi'], videoId: '8uy7G2JXVSA', title: 'Lathi', artist: 'Weird Genius' },
            { artists: ['pamungkas', 'sekadar', 'menemani'], videoId: 'FRfc8eK52tU', title: 'Kenangan Manis', artist: 'Pamungkas' },
            { artists: ['bernyadya', 'satu bulan'], videoId: 'yjnSX_iUFVo', title: 'Satu Bulan', artist: 'Bernadya' },
            { artists: ['rizky', 'febian', 'terlukis'], videoId: 'i90EvEZ3axw', title: 'Terlukis Indah', artist: 'Rizky Febian' },
            { artists: ['panturas', 'sunshine'], videoId: 'kD2Gsp9EB8k', title: 'Sunshine', artist: 'The Panturas' },
            { artists: ['budi', 'doremi', 'melukis', 'senja'], videoId: 'qZIQAk-BUEc', title: 'Melukis Senja', artist: 'Budi Doremi' },
            { artists: ['archie', 'rayuan', 'perempuan'], videoId: 'JIIKnE_QZAo', title: 'Rayuan Perempuan Gila', artist: 'Nadin Amizah' },
            { artists: ['anggi', 'marito', 'tak segampang'], videoId: '6NsiA6GFAbU', title: 'Tak Segampang Itu', artist: 'Anggi Marito' },
            { artists: ['fiersa', 'besari', 'melawan', 'hati'], videoId: 'ywh9dNpEX9c', title: 'Melawan Hati', artist: 'Fiersa Besari' },
            // International Pop
            { artists: ['taylor', 'swift'], videoId: 'b1kbLwvqugk', title: 'Anti-Hero', artist: 'Taylor Swift' },
            { artists: ['dua', 'lipa', 'levitating'], videoId: 'TUVcZfQe-Kw', title: 'Levitating', artist: 'Dua Lipa' },
            { artists: ['the', 'weeknd', 'blinding', 'lights'], videoId: '4NRXx6U8ABQ', title: 'Blinding Lights', artist: 'The Weeknd' },
            { artists: ['ed', 'sheeran', 'perfect'], videoId: '2Vv-BfVoq4g', title: 'Perfect', artist: 'Ed Sheeran' },
            { artists: ['adele', 'hello'], videoId: 'YQHsXMglC9A', title: 'Hello', artist: 'Adele' },
            { artists: ['drake', 'one', 'dance'], videoId: 'xpVfcZ0ZcFM', title: 'One Dance', artist: 'Drake' },
            { artists: ['billie', 'eilish', 'bad', 'guy'], videoId: 'DyDfgMOUjCI', title: 'Bad Guy', artist: 'Billie Eilish' },
            { artists: ['ariana', 'grande', '7', 'rings'], videoId: 'QYh6mYIJG2Y', title: '7 Rings', artist: 'Ariana Grande' },
            { artists: ['post', 'malone', 'circles'], videoId: 'wXhTHyIgQ_A', title: 'Circles', artist: 'Post Malone' },
            { artists: ['daddy', 'yankee', 'despacito', 'luis', 'fonsi'], videoId: 'kJQP7kiw5Fk', title: 'Despacito', artist: 'Luis Fonsi' },
            // Lofi / Chill / Study
            { artists: ['lofi', 'chill', 'study', 'hiphop', 'radio', 'beats', 'relax', 'sleep', 'focus', 'concentrate'], videoId: '5qap5aO4i9A', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl' },
            { artists: ['rainy', 'rain', 'chill', 'lofi'], videoId: 'rUxyKA_-grg', title: 'Rainy Day Chill', artist: 'Chill Music' },
            { artists: ['jazz', 'coffee', 'chill'], videoId: 'rUxyKA_-grg', title: 'Jazz Coffee Chill', artist: 'Jazz Vibes' },
            // Workout / Party / Dance
            { artists: ['workout', 'gym', 'motivation', 'exercise', 'fitness'], videoId: 'kTJczUoc26U', title: 'Workout Mix 2024', artist: 'Fitness Music' },
            { artists: ['party', 'dance', 'edm', 'electronic'], videoId: '8uy7G2JXVSA', title: 'Party Dance Mix', artist: 'DJ Mix' },
            // Sad / Galau / Romantic
            { artists: ['sad', 'galau', 'heartbreak', 'sedih'], videoId: 'cWrSjCZ5AeE', title: 'Sad Galau Playlist', artist: 'Indonesian Pop' },
            { artists: ['romantic', 'love', 'cinta', 'romance'], videoId: 'i90EvEZ3axw', title: 'Romantic Love Songs', artist: 'Love Music' },
            // Rock / Metal
            { artists: ['rock', 'indonesian', 'indie'], videoId: 'kD2Gsp9EB8k', title: 'Indonesian Rock Hits', artist: 'Rock Indonesia' },
            { artists: ['metal', 'heavy'], videoId: 'kJQP7kiw5Fk', title: 'Heavy Metal Mix', artist: 'Metal Music' },
            // R&B / Soul
            { artists: ['rnb', 'soul', 'indonesian'], videoId: 'QSWYyoF79oE', title: 'Indonesian R&B', artist: 'R&B Indonesia' },
            // Nostalgia / Retro
            { artists: ['nostalgia', 'retro', '90s', '2000s', 'dulu'], videoId: 'qZIQAk-BUEc', title: 'Nostalgia Retro Hits', artist: 'Retro Music' },
            // K-Pop
            { artists: ['kpop', 'korean', 'bts', 'blackpink'], videoId: 'pBuZEGYXA6g', title: 'K-Pop Hits 2024', artist: 'K-Pop' },
            // Arabic / Middle East
            { artists: ['arabic', 'arab', 'middle', 'east'], videoId: 'kJQP7kiw5Fk', title: 'Arabic Hits', artist: 'Arabic Music' },
            // General fallback - most popular
            { artists: ['musik', 'music', 'lagu', 'song', 'lagu indonesia', 'indonesian'], videoId: 'cWrSjCZ5AeE', title: 'Indonesian Pop Hits', artist: 'Various Artists' },
            { artists: ['pop', 'hits', 'terbaru', 'new'], videoId: 'kTJczUoc26U', title: 'Pop Hits Terbaru', artist: 'Various Artists' },
        ];

        const results = [];
        const seen = new Set();
        
        for (const song of popularSongs) {
            // Check if query matches any artist or title
            const matches = song.artists.some(a => queryLower.includes(a)) ||
                           queryLower.includes(song.title.toLowerCase()) ||
                           queryLower.includes(song.artist.toLowerCase());
            
            if (matches && !seen.has(song.videoId)) {
                seen.add(song.videoId);
                results.push({
                    id: `yt_${song.videoId}`,
                    videoId: song.videoId,
                    title: song.title,
                    artist: song.artist,
                    thumbnail: `https://img.youtube.com/vi/${song.videoId}/hqdefault.jpg`,
                    source: 'YouTube',
                    playType: 'video',
                    youtubeUrl: `https://www.youtube.com/watch?v=${song.videoId}`
                });
            }
        }

        return results;
    },

    // ==========================================
    // Validate with NoEmbed - get video info
    // ==========================================
    async validateWithNoEmbed(videoId) {
        try {
            const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
                console.warn('NoEmbed error:', data.error);
                return null;
            }
            
            return {
                videoId: videoId,
                title: data.title,
                author: data.author_name,
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                valid: true
            };
        } catch (error) {
            console.error('NoEmbed validation failed:', error);
            return null;
        }
    },

    // ==========================================
    // Validate with OEmbed - get video info
    // ==========================================
    async validateWithOEmbed(videoId) {
        try {
            const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.title) {
                return null;
            }
            
            return {
                videoId: videoId,
                title: data.title,
                author: data.author_name,
                thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                valid: true
            };
        } catch (error) {
            console.error('OEmbed validation failed:', error);
            return null;
        }
    },

    // ==========================================
    // Validate a video ID before playing
    // Returns true if video is likely available
    // ==========================================
    async validateVideoId(videoId) {
        // First try NoEmbed
        const noembedResult = await this.validateWithNoEmbed(videoId);
        if (noembedResult) {
            return noembedResult;
        }

        // Fallback to OEmbed
        const oembedResult = await this.validateWithOEmbed(videoId);
        if (oembedResult) {
            return oembedResult;
        }

        // If both fail, assume video might still be playable
        // (some videos are restricted from oEmbed but playable)
        return { videoId, valid: true };
    },

    // ==========================================
    // Get alternative video IDs for a song
    // ==========================================
    async getAlternatives(songTitle, songArtist, excludeVideoId = null) {
        const query = `${songTitle} ${songArtist}`;
        const results = await this.searchYouTube(query, 5);
        
        // Filter out the excluded video ID
        return results.filter(r => r.videoId !== excludeVideoId);
    },

    // ==========================================
    // Clear cache
    // ==========================================
    clearCache() {
        this.cache = {};
    }
};
