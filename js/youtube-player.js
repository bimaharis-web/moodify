/* ============================================
   MOODIFY - YouTube Player Module
   YouTube IFrame Player API Integration
   Developed by Bima Haris
   ============================================ */

const YouTubePlayer = {
    player: null,
    playerReady: false,
    apiLoaded: false,
    currentVideoId: null,
    currentSong: null,
    isPlayerVisible: false,
    
    // Audio player for iTunes preview and Audius streaming
    audioPlayer: null,
    currentPlayType: null, // 'youtube', 'preview', 'stream', 'metadata'
    
    // Play Queue
    queue: [],
    queueIndex: -1,
    queueEnabled: true,
    
    // Progress tracking
    progressInterval: null,
    currentTime: 0,
    duration: 0,
    
    // Volume
    volume: 80,
    
    // Error handling
    maxRetries: 2,
    retryCount: 0,

    // ==========================================
    // Load YouTube IFrame API script
    // ==========================================
    loadAPI() {
        return new Promise((resolve) => {
            // Already loaded?
            if (this.apiLoaded) {
                resolve();
                return;
            }
            if (window.YT && window.YT.Player) {
                this.apiLoaded = true;
                resolve();
                return;
            }
            
            // Inject script tag
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const first = document.getElementsByTagName('script')[0];
            first.parentNode.insertBefore(tag, first);
            
            // Wait for YT to load
            const check = () => {
                if (window.YT && window.YT.Player) {
                    this.apiLoaded = true;
                    console.log('✅ YouTube IFrame API loaded');
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    },

    // ==========================================
    // Create/initialize the YT.Player instance
    // ==========================================
    createPlayer() {
        const container = document.getElementById('youtubePlayerElement');
        if (!container) {
            console.error('❌ youtubePlayerElement not found in DOM');
            return;
        }

        // Destroy old player if exists
        if (this.player) {
            try { this.player.destroy(); } catch(e) {}
        }

        console.log('🔧 Creating YouTube Player...');
        this.player = new YT.Player('youtubePlayerElement', {
            width: '100%',
            playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                rel: 0,
                fs: 0,
                playsinline: 1,
                origin: window.location.origin
            },
            events: {
                onReady: () => {
                    console.log('✅ YouTube Player READY');
                    this.playerReady = true;
                    this.player.setVolume(this.volume);
                },
                onStateChange: (e) => this.onPlayerStateChange(e),
                onError: (e) => this.onPlayerError(e)
            }
        });
    },

    // ==========================================
    // Full init: load API → create player → resolve when ready
    // ==========================================
    async init() {
        await this.loadAPI();
        this.createPlayer();
        // Wait until playerReady flag is set
        return new Promise((resolve) => {
            if (this.playerReady) {
                resolve();
            } else {
                const check = () => {
                    if (this.playerReady) resolve();
                    else setTimeout(check, 100);
                };
                check();
            }
        });
    },
    
    // Handle player state changes
    onPlayerStateChange(event) {
        const playToggle = $('playToggle');
        
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                if (playToggle) playToggle.textContent = '⏸';
                if (typeof AppState !== 'undefined') AppState.isPlaying = true;
                this.retryCount = 0;
                this.startProgressTracking();
                // Auto-show video player container
                this.toggleVisible(true);
                // Update toggle button
                const btn = $('toggleVideoBtn');
                if (btn) {
                    btn.textContent = '⬇️';
                    btn.title = 'Sembunyikan video';
                }
                break;
            case YT.PlayerState.PAUSED:
                if (playToggle) playToggle.textContent = '▶';
                if (typeof AppState !== 'undefined') AppState.isPlaying = false;
                this.stopProgressTracking();
                break;
            case YT.PlayerState.ENDED:
                if (playToggle) playToggle.textContent = '▶';
                if (typeof AppState !== 'undefined') AppState.isPlaying = false;
                this.stopProgressTracking();
                // Auto play next
                if (this.queueEnabled && this.queue.length > 0) {
                    this.playNext();
                } else if (typeof playNext === 'function') {
                    playNext();
                }
                break;
            case YT.PlayerState.CUED:
                // Video is cued, ready to play
                break;
        }
    },
    
    // Handle player errors
    onPlayerError(event) {
        console.error('YouTube player error:', event.data);
        this.stopProgressTracking();
        
        // Error codes: 2, 5, 100, 101, 150
        const errorMessages = {
            2: 'Kode video tidak valid.',
            5: 'Video tidak dapat diputar melalui player embedded.',
            100: 'Video tidak ditemukan atau telah dihapus.',
            101: 'Pemilik video membatasi pemutaran.',
            150: 'Video tidak tersedia di wilayah Anda.'
        };
        
        const errorMessage = errorMessages[event.data] || 'Video tidak dapat diputar.';
        
        // Retry logic - ALWAYS try to find alternative, even without API key
        if (this.retryCount < this.maxRetries && this.currentSong) {
            this.retryCount++;
            console.log(`🔄 Retrying... (${this.retryCount}/${this.maxRetries})`);
            
            // Try YTSearch first (no API key needed)
            if (typeof YTSearch !== 'undefined') {
                YTSearch.getAlternatives(this.currentSong.title, this.currentSong.artist, this.currentVideoId)
                    .then(results => {
                        if (results.length > 0) {
                            const altVideo = results[0];
                            if (altVideo && altVideo.videoId) {
                                console.log('🎵 Trying alternative video:', altVideo.videoId);
                                this.currentSong.videoId = altVideo.videoId;
                                this.currentSong.youtubeUrl = altVideo.youtubeUrl;
                                this.playVideo(altVideo.videoId);
                            } else {
                                this.handleFinalError(errorMessage);
                            }
                        } else {
                            // No alternatives from YTSearch, try API key search
                            this.tryApiSearch(errorMessage);
                        }
                    })
                    .catch(err => {
                        console.error('YTSearch failed:', err);
                        this.tryApiSearch(errorMessage);
                    });
            } else {
                // Fallback to API key search if available
                this.tryApiSearch(errorMessage);
            }
        } else {
            this.handleFinalError(errorMessage);
        }
    },

    // Try API key search as fallback
    tryApiSearch(errorMessage) {
        if (typeof MusicSearch !== 'undefined' && typeof CONFIG !== 'undefined' && 
            CONFIG.YOUTUBE_API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE') {
            
            MusicSearch.searchYouTube(`${this.currentSong.title} ${this.currentSong.artist}`, 3)
                .then(results => {
                    if (results.length > 0) {
                        const altVideo = results.find(r => r.videoId !== this.currentVideoId) || results[0];
                        if (altVideo && altVideo.videoId) {
                            console.log('Trying alternative video via API:', altVideo.videoId);
                            this.playVideo(altVideo.videoId);
                        } else {
                            this.handleFinalError(errorMessage);
                        }
                    } else {
                        this.handleFinalError(errorMessage);
                    }
                })
                .catch(err => {
                    console.error('Failed to search for alternative:', err);
                    this.handleFinalError(errorMessage);
                });
        } else {
            this.handleFinalError(errorMessage);
        }
    },
    
    // Handle final error after retries
    handleFinalError(message) {
        const playToggle = $('playToggle');
        if (playToggle) playToggle.textContent = '▶';
        if (typeof AppState !== 'undefined') AppState.isPlaying = false;
        
        notify(`⚠️ ${message} Coba lagu lain.`);
        
        // Try to play next song in queue
        if (this.queueEnabled && this.queue.length > 0) {
            setTimeout(() => this.playNext(), 2000);
        }
    },
    
    // Start progress tracking
    startProgressTracking() {
        this.stopProgressTracking();
        this.progressInterval = setInterval(() => {
            if (this.player && this.player.getCurrentTime && this.player.getDuration) {
                this.currentTime = this.player.getCurrentTime();
                this.duration = this.player.getDuration();
                this.updateProgressUI();
            }
        }, 1000);
    },
    
    // Stop progress tracking
    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    },
    
    // Update progress UI
    updateProgressUI() {
        const progress = document.querySelector('.progress i');
        const timeSpans = document.querySelectorAll('.progress-wrap span');
        
        if (progress && this.duration > 0) {
            const percent = (this.currentTime / this.duration) * 100;
            progress.style.width = `${percent}%`;
        }
        
        if (timeSpans && timeSpans.length >= 2) {
            timeSpans[0].textContent = this.formatTime(this.currentTime);
            timeSpans[1].textContent = this.formatTime(this.duration);
        }
    },
    
    // Format time (seconds to MM:SS)
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Seek to a specific time
    seekTo(seconds) {
        if (this.player && this.player.seekTo) {
            this.player.seekTo(seconds, true);
        }
    },
    
    // Play a video by ID
    playVideo(videoId) {
        if (!this.player || !this.player.loadVideoById) {
            console.warn('YouTube player not ready');
            return false;
        }
        
        this.currentVideoId = videoId;
        this.currentTime = 0;
        this.duration = 0;
        this.retryCount = 0;
        
        try {
            this.player.loadVideoById(videoId);
            return true;
        } catch (error) {
            console.error('Failed to load video:', error);
            return false;
        }
    },
    
    // Pause the current video
    pause() {
        if (this.player && this.player.pauseVideo) {
            this.player.pauseVideo();
        }
    },
    
    // Resume playing
    play() {
        if (this.player && this.player.playVideo) {
            this.player.playVideo();
        }
    },
    
    // Toggle play/pause (supports both YouTube and HTML5 audio)
    togglePlay() {
        // If playing HTML5 audio (iTunes preview or Audius stream)
        if (this.audioPlayer && this.currentPlayType !== 'youtube') {
            if (this.audioPlayer.paused) {
                this.audioPlayer.play();
                if (typeof AppState !== 'undefined') AppState.isPlaying = true;
                const playToggle = $('playToggle');
                if (playToggle) playToggle.textContent = '⏸';
                this.startProgressTracking();
            } else {
                this.audioPlayer.pause();
                if (typeof AppState !== 'undefined') AppState.isPlaying = false;
                const playToggle = $('playToggle');
                if (playToggle) playToggle.textContent = '▶';
                this.stopProgressTracking();
            }
            return;
        }
        
        // YouTube player
        if (this.player && this.player.getPlayerState) {
            const state = this.player.getPlayerState();
            if (state === YT.PlayerState.PLAYING) {
                this.pause();
            } else {
                this.play();
            }
        }
    },
    
    // Set volume (supports both YouTube and HTML5 audio)
    setVolume(level) {
        this.volume = Math.min(100, Math.max(0, level));
        
        // YouTube player
        if (this.player && this.player.setVolume) {
            this.player.setVolume(this.volume);
        }
        
        // HTML5 audio player
        if (this.audioPlayer) {
            this.audioPlayer.volume = this.volume / 100;
        }
    },
    
    // Mute/unmute (supports both YouTube and HTML5 audio)
    mute(isMuted) {
        // YouTube player
        if (this.player) {
            if (isMuted) {
                this.player.mute();
            } else {
                this.player.unMute();
            }
        }
        
        // HTML5 audio player
        if (this.audioPlayer) {
            this.audioPlayer.muted = isMuted;
        }
    },
    
    // Stop the current video
    stop() {
        if (this.player && this.player.stopVideo) {
            this.player.stopVideo();
        }
        this.currentVideoId = null;
        this.stopProgressTracking();
    },
    
    // Extract video ID from YouTube URL
    extractVideoId(url) {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    },
    
    // Stop any currently playing audio (YouTube or HTML5)
    stopCurrentPlayback() {
        // Stop YouTube player
        if (this.player) {
            try {
                this.player.stopVideo();
            } catch (e) {
                // Ignore errors
            }
        }
        
        // Stop HTML5 audio player
        if (this.audioPlayer) {
            try {
                this.audioPlayer.pause();
                this.audioPlayer.src = '';
            } catch (e) {
                // Ignore errors
            }
        }
        
        this.stopProgressTracking();
        this.currentPlayType = null;
    },
    
    // Play iTunes preview audio (30-second preview)
    playPreviewAudio(song) {
        // Stop any current playback
        this.stopCurrentPlayback();
        
        if (!song.previewUrl) {
            notify('⚠️ Preview tidak tersedia untuk lagu ini.');
            return false;
        }
        
        this.currentSong = song;
        this.currentPlayType = 'preview';
        
        // Create or reuse audio element
        if (!this.audioPlayer) {
            this.audioPlayer = new Audio();
            this.audioPlayer.addEventListener('ended', () => {
                // Preview ended
                if (typeof AppState !== 'undefined') AppState.isPlaying = false;
                const playToggle = $('playToggle');
                if (playToggle) playToggle.textContent = '▶';
                this.stopProgressTracking();
                
                // Auto play next
                if (this.queueEnabled && this.queue.length > 0) {
                    this.playNext();
                }
            });
            this.audioPlayer.addEventListener('error', (e) => {
                console.error('Audio playback error:', e);
                notify('⚠️ Gagal memutar preview audio.');
            });
            this.audioPlayer.addEventListener('timeupdate', () => {
                this.updateProgress();
            });
            this.audioPlayer.addEventListener('loadedmetadata', () => {
                this.duration = this.audioPlayer.duration;
                const durationEl = $('duration');
                if (durationEl) {
                    durationEl.textContent = this.formatDuration(this.duration);
                }
            });
        }
        
        // Set audio source and play
        this.audioPlayer.src = song.previewUrl;
        this.audioPlayer.volume = this.volume / 100;
        this.audioPlayer.play().then(() => {
            this.currentPlayType = 'preview';
            if (typeof AppState !== 'undefined') AppState.isPlaying = true;
            const playToggle = $('playToggle');
            if (playToggle) playToggle.textContent = '⏸';
            this.startProgressTracking();
            notify('🍎 Memutar preview iTunes (30 detik)');
            
            // Hide YouTube video container for audio-only playback
            this.toggleVisible(false);
        }).catch(err => {
            console.error('Failed to play preview:', err);
            notify('⚠️ Gagal memutar preview audio.');
        });
        
        return true;
    },
    
    // Play Audius streaming audio
    playAudiusStream(song) {
        // Stop any current playback
        this.stopCurrentPlayback();
        
        const streamUrl = song.url || song.downloadUrl || null;
        
        if (!streamUrl) {
            // Try to open in Audius web player
            if (song.audiusUrl) {
                notify('🎧 Membuka di Audius...');
                window.open(song.audiusUrl, '_blank', 'noopener');
            } else {
                notify('⚠️ Streaming tidak tersedia untuk lagu ini.');
            }
            return false;
        }
        
        this.currentSong = song;
        this.currentPlayType = 'stream';
        
        // Create or reuse audio element
        if (!this.audioPlayer) {
            this.audioPlayer = new Audio();
            this.audioPlayer.addEventListener('ended', () => {
                if (typeof AppState !== 'undefined') AppState.isPlaying = false;
                const playToggle = $('playToggle');
                if (playToggle) playToggle.textContent = '▶';
                this.stopProgressTracking();
                
                if (this.queueEnabled && this.queue.length > 0) {
                    this.playNext();
                }
            });
            this.audioPlayer.addEventListener('error', (e) => {
                console.error('Audius stream error:', e);
                notify('⚠️ Gagal memutar streaming Audius.');
            });
            this.audioPlayer.addEventListener('timeupdate', () => {
                this.updateProgress();
            });
            this.audioPlayer.addEventListener('loadedmetadata', () => {
                this.duration = this.audioPlayer.duration;
                const durationEl = $('duration');
                if (durationEl) {
                    durationEl.textContent = this.formatDuration(this.duration);
                }
            });
        }
        
        // Set audio source and play
        this.audioPlayer.src = streamUrl;
        this.audioPlayer.volume = this.volume / 100;
        this.audioPlayer.play().then(() => {
            this.currentPlayType = 'stream';
            if (typeof AppState !== 'undefined') AppState.isPlaying = true;
            const playToggle = $('playToggle');
            if (playToggle) playToggle.textContent = '⏸';
            this.startProgressTracking();
            notify('🎧 Memutar streaming dari Audius');
            
            // Hide YouTube video container for audio-only playback
            this.toggleVisible(false);
        }).catch(err => {
            console.error('Failed to play Audius stream:', err);
            // Fallback: open in Audius
            if (song.audiusUrl) {
                notify('🎧 Membuka di Audius web player...');
                window.open(song.audiusUrl, '_blank', 'noopener');
            }
        });
        
        return true;
    },
    
    // ==========================================
    // Wait for player to be ready (with timeout)
    // ==========================================
    waitForPlayerReady(timeout = 10000) {
        return new Promise((resolve) => {
            if (this.playerReady && this.player) {
                resolve(true);
                return;
            }

            const start = Date.now();
            const check = () => {
                if (this.playerReady && this.player) {
                    resolve(true);
                } else if (Date.now() - start > timeout) {
                    console.warn('⏱️ YouTube player ready timeout');
                    resolve(false);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    },

    // ==========================================
    // Play a song — supports YouTube video, iTunes preview, Audius stream
    // ==========================================
    async playSong(song) {
        console.log('🎵 YouTubePlayer.playSong called:', song.title, song.artist);
        this.currentSong = song;

        // Determine play type
        const playType = song.playType || this.detectPlayType(song);
        console.log('📋 Play type:', playType);

        // --------------------------------------------------
        // 1. YOUTUBE VIDEO (videoId or youtubeUrl)
        // --------------------------------------------------
        if (playType === 'video' || song.videoId || song.youtubeUrl) {
            let videoId = song.videoId || this.extractVideoId(song.youtubeUrl);

            if (videoId) {
                console.log('▶️ Playing YouTube video:', videoId);

                // Ensure player is initialized and ready
                if (!this.playerReady || !this.player) {
                    console.log('🔧 Initializing YouTube player...');
                    try {
                        await this.init();
                    } catch(e) {
                        console.error('❌ Failed to init YouTube player:', e);
                    }
                }

                // Wait for player to be ready
                const ready = await this.waitForPlayerReady(10000);
                console.log('📡 Player ready:', ready);

                if (ready && this.player) {
                    this.retryCount = 0;
                    this.currentVideoId = videoId;
                    this.currentPlayType = 'youtube';

                    try {
                        this.player.loadVideoById(videoId);
                        console.log('✅ loadVideoById called for:', videoId);
                    } catch(e) {
                        console.error('❌ loadVideoById failed:', e);
                    }

                    // Show video container
                    this.toggleVisible(true);
                    return true;
                } else {
                    console.warn('⚠️ Player not ready after wait, opening YouTube');
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener');
                    return false;
                }
            }
        }

        // --------------------------------------------------
        // 2. ITUNES PREVIEW (30 seconds)
        // --------------------------------------------------
        if (song.previewUrl) {
            console.log('🍎 Playing iTunes preview');
            return this.playPreviewAudio(song);
        }

        // --------------------------------------------------
        // 3. AUDIUS STREAM
        // --------------------------------------------------
        if (song.url || song.downloadUrl) {
            console.log('🎧 Playing Audius stream');
            return this.playAudiusStream(song);
        }

        // --------------------------------------------------
        // 4. FALLBACK: Try iTunes search for preview
        // --------------------------------------------------
        console.log('🔍 Searching iTunes for preview...');
        if (typeof MusicSources !== 'undefined' && MusicSources.searchiTunes) {
            try {
                const results = await MusicSources.searchiTunes(`${song.title} ${song.artist}`, 3);
                if (results.length > 0 && results[0].previewUrl) {
                    song.previewUrl = results[0].previewUrl;
                    return this.playPreviewAudio(song);
                }
            } catch(e) {
                console.warn('iTunes search failed:', e);
            }
        }

        // --------------------------------------------------
        // 5. LAST RESORT: Open YouTube search
        // --------------------------------------------------
        console.warn('⚠️ No playable source found, opening YouTube search');
        notify(`🎵 Mencari "${song.title}" di YouTube...`);
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`, '_blank', 'noopener');
        return false;
    },
    
    // Detect play type from song properties
    detectPlayType(song) {
        if (song.videoId || song.youtubeUrl) return 'video';
        if (song.previewUrl) return 'preview';
        if (song.url || song.downloadUrl) return 'stream';
        if (song.source === 'MusicBrainz') return 'metadata';
        return null;
    },
    
    // Add song to queue
    addToQueue(song) {
        this.queue.push(song);
        notify(`📋 "${song.title}" ditambahkan ke antrean`);
    },
    
    // Add multiple songs to queue
    addToQueueBatch(songs) {
        this.queue.push(...songs);
        notify(`📋 ${songs.length} lagu ditambahkan ke antrean`);
    },
    
    // Remove song from queue
    removeFromQueue(index) {
        if (index >= 0 && index < this.queue.length) {
            const removed = this.queue.splice(index, 1)[0];
            if (index < this.queueIndex) {
                this.queueIndex--;
            }
            notify(`🗑 "${removed.title}" dihapus dari antrean`);
        }
    },
    
    // Clear queue
    clearQueue() {
        this.queue = [];
        this.queueIndex = -1;
        notify('🗑 Antrean dikosongkan');
    },
    
    // Play next song
    playNext() {
        if (this.queue.length === 0) {
            // No queue, try to play random demo song
            if (typeof DEMO_SONGS !== 'undefined' && DEMO_SONGS.length > 0) {
                const randomSong = DEMO_SONGS[Math.floor(Math.random() * DEMO_SONGS.length)];
                this.playSong(randomSong);
            }
            return;
        }
        
        this.queueIndex = (this.queueIndex + 1) % this.queue.length;
        const nextSong = this.queue[this.queueIndex];
        this.playSong(nextSong);
    },
    
    // Play previous song
    playPrevious() {
        if (this.queue.length === 0) {
            // No queue, try to play random demo song
            if (typeof DEMO_SONGS !== 'undefined' && DEMO_SONGS.length > 0) {
                const randomSong = DEMO_SONGS[Math.floor(Math.random() * DEMO_SONGS.length)];
                this.playSong(randomSong);
            }
            return;
        }
        
        // If current song has played more than 3 seconds, restart it
        if (this.currentTime > 3) {
            this.seekTo(0);
            return;
        }
        
        this.queueIndex = (this.queueIndex - 1 + this.queue.length) % this.queue.length;
        const prevSong = this.queue[this.queueIndex];
        this.playSong(prevSong);
    },
    
    // Get queue
    getQueue() {
        return this.queue;
    },
    
    // Get current queue index
    getQueueIndex() {
        return this.queueIndex;
    },
    
    // Show/hide the visible player container
    toggleVisible(show) {
        const container = $('youtubePlayerContainer');
        if (!container) return;
        
        if (show) {
            container.classList.add('show');
            this.isPlayerVisible = true;
        } else {
            container.classList.remove('show');
            this.isPlayerVisible = false;
        }
    },
    
    // Get current video info
    getCurrentVideo() {
        if (!this.currentVideoId) return null;
        
        return {
            videoId: this.currentVideoId,
            isPlaying: this.player?.getPlayerState() === YT.PlayerState.PLAYING,
            currentTime: this.currentTime,
            duration: this.duration,
            volume: this.volume
        };
    },
    
    // Get player state
    getState() {
        if (!this.player) return 'uninitialized';
        return this.player.getPlayerState();
    },
    
    // Check if player is ready
    isReady() {
        return this.playerReady && this.player !== null;
    }
};

// Do NOT auto-initialize on DOMContentLoaded.
// Player will be initialized lazily when playSong() is first called.
// This avoids race conditions with DOM elements.
