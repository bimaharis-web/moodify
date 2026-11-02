/* ============================================
   MOODIFY - Spotify Integration Module
   Spotify Web API with OAuth Authorization Code + PKCE
   Developed by Bima Haris
   
   Fitur:
   - Connect / Disconnect Spotify
   - OAuth PKCE flow (tanpa Client Secret di frontend)
   - Token management (access + refresh)
   - Profil pengguna (nama, foto, username)
   - Playlist pengguna dengan detail lagu
   - Detail lagu, artis, album, artwork
   - Tombol Open in Spotify
   - Status Connected / Not Connected
   - Mode demo ketika kredensial belum tersedia
   ============================================ */

const Spotify = {
   accessToken: null,
   refreshToken: null,
   expiresAt: null,
   userProfile: null,
   isConnected: false,
   
   // Minimum scopes needed (sesuai permintaan)
   SCOPES: [
       'user-read-email',
       'user-read-private',
       'playlist-read-private',
       'playlist-read-collaborative',
       'user-top-read',
       'user-library-read'
   ].join(' '),
   
   // Demo data untuk mode tanpa kredensial
   DEMO_PROFILE: {
       display_name: 'Demo User',
       external_urls: { spotify: 'https://open.spotify.com/user/demo' },
       followers: { total: 0 },
       href: '',
       id: 'demo',
       images: [],
       type: 'user',
       uri: 'spotify:user:demo'
   },
   
   DEMO_PLAYLISTS: [
       {
           collaborative: false,
           description: 'Lagu-lagu favorit saya 🎵',
           external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
           href: '',
           id: 'demo_1',
           images: [{ url: 'https://i.scdn.co/image/ab67706f00000002724554ed6bed6f15041c45c5', height: 300, width: 300 }],
           name: 'Today\'s Top Hits',
           owner: { display_name: 'Spotify', external_urls: { spotify: 'https://open.spotify.com/user/spotify' }, href: '', id: 'spotify', type: 'user', uri: 'spotify:user:spotify' },
           primary_color: null,
           public: true,
           snapshot_id: '',
           tracks: { href: '', total: 50 },
           type: 'playlist',
           uri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M'
       },
       {
           collaborative: false,
           description: 'Musik chill untuk fokus 🎧',
           external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX4wct9seBnpT' },
           href: '',
           id: 'demo_2',
           images: [{ url: 'https://i.scdn.co/image/ab67706f000000029bb6af539d87fbbf70c382fe', height: 300, width: 300 }],
           name: 'Deep Focus',
           owner: { display_name: 'Spotify', external_urls: { spotify: 'https://open.spotify.com/user/spotify' }, href: '', id: 'spotify', type: 'user', uri: 'spotify:user:spotify' },
           primary_color: null,
           public: true,
           snapshot_id: '',
           tracks: { href: '', total: 170 },
           type: 'playlist',
           uri: 'spotify:playlist:37i9dQZF1DX4wct9seBnpT'
       },
       {
           collaborative: false,
           description: 'Lagu romantis untuk suasana hati 💕',
           external_urls: { spotify: 'https://open.spotify.com/playlist/37i9dQZF1DX50QitC6rQMT' },
           href: '',
           id: 'demo_3',
           images: [{ url: 'https://i.scdn.co/image/ab67706f0000000298990a3a2849b93465d59a7e', height: 300, width: 300 }],
           name: 'Romantic Hits',
           owner: { display_name: 'Spotify', external_urls: { spotify: 'https://open.spotify.com/user/spotify' }, href: '', id: 'spotify', type: 'user', uri: 'spotify:user:spotify' },
           primary_color: null,
           public: true,
           snapshot_id: '',
           tracks: { href: '', total: 80 },
           type: 'playlist',
           uri: 'spotify:playlist:37i9dQZF1DX50QitC6rQMT'
       }
   ],
   
   DEMO_TRACKS: [
       {
           album: { album_type: 'album', artists: [{ external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05ib' }, href: '', id: '1Xyo4u8uXC1ZmMpatF05ib', name: 'The Weeknd', type: 'artist', uri: 'spotify:artist:1Xyo4u8uXC1ZmMpatF05ib' }], external_urls: { spotify: 'https://open.spotify.com/album/4yP0hdKOZPNshxUOjY0cZj' }, href: '', id: '4yP0hdKOZPNshxUOjY0cZj', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b27347685e6c8b1e6e8e2c3e8e8e', height: 640, width: 640 }], name: 'After Hours', release_date: '2020-03-20', release_date_precision: 'day', type: 'album', uri: 'spotify:album:4yP0hdKOZPNshxUOjY0cZj' },
           artists: [{ external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05ib' }, href: '', id: '1Xyo4u8uXC1ZmMpatF05ib', name: 'The Weeknd', type: 'artist', uri: 'spotify:artist:1Xyo4u8uXC1ZmMpatF05ib' }],
           disc_number: 1,
           duration_ms: 200040,
           explicit: false,
           external_urls: { spotify: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b' },
           href: '',
           id: '0VjIjW4GlUZAMYd2vXMi3b',
           is_local: false,
           name: 'Blinding Lights',
           track_number: 3,
           type: 'track',
           uri: 'spotify:track:0VjIjW4GlUZAMYd2vXMi3b'
       },
       {
           album: { album_type: 'album', artists: [{ external_urls: { spotify: 'https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR' }, href: '', id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Ariana Grande', type: 'artist', uri: 'spotify:artist:66CXWjxzNUsdJxJ2JdwvnR' }], external_urls: { spotify: 'https://open.spotify.com/album/3euz4vS7ezKGnNSwgyvKcd' }, href: '', id: '3euz4vS7ezKGnNSwgyvKcd', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273999999999999999999999999', height: 640, width: 640 }], name: 'Positions', release_date: '2020-10-30', release_date_precision: 'day', type: 'album', uri: 'spotify:album:3euz4vS7ezKGnNSwgyvKcd' },
           artists: [{ external_urls: { spotify: 'https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR' }, href: '', id: '66CXWjxzNUsdJxJ2JdwvnR', name: 'Ariana Grande', type: 'artist', uri: 'spotify:artist:66CXWjxzNUsdJxJ2JdwvnR' }],
           disc_number: 1,
           duration_ms: 172000,
           explicit: false,
           external_urls: { spotify: 'https://open.spotify.com/track/35mvY5S1H3J2QZa3rBB9yL' },
           href: '',
           id: '35mvY5S1H3J2QZa3rBB9yL',
           is_local: false,
           name: 'positions',
           track_number: 1,
           type: 'track',
           uri: 'spotify:track:35mvY5S1H3J2QZa3rBB9yL'
       }
   ],
    
    // Generate random string for PKCE
    generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    
    // Generate code verifier
    generateCodeVerifier() {
        return this.generateRandomString(64);
    },
    
    // Generate code challenge from verifier (PKCE)
    async generateCodeChallenge(verifier) {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode(...new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    },
    
    // Check if Spotify is configured
    isConfigured() {
        return typeof CONFIG !== 'undefined' && 
               CONFIG.SPOTIFY_CLIENT_ID !== 'YOUR_SPOTIFY_CLIENT_ID_HERE';
    },
    
    // Start OAuth flow
    connect() {
        if (!this.isConfigured()) {
            if (typeof notify === 'function') {
                notify('⚠️ Spotify belum dikonfigurasi. Lihat settings.html untuk instruksi.');
            }
            return false;
        }
        
        const clientId = CONFIG.SPOTIFY_CLIENT_ID;
        const redirectUri = CONFIG.SPOTIFY_REDIRECT_URI || window.location.origin;
        const codeVerifier = this.generateCodeVerifier();
        
        this.generateCodeChallenge(codeVerifier).then(async (codeChallenge) => {
            // Store verifier in session storage
            sessionStorage.setItem('spotify_code_verifier', codeVerifier);
            sessionStorage.setItem('spotify_state', this.generateRandomString(16));
            
            const state = sessionStorage.getItem('spotify_state');
            const scopes = this.SCOPES;
            
            const authUrl = `https://accounts.spotify.com/authorize?` + 
                `client_id=${encodeURIComponent(clientId)}` +
                `&response_type=code` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&scope=${encodeURIComponent(scopes)}` +
                `&state=${encodeURIComponent(state)}` +
                `&code_challenge=${encodeURIComponent(codeChallenge)}` +
                `&code_challenge_method=S256`;
            
            window.location.href = authUrl;
        });
        
        return true;
    },
    
    // Handle OAuth callback
    async handleCallback(authCode) {
        if (!this.isConfigured()) return false;
        
        const codeVerifier = sessionStorage.getItem('spotify_code_verifier');
        const redirectUri = CONFIG.SPOTIFY_REDIRECT_URI || window.location.origin;
        
        if (!codeVerifier) {
            console.error('No code verifier found');
            return false;
        }
        
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: CONFIG.SPOTIFY_CLIENT_ID,
                    grant_type: 'authorization_code',
                    code: authCode,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier
                })
            });
            
            if (!response.ok) throw new Error('Token exchange failed');
            
            const data = await response.json();
            
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.expiresAt = Date.now() + (data.expires_in * 1000);
            this.isConnected = true;
            
            // Store tokens
            this.storeTokens();
            
            // Clear session storage
            sessionStorage.removeItem('spotify_code_verifier');
            sessionStorage.removeItem('spotify_state');
            
            // Fetch user profile
            await this.fetchUserProfile();
            
            // Update UI
            this.updateSpotifyUI();
            
            // Update profile link
            const profileLink = document.getElementById('spotifyProfileLink');
            if (profileLink && this.userProfile) {
                profileLink.href = this.userProfile.external_urls?.spotify || '#';
            }
            
            // Toggle demo/real playlists
            const demoPanel = document.getElementById('spotifyDemoPanel');
            const setupInstructions = document.getElementById('spotifySetupInstructions');
            const realPlaylists = document.getElementById('spotifyRealPlaylists');
            if (demoPanel) demoPanel.style.display = 'none';
            if (setupInstructions) setupInstructions.style.display = 'none';
            if (realPlaylists) realPlaylists.style.display = 'block';
            
            // Load real playlists
            this.displayUserPlaylists();
            
            // Call external callback if exists
            if (typeof onSpotifyConnected === 'function') {
                onSpotifyConnected();
            }
            
            if (typeof notify === 'function') {
                notify('✅ Spotify berhasil dihubungkan!');
            }
            
            return true;
            
        } catch (error) {
            console.error('Spotify OAuth error:', error);
            if (typeof notify === 'function') {
                notify('❌ Gagal menghubungkan Spotify');
            }
            return false;
        }
    },
    
    // Store tokens in localStorage
    storeTokens() {
        try {
            localStorage.setItem('moodify_spotify_tokens', JSON.stringify({
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                expiresAt: this.expiresAt
            }));
        } catch (error) {
            console.error('Failed to store tokens:', error);
        }
    },
    
    // Load tokens from localStorage
    loadTokens() {
        try {
            const stored = localStorage.getItem('moodify_spotify_tokens');
            if (!stored) return false;
            
            const tokens = JSON.parse(stored);
            this.accessToken = tokens.accessToken;
            this.refreshToken = tokens.refreshToken;
            this.expiresAt = tokens.expiresAt;
            this.isConnected = Date.now() < this.expiresAt;
            
            return this.isConnected;
        } catch (error) {
            console.error('Failed to load tokens:', error);
            return false;
        }
    },
    
    // Check if token is expired
    isTokenExpired() {
        return !this.expiresAt || Date.now() >= this.expiresAt;
    },
    
    // Refresh access token
    async refreshTokenIfNeeded() {
        if (!this.isTokenExpired()) return true;
        
        if (!this.refreshToken || !this.isConfigured()) {
            this.isConnected = false;
            return false;
        }
        
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: CONFIG.SPOTIFY_CLIENT_ID,
                    grant_type: 'refresh_token',
                    refresh_token: this.refreshToken
                })
            });
            
            if (!response.ok) throw new Error('Token refresh failed');
            
            const data = await response.json();
            
            this.accessToken = data.access_token;
            if (data.refresh_token) {
                this.refreshToken = data.refresh_token;
            }
            this.expiresAt = Date.now() + (data.expires_in * 1000);
            
            this.storeTokens();
            return true;
            
        } catch (error) {
            console.error('Token refresh error:', error);
            this.disconnect();
            return false;
        }
    },
    
    // Make API request with automatic token refresh
    async apiRequest(endpoint) {
        if (!this.isConnected) return null;
        
        await this.refreshTokenIfNeeded();
        
        try {
            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, try refresh
                    await this.refreshTokenIfNeeded();
                    const retryResponse = await fetch(endpoint, {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        }
                    });
                    if (!retryResponse.ok) throw new Error('API request failed');
                    return await retryResponse.json();
                }
                throw new Error('API request failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Spotify API error:', error);
            return null;
        }
    },
    
    // Fetch user profile
    async fetchUserProfile() {
        const data = await this.apiRequest('https://api.spotify.com/v1/me');
        if (data) {
            this.userProfile = data;
            return data;
        }
        return null;
    },
    
    // Get user playlists
    async getUserPlaylists(limit = 20) {
        const data = await this.apiRequest(
            `https://api.spotify.com/v1/me/playlists?limit=${limit}`
        );
        return data?.playlists?.items || [];
    },
    
    // Get playlist details
    async getPlaylistDetails(playlistId) {
        const data = await this.apiRequest(
            `https://api.spotify.com/v1/playlists/${playlistId}?fields=tracks,name,images,owner,description`
        );
        return data;
    },
    
    // Get user top tracks
    async getTopTracks(timeRange = 'short_term') {
        const data = await this.apiRequest(
            `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=10`
        );
        return data?.items || [];
    },
    
    // Get user saved tracks
    async getSavedTracks(limit = 20) {
        const data = await this.apiRequest(
            `https://api.spotify.com/v1/me/tracks?limit=${limit}`
        );
        return data?.items || [];
    },
    
    // Open a track in Spotify app/web
    openInSpotify(uri) {
        if (uri) {
            window.open(`https://open.spotify.com/${uri.split(':')[0]}/${uri.split(':')[1]}`, '_blank', 'noopener');
        }
    },
    
    // Get connection status
    getStatus() {
        return {
            isConnected: this.isConnected,
            isConfigured: this.isConfigured(),
            hasToken: !!this.accessToken,
            isExpired: this.isTokenExpired(),
            user: this.userProfile
        };
    },
    
    // =============================================
    // UI Update Functions
    // =============================================
    
    // Update all Spotify UI elements across the page
    updateSpotifyUI() {
        const status = this.getStatus();
        
        // Update connection status badges
        const statusBadges = document.querySelectorAll('.spotify-status-badge');
        statusBadges.forEach(badge => {
            if (status.isConnected) {
                badge.textContent = 'Connected';
                badge.className = 'spotify-status-badge connected';
            } else if (status.isConfigured) {
                badge.textContent = 'Not Connected';
                badge.className = 'spotify-status-badge not-connected';
            } else {
                badge.textContent = 'Not Configured';
                badge.className = 'spotify-status-badge not-configured';
            }
        });
        
        // Update Connect/Disconnect buttons
        const connectBtns = document.querySelectorAll('#spotifyConnectBtn, .spotify-connect-btn');
        const disconnectBtns = document.querySelectorAll('#spotifyDisconnectBtn, .spotify-disconnect-btn');
        
        connectBtns.forEach(btn => {
            btn.style.display = status.isConnected ? 'none' : 'inline-block';
        });
        disconnectBtns.forEach(btn => {
            btn.style.display = status.isConnected ? 'inline-block' : 'none';
        });
        
        // Update status text elements
        const statusTexts = document.querySelectorAll('#spotifyStatus, .spotify-status-text');
        statusTexts.forEach(el => {
            if (status.isConnected) {
                el.textContent = 'Terhubung';
                el.style.color = 'var(--cyan)';
            } else if (status.isConfigured) {
                el.textContent = 'Siap';
                el.style.color = 'var(--muted)';
            } else {
                el.textContent = 'Belum dikonfigurasi';
                el.style.color = 'var(--muted)';
            }
        });
        
        // Update right sidebar status
        const spotifyApiStatus = document.getElementById('spotifyApiStatus');
        if (spotifyApiStatus) {
            if (status.isConnected) {
                spotifyApiStatus.textContent = '✓';
                spotifyApiStatus.style.color = 'var(--cyan)';
            } else if (status.isConfigured) {
                spotifyApiStatus.textContent = '—';
                spotifyApiStatus.style.color = 'var(--muted)';
            } else {
                spotifyApiStatus.textContent = '—';
                spotifyApiStatus.style.color = 'var(--muted)';
            }
        }
        
        // Display user profile if connected
        if (status.isConnected && this.userProfile) {
            this.displayUserProfile();
        }
    },
    
    // Display user profile
    displayUserProfile() {
        const profile = this.userProfile;
        if (!profile) return;
        
        // Update profile section
        const profileContainer = document.getElementById('spotifyProfile');
        if (profileContainer) {
            profileContainer.style.display = 'block';
        }
        
        // Update avatar
        const avatar = document.getElementById('spotifyAvatar');
        if (avatar) {
            if (profile.images && profile.images.length > 0) {
                avatar.style.backgroundImage = `url(${profile.images[0].url})`;
                avatar.style.backgroundSize = 'cover';
                avatar.style.backgroundPosition = 'center';
                avatar.textContent = '';
            } else {
                avatar.textContent = (profile.display_name || 'S')[0].toUpperCase();
                avatar.style.backgroundImage = 'none';
            }
        }
        
        // Update name
        const name = document.getElementById('spotifyName');
        if (name) {
            name.textContent = profile.display_name || 'Spotify User';
        }
        
        // Update email/username
        const email = document.getElementById('spotifyEmail');
        if (email) {
            const uri = profile.uri || '';
            const userId = uri.split(':').pop() || profile.id || '-';
            email.textContent = `@${userId}`;
        }
        
        // Update inline profile (index.html)
        const inlineProfile = document.getElementById('spotifyInlineProfile');
        if (inlineProfile) {
            inlineProfile.style.display = 'block';
            const inlineName = document.getElementById('spotifyInlineName');
            if (inlineName) inlineName.textContent = profile.display_name || 'Spotify User';
            const inlineAvatar = document.getElementById('spotifyInlineAvatar');
            if (inlineAvatar && profile.images && profile.images.length > 0) {
                inlineAvatar.style.backgroundImage = `url(${profile.images[0].url})`;
                inlineAvatar.style.backgroundSize = 'cover';
                inlineAvatar.style.backgroundPosition = 'center';
                inlineAvatar.textContent = '';
            }
        }
    },
    
    // Display user playlists
    async displayUserPlaylists() {
        // Determine which container to use
        let containerId = 'spotifyPlaylistsContainer';
        let detailsId = 'spotifyPlaylistDetails';
        
        // If connected, use real playlists container
        if (this.isConnected) {
            containerId = 'spotifyRealPlaylistsContainer';
            detailsId = 'spotifyRealPlaylistDetails';
        }
        
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Show loading
        container.innerHTML = `
            <div class="spotify-loading">
                <div class="spinner"></div>
                <p>Memuat playlist...</p>
            </div>
        `;
        
        let playlists;
        if (this.isConfigured() && this.isConnected) {
            playlists = await this.getUserPlaylists(20);
        } else {
            // Demo mode
            playlists = this.DEMO_PLAYLISTS;
        }
        
        if (!playlists || playlists.length === 0) {
            container.innerHTML = `
                <div class="spotify-empty">
                    <p>🎵 Tidak ada playlist ditemukan.</p>
                </div>
            `;
            return;
        }
        
        // Render playlists
        let html = '<div class="spotify-playlists-grid">';
        playlists.forEach(playlist => {
            const cover = playlist.images && playlist.images.length > 0 
                ? playlist.images[0].url 
                : '';
            const trackCount = playlist.tracks?.total || 0;
            const owner = playlist.owner?.display_name || '-';
            const description = playlist.description || '';
            const spotifyUrl = playlist.external_urls?.spotify || '#';
            
            html += `
                <div class="spotify-playlist-card" onclick="Spotify.showPlaylistDetails('${playlist.id}', '${detailsId}')">
                    ${cover 
                        ? `<div class="playlist-cover"><img src="${cover}" alt="${this.escapeHtml(playlist.name)}" loading="lazy"></div>`
                        : `<div class="playlist-cover playlist-cover-empty">🎵</div>`
                    }
                    <div class="playlist-info">
                        <h4 class="playlist-name">${this.escapeHtml(playlist.name)}</h4>
                        <p class="playlist-desc">${this.escapeHtml(description)}</p>
                        <p class="playlist-meta">
                            <span>${this.escapeHtml(owner)}</span>
                            <span>•</span>
                            <span>${trackCount} lagu</span>
                        </p>
                    </div>
                    <a href="${spotifyUrl}" target="_blank" rel="noopener" class="open-spotify-btn" onclick="event.stopPropagation()">
                        Open in Spotify ↗
                    </a>
                </div>
            `;
        });
        html += '</div>';
        
        // Add demo label if in demo mode
        if (!this.isConfigured() || !this.isConnected) {
            html = `
                <div class="demo-label">
                    <span>🎵 Mode Demo</span>
                    <p>Data contoh — hubungkan Spotify untuk melihat playlist Anda</p>
                </div>
            ` + html;
        }
        
        container.innerHTML = html;
    },
    
    // Show playlist details (tracks)
    async showPlaylistDetails(playlistId, detailsContainerId) {
        // Use provided container ID or default based on connection status
        if (!detailsContainerId) {
            detailsContainerId = this.isConnected ? 'spotifyRealPlaylistDetails' : 'spotifyPlaylistDetails';
        }
        const container = document.getElementById(detailsContainerId);
        if (!container) return;
        
        // Show loading
        container.style.display = 'block';
        container.innerHTML = `
            <div class="spotify-loading">
                <div class="spinner"></div>
                <p>Memuat detail playlist...</p>
            </div>
        `;
        
        let tracks;
        let playlistName = '';
        
        if (this.isConfigured() && this.isConnected) {
            // Fetch real playlist details
            const details = await this.getPlaylistTracks(playlistId);
            tracks = details.tracks || [];
            playlistName = details.name || '';
        } else {
            // Demo mode
            tracks = this.DEMO_TRACKS;
            playlistName = 'Demo Playlist';
        }
        
        if (!tracks || tracks.length === 0) {
            container.innerHTML = `
                <div class="spotify-empty">
                    <p>🎵 Tidak ada lagu di playlist ini.</p>
                </div>
            `;
            return;
        }
        
        // Render tracks
        let html = `
            <div class="playlist-details-header">
                <h3>${this.escapeHtml(playlistName)}</h3>
                <p>${tracks.length} lagu</p>
            </div>
            <div class="spotify-tracks-list">
        `;
        
        tracks.forEach((track, index) => {
            const trackItem = track.track || track; // Handle saved tracks format
            const name = trackItem.name || '-';
            const artists = (trackItem.artists || []).map(a => a.name).join(', ') || '-';
            const album = trackItem.album?.name || '-';
            const albumCover = trackItem.album?.images?.[0]?.url || '';
            const duration = this.formatDuration(trackItem.duration_ms || 0);
            const spotifyUrl = trackItem.external_urls?.spotify || '#';
            
            html += `
                <div class="spotify-track-item">
                    <span class="track-number">${index + 1}</span>
                    ${albumCover 
                        ? `<div class="track-artwork"><img src="${albumCover}" alt="${this.escapeHtml(album)}" loading="lazy"></div>`
                        : `<div class="track-artwork track-artwork-empty">♫</div>`
                    }
                    <div class="track-info">
                        <h4 class="track-name">${this.escapeHtml(name)}</h4>
                        <p class="track-artist">${this.escapeHtml(artists)}</p>
                    </div>
                    <div class="track-album">${this.escapeHtml(album)}</div>
                    <div class="track-duration">${duration}</div>
                    <a href="${spotifyUrl}" target="_blank" rel="noopener" class="track-open-spotify" title="Open in Spotify">
                        ↗
                    </a>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add demo label
        if (!this.isConfigured() || !this.isConnected) {
            html = `
                <div class="demo-label">
                    <span>🎵 Mode Demo</span>
                    <p>Data contoh — hubungkan Spotify untuk melihat detail playlist Anda</p>
                </div>
            ` + html;
        }
        
        container.innerHTML = html;
    },
    
    // Get playlist tracks
    async getPlaylistTracks(playlistId, limit = 50) {
        const data = await this.apiRequest(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`
        );
        return data;
    },
    
    // Format duration (milliseconds to MM:SS)
    formatDuration(ms) {
        if (!ms) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Disconnect Spotify (with UI update)
    disconnect() {
        this.accessToken = null;
        this.refreshToken = null;
        this.expiresAt = null;
        this.userProfile = null;
        this.isConnected = false;
        
        localStorage.removeItem('moodify_spotify_tokens');
        
        // Hide profile
        const profileContainer = document.getElementById('spotifyProfile');
        if (profileContainer) profileContainer.style.display = 'none';
        
        const inlineProfile = document.getElementById('spotifyInlineProfile');
        if (inlineProfile) inlineProfile.style.display = 'none';
        
        // Hide real playlists, show demo
        const realPlaylists = document.getElementById('spotifyRealPlaylists');
        if (realPlaylists) realPlaylists.style.display = 'none';
        
        const demoPanel = document.getElementById('spotifyDemoPanel');
        if (demoPanel) demoPanel.style.display = 'block';
        
        const setupInstructions = document.getElementById('spotifySetupInstructions');
        if (setupInstructions) setupInstructions.style.display = 'block';
        
        // Clear playlist details
        const playlistDetails = document.getElementById('spotifyPlaylistDetails');
        if (playlistDetails) {
            playlistDetails.style.display = 'none';
            playlistDetails.innerHTML = '';
        }
        const realPlaylistDetails = document.getElementById('spotifyRealPlaylistDetails');
        if (realPlaylistDetails) {
            realPlaylistDetails.style.display = 'none';
            realPlaylistDetails.innerHTML = '';
        }
        
        // Update UI
        this.updateSpotifyUI();
        
        // Load demo playlists
        setTimeout(() => {
            this.displayUserPlaylists();
        }, 100);
        
        // Call external callback if exists
        if (typeof onSpotifyDisconnected === 'function') {
            onSpotifyDisconnected();
        }
        
        if (typeof notify === 'function') {
            notify('🔌 Spotify telah dipisahkan');
        }
    },
    
    // Initialize - check for OAuth callback and load saved tokens
    init() {
        // Check for auth code in URL
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const error = urlParams.get('error');
        
        if (error) {
            console.error('Spotify OAuth error:', error);
            if (typeof notify === 'function') {
                notify('❌ Otorisasi Spotify dibatalkan');
            }
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }
        
        if (authCode) {
            this.handleCallback(authCode).then(() => {
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            });
            return;
        }
        
        // Load saved tokens
        this.loadTokens();
        
        if (this.isConnected) {
            // Fetch user profile in background
            this.fetchUserProfile().then(() => {
                // Update UI after profile loaded
                this.updateSpotifyUI();
                // Display playlists if container exists
                if (document.getElementById('spotifyPlaylistsContainer')) {
                    this.displayUserPlaylists();
                }
            }).catch(console.error);
        }
        
        // Update UI
        this.updateSpotifyUI();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Spotify.init();
});
