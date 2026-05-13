const cookieManager = new CookieNoticeManager();


const userAuth = (function() {
    let currentUser = null;
    

    function areFunctionalCookiesAllowed() {
        return cookieManager.cookieSettings.functional;
    }
    

    function setUserCookie(name, value, days = 7) {
        if (!areFunctionalCookiesAllowed()) {
            return false;
        }
        
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        return true;
    }
    

    function getUserCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
        return null;
    }
    

    function deleteUserCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
    

    function updateAccountButton() {
        const accountBtn = document.getElementById('accountBtn');
        
        if (!accountBtn) {
            return;
        }
        
        if (currentUser && currentUser.dp) {
            // If user is logged in, show dp...
            accountBtn.innerHTML = `
                <button onclick="showAccCont()"><a href="https://baltaidaniel.github.io/dragonfly/auth" class="nav-btn-icon" id="accountBtn" 
                style="padding: 0;" alt="${currentUser.name}"><img src="${currentUser.dp}"></a></button>
            `;
        } else {
            // ...else, show default icon
            accountBtn.innerHTML = `
                <a href="https://baltaidaniel.github.io/dragonfly/auth" class="nav-btn-icon" id="accountBtn" style="padding: 0;"><i class="bi-person-circle" style="font-size: 24px;"></i></a>
            `;
        }
    }
    

    function initFromCookies() {
        if (!areFunctionalCookiesAllowed()) {
            currentUser = null;
            updateAccountButton();
            return;
        }
        
        const userId = getUserCookie('userId');
        const userDp = getUserCookie('userDp');
        const userName = getUserCookie('userName');
        
        if (userId && userDp && userName) {
            currentUser = {
                id: userId,
                dp: userDp,
                name: userName
            };
            updateAccountButton();
            console.log(`✅ Logged in as: ${userName}`);
        } else {
            currentUser = null;
            updateAccountButton();
            console.log('❌ Not logged in');
        }
    }
    

    function login() {
        if (!areFunctionalCookiesAllowed()) {
            cookieManager.showCookieNotice();
            if (typeof showCookieNotice !== 'undefined') {
                showCookieNotice();
            }
            return;
        }
        
        const demoUsers = [
            { id: '1', name: 'John Doe', dp: 'https://randomuser.me/api/portraits/men/1.jpg', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', dp: 'https://randomuser.me/api/portraits/women/2.jpg', email: 'jane@example.com' },
            { id: '3', name: 'Mike Johnson', dp: 'https://randomuser.me/api/portraits/men/3.jpg', email: 'mike@example.com' }
        ];
        
        const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
        

        setUserCookie('userId', randomUser.id);
        setUserCookie('userDp', randomUser.dp);
        setUserCookie('userName', randomUser.name);
        setUserCookie('userEmail', randomUser.email);
        
        currentUser = randomUser;
        updateAccountButton();
        console.log(`✅ Logged in as: ${randomUser.name}`);
        showToast(`Welcome back, ${randomUser.name}!`, 'success');
    }
    

    function logout() {
        deleteUserCookie('userId');
        deleteUserCookie('userDp');
        deleteUserCookie('userName');
        deleteUserCookie('userEmail');
        
        currentUser = null;
        updateAccountButton();
        console.log('❌ Not logged in');
        showToast('Logged out successfully', 'info');
    }
    

    function getCurrentUser() {
        return currentUser;
    }
    

    function isLoggedIn() {
        return currentUser !== null;
    }
    

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    

    function listenForConsentChanges() {
        document.addEventListener('cookie-consent-changed', function(e) {
            if (e.detail && e.detail.functional === true) {
                initFromCookies();
            } else if (e.detail && e.detail.functional === false) {
                logout();
            } else if (!areFunctionalCookiesAllowed()) {
                logout();
            }
        });
    }
    

    function init() {
        initFromCookies();
        listenForConsentChanges();
    }
    

    return {
        init: init,
        login: login,
        logout: logout,
        getCurrentUser: getCurrentUser,
        isLoggedIn: isLoggedIn,
        updateButton: updateAccountButton
    };
})();


document.addEventListener('DOMContentLoaded', function() {
    userAuth.init();
});
