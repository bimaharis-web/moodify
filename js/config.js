/**
 * MOODIFY - Configuration File
 * Developed by Bima Haris
 * 
 * File ini dibuat dari config.example.js
 * Isi API key di bawah ini untuk mengaktifkan fitur lengkap.
 * 
 * === CARA MENDAPATKAN YOUTUBE API KEY ===
 * 
 * 1. Buka https://console.cloud.google.com/
 *    - Login dengan akun Google pribadi Anda
 *    - Jika diminta, buat project baru (klik "New Project")
 *    - Beri nama: "MOODIFY"
 * 
 * 2. Aktifkan YouTube Data API v3
 *    - Klik "ENABLE APIS AND SERVICES"
 *    - Cari "YouTube Data API v3"
 *    - Klik "ENABLE"
 * 
 * 3. Buat API Key
 *    - Klik menu "Credentials" di sidebar kiri
 *    - Klik "+ CREATE CREDENTIALS" → "API key"
 *    - Copy API key yang muncul
 * 
 * 4. Batasi API Key (PENTING untuk keamanan)
 *    - Klik edit (✏️) pada API key
 *    - API restrictions → pilih "YouTube Data API v3"
 *    - Application restrictions → pilih "Websites"
 *    - HTTP referrers → tambahkan:
 *      - localhost/* (untuk testing lokal)
 *      - bimaharis.my.id/* (untuk domain Anda)
 *    - Klik "SAVE"
 * 
 * 5. Paste API key di bawah ini
 * 
 * === CATATAN PENTING ===
 * - Free tier: 10,000 units/hari (cukup untuk ~100 pencarian)
 * - Billing account DIWAJIBKAN oleh Google Cloud, tapi TIDAK DIPOTONG
 *   selama di free tier. Google hanya butuh kartu kredit untuk verifikasi.
 * - Jika tidak punya kartu kredit, Anda bisa:
 *   a) Menggunakan akun Google teman yang punya billing setup
 *   b) Tetap menggunakan mode demo (iTunes + database fallback)
 * 
 * === SPOTIFY (Opsional) ===
 * 1. Buka https://developer.spotify.com/dashboard
 * 2. Login dengan akun Spotify
 * 3. Create App → beri nama "MOODIFY"
 * 4. Copy Client ID
 * 5. Redirect URI: http://localhost:8000/settings.html
 */

const CONFIG = {
    // ==========================================
    // YouTube Data API v3 (GRATIS)
    // ==========================================
    // Paste API key Anda di sini setelah mendapatkannya
    YOUTUBE_API_KEY: 'AIzaSyBUUv-siEAltTly6DDgl9sx9S_QbLR_sdg',
    
    // Google Client ID (untuk Google Sign-In)
    // Bisa menggunakan project yang sama dengan YouTube API
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com',
    
    // YouTube settings
    YOUTUBE_MAX_RESULTS: 12,
    YOUTUBE_DEFAULT_VOLUME: 80,
    
    // ==========================================
    // Spotify Web API (Opsional)
    // ==========================================
    SPOTIFY_CLIENT_ID: 'YOUR_SPOTIFY_CLIENT_ID_HERE',
    SPOTIFY_REDIRECT_URI: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/settings.html',
    
    SPOTIFY_SCOPES: [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'playlist-read-collaborative'
    ],

    // ==========================================
    // Supabase (Tahap 4 - Belum diperlukan)
    // ==========================================
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',

    // ==========================================
    // App settings
    // ==========================================
    APP_NAME: 'MOODIFY',
    APP_TAGLINE: 'Your Music. Your Mood. Your Story.',
    DEVELOPER_CREDIT: 'Developed by Bima Haris',
    
    // Demo mode - otomatis false jika API key terisi (bukan placeholder)
    // NOTE: Tidak bisa pakai CONFIG.YOUTUBE_API_KEY di sini karena objek belum selesai didefinisikan
    // Placeholder values yang berarti mode demo
    DEMO_MODE: false,
    
    FEATURES: {
        YOUTUBE_SEARCH: true,
        YOUTUBE_PLAYER: true,
        SPOTIFY_CONNECT: true,
        SOCIAL_FEATURES: true,
        PLAYLIST_FEATURES: true
    }
};
