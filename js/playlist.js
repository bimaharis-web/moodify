/* ============================================
   MOODIFY - Playlist Module
   Playlist Management
   Developed by Bima Haris
   ============================================ */

const PlaylistManager = {
    // Get all playlists
    getAll() {
        if (typeof AppState !== 'undefined') {
            return AppState.playlists || [];
        }
        return [];
    },
    
    // Get playlist by ID
    getById(id) {
        return this.getAll().find(p => p.id === id);
    },
    
    // Create a new playlist
    create(name, description = '', isPublic = true) {
        if (typeof AppState === 'undefined') return null;
        
        const playlist = {
            id: 'pl_' + Date.now(),
            name: name,
            description: description,
            cover: 'c' + (Math.floor(Math.random() * 4) + 1),
            emoji: '🎵',
            songs: [],
            isPublic: isPublic,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        AppState.playlists.push(playlist);
        this.saveToStorage();
        
        if (typeof notify === 'function') {
            notify(`🎵 Playlist "${name}" dibuat!`);
        }
        
        return playlist;
    },
    
    // Update playlist
    update(id, updates) {
        const playlist = this.getById(id);
        if (!playlist) return false;
        
        Object.assign(playlist, updates);
        this.saveToStorage();
        
        if (typeof notify === 'function') {
            notify('✅ Playlist diperbarui');
        }
        
        return true;
    },
    
    // Delete playlist
    delete(id) {
        if (typeof AppState === 'undefined') return false;
        
        AppState.playlists = AppState.playlists.filter(p => p.id !== id);
        this.saveToStorage();
        
        if (typeof notify === 'function') {
            notify('🗑 Playlist dihapus');
        }
        
        return true;
    },
    
    // Add song to playlist
    addSong(playlistId, songId) {
        const playlist = this.getById(playlistId);
        if (!playlist) return false;
        
        if (!playlist.songs.includes(songId)) {
            playlist.songs.push(songId);
            this.saveToStorage();
            
            if (typeof notify === 'function') {
                notify('🎵 Lagu ditambahkan ke playlist');
            }
            return true;
        }
        
        return false;
    },
    
    // Remove song from playlist
    removeSong(playlistId, songId) {
        const playlist = this.getById(playlistId);
        if (!playlist) return false;
        
        playlist.songs = playlist.songs.filter(id => id !== songId);
        this.saveToStorage();
        
        if (typeof notify === 'function') {
            notify('Lagu dihapus dari playlist');
        }
        
        return true;
    },
    
    // Reorder songs in playlist
    reorderSong(playlistId, fromIndex, toIndex) {
        const playlist = this.getById(playlistId);
        if (!playlist) return false;
        
        const songs = [...playlist.songs];
        const [movedSong] = songs.splice(fromIndex, 1);
        songs.splice(toIndex, 0, movedSong);
        playlist.songs = songs;
        
        this.saveToStorage();
        return true;
    },
    
    // Get songs with full details
    getSongsWithDetails(playlistId) {
        const playlist = this.getById(playlistId);
        if (!playlist) return [];
        
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        
        return playlist.songs.map(id => demoSongs.find(s => s.id === id)).filter(Boolean);
    },
    
    // Share playlist link
    getShareLink(playlistId) {
        return `${window.location.origin}${window.location.pathname}playlist.html?id=${playlistId}`;
    },
    
    // Copy share link to clipboard
    copyShareLink(playlistId) {
        const link = this.getShareLink(playlistId);
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(link).then(() => {
                if (typeof notify === 'function') {
                    notify('📋 Link playlist disalin!');
                }
            }).catch(() => {
                this.fallbackCopy(link);
            });
        } else {
            this.fallbackCopy(link);
        }
    },
    
    // Fallback copy method
    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            if (typeof notify === 'function') {
                notify('📋 Link playlist disalin!');
            }
        } catch (err) {
            if (typeof notify === 'function') {
                notify('❌ Gagal menyalin link');
            }
        }
        
        document.body.removeChild(textarea);
    },
    
    // Save playlists to localStorage
    saveToStorage() {
        try {
            if (typeof AppState !== 'undefined') {
                localStorage.setItem('moodify_playlists', JSON.stringify(AppState.playlists));
            }
        } catch (error) {
            console.error('Failed to save playlists:', error);
        }
    },
    
    // Load playlists from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('moodify_playlists');
            if (!stored) return false;
            
            const playlists = JSON.parse(stored);
            if (typeof AppState !== 'undefined' && Array.isArray(playlists)) {
                AppState.playlists = playlists;
                return true;
            }
        } catch (error) {
            console.error('Failed to load playlists:', error);
        }
        return false;
    },
    
    // Initialize
    init() {
        // Try to load from storage
        if (!this.loadFromStorage()) {
            // Use default playlists from AppState
            console.log('Using default playlists');
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PlaylistManager.init();
});
