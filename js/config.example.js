/**
 * MOODIFY - Configuration File
 * Developed by Bima Haris
 * 
 * Copy this file to config.js and fill in your API keys.
 * NEVER commit config.js to version control.
 * 
 * === YouTube Data API v3 Setup ===
 * 1. Go to https://console.cloud.google.com/
 * 2. Create a new project or select existing project
 * 3. Enable "YouTube Data API v3"
 * 4. Go to Credentials → Create Credentials → API Key
 * 5. Restrict the API key:
 *    - API restrictions: YouTube Data API v3
 *    - Application restrictions: Website
 *    - HTTP referrers: yourdomain.com/* (e.g., bimaharis.my.id/*)
 * 6. Copy the API key and paste it below
 * 
 * === Spotify Web API Setup ===
 * 1. Go to https://developer.spotify.com/dashboard
 * 2. Create a new app
 * 3. Copy Client ID and paste it below
 * 4. Add Redirect URI: http://yourdomain.com/settings.html
 * 5. NEVER put Client Secret in frontend code!
 */

const CONFIG = {
    // ==========================================
    // YouTube Data API v3
    // ==========================================
    // Get your key: https://console.cloud.google.com/apis/credentials
    // Required for: YouTube search, video metadata, in-app playback
    // Quota: 10,000 units/day (free tier)
    // - Search: 100 units/request
    // - Video details: 1 unit/request
    YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
    
    // Google Client ID (for Google Sign-In)
    // Get it from: https://console.cloud.google.com/apis/credentials
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID_HERE',
    
    // YouTube settings
    YOUTUBE_MAX_RESULTS: 12,  // Max results per search
    YOUTUBE_DEFAULT_VOLUME: 80,  // Default volume (0-100)
    
    // ==========================================
    // Spotify Web API
    // ==========================================
    // Get your credentials: https://developer.spotify.com/dashboard
    SPOTIFY_CLIENT_ID: 'YOUR_SPOTIFY_CLIENT_ID_HERE',
    // IMPORTANT: Never put Client Secret in frontend code!
    // SPOTIFY_CLIENT_SECRET should only be used in backend/Edge Functions

    // Spotify OAuth redirect URI must match your Spotify app settings
    SPOTIFY_REDIRECT_URI: window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '') + '/settings.html',
    
    // Spotify OAuth scopes (minimum required)
    SPOTIFY_SCOPES: [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'playlist-read-collaborative'
    ],

    // ==========================================
    // Supabase (for backend integration - Phase 4)
    // ==========================================
    SUPABASE_URL: 'YOUR_SUPABASE_URL_HERE',
    SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY_HERE',

    // ==========================================
    // App settings
    // ==========================================
    APP_NAME: 'MOODIFY',
    APP_TAGLINE: 'Your Music. Your Mood. Your Story.',
    DEVELOPER_CREDIT: 'Developed by Bima Haris',
    
    // Demo mode - set to false when API keys are configured
    // When true, demo data is used as fallback
    DEMO_MODE: true,
    
    // Feature flags
    FEATURES: {
        YOUTUBE_SEARCH: true,        // Enable YouTube search
        YOUTUBE_PLAYER: true,        // Enable YouTube IFrame Player
        SPOTIFY_CONNECT: true,       // Enable Spotify OAuth
        SOCIAL_FEATURES: true,       // Enable social features (demo)
        PLAYLIST_FEATURES: true      // Enable playlist features (demo)
    }
};
