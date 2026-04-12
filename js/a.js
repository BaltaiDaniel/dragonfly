// ---------- Mock Backend Simulation ----------
// Mock "database" of existing users (emails + stored hashed-like passwords for demo)
// In real scenario, backend would check existence & verify credentials.
const EXISTING_USERS_DB = new Map([
    ['alex@example.com', { exists: true, password: 'pass123', firstName: 'Alex', lastName: 'Morgan', middleName: 'J.' }],
    ['jordan@work.com', { exists: true, password: 'secure456', firstName: 'Jordan', lastName: 'Lee', middleName: '' }],
    ['emily.c@design.com', { exists: true, password: 'creativ3!', firstName: 'Emily', lastName: 'Chen', middleName: 'Rose' }]
]);


// For demo: additional emails that are "existing" but we don't store full data? we treat any email in map as registered.
// Helper: simulate backend call (async) to check email existence.
async function checkEmailExists(email) {
    // simulate network latency
    await new Promise(resolve => setTimeout(resolve, 450));
    const normalized = email.trim().toLowerCase();
    return EXISTING_USERS_DB.has(normalized);
}


// Simulate fetching user data (for prefill? not needed now, but we can get name hints optional)
async function fetchUserProfile(email) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const normalized = email.trim().toLowerCase();
    return EXISTING_USERS_DB.get(normalized) || null;
}


// Simulate magic link send (demo)
async function sendMagicLink(email) {
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log(`[MAGIC LINK] ✨ Magic link sent to ${email} (demo backend)`);
    return true;
}


// Simulate signup (create user)
async function createNewUser(email, userData) {
    await new Promise(resolve => setTimeout(resolve, 700));
    const normalized = email.trim().toLowerCase();
    if (EXISTING_USERS_DB.has(normalized)) {
        throw new Error('User already exists during signup');
    }
    // store in mock DB
    EXISTING_USERS_DB.set(normalized, {
        exists: true,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName || ''
    });
    return { success: true };
}


// Simulate password verification
async function verifyPassword(email, enteredPassword) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const normalized = email.trim().toLowerCase();
    const user = EXISTING_USERS_DB.get(normalized);
    if (user && user.password === enteredPassword) {
        return { success: true, message: 'Sign in successful!' };
    }
    return { success: false, message: 'Incorrect password. Try again or use magic link.' };
}


// ---------- UI State Management ----------
let currentEmail = '';          // store email after first step
let stage = 'email';            // 'email', 'passwordMagic', 'signup'
let lastError = null;

// DOM elements references
const dynamicView = document.getElementById('dynamicView');

// Helper to show error/info message inside container (transient)
function setMessage(htmlContent, type = 'error') {
    const existingMsg = document.querySelector('.message-area');
    if (existingMsg) existingMsg.remove();
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-area ${type === 'error' ? 'error-msg' : 'info-msg'}`;
    msgDiv.innerHTML = htmlContent;
    // Insert after the main buttons container or at top of dynamicView? Append to dynamicView but before optional next?
    const btnWrapper = dynamicView.querySelector('.action-wrapper') || dynamicView;
    btnWrapper.insertAdjacentElement('afterend', msgDiv);
    // auto clear after 5 sec for info, but keep errors until next action? fine
    if (type === 'info') {
        setTimeout(() => { if (msgDiv && msgDiv.remove) msgDiv.remove(); }, 4000);
    }
}


function clearMessages() {
    const msgs = dynamicView.querySelectorAll('.message-area');
    msgs.forEach(m => m.remove());
}


// ---- RENDER ENGINE ----
function render() {
    if (stage === 'email') {
        renderEmailStep();
    } else if (stage === 'passwordMagic') {
        renderPasswordMagicStep();
    } else if (stage === 'signup') {
        renderSignupStep();
    }
    attachFloatingLabelEvents(); // ensure floating label behaviour on dynamic inputs
}


function renderEmailStep() {
    dynamicView.innerHTML = `
        <div class="float-group" id="emailGroup">
            <input type="email" id="emailInput" placeholder=" " autocomplete="email" value="${escapeHtml(currentEmail)}">
            <label>Email address</label>
        </div>
        <button class="sign-primary-decision-btn black" id="nextBtn">Next <i class="bi-forward"></i></button>
    `;
    
    const nextBtn = document.getElementById('nextBtn');
    const emailInput = document.getElementById('emailInput');
    nextBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email || !isValidEmail(email)) {
            setMessage('Please enter a valid email address', 'error');
            return;
        }
        clearMessages();
        // check existence on backend
        try {
            const exists = await checkEmailExists(email);
            currentEmail = email;
            if (exists) {
                stage = 'passwordMagic';
                render();
            } else {
                stage = 'signup';
                render();
            }
        } catch (err) {
            setMessage('Network error. Please try again.', 'error');
        }
    });
    // focus handling for float
    if (emailInput) emailInput.focus();
}


function renderPasswordMagicStep() {
    dynamicView.innerHTML = `
        <p>📧 ${escapeHtml(currentEmail)}</p>
        <div class="float-group" id="passwordGroup">
            <input type="password" id="passwordInput" placeholder=" " autocomplete="current-password">
            <label>Password</label>
        </div>

        <button class="primary-btn" id="signinPasswordBtn">Sign in <i class="bi-forward"></i></button>
        <button class="sign-secondary-decision-btn" id="magicLinkBtn">Sign in using magic link</button>
        <button class="sign-secondary-decision-btn" id="backToEmailBtn">← Sign in with a different email</button>
    `;
    const passInput = document.getElementById('passwordInput');
    const signinBtn = document.getElementById('signinPasswordBtn');
    const magicBtn = document.getElementById('magicLinkBtn');
    const backBtn = document.getElementById('backToEmailBtn');

    signinBtn.addEventListener('click', async () => {
        const password = passInput.value;
        if (!password) {
            setMessage('Please enter your password', 'error');
            return;
        }
        clearMessages();
        const result = await verifyPassword(currentEmail, password);
        if (result.success) {
            setMessage(`✅ ${result.message} Welcome back! (demo dashboard)`, 'info');
            // simulate redirect / reset after 1.5 sec (reset to email stage for demo)
            setTimeout(() => {
                alert('Demo: Login success. Reset to email step for next test.');
                resetToEmailStage();
            }, 1500);
        } else {
            setMessage(result.message, 'error');
        }
    });

    magicBtn.addEventListener('click', async () => {
        clearMessages();
        setMessage('✨ Sending magic link...', 'info');
        const sent = await sendMagicLink(currentEmail);
        if (sent) {
            setMessage(`🔮 Magic link sent to ${escapeHtml(currentEmail)}. Check console (demo).`, 'info');
            // optional: stay on same stage but show note
        }
    });

    backBtn.addEventListener('click', () => {
        resetToEmailStage();
    });
    if (passInput) passInput.focus();
}


function renderSignupStep() {
    dynamicView.innerHTML = `
        <h4 class="dark-100" style="margin-bottom: 12px;">Create New Account</h4>
        <div class="two-col">
            <div class="float-group">
                <input type="text" id="firstName" placeholder=" " autocomplete="given-name">
                <label>First Name *</label>
            </div>
            <div class="float-group">
                <input type="text" id="lastName" placeholder=" " autocomplete="family-name">
                <label>Last Name *</label>
            </div>
        </div>
        <div class="float-group">
            <input type="text" id="middleName" placeholder=" " autocomplete="additional-name">
            <label>Middle Name (Optional)</label>
        </div>
        <div class="float-group">
            <input type="email" id="signupEmail" placeholder=" " autocomplete="email" value="${escapeHtml(currentEmail)}">
            <label>Email address</label>
        </div>
        <div class="float-group">
            <input type="password" id="signupPassword" placeholder=" " autocomplete="new-password">
            <label>Password *</label>
        </div>
        <div class="float-group">
            <input type="password" id="confirmPassword" placeholder=" ">
            <label>Confirm password *</label>
        </div>
        <button class="sign-primary-decision-btn" id="completeSignupBtn">Sign up →</button>
        <button class="sign-secondary-decision-btn" id="cancelSignupBtn">← Back to email</button>
    `;

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const middleInput = document.getElementById('middleName');
    const emailInput = document.getElementById('signupEmail');
    const passInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('confirmPassword');
    const signupBtn = document.getElementById('completeSignupBtn');
    const cancelBtn = document.getElementById('cancelSignupBtn');

    // prefill email if we have currentEmail
    if (currentEmail && emailInput) emailInput.value = currentEmail;

    signupBtn.addEventListener('click', async () => {
        clearMessages();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passInput.value;
        const confirm = confirmInput.value;
        const middleName = middleInput.value.trim();

        if (!firstName || !lastName) {
            setMessage('First name and last name are required.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            setMessage('Valid email required.', 'error');
            return;
        }
        if (password.length < 4) {
            setMessage('Password must be at least 4 characters.', 'error');
            return;
        }
        if (password !== confirm) {
            setMessage('Passwords do not match.', 'error');
            return;
        }

        // double-check existence (backend side)
        const exists = await checkEmailExists(email);
        if (exists) {
            setMessage('Email already registered. Please sign in instead.', 'error');
            return;
        }

        try {
            await createNewUser(email, {
                firstName, lastName, middleName, password
            });
            setMessage(`🎉 Account created for ${firstName} ${lastName}! You can now sign in.`, 'info');
            // reset flow to email stage
            setTimeout(() => {
                currentEmail = '';
                stage = 'email';
                render();
            }, 2000);
        } catch (err) {
            setMessage(err.message || 'Signup failed, try again.', 'error');
        }
    });

    cancelBtn.addEventListener('click', () => {
        resetToEmailStage();
    });
    if (firstNameInput) firstNameInput.focus();
}


// Helper reset function
function resetToEmailStage() {
    currentEmail = '';
    stage = 'email';
    render();
}


// floating label: reinitialize on each render because dynamic inputs might lack proper classes
function attachFloatingLabelEvents() {
    // for each .float-group, watch input value and focus to toggle 'float-active' class (extra)
    const groups = document.querySelectorAll('.float-group');
    groups.forEach(group => {
        const input = group.querySelector('input');
        if (!input) return;
        const checkActive = () => {
            if (input.value.trim() !== '') {
                group.classList.add('float-active');
            } else {
                group.classList.remove('float-active');
            }
        };
        input.addEventListener('focus', () => {
            group.classList.add('float-active');
        });
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                group.classList.remove('float-active');
            }
        });
        // initial check
        if (input.value.trim() !== '') group.classList.add('float-active');
        else group.classList.remove('float-active');
        // also on input
        input.addEventListener('input', checkActive);
    });
}


// email validator
function isValidEmail(email) {
    return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(email);
}


function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}


// initial render
render();


