/* ============================================
   MOODIFY - Music Sources Module
   Unified music sources: iTunes, MusicBrainz, Audius
   Developed by Bima Haris
   ============================================ */

const MusicSources = {
    // Cache storage
    cache: {},
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
    
    // ==========================================
    // iTunes Search API (No API key required)
    // ==========================================
    
    async searchiTunes(query, limit = 20) {
        const cacheKey = `itunes_${query}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;
        
        try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('iTunes API error');
            
            const data = await response.json();
            const results = (data.results || []).map((item, i) => ({
                id: 'itunes_' + item.trackId || 'itunes_' + Date.now() + '_' + i,
                title: item.trackName || 'Untitled',
                artist: item.artistName || 'Unknown Artist',
                album: item.collectionName || 'Single',
                artworkUrl: (item.artworkUrl100 || '').replace('100x100', '600x600'),
                artworkSmall: item.artworkUrl100 || '',
                previewUrl: item.previewUrl || null,
                duration: item.trackTimeMillis ? Math.floor(item.trackTimeMillis / 1000) : 0,
                releaseDate: item.releaseDate || null,
                genre: item.primaryGenreName || 'Unknown',
                collectionName: item.collectionName || null,
                trackCount: item.trackCount || 0,
                explicit: item.contentAdvisoryRating === 'explicit',
                url: item.trackViewUrl || null,
                source: 'iTunes',
                sourceIcon: '🍎',
                playable: !!item.previewUrl,
                playType: 'preview' // 30-second preview
            }));
            
            this.setCache(cacheKey, results);
            return results;
        } catch (error) {
            console.error('iTunes search error:', error);
            return [];
        }
    },
    
    // Get track info from iTunes by ID
    async getiTunesTrackInfo(trackId) {
        try {
            const url = `https://itunes.apple.com/lookup?id=${trackId}&entity=song`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('iTunes lookup error');
            
            const data = await response.json();
            if (!data.results || data.results.length === 0) return null;
            
            const item = data.results[0];
            return {
                id: 'itunes_' + item.trackId,
                title: item.trackName || 'Untitled',
                artist: item.artistName || 'Unknown Artist',
                album: item.collectionName || 'Single',
                artworkUrl: (item.artworkUrl100 || '').replace('100x100', '600x600'),
                previewUrl: item.previewUrl || null,
                duration: item.trackTimeMillis ? Math.floor(item.trackTimeMillis / 1000) : 0,
                releaseDate: item.releaseDate || null,
                genre: item.primaryGenreName || 'Unknown',
                source: 'iTunes',
                playable: !!item.previewUrl,
                playType: 'preview'
            };
        } catch (error) {
            console.error('iTunes track info error:', error);
            return null;
        }
    },
    
    // Search artist on iTunes
    async searchArtistiTunes(artistName, limit = 10) {
        const cacheKey = `artist_itunes_${artistName}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;
        
        try {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=album&limit=${limit}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error('iTunes artist search error');
            
            const data = await response.json();
            const results = (data.results || []).map(item => ({
                id: 'itunes_album_' + item.collectionId,
                title: item.collectionName || 'Unknown Album',
                artist: item.artistName || 'Unknown Artist',
                artworkUrl: (item.artworkUrl100 || '').replace('100x100', '600x600'),
                trackCount: item.trackCount || 0,
                releaseDate: item.releaseDate || null,
                genre: item.primaryGenreName || 'Unknown',
                url: item.collectionViewUrl || null,
                source: 'iTunes'
            }));
            
            this.setCache(cacheKey, results);
            return results;
        } catch (error) {
            console.error('iTunes artist search error:', error);
            return [];
        }
    },
    
    // ==========================================
    // MusicBrainz API (No API key required)
    // ==========================================
    
    async searchMusicBrainz(query, type = 'recording', limit = 10) {
        const cacheKey = `mb_${type}_${query}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;
        
        try {
            const url = `https://musicbrainz.org/ws/2/${type}?query=${encodeURIComponent(query)}&fmt=json&limit=${limit}`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'MOODIFY/1.0 (bimaharis.my.id)'
                }
            });
            
            if (!response.ok) throw new Error('MusicBrainz API error');
            
            const data = await response.json();
            const results = (data['recording-list'] || data['release-list'] || data['artist-list'] || []).map((item, i) => {
                if (type === 'recording') {
                    return {
                        id: 'mb_recording_' + item.id,
                        title: item.title || 'Untitled',
                        artist: (item['artist-credit'] || []).map(a => a.name).join(', ') || 'Unknown Artist',
                        duration: item.length ? Math.floor(item.length / 1000) : 0,
                        mbid: item.id,
                        source: 'MusicBrainz',
                        sourceIcon: '🧠',
                        playable: false,
                        playType: 'metadata'
                    };
                } else if (type === 'artist') {
                    return {
                        id: 'mb_artist_' + item.id,
                        name: item.name || 'Unknown',
                        type: item['type'] || '',
                        country: item['country'] || '',
                        beginDate: item['life-span']?.['begin-date'] || '',
                        mbid: item.id,
                        source: 'MusicBrainz',
                        sourceIcon: '🧠'
                    };
                } else if (type === 'release') {
                    return {
                        id: 'mb_release_' + item.id,
                        title: item.title || 'Unknown Album',
                        artist: (item['artist-credit'] || []).map(a => a.name).join(', ') || 'Unknown Artist',
                        artworkUrl: item['cover-art-archive']?.['thumbnails']?.['front']?.['image'] || '',
                        releaseDate: item['date'] || '',
                        mbid: item.id,
                        source: 'MusicBrainz',
                        sourceIcon: '🧠'
                    };
                }
            }).filter(Boolean);
            
            this.setCache(cacheKey, results);
            return results;
        } catch (error) {
            console.error('MusicBrainz search error:', error);
            return [];
        }
    },
    
    // Get artist info from MusicBrainz
    async getArtistInfo(artistName) {
        return this.searchMusicBrainz(artistName, 'artist', 1);
    },
    
    // Get album info from MusicBrainz
    async getAlbumInfo(albumName, artistName = '') {
        const query = artistName ? `${albumName} artist:${artistName}` : albumName;
        return this.searchMusicBrainz(query, 'release', 5);
    },
    
    // Get recording details
    async getRecordingInfo(recordingMbid) {
        try {
            const url = `https://musicbrainz.org/ws/2/recording/${recordingMbid}?inc=artists+aliases+discids+media+recordings+isrcs&fmt=json`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'MOODIFY/1.0 (bimaharis.my.id)'
                }
            });
            
            if (!response.ok) throw new Error('MusicBrainz recording error');
            
            const data = await response.json();
            return {
                id: 'mb_recording_' + data.id,
                title: data.title || 'Untitled',
                artist: (data['artist-credit'] || []).map(a => a.name).join(', ') || 'Unknown Artist',
                duration: data.length ? Math.floor(data.length / 1000) : 0,
                mbid: data.id,
                source: 'MusicBrainz'
            };
        } catch (error) {
            console.error('MusicBrainz recording error:', error);
            return null;
        }
    },
    
    // ==========================================
    // Audius API (No API key required)
    // ==========================================
    
    async searchAudius(query, limit = 20) {
        // Audius public API is no longer available (2025)
        // All endpoints return 404 or DNS errors
        console.warn('Audius API is currently unavailable. Using iTunes + MusicBrainz instead.');
        return [];
    },
    
    // Get trending tracks from Audius
    async getTrendingAudius(limit = 20) {
        // Audius API is no longer available
        console.warn('Audius trending is currently unavailable.');
        return [];
    },
    
    // Get user profile from Audius
    async getAudiusUser(username) {
        // Audius API is no longer available
        return null;
    },
    
    // ==========================================
    // Unified Search (All sources combined)
    // ==========================================
    
    async unifiedSearch(query, limit = 20) {
        if (!query || query.length < 2) return [];
        
        const results = {
            iTunes: [],
            MusicBrainz: [],
            Audius: [],
            total: 0
        };
        
        // Search all sources in parallel
        const [iTunesResults, mbResults, audiusResults] = await Promise.allSettled([
            this.searchiTunes(query, limit),
            this.searchMusicBrainz(query, 'recording', limit),
            this.searchAudius(query, limit)
        ]);
        
        // Process results
        if (iTunesResults.status === 'fulfilled') {
            results.iTunes = iTunesResults.value;
        }
        
        if (mbResults.status === 'fulfilled') {
            results.MusicBrainz = mbResults.value;
        }
        
        if (audiusResults.status === 'fulfilled') {
            results.Audius = audiusResults.value;
        }
        
        // Calculate total
        results.total = results.iTunes.length + results.MusicBrainz.length + results.Audius.length;
        
        // Flatten all results for display
        results.all = [
            ...results.iTunes,
            ...results.MusicBrainz,
            ...results.Audius
        ];
        
        return results;
    },
    
    // Search with priority: iTunes first (has preview), then Audius (has streaming), then MusicBrainz (metadata)
    async searchWithPriority(query, limit = 20) {
        const results = await this.unifiedSearch(query, limit);
        
        // Sort by playability: playable tracks first
        return results.all.sort((a, b) => {
            const aPlayable = a.playable ? 0 : 1;
            const bPlayable = b.playable ? 0 : 1;
            return aPlayable - bPlayable;
        });
    },
    
    // ==========================================
    // Utility Functions
    // ==========================================
    
    // Slugify string for URLs
    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 100);
    },
    
    // Format duration in seconds to MM:SS
    formatDuration(seconds) {
        if (!seconds || seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Format play count (e.g., 1234567 → 1.2M)
    formatCount(count) {
        if (!count) return '0';
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
    },
    
    // Get source badge HTML
    getSourceBadge(source) {
        const badges = {
            'iTunes': '<span class="source-badge itunes">🍎 iTunes</span>',
            'YouTube': '<span class="source-badge youtube">▶️ YouTube</span>',
            'MusicBrainz': '<span class="source-badge musicbrainz">🧠 MusicBrainz</span>',
            'Audius': '<span class="source-badge audius">🎧 Audius</span>',
            'Spotify': '<span class="source-badge spotify">🟢 Spotify</span>',
            'Demo': '<span class="source-badge demo">✨ Demo</span>'
        };
        return badges[source] || `<span class="source-badge unknown">🎵 ${source}</span>`;
    },
    
    // Get play type label
    getPlayTypeLabel(playType) {
        const labels = {
            'preview': 'Preview 30 detik',
            'stream': 'Streaming langsung',
            'video': 'Video YouTube',
            'metadata': 'Info saja',
            'spotify': 'Buka di Spotify'
        };
        return labels[playType] || 'Tidak dapat diputar';
    },
    
    // ==========================================
    // Cache Management
    // ==========================================
    
    getCached(key) {
        const cached = this.cache[key];
        if (!cached) return null;
        
        const now = Date.now();
        if (now - cached.timestamp > this.cacheExpiry) {
            delete this.cache[key];
            return null;
        }
        
        return cached.data;
    },
    
    setCache(key, data) {
        this.cache[key] = {
            data: data,
            timestamp: Date.now()
        };
    },
    
    clearCache() {
        this.cache = {};
    },
    
    // Clear cache older than expiry
    cleanCache() {
        const now = Date.now();
        Object.keys(this.cache).forEach(key => {
            if (now - this.cache[key].timestamp > this.cacheExpiry) {
                delete this.cache[key];
            }
        });
    }
};
