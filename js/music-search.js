/* ============================================
   MOODIFY - Music Search Module
   Unified Search: iTunes, MusicBrainz, Audius, YouTube
   Developed by Bima Haris
   ============================================ */

const MusicSearch = {
    // Debounce timer
    debounceTimer: null,
    debounceDelay: 300,
    
    // Search cache
    searchCache: {},
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
    
    // Search using iTunes API (no API key required)
    // Now delegates to MusicSources for better metadata
    async searchiTunes(query, limit = 16) {
        // Use MusicSources if available
        if (typeof MusicSources !== 'undefined') {
            return MusicSources.searchiTunes(query, limit);
        }
        
        // Fallback to original implementation
        try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}&country=id`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('iTunes API error');
            
            const data = await response.json();
            return (data.results || []).map((item, i) => ({
                id: 'itunes_' + Date.now() + '_' + i,
                title: item.trackName || 'Untitled',
                artist: item.artistName || 'Unknown artist',
                emoji: '🎵',
                cover: 'c' + (i % 4 + 1),
                mood: '',
                artworkUrl: (item.artworkUrl100 || '').replace('100x100', '400x400'),
                previewUrl: item.previewUrl || null,
                collectionName: item.collectionName || null,
                source: 'iTunes',
                playable: !!item.previewUrl,
                playType: 'preview'
            }));
        } catch (error) {
            console.error('iTunes search error:', error);
            return [];
        }
    },
    
    // Search using YouTube Data API v3 (requires API key)
    async searchYouTube(query, maxResults = 12) {
        // Check if API key is configured
        if (typeof CONFIG === 'undefined') {
            console.warn('⚠️ CONFIG not loaded. YouTube search disabled.');
            return [];
        }
        if (CONFIG.YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE' || CONFIG.YOUTUBE_API_KEY === '') {
            console.warn('⚠️ YouTube API key not configured. Use iTunes search or open YouTube directly.');
            return [];
        }
        
        console.log(`▶️ YouTube API search: "${query}" (key: ${CONFIG.YOUTUBE_API_KEY.substring(0,10)}...)`);
        
        try {
            // Search for music videos
            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${CONFIG.YOUTUBE_API_KEY}`;
            const searchResponse = await fetch(searchUrl);
            
            if (!searchResponse.ok) {
                const errorText = await searchResponse.text();
                console.error('❌ YouTube API error:', searchResponse.status, errorText.substring(0, 200));
                throw new Error(`YouTube API error: ${searchResponse.status}`);
            }
            
            const searchData = await searchResponse.json();
            const items = searchData.items || [];
            console.log(`✅ YouTube API returned ${items.length} results`);
            
            if (items.length === 0) return [];
            
            // Get video details (duration, view count)
            const videoIds = items.map(item => item.id.videoId).join(',');
            const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${CONFIG.YOUTUBE_API_KEY}`;
            
            let detailsData = null;
            try {
                const detailsResponse = await fetch(detailsUrl);
                if (detailsResponse.ok) {
                    detailsData = await detailsResponse.json();
                }
            } catch (err) {
                console.warn('Failed to fetch video details:', err);
            }
            
            // Map results with details
            return items.map((item, i) => {
                const videoDetails = detailsData?.items?.find(v => v.id === item.id.videoId);
                const duration = videoDetails?.contentDetails?.duration || '';
                const viewCount = videoDetails?.statistics?.viewCount || 0;
                
                // Parse ISO 8601 duration to seconds
                let durationSeconds = 0;
                if (duration) {
                    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                    if (match) {
                        durationSeconds = (parseInt(match[1] || 0) * 3600) + 
                                         (parseInt(match[2] || 0) * 60) + 
                                         parseInt(match[3] || 0);
                    }
                }
                
                return {
                    id: 'yt_' + item.id.videoId,
                    title: this.cleanTitle(item.snippet.title),
                    artist: item.snippet.channelTitle,
                    emoji: '▶️',
                    cover: 'c' + (i % 4 + 1),
                    mood: '',
                    videoId: item.id.videoId,
                    thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
                    duration: durationSeconds,
                    durationFormatted: this.formatDuration(durationSeconds),
                    viewCount: parseInt(viewCount),
                    publishedAt: item.snippet.publishedAt,
                    description: item.snippet.description || '',
                    source: 'YouTube'
                };
            });
        } catch (error) {
            console.error('YouTube search error:', error);
            return [];
        }
    },
    
    // Clean YouTube video title (remove brackets, views, etc.)
    cleanTitle(title) {
        return title
            .replace(/\[.*?\]/g, '') // Remove [Official Music Video], etc.
            .replace(/\(.*?\)/g, '') // Remove (Lyrics), etc.
            .replace(/-{2,}/g, '-')  // Replace multiple dashes with single
            .replace(/^-+\s*|-+\s*$/g, '') // Remove leading/trailing dashes
            .trim();
    },
    
    // Format duration in seconds to MM:SS
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Combined search: YouTube first (if API key available), then iTunes
    async searchAll(query) {
        const [youtubeResults, iTunesResults] = await Promise.all([
            this.searchYouTube(query),
            this.searchiTunes(query)
        ]);
        
        // Merge results, YouTube first (better for playback)
        return [...youtubeResults, ...iTunesResults];
    },
    
    // Search with fallback: YouTube first, then iTunes if no results
    async searchWithFallback(query) {
        // Try YouTube first
        const youtubeResults = await this.searchYouTube(query);
        if (youtubeResults.length > 0) {
            return youtubeResults;
        }
        
        // Fallback to iTunes
        const iTunesResults = await this.searchiTunes(query);
        return iTunesResults;
    },
    
    // ==========================================
    // Unified Search with all sources
    // ==========================================
    
    // Search all sources: iTunes, MusicBrainz, YouTube
    // Audius API is no longer available (2025)
    async unifiedSearch(query) {
        if (!query || query.length < 2) {
            return { iTunes: [], MusicBrainz: [], YouTube: [], total: 0, all: [] };
        }
        
        // Check cache first
        const cacheKey = `unified_${query}`;
        const cached = this.searchCache[cacheKey];
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        
        const results = {
            iTunes: [],
            MusicBrainz: [],
            YouTube: [],
            total: 0
        };
        
        // YouTube search: try API key first, fallback to YTSearch (no API key needed)
        async function searchYouTubeWithFallback(query, limit) {
            try {
                // Try YouTube Data API first if configured
                if (typeof CONFIG !== 'undefined' && 
                    CONFIG.YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE' && 
                    CONFIG.YOUTUBE_API_KEY !== '' &&
                    CONFIG.YOUTUBE_API_KEY !== 'AIzaSyAXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') {
                    
                    console.log('🔑 YouTube API key detected, using YouTube Data API v3');
                    const apiResults = await MusicSearch.searchYouTube(query, limit);
                    if (apiResults.length > 0) {
                        console.log(`✅ YouTube API: ${apiResults.length} results`);
                        return apiResults;
                    }
                    console.warn('⚠️ YouTube API returned 0 results, trying fallback...');
                } else {
                    console.log('ℹ️ YouTube API key not configured, using fallback search');
                }
                
                // Fallback to YTSearch (no API key needed)
                if (typeof YTSearch !== 'undefined') {
                    console.log('🔄 Using YTSearch fallback...');
                    const ytResults = await YTSearch.searchYouTube(query, limit);
                    return ytResults;
                }
            } catch (error) {
                console.warn('❌ YouTube search failed:', error.message);
            }
            
            return [];
        }
        
        // Search all sources in parallel with timeout
        const timeout = (promise, ms) => {
            return Promise.race([
                promise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
                )
            ]);
        };
        
        const [iTunesResults, mbResults, youtubeResults] = await Promise.allSettled([
            timeout(this.searchiTunes(query, 15), 10000),
            timeout(
                typeof MusicSources !== 'undefined' ? MusicSources.searchMusicBrainz(query, 'recording', 10) : Promise.resolve([]),
                10000
            ),
            timeout(searchYouTubeWithFallback(query, 10), 15000)
        ]);
        
        // Process results - always accept fulfilled, ignore rejected
        if (iTunesResults.status === 'fulfilled') {
            results.iTunes = iTunesResults.value || [];
            console.log(`🍎 iTunes: ${results.iTunes.length} results`);
        } else {
            console.warn('iTunes search rejected:', iTunesResults.reason?.message || 'unknown');
        }
        
        if (mbResults.status === 'fulfilled') {
            results.MusicBrainz = mbResults.value || [];
            console.log(`🧠 MusicBrainz: ${results.MusicBrainz.length} results`);
        } else {
            console.warn('MusicBrainz search rejected:', mbResults.reason?.message || 'unknown');
        }
        
        if (youtubeResults.status === 'fulfilled') {
            results.YouTube = youtubeResults.value || [];
            console.log(`▶️ YouTube: ${results.YouTube.length} results`);
        } else {
            console.warn('YouTube search rejected:', youtubeResults.reason?.message || 'unknown');
        }
        
        // Calculate total
        results.total = results.iTunes.length + results.MusicBrainz.length + results.YouTube.length;
        
        // Flatten all results
        results.all = [
            ...results.YouTube,  // YouTube first (best for playback)
            ...results.iTunes,   // iTunes second (has preview)
            ...results.MusicBrainz  // MusicBrainz last (metadata only)
        ];
        
        console.log(`📊 Total search results: ${results.total}`);
        
        // Cache results
        this.searchCache[cacheKey] = {
            data: results,
            timestamp: Date.now()
        };
        
        return results;
    },
    
    // Debounced search - prevents excessive API calls
    async debouncedSearch(query, callback) {
        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        // Show loading indicator
        if (typeof showSearchLoading === 'function') {
            showSearchLoading(true);
        }
        
        // Set new timer
        this.debounceTimer = setTimeout(async () => {
            const results = await this.unifiedSearch(query);
            
            // Hide loading indicator
            if (typeof showSearchLoading === 'function') {
                showSearchLoading(false);
            }
            
            // Call callback with results
            if (typeof callback === 'function') {
                callback(results);
            }
        }, this.debounceDelay);
    },
    
    // Search with source filter
    async searchBySource(query, source) {
        switch (source.toLowerCase()) {
            case 'itunes':
                return await this.searchiTunes(query);
            case 'youtube':
                return await this.searchYouTube(query);
            case 'musicbrainz':
                return typeof MusicSources !== 'undefined' ? 
                    MusicSources.searchMusicBrainz(query, 'recording') : [];
            case 'audius':
                return typeof MusicSources !== 'undefined' ? 
                    MusicSources.searchAudius(query) : [];
            default:
                return await this.unifiedSearch(query);
        }
    },
    
    // Get trending from multiple sources
    async getTrendingAll() {
        const results = {
            demo: this.getTrending(),
            audius: []
        };
        
        try {
            if (typeof MusicSources !== 'undefined') {
                results.audius = await MusicSources.getTrendingAudius(10);
            }
        } catch (error) {
            console.warn('Failed to get Audius trending:', error);
        }
        
        return results;
    },
    
    // Clear search cache
    clearSearchCache() {
        this.searchCache = {};
        if (typeof MusicSources !== 'undefined') {
            MusicSources.clearCache();
        }
    },

    // Get suggestions based on query
    async getSuggestions(query) {
        if (!query || query.length < 2) return [];
        
        // Use demo songs for suggestions
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        const queryLower = query.toLowerCase();
        
        return demoSongs
            .filter(s => 
                s.title.toLowerCase().includes(queryLower) || 
                s.artist.toLowerCase().includes(queryLower)
            )
            .slice(0, 5)
            .map(s => s.title);
    },
    
    // Search by mood
    searchByMood(mood) {
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        return demoSongs.filter(s => s.mood === mood);
    },
    
    // Get trending songs
    getTrending() {
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        return demoSongs.slice(0, 8);
    },
    
    // Get recently played (from localStorage)
    getRecentlyPlayed() {
        try {
            const stored = localStorage.getItem('moodify_recentlyPlayed');
            if (!stored) return [];
            
            const recentlyPlayed = JSON.parse(stored);
            const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
            
            return recentlyPlayed
                .map(id => demoSongs.find(s => s.id === id))
                .filter(Boolean)
                .slice(0, 10);
        } catch (error) {
            return [];
        }
    },
    
    // Add to recently played
    addToRecentlyPlayed(songId) {
        try {
            let recentlyPlayed = JSON.parse(localStorage.getItem('moodify_recentlyPlayed') || '[]');
            
            // Remove if already exists
            recentlyPlayed = recentlyPlayed.filter(id => id !== songId);
            
            // Add to beginning
            recentlyPlayed.unshift(songId);
            
            // Keep only last 20
            recentlyPlayed = recentlyPlayed.slice(0, 20);
            
            localStorage.setItem('moodify_recentlyPlayed', JSON.stringify(recentlyPlayed));
        } catch (error) {
            console.error('Failed to save recently played:', error);
        }
    },
    
    // Check if YouTube API is configured
    isYouTubeConfigured() {
        if (typeof CONFIG === 'undefined') return false;
        const placeholders = ['YOUR_YOUTUBE_API_KEY_HERE', 'AIzaSyAXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', ''];
        return !placeholders.includes(CONFIG.YOUTUBE_API_KEY);
    }
};
