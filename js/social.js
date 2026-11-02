/* ============================================
   MOODIFY - Social Module
   Posts, Likes, Comments, Follow
   Developed by Bima Haris
   ============================================ */

const Social = {
    // Demo posts data
    posts: [
        {
            id: 'p1',
            user: 'Nadia Putri',
            handle: 'nadiaptr',
            avatar: 'NP',
            tone: 'a3',
            time: '12 menit lalu',
            text: 'Lagu ini selalu berhasil bikin perjalanan pulang terasa seperti scene film. 🌙',
            song: 's3',
            likes: 24,
            comments: [
                { user: 'Ari', text: 'Setuju banget! 🥰', time: '10 menit lalu' },
                { user: 'Raka', text: 'Bernadya emang selalu hits', time: '5 menit lalu' }
            ],
            isLiked: false,
            isFollowed: false
        },
        {
            id: 'p2',
            user: 'Raka Mahendra',
            handle: 'rakamhd',
            avatar: 'RM',
            tone: 'a2',
            time: '1 jam lalu',
            text: 'Sedikit nostalgia untuk sore ini. Ada yang masih sering dengerin?',
            song: 's4',
            likes: 18,
            comments: [
                { user: 'Nadia', text: 'Tulus emang nggak pernah salah', time: '45 menit lalu' }
            ],
            isLiked: false,
            isFollowed: true
        },
        {
            id: 'p3',
            user: 'Dina Aulia',
            handle: 'dinaaulia',
            avatar: 'DA',
            tone: '',
            time: '3 jam lalu',
            text: 'Today feels like this song. No explanation needed. 💗',
            song: 's2',
            likes: 42,
            comments: [],
            isLiked: false,
            isFollowed: false
        },
        {
            id: 'p4',
            user: 'Fajar Akbar',
            handle: 'fajarakbr',
            avatar: 'FA',
            tone: 'a2',
            time: '5 jam lalu',
            text: 'Lofi beats buat ngerjain tugas. Produktif banget hari ini! 🎧',
            song: 's6',
            likes: 15,
            comments: [
                { user: 'Mira', text: 'Playlist lofi-nya bisa dibagikan?', time: '4 jam lalu' }
            ],
            isLiked: false,
            isFollowed: false
        },
        {
            id: 'p5',
            user: 'Mira Lestari',
            handle: 'miralestari',
            avatar: 'ML',
            tone: 'a3',
            time: '1 hari lalu',
            text: 'R&B vibes for the weekend. Siapa yang sama? 🎶',
            song: 's9',
            likes: 31,
            comments: [],
            isLiked: false,
            isFollowed: true
        }
    ],
    
    // Initialize
    init() {
        // Try to load from localStorage
        this.loadFromStorage();
        
        // Render feeds
        this.renderFeed();
    },
    
    // Render all feed sections
    renderFeed() {
        this.renderHomeFeed();
        this.renderFullFeed();
        this.renderProfileFeed();
    },
    
    // Render home feed (first 2 posts)
    renderHomeFeed() {
        const container = $('homeFeed');
        if (!container) return;
        
        container.innerHTML = this.posts.slice(0, 2).map((post, i) => 
            this.postHTML(post, i)
        ).join('');
    },
    
    // Render full feed (all posts)
    renderFullFeed() {
        const container = $('fullFeed');
        if (!container) return;
        
        container.innerHTML = this.posts.map((post, i) => 
            this.postHTML(post, i)
        ).join('');
    },
    
    // Render profile feed (user's own posts)
    renderProfileFeed() {
        const container = $('profileFeed');
        if (!container) return;
        
        // Show all posts for demo
        container.innerHTML = this.posts.map((post, i) => 
            this.postHTML(post, i)
        ).join('');
    },
    
    // Generate post HTML
    postHTML(post, index) {
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        const song = demoSongs.find(s => s.id === post.song);
        
        if (!song) return '';
        
        const commentsHTML = post.comments.map(c => `
            <div style="display:flex;gap:8px;padding:8px 0;border-top:1px solid var(--line)">
                <div class="avatar" style="width:28px;height:28px;min-width:28px;font-size:10px">${c.user.charAt(0)}</div>
                <div>
                    <b style="font-size:12px">${c.user}</b>
                    <p style="font-size:12px;margin:2px 0 0;color:var(--text-secondary)">${c.text}</p>
                    <small style="color:var(--muted);font-size:10px">${c.time}</small>
                </div>
            </div>
        `).join('');
        
        return `
            <article class="post">
                <div class="post-head">
                    <div class="avatar ${post.tone}">${post.avatar}</div>
                    <div>
                        <strong>${post.user}</strong>
                        <small>@${post.handle} · ${post.time}</small>
                    </div>
                    <button class="follow ${post.isFollowed ? 'following' : ''}" 
                            onclick="Social.toggleFollow(${index})">
                        ${post.isFollowed ? '✓ Following' : '+ Follow'}
                    </button>
                </div>
                <p class="post-copy">${post.text}</p>
                <div class="shared-track">
                    <div class="cover ${song.cover}">${song.emoji}</div>
                    <div class="track-info">
                        <b>${song.title}</b>
                        <small>${song.artist}</small>
                    </div>
                    <button class="icon-btn" onclick="App.playSong('${song.id}')">▶</button>
                </div>
                <div class="post-actions">
                    <button onclick="Social.likePost(${index})" 
                            style="${post.isLiked ? 'color:var(--pink)' : ''}">
                        ${post.isLiked ? '♥' : '♡'} ${post.likes} suka
                    </button>
                    <button onclick="Social.toggleComments(${index})">
                        ▢ ${post.comments.length} komentar
                    </button>
                    <button onclick="Social.sharePost(${index})">
                        ↗ Bagikan
                    </button>
                </div>
                <div id="comments-${index}" style="display:none;margin-top:12px">
                    ${commentsHTML}
                    <div style="display:flex;gap:8px;margin-top:10px">
                        <input type="text" id="commentInput-${index}" 
                               placeholder="Tulis komentar..." 
                               style="flex:1;padding:8px 12px;font-size:12px"
                               onkeydown="if(event.key==='Enter')Social.addComment(${index},this.value)">
                        <button class="secondary" onclick="Social.addComment(${index},$('commentInput-${index}').value)" 
                                style="padding:8px 14px;font-size:12px">Kirim</button>
                    </div>
                </div>
            </article>
        `;
    },
    
    // Like a post
    likePost(index) {
        if (!this.posts[index]) return;
        
        if (this.posts[index].isLiked) {
            this.posts[index].likes--;
            this.posts[index].isLiked = false;
        } else {
            this.posts[index].likes++;
            this.posts[index].isLiked = true;
        }
        
        this.renderFeed();
        this.saveToStorage();
    },
    
    // Toggle follow
    toggleFollow(index) {
        if (!this.posts[index]) return;
        
        this.posts[index].isFollowed = !this.posts[index].isFollowed;
        this.renderFeed();
        this.saveToStorage();
        
        const status = this.posts[index].isFollowed ? 'following' : 'unfollowed';
        if (typeof notify === 'function') {
            notify(this.posts[index].isFollowed ? 
                `✓ Sekarang mengikuti ${this.posts[index].user}` : 
                `Berhenti mengikuti ${this.posts[index].user}`);
        }
    },
    
    // Toggle comments visibility
    toggleComments(index) {
        const commentsEl = $(`comments-${index}`);
        if (!commentsEl) return;
        
        commentsEl.style.display = commentsEl.style.display === 'none' ? 'block' : 'none';
    },
    
    // Add a comment
    addComment(index, text) {
        if (!this.posts[index] || !text || !text.trim()) return;
        
        this.posts[index].comments.push({
            user: typeof AppState !== 'undefined' ? AppState.user.name.split(' ')[0] : 'Ari',
            text: text.trim(),
            time: 'Baru saja'
        });
        
        this.renderFeed();
        this.saveToStorage();
        
        if (typeof notify === 'function') {
            notify('💬 Komentar ditambahkan');
        }
    },
    
    // Add a new post
    addPost(text, songLink = '') {
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        const user = typeof AppState !== 'undefined' ? AppState.user : { name: 'Ari', handle: 'arivibes', avatar: 'AR' };
        
        // Try to find song from link
        let songId = 's1'; // default
        if (songLink) {
            const found = demoSongs.find(s => 
                s.title.toLowerCase().includes(songLink.toLowerCase()) ||
                s.artist.toLowerCase().includes(songLink.toLowerCase())
            );
            if (found) songId = found.id;
        }
        
        const newPost = {
            id: 'p_' + Date.now(),
            user: user.name,
            handle: user.handle,
            avatar: user.avatar,
            tone: '',
            time: 'Baru saja',
            text: text,
            song: songId,
            likes: 0,
            comments: [],
            isLiked: false,
            isFollowed: true
        };
        
        this.posts.unshift(newPost);
        this.renderFeed();
        this.saveToStorage();
    },
    
    // Share a post
    sharePost(index) {
        const post = this.posts[index];
        if (!post) return;
        
        const demoSongs = typeof DEMO_SONGS !== 'undefined' ? DEMO_SONGS : [];
        const song = demoSongs.find(s => s.id === post.song);
        
        const text = `Post dari ${post.user}: "${post.text}" 🎵 ${song ? song.title + ' - ' + song.artist : ''}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                if (typeof notify === 'function') {
                    notify('📋 Post disalin ke clipboard!');
                }
            });
        } else {
            if (typeof notify === 'function') {
                notify('Link post disalin (simulasi)');
            }
        }
    },
    
    // Save to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('moodify_posts', JSON.stringify(this.posts));
        } catch (error) {
            console.error('Failed to save posts:', error);
        }
    },
    
    // Load from localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('moodify_posts');
            if (stored) {
                this.posts = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Failed to load posts:', error);
        }
    }
};
