/* ============================================
   MOODIFY - Authentication Module
   User Login, Register, Profile Management
   Developed by Bima Haris
   ============================================ */

const Auth = {
    // Current user (demo mode)
    currentUser: null,
    isAuthenticated: false,
    
    // Demo users database
    demoUsers: [
        {
            id: 'u1',
            name: 'Bima Haris',
            handle: 'bimaharis',
            email: 'bima@moodify.com',
            password: 'demo123', // In production, this would be hashed
            avatar: 'BH',
            bio: 'Collecting songs, moments & memories. ✨',
            location: 'Jakarta',
            followers: 128,
            following: 96,
            joinedAt: '2024-01-01'
        }
    ],
    
    // Initialize
    init() {
        // Check for saved session
        this.loadSession();
        
        // Update UI if authenticated
        if (this.isAuthenticated && this.currentUser) {
            this.updateUI();
        }
    },
    
    // Login with email and password
    login(email, password) {
        // Find user
        const user = this.demoUsers.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        
        if (user) {
            this.currentUser = { ...user };
            this.isAuthenticated = true;
            
            // Remove password from stored user
            delete this.currentUser.password;
            
            // Save session
            this.saveSession();
            
            // Update AppState
            if (typeof AppState !== 'undefined') {
                AppState.user = {
                    name: this.currentUser.name,
                    handle: this.currentUser.handle,
                    avatar: this.currentUser.avatar,
                    bio: this.currentUser.bio,
                    location: this.currentUser.location,
                    followers: this.currentUser.followers,
                    following: this.currentUser.following,
                    posts: 3
                };
            }
            
            this.updateUI();
            
            if (typeof notify === 'function') {
                notify(`✅ Selamat datang, ${this.currentUser.name}!`);
            }
            
            return true;
        }
        
        // Demo mode: auto register and login
        if (typeof CONFIG !== 'undefined' && CONFIG.DEMO_MODE) {
            this.currentUser = {
                id: 'u_' + Date.now(),
                name: email.split('@')[0] || 'User',
                handle: email.split('@')[0] || 'user',
                email: email,
                avatar: (email.charAt(0) || 'U').toUpperCase(),
                bio: 'New to MOODIFY 🎵',
                location: '',
                followers: 0,
                following: 0,
                joinedAt: new Date().toISOString().split('T')[0]
            };
            this.isAuthenticated = true;
            this.saveSession();
            
            if (typeof AppState !== 'undefined') {
                AppState.user = {
                    name: this.currentUser.name,
                    handle: this.currentUser.handle,
                    avatar: this.currentUser.avatar,
                    bio: this.currentUser.bio,
                    location: this.currentUser.location,
                    followers: this.currentUser.followers,
                    following: this.currentUser.following,
                    posts: 0
                };
            }
            
            this.updateUI();
            
            if (typeof notify === 'function') {
                notify(`🎉 Akun dibuat & login berhasil!`);
            }
            
            return true;
        }
        
        if (typeof notify === 'function') {
            notify('❌ Email atau password salah');
        }
        
        return false;
    },
    
    // Register a new user
    register(name, handle, email, password) {
        // Check if email already exists
        const existing = this.demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existing) {
            if (typeof notify === 'function') {
                notify('❌ Email sudah terdaftar');
            }
            return false;
        }
        
        // Check if handle already exists
        const existingHandle = this.demoUsers.find(u => u.handle.toLowerCase() === handle.toLowerCase());
        if (existingHandle) {
            if (typeof notify === 'function') {
                notify('❌ Username sudah digunakan');
            }
            return false;
        }
        
        // Create new user
        const newUser = {
            id: 'u_' + Date.now(),
            name: name,
            handle: handle,
            email: email,
            password: password,
            avatar: name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2),
            bio: 'New to MOODIFY 🎵',
            location: '',
            followers: 0,
            following: 0,
            joinedAt: new Date().toISOString().split('T')[0]
        };
        
        this.demoUsers.push(newUser);
        
        // Auto login
        this.currentUser = { ...newUser };
        this.isAuthenticated = true;
        delete this.currentUser.password;
        
        this.saveSession();
        
        if (typeof AppState !== 'undefined') {
            AppState.user = {
                name: this.currentUser.name,
                handle: this.currentUser.handle,
                avatar: this.currentUser.avatar,
                bio: this.currentUser.bio,
                location: this.currentUser.location,
                followers: this.currentUser.followers,
                following: this.currentUser.following,
                posts: 0
            };
        }
        
        this.updateUI();
        
        if (typeof notify === 'function') {
            notify(`🎉 Selamat datang di MOODIFY, ${name}!`);
        }
        
        return true;
    },
    
    // Logout
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Clear session
        localStorage.removeItem('moodify_session');
        
        // Reset AppState user
        if (typeof AppState !== 'undefined') {
            AppState.user = {
                name: 'Bima Haris',
                handle: 'bimaharis',
                avatar: 'BH',
                bio: 'Collecting songs, moments & memories. ✨',
                location: 'Jakarta',
                followers: 128,
                following: 96,
                posts: 3
            };
        }
        
        this.updateUI();
        
        if (typeof notify === 'function') {
            notify('👋 Berhasil logout');
        }
    },
    
    // Update user profile
    updateProfile(updates) {
        if (!this.isAuthenticated) return false;
        
        Object.assign(this.currentUser, updates);
        this.saveSession();
        
        if (typeof AppState !== 'undefined') {
            Object.assign(AppState.user, updates);
        }
        
        this.updateUI();
        
        if (typeof notify === 'function') {
            notify('✅ Profil diperbarui');
        }
        
        return true;
    },
    
    // Save session to localStorage
    saveSession() {
        try {
            localStorage.setItem('moodify_session', JSON.stringify({
                user: this.currentUser,
                isAuthenticated: this.isAuthenticated
            }));
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    },
    
    // Load session from localStorage
    loadSession() {
        try {
            const stored = localStorage.getItem('moodify_session');
            if (!stored) return false;
            
            const session = JSON.parse(stored);
            if (session.isAuthenticated && session.user) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                
                if (typeof AppState !== 'undefined') {
                    AppState.user = {
                        name: this.currentUser.name,
                        handle: this.currentUser.handle,
                        avatar: this.currentUser.avatar,
                        bio: this.currentUser.bio,
                        location: this.currentUser.location,
                        followers: this.currentUser.followers,
                        following: this.currentUser.following,
                        posts: 3
                    };
                }
                
                return true;
            }
        } catch (error) {
            console.error('Failed to load session:', error);
        }
        return false;
    },
    
    // Update UI elements
    updateUI() {
        // Update sidebar profile
        const sidebarProfile = document.querySelector('.sidebar-bottom');
        if (sidebarProfile && this.currentUser) {
            sidebarProfile.innerHTML = `
                <div class="avatar">${this.currentUser.avatar}</div>
                <div>
                    <b style="font-size:13px">${this.currentUser.name}</b>
                    <small style="display:block;font-size:11px;color:var(--muted)">@${this.currentUser.handle}</small>
                </div>
                <span style="margin-left:auto;cursor:pointer;color:var(--muted)" onclick="Auth.logout()" title="Logout">⏻</span>
            `;
        }
        
        // Update greeting
        if (typeof getGreeting === 'function' && this.currentUser) {
            const pageTitle = $('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = `${getGreeting()}, ${this.currentUser.name} ✦`;
            }
        }
    },
    
    // Check if user is authenticated
    isLoggedIn() {
        return this.isAuthenticated;
    },
    
    // Get current user
    getUser() {
        return this.currentUser;
    },
    
    // Get user by handle (for public profiles)
    getUserByHandle(handle) {
        return this.demoUsers.find(u => u.handle.toLowerCase() === handle.toLowerCase());
    },
    
    // ==========================================
    // Google Sign-In (Google Identity Services)
    // ==========================================
    
    // Initialize Google Sign-In
    initGoogleSignIn() {
        // Load Google Identity Services library
        if (!window.google) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('🔑 Google Identity Services loaded');
            };
            document.head.appendChild(script);
        }
    },
    
    // Login with Google
    async loginWithGoogle() {
        // Check if Google client ID is configured
        const clientId = (typeof CONFIG !== 'undefined') ? CONFIG.GOOGLE_CLIENT_ID : null;
        
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            // Demo mode: simulate Google login
            if (typeof notify === 'function') {
                notify('⚠️ Google Sign-In belum dikonfigurasi. Menggunakan mode demo.');
            }
            
            // Create demo user
            this.currentUser = {
                id: 'u_google_' + Date.now(),
                name: 'Bima Haris',
                handle: 'bimaharis',
                email: 'bima@gmail.com',
                avatar: 'BH',
                bio: 'Logged in with Google 🎵',
                location: 'Jakarta',
                followers: 0,
                following: 0,
                joinedAt: new Date().toISOString().split('T')[0],
                loginMethod: 'google'
            };
            this.isAuthenticated = true;
            this.saveSession();
            
            if (typeof AppState !== 'undefined') {
                AppState.user = {
                    name: this.currentUser.name,
                    handle: this.currentUser.handle,
                    avatar: this.currentUser.avatar,
                    bio: this.currentUser.bio,
                    location: this.currentUser.location,
                    followers: this.currentUser.followers,
                    following: this.currentUser.following,
                    posts: 0
                };
            }
            
            this.updateUI();
            
            if (typeof notify === 'function') {
                notify('✅ Login berhasil (mode demo)!');
            }
            
            if (typeof closeModal === 'function') {
                closeModal();
            }
            
            return true;
        }
        
        // Real Google Sign-In
        try {
            // Initialize Google client
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: (response) => {
                        this.handleGoogleResponse(response);
                    },
                    auto_select: false
                });
                
                // Prompt user to sign in
                window.google.accounts.id.prompt((notification) => {
                    console.log('Google Sign-In notification:', notification);
                });
            } else {
                // Fallback: use One Tap
                this.initGoogleSignIn();
                setTimeout(() => {
                    if (window.google && window.google.accounts) {
                        window.google.accounts.id.initialize({
                            client_id: clientId,
                            callback: (response) => {
                                this.handleGoogleResponse(response);
                            }
                        });
                        window.google.accounts.id.prompt();
                    }
                }, 1000);
            }
            
            return true;
        } catch (error) {
            console.error('Google Sign-In error:', error);
            if (typeof notify === 'function') {
                notify('❌ Gagal login dengan Google');
            }
            return false;
        }
    },
    
    // Handle Google Sign-In response
    handleGoogleResponse(response) {
        // Decode JWT token
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        
        // Create user from Google profile
        this.currentUser = {
            id: 'u_google_' + payload.sub,
            name: payload.name || 'Google User',
            handle: payload.email?.split('@')[0] || 'user',
            email: payload.email || '',
            avatar: (payload.name?.charAt(0) || 'U').toUpperCase(),
            bio: 'Logged in with Google 🎵',
            location: '',
            followers: 0,
            following: 0,
            joinedAt: new Date().toISOString().split('T')[0],
            loginMethod: 'google',
            googlePicture: payload.picture || ''
        };
        this.isAuthenticated = true;
        this.saveSession();
        
        if (typeof AppState !== 'undefined') {
            AppState.user = {
                name: this.currentUser.name,
                handle: this.currentUser.handle,
                avatar: this.currentUser.avatar,
                bio: this.currentUser.bio,
                location: this.currentUser.location,
                followers: this.currentUser.followers,
                following: this.currentUser.following,
                posts: 0
            };
        }
        
        this.updateUI();
        
        if (typeof notify === 'function') {
            notify(`✅ Selamat datang, ${this.currentUser.name}!`);
        }
        
        if (typeof closeModal === 'function') {
            closeModal();
        }
    },
    
    // Render Google Sign-In button
    renderGoogleButton() {
        const clientId = (typeof CONFIG !== 'undefined') ? CONFIG.GOOGLE_CLIENT_ID : null;
        
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
            // Demo button
            return `
                <button type="button" class="google-btn" onclick="Auth.loginWithGoogle()" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:12px">
                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.586-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.161 6.656 3.58 9 3.58z"/></svg>
                    <span>Login dengan Google (Demo)</span>
                </button>
            `;
        }
        
        // Real Google button container
        return `
            <div id="g_id_signin" data-theme="outline" data-size="large" data-width="100%" data-type="standard"></div>
        `;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
