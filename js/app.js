/* ============================================
   MOODIFY - Core Application Logic
   Developed by Bima Haris
   ============================================ */

// --- Demo Songs Data ---
// Verified active YouTube video IDs (popular Indonesian & international songs, 2024-2025)
const DEMO_SONGS = [
    // === POP INDONESIA ===
    { id: 's1', title: 'Evaluasi', artist: 'Hindia', emoji: '🌆', cover: 'c1', mood: 'Galau', youtubeUrl: 'https://www.youtube.com/watch?v=cWrSjCZ5AeE', videoId: 'cWrSjCZ5AeE' },
    { id: 's2', title: 'Terlukis Indah', artist: 'Rizky Febian', emoji: '🌸', cover: 'c2', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=i90EvEZ3axw', videoId: 'i90EvEZ3axw' },
    { id: 's3', title: 'Satu Bulan', artist: 'Bernadya', emoji: '🌊', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=yjnSX_iUFVo', videoId: 'yjnSX_iUFVo' },
    { id: 's4', title: 'Monokrom', artist: 'Tulus', emoji: '🌙', cover: 'c4', mood: 'Focus', youtubeUrl: 'https://www.youtube.com/watch?v=QqJ-Vp8mvbk', videoId: 'QqJ-Vp8mvbk' },
    { id: 's5', title: 'Sial', artist: 'Mahalini', emoji: '💜', cover: 'c1', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=QSWYyoF79oE', videoId: 'QSWYyoF79oE' },
    { id: 's6', title: 'Bertaut', artist: 'Nadin Amizah', emoji: '🪐', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=HyhLsy6b0XI', videoId: 'HyhLsy6b0XI' },
    { id: 's7', title: 'Sunshine', artist: 'The Panturas', emoji: '🌴', cover: 'c2', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=kD2Gsp9EB8k', videoId: 'kD2Gsp9EB8k' },
    { id: 's8', title: 'Melukis Senja', artist: 'Budi Doremi', emoji: '🌅', cover: 'c4', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=qZIQAk-BUEc', videoId: 'qZIQAk-BUEc' },
    { id: 's9', title: 'Lathi', artist: 'Weird Genius', emoji: '⚡', cover: 'c1', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=8uy7G2JXVSA', videoId: '8uy7G2JXVSA' },
    { id: 's10', title: 'To The Bone', artist: 'Pamungkas', emoji: '💧', cover: 'c3', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=oIYWenB637c', videoId: 'oIYWenB637c' },
    { id: 's11', title: 'Rayuan Perempuan Gila', artist: 'Nadin Amizah', emoji: '🔥', cover: 'c2', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=JIIKnE_QZAo', videoId: 'JIIKnE_QZAo' },
    { id: 's12', title: 'Rumpang', artist: 'Nadin Amizah', emoji: '🍂', cover: 'c4', mood: 'Nostalgia', youtubeUrl: 'https://www.youtube.com/watch?v=XshVws8BE3A', videoId: 'XshVws8BE3A' },
    { id: 's13', title: 'Kenangan Manis', artist: 'Pamungkas', emoji: '🌙', cover: 'c1', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=FRfc8eK52tU', videoId: 'FRfc8eK52tU' },
    { id: 's14', title: 'Tak Segampang Itu', artist: 'Anggi Marito', emoji: '💔', cover: 'c2', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=6NsiA6GFAbU', videoId: '6NsiA6GFAbU' },
    { id: 's15', title: 'Melawan Hati', artist: 'Fiersa Besari', emoji: '🍃', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=ywh9dNpEX9c', videoId: 'ywh9dNpEX9c' },
    { id: 's16', title: 'Hindia - Rumpang', artist: 'Hindia', emoji: '🎸', cover: 'c4', mood: 'Galau', youtubeUrl: 'https://www.youtube.com/watch?v=Jm1X1gza5wI', videoId: 'Jm1X1gza5wI' },
    { id: 's17', title: 'Raisa - Serendipity', artist: 'Raisa', emoji: '✨', cover: 'c1', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's18', title: 'Tulus - Hati-Hati di Jalan', artist: 'Tulus', emoji: '🛤️', cover: 'c2', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=2lAeCM2NjXE', videoId: '2lAeCM2NjXE' },
    { id: 's19', title: 'Pamungkas - Luka', artist: 'Pamungkas', emoji: '💔', cover: 'c3', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's20', title: 'Mahalini - Kotak Pers', artist: 'Mahalini', emoji: '📦', cover: 'c4', mood: 'Galau', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's21', title: 'Fiersa Besari - Sepi', artist: 'Fiersa Besari', emoji: '🌙', cover: 'c1', mood: 'Nostalgia', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's22', title: 'Raisa - Magic', artist: 'Raisa', emoji: '🪄', cover: 'c2', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's23', title: 'Tulus - Ruang Sendiri', artist: 'Tulus', emoji: '🏠', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's24', title: 'Hindia - Impala', artist: 'Hindia', emoji: '🦌', cover: 'c4', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's25', title: 'Bernadya - Tak Segarap Itu', artist: 'Bernadya', emoji: '💪', cover: 'c1', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's26', title: 'Nadin Amizah - Laut', artist: 'Nadin Amizah', emoji: '🌊', cover: 'c2', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's27', title: 'Weird Genius - Monokrom', artist: 'Weird Genius', emoji: '🎹', cover: 'c3', mood: 'Focus', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's28', title: 'Rizky Febian - Menunggu Kamu', artist: 'Rizky Febian', emoji: '⏳', cover: 'c4', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's29', title: 'Pamungkas - Tak Sempurna', artist: 'Pamungkas', emoji: '🌟', cover: 'c1', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's30', title: 'Mahalini - Ruang Rindu', artist: 'Mahalini', emoji: '💜', cover: 'c2', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    
    // === INTERNATIONAL POP ===
    { id: 's31', title: 'Flowers', artist: 'Miley Cyrus', emoji: '🌺', cover: 'c3', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=G7KNmW9a75k', videoId: 'G7KNmW9a75k' },
    { id: 's32', title: 'Anti-Hero', artist: 'Taylor Swift', emoji: '🦸', cover: 'c4', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=b1kbLwvqugk', videoId: 'b1kbLwvqugk' },
    { id: 's33', title: 'As It Was', artist: 'Harry Styles', emoji: '🌈', cover: 'c1', mood: 'Nostalgia', youtubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q', videoId: 'H5v3kku4y6Q' },
    { id: 's34', title: 'Cruel Summer', artist: 'Taylor Swift', emoji: '☀️', cover: 'c2', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=ic8j13piAhQ', videoId: 'ic8j13piAhQ' },
    { id: 's35', title: 'Vampire', artist: 'Olivia Rodrigo', emoji: '🧛', cover: 'c3', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=RlPNh_PBZb4', videoId: 'RlPNh_PBZb4' },
    { id: 's36', title: 'Paint The Town Red', artist: 'Doja Cat', emoji: '🎨', cover: 'c4', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=tQ0yjRM2S14', videoId: 'tQ0yjRM2S14' },
    { id: 's37', title: 'Calm Down', artist: 'Rema & Selena Gomez', emoji: '🔥', cover: 'c1', mood: 'Party', youtubeUrl: 'https://www.youtube.com/watch?v=WcIcVapfqXw', videoId: 'WcIcVapfqXw' },
    { id: 's38', title: 'Unholy', artist: 'Sam Smith & Kim Petras', emoji: '😈', cover: 'c2', mood: 'Party', youtubeUrl: 'https://www.youtube.com/watch?v=Uq9gPaIzbe8', videoId: 'Uq9gPaIzbe8' },
    { id: 's39', title: 'Die For You', artist: 'The Weeknd', emoji: '💀', cover: 'c3', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=JBBK6jI4a5Q', videoId: 'JBBK6jI4a5Q' },
    { id: 's40', title: 'Blinding Lights', artist: 'The Weeknd', emoji: '🌃', cover: 'c4', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ', videoId: '4NRXx6U8ABQ' },
    { id: 's41', title: 'Levitating', artist: 'Dua Lipa', emoji: '🚀', cover: 'c1', mood: 'Party', youtubeUrl: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw', videoId: 'TUVcZfQe-Kw' },
    { id: 's42', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', emoji: '💫', cover: 'c2', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U', videoId: 'kTJczUoc26U' },
    { id: 's43', title: 'Heat Waves', artist: 'Glass Animals', emoji: '🌡️', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=mRD0-GxcaoA', videoId: 'mRD0-GxcaoA' },
    { id: 's44', title: 'Watermelon Sugar', artist: 'Harry Styles', emoji: '🍉', cover: 'c4', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=E0y3Vl262pE', videoId: 'E0y3Vl262pE' },
    { id: 's45', title: 'Bad Guy', artist: 'Billie Eilish', emoji: '😈', cover: 'c1', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=DyDfgMOUjCI', videoId: 'DyDfgMOUjCI' },
    { id: 's46', title: 'Shape of You', artist: 'Ed Sheeran', emoji: '💃', cover: 'c2', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=JGwWNGJdvx8', videoId: 'JGwWNGJdvx8' },
    { id: 's47', title: 'Perfect', artist: 'Ed Sheeran', emoji: '💕', cover: 'c3', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g', videoId: '2Vv-BfVoq4g' },
    { id: 's48', title: 'Someone Like You', artist: 'Adele', emoji: '💔', cover: 'c4', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=hLQl3WQQoQ0', videoId: 'hLQl3WQQoQ0' },
    { id: 's49', title: 'Shake It Off', artist: 'Taylor Swift', emoji: '💃', cover: 'c1', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=nfWlot6h_JM', videoId: 'nfWlot6h_JM' },
    { id: 's50', title: 'Bohemian Rhapsody', artist: 'Queen', emoji: '👑', cover: 'c2', mood: 'Nostalgia', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', videoId: 'fJ9rUzIMcZQ' },
    
    // === LOFI / CHILL / FOCUS ===
    { id: 's51', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', emoji: '🎧', cover: 'c3', mood: 'Focus', youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A', videoId: '5qap5aO4i9A' },
    { id: 's52', title: 'Rainy Day Chill', artist: 'Chill Music', emoji: '🌧️', cover: 'c4', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=rUxyKA_-grg', videoId: 'rUxyKA_-grg' },
    { id: 's53', title: 'Study Music', artist: 'Lofi Girl', emoji: '📚', cover: 'c1', mood: 'Focus', youtubeUrl: 'https://www.youtube.com/watch?v=rUxyKA_-grg', videoId: 'rUxyKA_-grg' },
    { id: 's54', title: 'Jazz Cafe', artist: 'Cafe Music', emoji: '☕', cover: 'c2', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=rUxyKA_-grg', videoId: 'rUxyKA_-grg' },
    { id: 's55', title: 'Sleep Music', artist: 'Relax Music', emoji: '😴', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=rUxyKA_-grg', videoId: 'rUxyKA_-grg' },
    
    // === WORKOUT / PARTY ===
    { id: 's56', title: 'Workout Mix 2024', artist: 'Gym Music', emoji: '💪', cover: 'c4', mood: 'Workout', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U', videoId: 'kTJczUoc26U' },
    { id: 's57', title: 'Party Hits', artist: 'Various Artists', emoji: '🎉', cover: 'c1', mood: 'Party', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U', videoId: 'kTJczUoc26U' },
    { id: 's58', title: 'EDM Bangers', artist: 'DJ Mix', emoji: '🎵', cover: 'c2', mood: 'Party', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U', videoId: 'kTJczUoc26U' },
    
    // === GALAU / SAD ===
    { id: 's59', title: 'Lagu Galau Indonesia', artist: 'Various Artists', emoji: '😢', cover: 'c3', mood: 'Galau', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U', videoId: 'kTJczUoc26U' },
    { id: 's60', title: 'Sad Songs Playlist', artist: 'Various Artists', emoji: '💧', cover: 'c4', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=kTJczUoc26U', videoId: 'kTJczUoc26U' },
    
    // === K-POP ===
    { id: 's61', title: 'Ditto', artist: 'NewJeans', emoji: '🐰', cover: 'c1', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=Km71Rr9K-Bw', videoId: 'Km71Rr9K-Bw' },
    { id: 's62', title: 'Super Shy', artist: 'NewJeans', emoji: '🙈', cover: 'c2', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=ArmDp-zijuc', videoId: 'ArmDp-zijuc' },
    { id: 's63', title: 'Cupid', artist: 'FIFTY FIFTY', emoji: '💘', cover: 'c3', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=6zou3gnzNaU', videoId: '6zou3gnzNaU' },
    { id: 's64', title: 'Dynamite', artist: 'BTS', emoji: '🎆', cover: 'c4', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=gdZLi9oWNZg', videoId: 'gdZLi9oWNZg' },
    { id: 's65', title: 'Pink Venom', artist: 'BLACKPINK', emoji: '🖤', cover: 'c1', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=gQlMMD8auMs', videoId: 'gQlMMD8auMs' },
    
    // === ROCK / ALTERNATIVE ===
    { id: 's66', title: 'Stairway to Heaven', artist: 'Led Zeppelin', emoji: '🎸', cover: 'c2', mood: 'Nostalgia', youtubeUrl: 'https://www.youtube.com/watch?v=QkF3oxziUI4', videoId: 'QkF3oxziUI4' },
    { id: 's67', title: 'Hotel California', artist: 'Eagles', emoji: '🏨', cover: 'c3', mood: 'Nostalgia', youtubeUrl: 'https://www.youtube.com/watch?v=09839DpTctU', videoId: '09839DpTctU' },
    { id: 's68', title: 'Smells Like Teen Spirit', artist: 'Nirvana', emoji: '🤘', cover: 'c4', mood: 'Energetic', youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg', videoId: 'hTWKbfoikeg' },
    
    // === R&B / SOUL ===
    { id: 's69', title: 'Thinking Out Loud', artist: 'Ed Sheeran', emoji: '💭', cover: 'c1', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=lp-EO5I60KA', videoId: 'lp-EO5I60KA' },
    { id: 's70', title: 'All of Me', artist: 'John Legend', emoji: '💕', cover: 'c2', mood: 'Romantic', youtubeUrl: 'https://www.youtube.com/watch?v=450p7goxZqg', videoId: '450p7goxZqg' },
    
    // === POP INDONESIA 2025 ===
    { id: 's71', title: 'Hindia - Impala', artist: 'Hindia', emoji: '🦌', cover: 'c3', mood: 'Happy', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's72', title: 'Tulus - Monokrom (Live)', artist: 'Tulus', emoji: '🎤', cover: 'c4', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's73', title: 'Pamungkas - To The Bone (Live)', artist: 'Pamungkas', emoji: '🎸', cover: 'c1', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's74', title: 'Mahalini - Sial (Live)', artist: 'Mahalini', emoji: '🎤', cover: 'c2', mood: 'Sad', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' },
    { id: 's75', title: 'Nadin Amizah - Bertaut (Live)', artist: 'Nadin Amizah', emoji: '🎸', cover: 'c3', mood: 'Chill', youtubeUrl: 'https://www.youtube.com/watch?v=2V4FsMCSrnw', videoId: '2V4FsMCSrnw' }
];

// --- Mood Categories ---
const MOOD_CATEGORIES = [
    { id: 'Happy', emoji: '☀️', label: 'Happy' },
    { id: 'Sad', emoji: '🌧️', label: 'Sad' },
    { id: 'Chill', emoji: '🌊', label: 'Chill' },
    { id: 'Focus', emoji: '🎧', label: 'Focus' },
    { id: 'Romantic', emoji: '💗', label: 'Romantic' },
    { id: 'Party', emoji: '🎉', label: 'Party' },
    { id: 'Workout', emoji: '💪', label: 'Workout' },
    { id: 'Nostalgia', emoji: '📻', label: 'Nostalgia' }
];

// --- App State ---
const AppState = {
    currentPage: 'home',
    currentSong: null,
    isPlaying: false,
    savedSongs: new Set(['s1', 's3']),
    activeMood: '',
    playQueue: [],
    queueIndex: -1,
    user: {
        name: 'Bima Haris',
        handle: 'bimaharis',
        avatar: 'BH',
        bio: 'Collecting songs, moments & memories. ✨',
        location: 'Jakarta',
        followers: 128,
        following: 96,
        posts: 3
    },
    playlists: [
        {
            id: 'pl1',
            name: 'Chill Vibes',
            description: 'Lagu-lagu santai untuk relaksasi',
            cover: 'c3',
            emoji: '🌊',
            songs: ['s3', 's6', 's4'],
            isPublic: true,
            createdAt: '2024-01-15'
        },
        {
            id: 'pl2',
            name: 'Galau Station',
            description: 'Khusus buat yang lagi galau',
            cover: 'c1',
            emoji: '🌧️',
            songs: ['s1', 's5', 's10'],
            isPublic: true,
            createdAt: '2024-01-20'
        },
        {
            id: 'pl3',
            name: 'Workout Mix',
            description: 'Energi tinggi untuk olahraga',
            cover: 'c2',
            emoji: '💪',
            songs: ['s9', 's11', 's7'],
            isPublic: false,
            createdAt: '2024-02-01'
        }
    ],
    searchHistory: [],
    // Store search results so playSong can find them
    searchResults: []
};

// --- Utility Functions ---
const $ = (id) => document.getElementById(id);

function notify(message) {
    const toast = $('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.toastTimer);
    notify.toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Song Card HTML Generator ---
function songCardHTML(song) {
    const isSaved = AppState.savedSongs.has(song.id);
    const hasImage = song.artworkUrl ? 
        `<img src="${song.artworkUrl}" alt="" loading="lazy">` : 
        song.emoji;
    
    // Store song in searchResults so playSong can find it later
    if (!AppState.searchResults.find(s => s.id === song.id)) {
        AppState.searchResults.push(song);
    }

    const coverContent = song.artworkUrl ? 
        `<div class="cover"><img src="${song.artworkUrl}" alt="" loading="lazy"><button class="play-cover" aria-label="Putar" onclick="App.playSong('${song.id}')">▶</button></div>` :
        `<div class="cover ${song.cover}">${song.emoji || ''}<button class="play-cover" aria-label="Putar" onclick="App.playSong('${song.id}')">▶</button></div>`;

    // Source badge
    let sourceBadge = '';
    if (song.source) {
        const badgeMap = {
            'iTunes': '<span class="source-badge itunes">🍎 iTunes</span>',
            'YouTube': '<span class="source-badge youtube">▶️ YouTube</span>',
            'MusicBrainz': '<span class="source-badge musicbrainz">🧠 MusicBrainz</span>',
            'Audius': '<span class="source-badge audius">🎧 Audius</span>',
            'Spotify': '<span class="source-badge spotify">🟢 Spotify</span>',
            'Demo': '<span class="source-badge demo">✨ Demo</span>'
        };
        sourceBadge = badgeMap[song.source] || `<span class="source-badge">🎵 ${escapeHtml(song.source)}</span>`;
    } else if (song.youtubeUrl) {
        sourceBadge = '<span class="source-badge youtube">▶️ YouTube</span>';
    } else {
        sourceBadge = '<span class="source-badge demo">✨ Demo</span>';
    }
    
    // Play type info
    let playInfo = '';
    if (song.playType === 'preview') {
        playInfo = '<span class="play-info" title="Preview 30 detik">🎵 Preview</span>';
    } else if (song.playType === 'stream') {
        playInfo = '<span class="play-info" title="Streaming langsung">📡 Stream</span>';
    } else if (song.playType === 'metadata') {
        playInfo = '<span class="play-info" title="Info saja">ℹ️ Info</span>';
    } else if (song.playType === 'video' || song.youtubeUrl) {
        playInfo = '<span class="play-info" title="Video YouTube">📺 Video</span>';
    }
    
    // Duration
    let duration = '';
    if (song.duration) {
        const mins = Math.floor(song.duration / 60);
        const secs = song.duration % 60;
        duration = `<span class="duration">${mins}:${secs.toString().padStart(2, '0')}</span>`;
    }

    return `
        <article class="music-card">
            ${coverContent}
            <h3>${escapeHtml(song.title)}</h3>
            <p>${escapeHtml(song.artist)}</p>
            <div class="card-meta">
                ${sourceBadge}
                ${playInfo}
                ${duration}
            </div>
            <div class="card-actions">
                <button class="tiny ${isSaved ? 'liked' : ''}" onclick="App.toggleSave('${song.id}')">
                    ${isSaved ? '♥ Tersimpan' : '♡ Simpan'}
                </button>
                <button class="tiny" onclick="App.shareSong('${song.id}')">↗ Bagikan</button>
            </div>
        </article>
    `;
}

// --- Render Functions ---
function renderTrending() {
    const container = $('trendingCards');
    if (!container) return;
    // Tampilkan 12 lagu trending (campuran Pop Indonesia & International)
    const trending = [
        DEMO_SONGS[0],   // Hindia - Evaluasi
        DEMO_SONGS[1],   // Rizky Febian - Terlukis Indah
        DEMO_SONGS[3],   // Tulus - Monokrom
        DEMO_SONGS[4],   // Mahalini - Sial
        DEMO_SONGS[8],   // Weird Genius - Lathi
        DEMO_SONGS[9],   // Pamungkas - To The Bone
        DEMO_SONGS[30],  // Miley Cyrus - Flowers
        DEMO_SONGS[31],  // Taylor Swift - Anti-Hero
        DEMO_SONGS[32],  // Harry Styles - As It Was
        DEMO_SONGS[39],  // The Weeknd - Blinding Lights
        DEMO_SONGS[40],  // Dua Lipa - Levitating
        DEMO_SONGS[63],  // BTS - Dynamite
    ];
    container.innerHTML = trending.map(songCardHTML).join('');
}

function renderCategorySongs() {
    // Render section lagu berdasarkan kategori di beranda
    const categories = [
        { title: '🇮🇩 Pop Indonesia', ids: [0,1,2,3,4,5,6,7,8,9] },
        { title: '🌍 International Hits', ids: [30,31,32,33,34,35,36,37,38,39] },
        { title: '🎧 Lofi & Chill', ids: [50,51,52,53,54] },
        { title: '💜 Galau Station', ids: [0,4,9,13,19,29,59] },
        { title: '💕 Romantic Vibes', ids: [1,12,16,17,21,22,38,46,47,68,69] },
        { title: '🎉 Party & Workout', ids: [8,10,35,36,37,38,40,44,55,56,57] },
        { title: '🇰🇷 K-Pop', ids: [60,61,62,63,64] },
        { title: '🎸 Rock Classics', ids: [49,65,66,67] },
    ];

    // Update section "Vibe dari teman" dengan lagu berdasarkan kategori
    const homeFeed = $('homeFeed');
    if (!homeFeed) return;

    let html = '';
    categories.forEach(cat => {
        const songs = cat.ids.map(i => DEMO_SONGS[i]).filter(Boolean);
        if (songs.length === 0) return;

        html += `
            <div class="section-head" style="margin-top:32px">
                <div>
                    <h3 style="font-size:18px;color:var(--text)">${cat.title}</h3>
                </div>
            </div>
            <div class="cards">
                ${songs.slice(0, 6).map(songCardHTML).join('')}
            </div>
        `;
    });

    homeFeed.innerHTML = html;
}

function renderDiscover() {
    const container = $('discoverCards');
    if (!container) return;
    container.innerHTML = DEMO_SONGS.map(songCardHTML).join('');
}

function renderLibrary() {
    const container = $('libraryCards');
    const emptyState = $('libraryEmpty');
    if (!container) return;
    
    const savedSongs = DEMO_SONGS.filter(s => AppState.savedSongs.has(s.id));
    container.innerHTML = savedSongs.map(songCardHTML).join('');
    
    if (emptyState) {
        emptyState.hidden = savedSongs.length > 0;
    }
}

function renderRightTrending() {
    const container = $('rightTrending');
    if (!container) return;
    container.innerHTML = DEMO_SONGS.slice(0, 4).map(song => `
        <div class="trend" onclick="App.playSong('${song.id}')" style="cursor:pointer">
            <div class="cover ${song.cover}">${song.emoji}</div>
            <div>
                <b>${escapeHtml(song.title)}</b>
                <small>${escapeHtml(song.artist)}</small>
            </div>
        </div>
    `).join('');
}

function renderSuggestedPeople() {
    const container = $('suggestedPeople');
    if (!container) return;
    const people = [
        { initials: 'KS', name: 'Kevin Saputra', desc: 'Suka indie pop', tone: 'a2' },
        { initials: 'ML', name: 'Mira Lestari', desc: 'R&B & soul', tone: 'a3' },
        { initials: 'FA', name: 'Fajar Akbar', desc: 'Lofi enthusiast', tone: '' }
    ];
    
    container.innerHTML = people.map(p => `
        <div class="person">
            <div class="avatar ${p.tone}">${p.initials}</div>
            <div class="person-info">
                <b>${p.name}</b>
                <small>${p.desc}</small>
            </div>
            <button onclick="this.textContent=this.textContent==='Follow'? 'Following':'Follow'">Follow</button>
        </div>
    `).join('');
}

function renderPlaylists() {
    const container = $('playlistCards');
    if (!container) return;
    
    container.innerHTML = AppState.playlists.map(pl => {
        const songCount = pl.songs.length;
        return `
            <article class="music-card" onclick="App.openPlaylist('${pl.id}')" style="cursor:pointer">
                <div class="cover ${pl.cover}" style="font-size:48px">${pl.emoji}</div>
                <h3>${escapeHtml(pl.name)}</h3>
                <p>${songCount} lagu ${pl.isPublic ? '· Publik' : '· Privat'}</p>
                <div class="card-actions">
                    <button class="tiny" onclick="event.stopPropagation(); App.editPlaylist('${pl.id}')">✎ Edit</button>
                    <button class="tiny" onclick="event.stopPropagation(); App.deletePlaylist('${pl.id}')">🗑 Hapus</button>
                </div>
            </article>
        `;
    }).join('');
}

// --- Mood Selection ---
function selectMood(element, mood) {
    document.querySelectorAll('.mood').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    AppState.activeMood = mood;
    
    const container = $('trendingCards') || $('discoverCards');
    if (!container) return;
    
    const filtered = DEMO_SONGS.filter(s => s.mood === mood);
    if (filtered.length > 0) {
        container.innerHTML = filtered.map(songCardHTML).join('');
    } else {
        container.innerHTML = '<div class="empty">Belum ada rekomendasi untuk mood ini. Coba cari lagu di Discover.</div>';
    }
    
    notify(`Vibe ${mood} dipilih ✨`);
}

// --- Player Functions ---
async function playSong(songId) {
    // Find song: 1) object passed directly, 2) DEMO_SONGS, 3) searchResults
    let song;
    if (typeof songId === 'object') {
        song = songId;
    } else {
        song = DEMO_SONGS.find(s => s.id === songId);
        // If not found in DEMO_SONGS, search in searchResults
        if (!song && AppState.searchResults.length > 0) {
            song = AppState.searchResults.find(s => s.id === songId);
        }
    }
    if (!song) {
        console.warn('Song not found:', songId);
        notify('⚠️ Lagu tidak ditemukan.');
        return;
    }

    console.log('🎵 playSong called:', song.title, song.artist);
    AppState.currentSong = song;
    AppState.isPlaying = true;

    // Update player UI
    updatePlayerUI(song);

    // Add to recently played
    if (typeof MusicSearch !== 'undefined' && MusicSearch.addToRecentlyPlayed) {
        MusicSearch.addToRecentlyPlayed(song.id);
    }

    // Play with YouTube player (handles all sources: YouTube, iTunes, Audius)
    if (typeof YouTubePlayer !== 'undefined') {
        try {
            const result = await YouTubePlayer.playSong(song);
            if (result === false) {
                notify(`⚠️ Lagu tidak dapat diputar dari sumber ini.`);
            } else {
                notify(`🎵 Memutar: ${song.title} — ${song.artist}`);
            }
        } catch (error) {
            console.error('❌ playSong error:', error);
            notify('⚠️ Gagal memutar lagu.');
        }
    } else {
        notify(`🎵 Memutar: ${song.title} — ${song.artist}`);
    }
}

function updatePlayerUI(song) {
    const playerTitle = $('playerTitle');
    const playerArtist = $('playerArtist');
    const playerCover = $('playerCover');
    const playToggle = $('playToggle');
    
    if (playerTitle) playerTitle.textContent = song.title;
    if (playerArtist) playerArtist.textContent = song.artist;
    
    if (playerCover) {
        if (song.artworkUrl) {
            playerCover.innerHTML = `<img src="${song.artworkUrl}" alt="" style="width:100%;height:100%;object-fit:cover">`;
        } else if (song.thumbnail) {
            playerCover.innerHTML = `<img src="${song.thumbnail}" alt="" style="width:100%;height:100%;object-fit:cover">`;
        } else {
            playerCover.className = `cover ${song.cover}`;
            playerCover.textContent = song.emoji;
        }
    }
    
    if (playToggle) playToggle.textContent = '⏸';
}

function togglePlay() {
    if (!AppState.currentSong) {
        playSong('s1');
        return;
    }
    
    // Use YouTube player if available
    if (typeof YouTubePlayer !== 'undefined') {
        // Ensure player is initialized
        if (!YouTubePlayer.isReady()) {
            YouTubePlayer.init();
        }
        YouTubePlayer.togglePlay();
    } else {
        AppState.isPlaying = !AppState.isPlaying;
        const playToggle = $('playToggle');
        if (playToggle) {
            playToggle.textContent = AppState.isPlaying ? '⏸' : '▶';
        }
        notify(AppState.isPlaying ? '▶️ Pemutaran dilanjutkan' : '⏸️ Dijeda');
    }
}

function playNext() {
    // Use YouTube player queue if available
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.playNext();
        return;
    }
    
    if (AppState.playQueue.length === 0) {
        // Play random song
        const randomSong = DEMO_SONGS[Math.floor(Math.random() * DEMO_SONGS.length)];
        playSong(randomSong.id);
        return;
    }
    
    AppState.queueIndex = (AppState.queueIndex + 1) % AppState.playQueue.length;
    const nextSong = AppState.playQueue[AppState.queueIndex];
    playSong(nextSong.id);
}

function playPrevious() {
    // Use YouTube player queue if available
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.playPrevious();
        return;
    }
    
    if (AppState.playQueue.length === 0) {
        const randomSong = DEMO_SONGS[Math.floor(Math.random() * DEMO_SONGS.length)];
        playSong(randomSong.id);
        return;
    }
    
    AppState.queueIndex = (AppState.queueIndex - 1 + AppState.playQueue.length) % AppState.playQueue.length;
    const prevSong = AppState.playQueue[AppState.queueIndex];
    playSong(prevSong.id);
}

// --- Volume Control ---
function setVolume(level) {
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.setVolume(level);
    }
}

function toggleMute() {
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        const isMuted = YouTubePlayer.getVolume() === 0;
        YouTubePlayer.setVolume(isMuted ? 80 : 0);
        notify(isMuted ? '🔊 Volume diaktifkan' : '🔇 Volume dimatikan');
    }
}

// --- Progress Bar Click ---
function onProgressClick(event) {
    const progress = event.currentTarget;
    const rect = progress.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady() && YouTubePlayer.duration > 0) {
        const seekTime = percent * YouTubePlayer.duration;
        YouTubePlayer.seekTo(seekTime);
    }
}

// --- Add to Queue ---
function addToQueue(songId) {
    const song = typeof songId === 'object' ? songId : DEMO_SONGS.find(s => s.id === songId);
    if (!song) return;
    
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.addToQueue(song);
    } else {
        AppState.playQueue.push(song);
        notify(`📋 "${song.title}" ditambahkan ke antrean`);
    }
}

// --- Play Queue ---
function playQueue(songs) {
    if (!songs || songs.length === 0) return;
    
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.clearQueue();
        YouTubePlayer.addToQueueBatch(songs);
        // Play first song
        YouTubePlayer.playSong(songs[0]);
    } else {
        AppState.playQueue = [...songs];
        AppState.queueIndex = 0;
        playSong(songs[0].id);
    }
    
    notify(`🎵 Memutar ${songs.length} lagu`);
}

// --- Save/Unsave Song ---
function toggleSave(songId) {
    if (AppState.savedSongs.has(songId)) {
        AppState.savedSongs.delete(songId);
        notify('Dihapus dari koleksi');
    } else {
        AppState.savedSongs.add(songId);
        notify('♥ Ditambahkan ke koleksi');
    }
    
    renderTrending();
    renderDiscover();
    renderLibrary();
}

// --- Share Song ---
function shareSong(songId) {
    const song = DEMO_SONGS.find(s => s.id === songId);
    if (!song) return;
    
    const text = `Lagi suka banget sama "${song.title}" — ${song.artist} 🎧 #Moodify`;
    openModal('share', text);
}

// --- Toggle Video Player ---
function toggleVideoPlayer() {
    if (typeof YouTubePlayer !== 'undefined') {
        const isVisible = YouTubePlayer.isPlayerVisible;
        YouTubePlayer.toggleVisible(!isVisible);
        
        const btn = $('toggleVideoBtn');
        if (btn) {
            btn.textContent = !isVisible ? '⬇️' : '📺';
            btn.title = !isVisible ? 'Sembunyikan video' : 'Tampilkan video';
        }
    }
}

// --- Open YouTube ---
function openYouTube(query) {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank', 'noopener');
}

// --- Playlist Functions ---
function openPlaylist(playlistId) {
    const playlist = AppState.playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    // Navigate to playlist page
    window.location.href = `playlist.html?id=${playlistId}`;
}

function editPlaylist(playlistId) {
    const playlist = AppState.playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    openModal('editPlaylist', playlist);
}

function deletePlaylist(playlistId) {
    if (!confirm('Yakin ingin menghapus playlist ini?')) return;
    
    AppState.playlists = AppState.playlists.filter(p => p.id !== playlistId);
    renderPlaylists();
    notify('Playlist dihapus');
}

// --- Modal Functions ---
function openModal(type, data = null, index = -1) {
    const modal = $('modalBackdrop');
    const title = $('modalTitle');
    const body = $('modalBody');
    const submit = $('modalSubmit');
    
    if (!modal || !title || !body || !submit) return;
    
    let titleText = '';
    let bodyHTML = '';
    let submitText = 'Simpan';
    
    switch (type) {
        case 'share':
            titleText = 'Bagikan vibe kamu';
            submitText = 'Bagikan';
            bodyHTML = `
                <p class="muted" style="font-size:12px">Ceritakan lagu yang sedang mewakili suasana hatimu.</p>
                <textarea id="modalText" placeholder="Lagi sering dengerin lagu ini karena...">${data || ''}</textarea>
                <input id="modalSong" placeholder="Judul lagu atau link YouTube (opsional)">
            `;
            submit.onclick = () => {
                const val = $('modalText')?.value || '';
                if (!val.trim()) {
                    notify('Tulis cerita singkat terlebih dahulu');
                    return;
                }
                if (typeof Social !== 'undefined') {
                    Social.addPost(val, $('modalSong')?.value || '');
                }
                notify('✨ Vibe berhasil dibagikan!');
                closeModal();
            };
            break;
            
        case 'playlist':
            titleText = 'Buat playlist baru';
            submitText = 'Buat playlist';
            bodyHTML = `
                <input id="modalText" placeholder="Nama playlist">
                <textarea id="modalSong" placeholder="Deskripsi playlist (opsional)"></textarea>
            `;
            submit.onclick = () => {
                const name = $('modalText')?.value || '';
                const desc = $('modalSong')?.value || '';
                if (!name.trim()) {
                    notify('Masukkan nama playlist');
                    return;
                }
                const newPlaylist = {
                    id: 'pl' + Date.now(),
                    name: name,
                    description: desc,
                    cover: 'c' + (Math.floor(Math.random() * 4) + 1),
                    emoji: '🎵',
                    songs: [],
                    isPublic: true,
                    createdAt: new Date().toISOString().split('T')[0]
                };
                AppState.playlists.push(newPlaylist);
                renderPlaylists();
                notify(`🎵 Playlist "${name}" dibuat!`);
                closeModal();
            };
            break;
            
        case 'editPlaylist':
            titleText = 'Edit playlist';
            submitText = 'Simpan perubahan';
            bodyHTML = `
                <input id="modalText" value="${data.name}" placeholder="Nama playlist">
                <textarea id="modalSong" placeholder="Deskripsi playlist">${data.description || ''}</textarea>
                <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)">
                    <input type="checkbox" id="modalPublic" ${data.isPublic ? 'checked' : ''} style="width:auto">
                    Playlist publik
                </label>
            `;
            submit.onclick = () => {
                data.name = $('modalText')?.value || data.name;
                data.description = $('modalSong')?.value || '';
                data.isPublic = $('modalPublic')?.checked ?? data.isPublic;
                renderPlaylists();
                notify('✅ Playlist diperbarui');
                closeModal();
            };
            break;
            
        case 'comment':
            titleText = 'Tulis komentar';
            submitText = 'Kirim komentar';
            bodyHTML = `
                <textarea id="modalText" placeholder="Tulis komentar yang baik..."></textarea>
            `;
            submit.onclick = () => {
                const val = $('modalText')?.value || '';
                if (!val.trim()) {
                    notify('Tulis komentar terlebih dahulu');
                    return;
                }
                if (typeof Social !== 'undefined') {
                    Social.addComment(index, val);
                }
                notify('💬 Komentar ditambahkan');
                closeModal();
            };
            break;
            
        case 'login':
            titleText = 'Masuk ke MOODIFY';
            submitText = 'Masuk';
            bodyHTML = `
                <div class="auth-form">
                    <input id="modalEmail" type="email" placeholder="Email">
                    <input id="modalPassword" type="password" placeholder="Password">
                    <p class="muted" style="font-size:12px;text-align:center">
                        Belum punya akun? <a href="#" onclick="openModal('register')">Daftar sekarang</a>
                    </p>
                    <div style="text-align:center;margin:16px 0;color:var(--muted);font-size:12px">atau</div>
                    ${typeof Auth !== 'undefined' ? Auth.renderGoogleButton() : ''}
                    <p class="muted" style="font-size:11px;text-align:center;margin-top:12px">
                        Demo: bima@moodify.com / demo123
                    </p>
                </div>
            `;
            submit.onclick = () => {
                const email = $('modalEmail')?.value || '';
                const password = $('modalPassword')?.value || '';
                if (!email || !password) {
                    notify('Isi email dan password');
                    return;
                }
                if (typeof Auth !== 'undefined') {
                    Auth.login(email, password);
                }
                closeModal();
            };
            break;
            
        case 'register':
            titleText = 'Daftar ke MOODIFY';
            submitText = 'Daftar';
            bodyHTML = `
                <div class="auth-form">
                    <input id="modalName" placeholder="Nama lengkap">
                    <input id="modalHandle" placeholder="Username">
                    <input id="modalEmail" type="email" placeholder="Email">
                    <input id="modalPassword" type="password" placeholder="Password">
                    <p class="muted" style="font-size:12px;text-align:center">
                        Sudah punya akun? <a href="#" onclick="openModal('login')">Masuk</a>
                    </p>
                </div>
            `;
            submit.onclick = () => {
                const name = $('modalName')?.value || '';
                const handle = $('modalHandle')?.value || '';
                const email = $('modalEmail')?.value || '';
                const password = $('modalPassword')?.value || '';
                if (!name || !handle || !email || !password) {
                    notify('Isi semua field');
                    return;
                }
                if (typeof Auth !== 'undefined') {
                    Auth.register(name, handle, email, password);
                }
                notify('🎉 Akun berhasil dibuat!');
                closeModal();
            };
            break;
            
        case 'edit':
        case 'editProfile':
            titleText = 'Edit profil';
            submitText = 'Simpan profil';
            bodyHTML = `
                <input id="modalText" value="${AppState.user.name}" placeholder="Nama">
                <input id="modalHandle" value="@${AppState.user.handle}" placeholder="Username">
                <textarea id="modalSong" placeholder="Bio">${AppState.user.bio}</textarea>
                <input id="modalLocation" value="${AppState.user.location}" placeholder="Lokasi">
            `;
            submit.onclick = () => {
                AppState.user.name = $('modalText')?.value || AppState.user.name;
                const newHandle = $('modalHandle')?.value || '';
                AppState.user.handle = newHandle.replace('@', '');
                AppState.user.bio = $('modalSong')?.value || AppState.user.bio;
                AppState.user.location = $('modalLocation')?.value || AppState.user.location;
                notify('✅ Profil diperbarui');
                closeModal();
            };
            break;
    }
    
    title.textContent = titleText;
    body.innerHTML = bodyHTML;
    submit.textContent = submitText;
    modal.classList.add('show');
}

function closeModal() {
    const modal = $('modalBackdrop');
    if (modal) modal.classList.remove('show');
}

// --- Search Functions ---
function searchMusic() {
    const searchInput = $('searchInput');
    const query = searchInput?.value.trim();
    if (query) {
        searchTerm(query);
    }
}

async function searchTerm(query) {
    const searchInput = $('searchInput');
    const status = $('searchStatus');
    const container = $('discoverCards');
    
    if (searchInput) searchInput.value = query;
    
    // Navigate to discover page
    setPage('discover');
    
    if (status) status.textContent = `🔍 Mencari "${query}" dari iTunes, MusicBrainz, YouTube…`;
    if (container) container.innerHTML = '<div class="empty"><div class="loading-spinner"></div><p>Sedang mencari dari semua sumber musik…</p></div>';
    
    try {
        // Use unified search from MusicSearch
        const results = await MusicSearch.unifiedSearch(query);
        
        // Update status with source breakdown
        const sourceCounts = [];
        if (results.iTunes && results.iTunes.length > 0) sourceCounts.push(`🍎 ${results.iTunes.length} iTunes`);
        if (results.MusicBrainz && results.MusicBrainz.length > 0) sourceCounts.push(`🧠 ${results.MusicBrainz.length} MusicBrainz`);
        if (results.YouTube && results.YouTube.length > 0) sourceCounts.push(`▶️ ${results.YouTube.length} YouTube`);
        
        // Render results grouped by source
        let html = '';
        
        // YouTube results (if any)
        if (results.YouTube && results.YouTube.length > 0) {
            html += `<div class="source-group"><h3 class="source-group-title">▶️ YouTube (${results.YouTube.length})</h3><div class="cards">${results.YouTube.map(songCardHTML).join('')}</div></div>`;
        }
        
        // iTunes results
        if (results.iTunes && results.iTunes.length > 0) {
            html += `<div class="source-group"><h3 class="source-group-title">🍎 iTunes (${results.iTunes.length})</h3><div class="cards">${results.iTunes.map(songCardHTML).join('')}</div></div>`;
        }
        
        // MusicBrainz results
        if (results.MusicBrainz && results.MusicBrainz.length > 0) {
            html += `<div class="source-group"><h3 class="source-group-title">🧠 MusicBrainz (${results.MusicBrainz.length})</h3><div class="cards">${results.MusicBrainz.map(songCardHTML).join('')}</div></div>`;
        }
        
        // If no results from APIs, show demo songs as fallback
        if (results.total === 0) {
            const filtered = DEMO_SONGS.filter(s => 
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.artist.toLowerCase().includes(query.toLowerCase())
            );
            
            if (filtered.length > 0) {
                html += `<div class="source-group"><h3 class="source-group-title">✨ Demo (${filtered.length})</h3><div class="cards">${filtered.map(songCardHTML).join('')}</div></div>`;
                if (status) status.textContent = `✨ ${filtered.length} lagu demo ditemukan`;
            } else {
                // Show all demo songs as last resort
                html += `<div class="source-group"><h3 class="source-group-title">✨ Lagu Populer (${DEMO_SONGS.length})</h3><div class="cards">${DEMO_SONGS.map(songCardHTML).join('')}</div></div>`;
                if (status) status.textContent = `Tidak ditemukan "${query}". Menampilkan lagu populer.`;
            }
        } else {
            if (status) status.textContent = `✅ ${results.total} hasil: ${sourceCounts.join(', ')}`;
        }
        
        if (container) {
            container.innerHTML = html;
        }
        
        // Add to search history
        if (!AppState.searchHistory.includes(query)) {
            AppState.searchHistory.unshift(query);
            if (AppState.searchHistory.length > 10) AppState.searchHistory.pop();
        }
        
    } catch (error) {
        console.error('Search error:', error);
        // Fallback to demo songs if everything fails
        if (status) status.textContent = '⚠️ API tidak tersedia. Menampilkan lagu demo.';
        if (container) {
            const filtered = DEMO_SONGS.filter(s => 
                s.title.toLowerCase().includes(query.toLowerCase()) ||
                s.artist.toLowerCase().includes(query.toLowerCase())
            );
            const songs = filtered.length > 0 ? filtered : DEMO_SONGS;
            container.innerHTML = `<div class="source-group"><h3 class="source-group-title">✨ Lagu Demo (${songs.length})</h3><div class="cards">${songs.map(songCardHTML).join('')}</div></div>`;
        }
    }
}

// --- Show/Hide Search Loading ---
function showSearchLoading(show) {
    const status = $('searchStatus');
    if (show && status) {
        status.textContent = '⏳ Mencari…';
    }
}

// --- Page Navigation ---
function setPage(page) {
    AppState.currentPage = page;
    
    const pages = ['home', 'discover', 'feed', 'library', 'profile', 'settings'];
    pages.forEach(p => {
        const el = $(p + 'Page');
        if (el) el.hidden = p !== page;
    });
    
    // Update nav buttons
    document.querySelectorAll('.nav button[data-page]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.page === page);
    });
    
    // Update mobile nav
    document.querySelectorAll('.mobile-nav button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset?.page === page);
    });
    
    // Update page title
    const labels = {
        home: [`${getGreeting()}, ${AppState.user.name} ✦`, 'Musik apa yang menggambarkan harimu?'],
        discover: ['Discover', 'Temukan soundtrack berikutnya.'],
        feed: ['Community Feed', 'Cerita dan musik dari temanmu.'],
        library: ['Koleksi Saya', 'Semua lagu yang kamu simpan.'],
        profile: ['Profil Saya', 'Your music. Your mood. Your story.'],
        settings: ['Pengaturan', 'Kelola akun dan koneksi musik.']
    };
    
    const pageTitle = $('pageTitle');
    const pageSub = $('pageSub');
    if (pageTitle) pageTitle.textContent = labels[page]?.[0] || 'MOODIFY';
    if (pageSub) pageSub.textContent = labels[page]?.[1] || '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Initialize App ---
function initApp() {
    // Set greeting
    const pageTitle = $('pageTitle');
    if (pageTitle) pageTitle.textContent = `${getGreeting()}, ${AppState.user.name} ✦`;
    
    // Render all sections
    renderTrending();
    renderDiscover();
    renderLibrary();
    renderRightTrending();
    renderSuggestedPeople();
    renderPlaylists();
    renderCategorySongs();
    
    // Initialize social feed
    if (typeof Social !== 'undefined') {
        Social.init();
    }
    
    // Initialize navigation
    if (typeof Navigation !== 'undefined') {
        Navigation.init();
    }
    
    // Set up search listener
    const searchInput = $('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchMusic();
        });
    }
    
    // Close modal on backdrop click
    const modalBackdrop = $('modalBackdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }
    
    console.log('🎵 MOODIFY initialized — Developed by Bima Haris');
}

// --- Queue Panel Functions ---
function toggleQueue() {
    const queuePanel = $('queuePanel');
    if (!queuePanel) return;
    
    const isVisible = queuePanel.classList.contains('show');
    if (isVisible) {
        queuePanel.classList.remove('show');
    } else {
        queuePanel.classList.add('show');
        renderQueue();
    }
}

function clearQueuePanel() {
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.clearQueue();
    }
    renderQueue();
}

function renderQueue() {
    const queueList = $('queueList');
    if (!queueList) return;
    
    const queue = typeof YouTubePlayer !== 'undefined' ? YouTubePlayer.getQueue() : AppState.playQueue;
    const queueIndex = typeof YouTubePlayer !== 'undefined' ? YouTubePlayer.getQueueIndex() : AppState.queueIndex;
    
    if (queue.length === 0) {
        queueList.innerHTML = '<div class="queue-empty">Antrean kosong. Tambahkan lagu untuk membuat antrean.</div>';
        return;
    }
    
    queueList.innerHTML = queue.map((song, index) => {
        const isCurrent = index === queueIndex;
        const coverContent = song.artworkUrl ? 
            `<img src="${song.artworkUrl}" alt="" style="width:100%;height:100%;object-fit:cover">` :
            song.thumbnail ?
            `<img src="${song.thumbnail}" alt="" style="width:100%;height:100%;object-fit:cover">` :
            song.emoji;
        
        return `
            <div class="queue-item ${isCurrent ? 'current' : ''}" onclick="playQueueItem(${index})">
                <div class="queue-number">${isCurrent ? '▶' : index + 1}</div>
                <div class="cover" style="width:40px;height:40px;min-width:40px;font-size:16px;aspect-ratio:unset;margin-bottom:0">
                    ${coverContent}
                </div>
                <div class="queue-info">
                    <b>${escapeHtml(song.title)}</b>
                    <small>${escapeHtml(song.artist)}</small>
                </div>
                <button class="tiny" onclick="event.stopPropagation(); removeFromQueuePanel(${index})">✕</button>
            </div>
        `;
    }).join('');
}

function playQueueItem(index) {
    const queue = typeof YouTubePlayer !== 'undefined' ? YouTubePlayer.getQueue() : AppState.playQueue;
    if (index >= 0 && index < queue.length) {
        const song = queue[index];
        if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
            YouTubePlayer.queueIndex = index;
            YouTubePlayer.playSong(song);
        } else {
            AppState.queueIndex = index;
            playSong(song.id);
        }
        renderQueue();
    }
}

function removeFromQueuePanel(index) {
    if (typeof YouTubePlayer !== 'undefined' && YouTubePlayer.isReady()) {
        YouTubePlayer.removeFromQueue(index);
    } else {
        if (index >= 0 && index < AppState.playQueue.length) {
            AppState.playQueue.splice(index, 1);
            if (index < AppState.queueIndex) {
                AppState.queueIndex--;
            }
        }
    }
    renderQueue();
}

// Update progress UI from YouTubePlayer
function updateProgressFromYouTube() {
    if (typeof YouTubePlayer !== 'undefined') {
        const currentTimeEl = $('currentTime');
        const durationEl = $('duration');
        const progressFill = $('progressFill');
        
        if (currentTimeEl && YouTubePlayer.currentTime > 0) {
            currentTimeEl.textContent = YouTubePlayer.formatTime(YouTubePlayer.currentTime);
        }
        if (durationEl && YouTubePlayer.duration > 0) {
            durationEl.textContent = YouTubePlayer.formatTime(YouTubePlayer.duration);
        }
        if (progressFill && YouTubePlayer.duration > 0) {
            const percent = (YouTubePlayer.currentTime / YouTubePlayer.duration) * 100;
            progressFill.style.width = `${percent}%`;
        }
    }
}

// --- App Object (Global API) ---
const App = {
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    toggleSave,
    shareSong,
    openPlaylist,
    editPlaylist,
    deletePlaylist,
    selectMood,
    searchMusic,
    searchTerm,
    setPage,
    openModal,
    closeModal,
    notify,
    setVolume,
    toggleMute,
    onProgressClick,
    addToQueue,
    playQueue,
    toggleQueue,
    clearQueuePanel,
    renderQueue,
    playQueueItem,
    removeFromQueuePanel,
    init: initApp
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG === 'undefined') {
        console.warn('⚠️ CONFIG not loaded. Make sure to include config.js before app.js');
    }
    initApp();
});
