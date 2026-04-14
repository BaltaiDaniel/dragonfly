// Cookie Notice Manager
class CookieNoticeManager {
    constructor() {
        this.consentGiven = false;
        this.cookieSettings = {
            necessary: true, // Always true
            functional: false,
            analytics: false,
            marketing: false
        };
        this.init();
    }

    init() {
        this.checkConsent();
        this.setupEventListeners();
    }

    // Check if user has already given consent
    checkConsent() {
        const consent = this.getCookie('cookie_consent');
        if (consent) {
            try {
                const settings = JSON.parse(consent);
                this.cookieSettings = settings;
                this.consentGiven = true;
                this.hideCookieNotice();
                this.applyCookieSettings();
            } catch (e) {
                console.error('Error parsing cookie consent', e);
            }
        } else {
            this.showCookieNotice();
        }
    }

    // Show cookie notice
    showCookieNotice() {
        const notice = document.getElementById('cookie-consent');
        if (notice) {
            notice.style.display = 'block';

            notice.innerHTML = `\
                <div class="cookie-consent-content">
                    <div class="cookie-header">
                        <h3>Dragonfly Values Your Privacy</h3>
                    </div>
                    <div class="cookie-body">
                        <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. You can reject all non-essential cookies by choosing to accept only necessary cookies. By clicking “Allow All”, you agree to the placement and use of cookies.</p>\
                    </div>
                    <div class="cookie-footer">
                        <div class="cookie-buttons">
                            <button class="cookie-btn cookie-accept-btn" id="cookie-accept-all">Accept All Cookies</button>
                            <button class="cookie-btn cookie-accept-btn" id="cookie-accept-necessary">Accept Only Necessary</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Hide cookie notice
    hideCookieNotice() {
        const notice = document.getElementById('cookie-consent');
        if (notice) {
            notice.style.display = 'none';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Accept all button
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        // Accept necessary button
        const acceptNecessaryBtn = document.getElementById('cookie-accept-necessary');
        if (acceptNecessaryBtn) {
            acceptNecessaryBtn.addEventListener('click', () => this.acceptNecessary());
        }

        // Decline all button
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAll());
        }

        // Settings button
        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsModal());
        }

        // Settings modal close
        const closeBtn = document.querySelector('.cookie-settings-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideSettingsModal());
        }

        // Save preferences
        const saveBtn = document.getElementById('save-preferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.savePreferences());
        }

        // Accept all from settings
        const acceptAllSettings = document.getElementById('accept-all-settings');
        if (acceptAllSettings) {
            acceptAllSettings.addEventListener('click', () => this.acceptAll());
        }

        // Close modal when clicking outside
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSettingsModal();
                }
            });
        }

        // Update settings modal with current values
        this.updateSettingsModalValues();
    }

    // Accept all cookies
    acceptAll() {
        this.cookieSettings = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true
        };
        this.saveConsent();
        this.applyCookieSettings();
        this.hideCookieNotice();
        this.hideSettingsModal();
        // this.showNotification('Cookie preferences saved successfully!');
    }

    // Accept necessary cookies
    acceptNecessary() {
        this.cookieSettings = {
            necessary: true,
            functional: true,
            analytics: false,
            marketing: false
        };
        this.saveConsent();
        this.applyCookieSettings();
        this.hideCookieNotice();
        this.hideSettingsModal();
        // this.showNotification('Cookie preferences saved successfully!');
    }

    // Decline all non-essential cookies
    declineAll() {
        this.cookieSettings = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        this.saveConsent();
        this.applyCookieSettings();
        this.hideCookieNotice();
        this.hideSettingsModal();
        this.showNotification('Only necessary cookies are enabled.');
    }

    // Save user preferences
    savePreferences() {
        // Get values from settings modal
        const functionalCheckbox = document.getElementById('settings-functional');
        const analyticsCheckbox = document.getElementById('settings-analytics');
        const marketingCheckbox = document.getElementById('settings-marketing');

        this.cookieSettings = {
            necessary: true,
            functional: functionalCheckbox ? functionalCheckbox.checked : false,
            analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
            marketing: marketingCheckbox ? marketingCheckbox.checked : false
        };

        this.saveConsent();
        this.applyCookieSettings();
        this.hideCookieNotice();
        this.hideSettingsModal();
        this.showNotification('Cookie preferences saved successfully!');
    }

    // Save consent to cookie
    saveConsent() {
        const consentValue = JSON.stringify(this.cookieSettings);
        this.setCookie('cookie_consent', consentValue, 365); // Expires in 1 year
        this.consentGiven = true;
        
        // Also save individual cookie preferences
        this.setCookie('functional_enabled', this.cookieSettings.functional, 365);
        this.setCookie('analytics_enabled', this.cookieSettings.analytics, 365);
        this.setCookie('marketing_enabled', this.cookieSettings.marketing, 365);
    }

    // Apply cookie settings to website
    applyCookieSettings() {
        // Apply analytics cookies
        if (this.cookieSettings.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Apply marketing cookies
        if (this.cookieSettings.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Apply functional cookies
        if (this.cookieSettings.functional) {
            this.enableFunctional();
        } else {
            this.disableFunctional();
        }

        // Dispatch custom event for other scripts to listen to
        const event = new CustomEvent('cookieConsentUpdated', { 
            detail: this.cookieSettings 
        });
        document.dispatchEvent(event);
    }

    // Show settings modal
    showSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            this.updateSettingsModalValues();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide settings modal
    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Update settings modal checkboxes with current values
    updateSettingsModalValues() {
        const functionalCheckbox = document.getElementById('settings-functional');
        const analyticsCheckbox = document.getElementById('settings-analytics');
        const marketingCheckbox = document.getElementById('settings-marketing');

        if (functionalCheckbox) functionalCheckbox.checked = this.cookieSettings.functional;
        if (analyticsCheckbox) analyticsCheckbox.checked = this.cookieSettings.analytics;
        if (marketingCheckbox) marketingCheckbox.checked = this.cookieSettings.marketing;

        // Update main notice checkboxes if they exist
        const mainFunctional = document.getElementById('functional-cookies');
        const mainAnalytics = document.getElementById('analytics-cookies');
        const mainMarketing = document.getElementById('marketing-cookies');

        if (mainFunctional) mainFunctional.checked = this.cookieSettings.functional;
        if (mainAnalytics) mainAnalytics.checked = this.cookieSettings.analytics;
        if (mainMarketing) mainMarketing.checked = this.cookieSettings.marketing;
    }

    // Enable analytics
    enableAnalytics() {
        console.log('Analytics cookies enabled');
        // Add your analytics initialization code here
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Load analytics scripts if needed
        this.loadAnalyticsScript();
    }

    // Disable analytics
    disableAnalytics() {
        console.log('Analytics cookies disabled');
        // Disable analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }

    // Enable marketing
    enableMarketing() {
        console.log('Marketing cookies enabled');
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        }
    }

    // Disable marketing
    disableMarketing() {
        console.log('Marketing cookies disabled');
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }
    }

    // Enable functional
    enableFunctional() {
        console.log('Functional cookies enabled');
        // Enable functionality that requires cookies
        // Example: Load user preferences, themes, etc.
        this.loadUserPreferences();
    }

    // Disable functional
    disableFunctional() {
        console.log('Functional cookies disabled');
        // Disable non-essential functionality
    }

    // Load analytics script
    loadAnalyticsScript() {
        // Check if analytics script already loaded
        if (!document.querySelector('#analytics-script') && this.cookieSettings.analytics) {
            // Example: Google Analytics
            const script = document.createElement('script');
            script.id = 'analytics-script';
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
            document.head.appendChild(script);
            
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
        }
    }

    // Load user preferences
    loadUserPreferences() {
        // Load saved user preferences from cookies
        const theme = this.getCookie('user_theme');
        const language = this.getCookie('user_language');
        
        if (theme) {
            document.body.classList.add(`theme-${theme}`);
        }
        
        if (language) {
            // Apply language preference
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Cookie utility functions
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Reset consent (for testing/debugging)
    resetConsent() {
        this.setCookie('cookie_consent', '', -1);
        this.cookieSettings = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false
        };
        this.consentGiven = false;
        this.showCookieNotice();
        this.updateSettingsModalValues();
        console.log('Cookie consent reset');
    }
}

// Add CSS animations
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

// Initialize cookie notice when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieNoticeManager();
});

// Optional: Add a floating button to reset consent (for testing)
function resetCookieConsent() {
    if (window.cookieManager) {
        window.cookieManager.resetConsent();
    }
}