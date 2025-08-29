// Main JavaScript for Dreamer's Land Verification Site
class VerificationSite {
    constructor() {
        this.apiData = null;
        this.currentTheme = this.getStoredTheme();
        this.init();
    }

    async init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.setupFavicons();
        this.createStarField();
        await this.loadApiData();
        this.setupPageSpecificFeatures();
        
        // Initialize page with fade in animation
        document.body.classList.add('fade-in');
    }

    // Theme Management
    getStoredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        
        // Default to dark theme
        return 'dark';
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update theme toggle if exists
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            // Set initial state
            themeToggle.checked = this.currentTheme === 'dark';
            
            // Remove any existing event listeners
            themeToggle.removeEventListener('change', this.themeChangeHandler);
            
            // Create and store the event handler
            this.themeChangeHandler = (e) => {
                const newTheme = e.target.checked ? 'dark' : 'light';
                this.applyTheme(newTheme);
                console.log('Theme changed to:', newTheme);
            };
            
            // Add the event listener
            themeToggle.addEventListener('change', this.themeChangeHandler);
            
            // Also add click handler to ensure it works
            themeToggle.addEventListener('click', (e) => {
                setTimeout(() => {
                    const newTheme = e.target.checked ? 'dark' : 'light';
                    this.applyTheme(newTheme);
                }, 50);
            });
        }
    }

    // Favicon Setup
    setupFavicons() {
        const head = document.head;
        
        // Remove any existing favicon links
        const existingFavicons = head.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]');
        existingFavicons.forEach(link => link.remove());
        
        // Add favicon.ico
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = '/cdn/assets/favicon/favicon.ico';
        favicon.type = 'image/x-icon';
        head.appendChild(favicon);
        
        // Add 16x16 favicon
        const favicon16 = document.createElement('link');
        favicon16.rel = 'icon';
        favicon16.type = 'image/png';
        favicon16.sizes = '16x16';
        favicon16.href = '/cdn/assets/favicon/favicon-16x16.png';
        head.appendChild(favicon16);
        
        // Add 32x32 favicon
        const favicon32 = document.createElement('link');
        favicon32.rel = 'icon';
        favicon32.type = 'image/png';
        favicon32.sizes = '32x32';
        favicon32.href = '/cdn/assets/favicon/favicon-32x32.png';
        head.appendChild(favicon32);
        
        // Add Apple touch icon
        const appleTouchIcon = document.createElement('link');
        appleTouchIcon.rel = 'apple-touch-icon';
        appleTouchIcon.sizes = '180x180';
        appleTouchIcon.href = '/cdn/assets/favicon/apple-touch-icon.png';
        head.appendChild(appleTouchIcon);
    }

    // Star Field Animation
    createStarField() {
        const starField = document.createElement('div');
        starField.className = 'animated-bg';
        starField.innerHTML = '<div class="stars"></div>';
        document.body.appendChild(starField);

        const starsContainer = starField.querySelector('.stars');
        const numberOfStars = window.innerWidth < 768 ? 50 : 100;

        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (Math.random() * 2 + 2) + 's';
            starsContainer.appendChild(star);
        }
    }

    // API Data Management
    async loadApiData() {
        try {
            const response = await fetch('https://janvi.jarvibeta.xyz/api/info');
            if (!response.ok) throw new Error('Failed to fetch API data');
            
            this.apiData = await response.json();
            this.updatePageWithApiData();
        } catch (error) {
            console.error('Error loading API data:', error);
            this.handleApiError();
        }
    }

    updatePageWithApiData() {
        if (!this.apiData) return;

        // Update dynamic content
        this.updateElement('guild-name', this.apiData.guild?.name || 'Dreamer\'s Land');
        this.updateElement('guild-name-footer', this.apiData.guild?.name || 'Dreamer\'s Land');
        this.updateElement('guild-member-count', this.apiData.guild?.memberCountFormatted || 'N/A');
        this.updateElement('guild-verified-count', this.apiData.guild?.verifiedUserCountFormatted || 'N/A');
        this.updateElement('owner-name', this.apiData.owner?.displayName || 'Server Owner');
        this.updateElement('youtube-channel', this.apiData.youtube?.channelTitle || 'Janvi Dreamer');
        this.updateElement('youtube-subscribers', this.apiData.youtube?.subscriberCountFormatted || 'N/A');
        this.updateElement('user-display-name', this.apiData.user?.displayName || 'Dear Dreamer');
        this.updateElement('user-discord-tag', this.apiData.user?.discordTag || 'Dreamer#0000');

        // Update images
        this.updateImage('guild-icon', this.apiData.guild?.iconUrl);
        this.updateImage('guild-icon-footer', this.apiData.guild?.iconUrl);
        this.updateImage('user-avatar', this.apiData.user?.avatarUrl);
        this.updateImage('owner-avatar', this.apiData.owner?.avatarUrl);
        this.updateImage('youtube-logo', this.apiData.youtube?.logoUrl);

        // Set dynamic year
        this.setCurrentYear();

        // Update page title if on verify page
        if (window.location.pathname.includes('verify') && this.apiData.guild?.name) {
            document.title = `Verify | ${this.apiData.guild.name}`;
        }
    }

    setCurrentYear() {
        const currentYear = new Date().getFullYear();
        const yearElements = document.querySelectorAll('#current-year');
        yearElements.forEach(element => {
            if (element) {
                element.textContent = currentYear;
            }
        });
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element && content) {
            element.textContent = content;
        }
    }

    updateImage(id, src) {
        const element = document.getElementById(id);
        if (element) {
            if (src && src.trim()) {
                element.src = src;
                element.alt = element.alt || 'Image';
                element.style.display = '';
            } else {
                // Hide empty images
                element.style.display = 'none';
            }
        }
    }

    handleApiError() {
        // Show fallback content
        this.updateElement('guild-name', 'Dreamer\'s Land');
        this.updateElement('guild-name-footer', 'Dreamer\'s Land');
        this.updateElement('guild-member-count', 'N/A');
        this.updateElement('guild-verified-count', 'N/A');
        this.updateElement('owner-name', 'Janvi Dreamer');
        this.updateElement('youtube-channel', 'Janvi Dreamer');
        this.updateElement('youtube-subscribers', 'N/A');
        this.updateElement('user-display-name', 'Dear Dreamer');
        this.updateElement('user-discord-tag', 'Dreamer#0000');
        
        // Set dynamic year
        this.setCurrentYear();
        
        console.warn('Using fallback content due to API error');
    }

    // Loading States
    showLoading(containerId = 'loading-overlay') {
        const overlay = document.getElementById(containerId);
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    hideLoading(containerId = 'loading-overlay') {
        const overlay = document.getElementById(containerId);
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Lottie Animation Helper
    loadLottieAnimation(containerId, animationUrl, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Create iframe for Lottie animation
        const iframe = document.createElement('iframe');
        iframe.src = animationUrl;
        iframe.style.width = options.width || '200px';
        iframe.style.height = options.height || '200px';
        iframe.style.border = 'none';
        iframe.style.background = 'transparent';
        
        container.innerHTML = '';
        container.appendChild(iframe);
    }

    // Page-specific features
    setupPageSpecificFeatures() {
        const path = window.location.pathname;
        
        if (path.includes('verify')) {
            this.setupVerifyPage();
        } else if (path.includes('error')) {
            this.setupErrorPage();
        } else {
            this.setupHomePage();
        }
    }

    setupHomePage() {
        // Add any homepage specific features
        console.log('Homepage initialized');
    }

    setupVerifyPage() {
        this.setupTokenValidation();
        this.setupOAuthButton();
        this.setupPageLoadingAnimation();
    }

    setupErrorPage() {
        // Add error page specific features
        this.setupRetryButtons();
    }

    // Verify Page Features
    setupTokenValidation() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
            this.showError('No verification token provided');
            return;
        }

        this.validateToken(token);
    }

    async validateToken(token) {
        try {
            const response = await fetch(`https://knarlix.github.io/idkxxx/testverify.json`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Token validation failed');
            }

            this.updateVerifyPageWithUserData(data);
            this.showOAuthButton(data.oauthURL);
            
        } catch (error) {
            console.error('Token validation error:', error);
            this.showError(error.message);
        }
    }

    updateVerifyPageWithUserData(userData) {
        // Update user information on verify page
        this.updateElement('user-display-name', userData.displayName);
        this.updateElement('user-discord-tag', userData.discordTag);
        this.updateImage('user-avatar', userData.avatarUrl);
        
        // Update page title with user name
        document.title = `Verify ${userData.displayName} | ${this.apiData?.guild?.name || 'Dreamer\'s Land'}`;
    }

    showOAuthButton(oauthURL) {
        const button = document.getElementById('oauth-button');
        if (button && oauthURL) {
            button.href = oauthURL;
            button.classList.remove('hidden');
            button.addEventListener('click', () => {
                this.showConnectingAnimation();
            });
        }
    }

    setupOAuthButton() {
        const button = document.getElementById('oauth-button');
        if (button) {
            button.addEventListener('click', (e) => {
                if (!button.href) {
                    e.preventDefault();
                    this.showError('OAuth URL not available');
                }
            });
        }
    }

    setupPageLoadingAnimation() {
        // Show initial loading animation
        this.loadLottieAnimation('page-loading', 
            'https://lottie.host/embed/fb90fbf7-0928-49a6-9d48-00b84fe11218/AkOk2t6qZZ.lottie',
            { width: '200px', height: '200px' }
        );
        
        // Hide loading after content loads
        setTimeout(() => {
            const loadingContainer = document.getElementById('page-loading');
            if (loadingContainer) {
                loadingContainer.style.opacity = '0';
                loadingContainer.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    loadingContainer.style.display = 'none';
                }, 50);
            }
        }, 0);
    }

    showConnectingAnimation() {
        // Show connecting animation overlay
        const overlay = document.getElementById('connecting-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    }

    // Error Handling
    showError(message) {
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.classList.remove('hidden');
        }
        
        // Hide OAuth button
        const button = document.getElementById('oauth-button');
        if (button) {
            button.classList.add('hidden');
        }
    }

    setupRetryButtons() {
        const retryButtons = document.querySelectorAll('.retry-button');
        retryButtons.forEach(button => {
            button.addEventListener('click', () => {
                window.location.reload();
            });
        });
    }

    // Utility Functions
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 0.75rem 1rem;
            background: var(--glass);
            border: 1px solid var(--glass-border);
            border-radius: 0.5rem;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Smooth scrolling for navigation
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.verificationSite = new VerificationSite();
});

// Handle system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        window.verificationSite?.applyTheme(e.matches ? 'dark' : 'light');
    }
});

// Add CSS animations for toasts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);