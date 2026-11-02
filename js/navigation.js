/* ============================================
   MOODIFY - Navigation Module
   Developed by Bima Haris
   ============================================ */

const Navigation = {
    currentPage: 'home',
    
    init() {
        // Sidebar navigation
        document.querySelectorAll('.nav button[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Mobile navigation
        document.querySelectorAll('.mobile-nav button[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, true);
            }
        });
        
        // Check URL hash for initial page
        const hash = window.location.hash.slice(1);
        if (hash && ['home', 'discover', 'feed', 'library', 'profile', 'settings'].includes(hash)) {
            this.navigateTo(hash, true);
        }
    },
    
    navigateTo(page, skipHistory = false) {
        this.currentPage = page;
        
        // Update URL hash
        if (!skipHistory) {
            history.pushState({ page }, '', `#${page}`);
        }
        
        // Call app setPage if available
        if (typeof setPage === 'function') {
            setPage(page);
        }
        
        // Update active states
        this.updateActiveStates(page);
    },
    
    updateActiveStates(page) {
        // Sidebar nav
        document.querySelectorAll('.nav button[data-page]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
        
        // Mobile nav
        document.querySelectorAll('.mobile-nav button[data-page]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });
    },
    
    getCurrentPage() {
        return this.currentPage;
    }
};
