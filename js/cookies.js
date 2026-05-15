class CookieNoticeManager {
    constructor() {
        this.consentGiven = false;
        this.cookieSettings = {
            necessary: true, // Always true
            functional: true,
            analytics: false,
            marketing: false
        };
        this.init();
    }

    init() {
        this.checkConsent();
        this.setupEventListeners();
    }


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


    showCookieNotice() {
        const notice = document.getElementById('cookie-consent');
        if (notice) {
            notice.style.display = 'block';

            notice.innerHTML = `\
                <div class="cookie-consent-content">
                    <div class="cookie-header">
                        <h3>Dragonfly Respects your Privacy</h3>
                    </div>
                    <div class="cookie-body">
                        <p>We are committed to enhancing your browsing experience. Cookies help us do that, as well as serve personalized ads or content, and analyze our traffic. You can reject all non-essential cookies by choosing to accept only essential cookies. By clicking "Accept All Cookies" or "Accept Only Essential", you agree to the placement and use of cookies.</p>\
                    </div>
                    <div class="cookie-footer">
                        <div class="cookie-buttons">
                            <button class="cookie-btn cookie-accept-btn" id="cookie-accept-all">Accept All Cookies</button>
                            <button class="cookie-btn cookie-accept-btn" id="cookie-accept-necessary">Accept Only Essential</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }


    hideCookieNotice() {
        const notice = document.getElementById('cookie-consent');
        if (notice) {
            notice.style.display = 'none';
        }
    }


    setupEventListeners() {
        const acceptBtn = document.getElementById('cookie-accept-all');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => this.acceptAll());
        }

        const acceptNecessaryBtn = document.getElementById('cookie-accept-necessary');
        if (acceptNecessaryBtn) {
            acceptNecessaryBtn.addEventListener('click', () => this.acceptNecessary());
        }

        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', () => this.declineAll());
        }

        const settingsBtn = document.getElementById('cookie-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsModal());
        }

        const closeBtn = document.querySelector('.cookie-settings-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideSettingsModal());
        }

        const saveBtn = document.getElementById('save-preferences');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.savePreferences());
        }

        const acceptAllSettings = document.getElementById('accept-all-settings');
        if (acceptAllSettings) {
            acceptAllSettings.addEventListener('click', () => this.acceptAll());
        }

        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideSettingsModal();
                }
            });
        }

        this.updateSettingsModalValues();
    }


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
    }


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
    }


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


    savePreferences() {
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


    saveConsent() {
        const consentValue = JSON.stringify(this.cookieSettings);
        this.setCookie('cookie_consent', consentValue, 365); // Expires in 1 year
        this.consentGiven = true;
        
        // Also save individual cookie preferences
        this.setCookie('functional_enabled', this.cookieSettings.functional, 365);
        this.setCookie('analytics_enabled', this.cookieSettings.analytics, 365);
        this.setCookie('marketing_enabled', this.cookieSettings.marketing, 365);
    }


    applyCookieSettings() {
        if (this.cookieSettings.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        if (this.cookieSettings.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        if (this.cookieSettings.functional) {
            this.enableFunctional();
        } else {
            this.disableFunctional();
        }

        const event = new CustomEvent('cookieConsentUpdated', { 
            detail: this.cookieSettings 
        });
        document.dispatchEvent(event);
    }


    showSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            this.updateSettingsModalValues();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }


    hideSettingsModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }


    updateSettingsModalValues() {
        const functionalCheckbox = document.getElementById('settings-functional');
        const analyticsCheckbox = document.getElementById('settings-analytics');
        const marketingCheckbox = document.getElementById('settings-marketing');

        if (functionalCheckbox) functionalCheckbox.checked = this.cookieSettings.functional;
        if (analyticsCheckbox) analyticsCheckbox.checked = this.cookieSettings.analytics;
        if (marketingCheckbox) marketingCheckbox.checked = this.cookieSettings.marketing;

        const mainFunctional = document.getElementById('functional-cookies');
        const mainAnalytics = document.getElementById('analytics-cookies');
        const mainMarketing = document.getElementById('marketing-cookies');

        if (mainFunctional) mainFunctional.checked = this.cookieSettings.functional;
        if (mainAnalytics) mainAnalytics.checked = this.cookieSettings.analytics;
        if (mainMarketing) mainMarketing.checked = this.cookieSettings.marketing;
    }


    enableAnalytics() {
        // Analytics initialization code
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        this.loadAnalyticsScript();
    }


    disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }


    enableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        }
    }


    disableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
            });
        }
    }


    enableFunctional() {
        // Enable functionality that requires cookies
        this.loadUserPreferences();
        // this.loadTheme();
    }

    disableFunctional() {
        // this.disableTheme();
    }


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


    loadUserPreferences() {
        const language = this.getCookie('user_language');
        
        if (language) {
            // Apply language preference
        }
    }


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
    }
}


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


document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieNoticeManager();
});


function resetCookieConsent() {
    if (window.cookieManager) {
        window.cookieManager.resetConsent();
    }
}