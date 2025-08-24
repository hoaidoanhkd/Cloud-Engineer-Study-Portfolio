// Dark Mode Management
class DarkModeManager {
    constructor() {
        this.theme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme();
        this.createToggleButton();
        this.addSystemThemeListener();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (error) {
            console.error('Error reading theme from localStorage:', error);
            return null;
        }
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error('Error storing theme to localStorage:', error);
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.storeTheme(this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateToggleButton();
        
        // Add animation effect
        document.body.style.transition = 'none';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 10);
    }

    createToggleButton() {
        // Remove existing toggle if any
        const existingToggle = document.querySelector('.theme-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        toggle.setAttribute('title', 'Toggle dark mode');
        
        toggle.innerHTML = `
            <svg class="sun-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
            <svg class="moon-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
            </svg>
        `;

        toggle.addEventListener('click', () => {
            this.toggleTheme();
            this.addClickEffect(toggle);
        });

        // Add keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
                this.addClickEffect(toggle);
            }
        });

        document.body.appendChild(toggle);
        this.updateToggleButton();
    }

    updateToggleButton() {
        const toggle = document.querySelector('.theme-toggle');
        if (!toggle) return;

        const sunIcon = toggle.querySelector('.sun-icon');
        const moonIcon = toggle.querySelector('.moon-icon');

        if (this.theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            toggle.setAttribute('title', 'Switch to light mode');
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            toggle.setAttribute('title', 'Switch to dark mode');
        }
    }

    addClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    addSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
                this.updateToggleButton();
            }
        });
    }

    // Public method to get current theme
    getCurrentTheme() {
        return this.theme;
    }

    // Public method to set theme programmatically
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.theme = theme;
            this.applyTheme();
            this.updateToggleButton();
        }
    }
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkModeManager;
}
