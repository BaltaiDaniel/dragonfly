// Modal System
class ModalManager {
    constructor() {
        this.modals = {};
        this.activeModal = null;
        this.initializeModals();
        this.setupEventListeners();
    }

    // Initialize all modals
    initializeModals() {
        // Create modal container if it doesn't exist
        if (!document.getElementById('modal-container')) {
            const container = document.createElement('div');
            container.id = 'modal-container';
            document.body.appendChild(container);
        }

        // Define modal templates
        this.modalTemplates = {
            cart: this.getCartModalTemplate(),
            checkout: this.getCheckoutModalTemplate(),
            appDetails: this.getAppDetailsModalTemplate(),
            login: this.getLoginModalTemplate(),
            confirmation: this.getConfirmationModalTemplate(),
            success: this.getSuccessModalTemplate(),
            error: this.getErrorModalTemplate()
        };
    }

    // Setup global event listeners
    setupEventListeners() {
        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });

        // Close modal on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList && e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
    }

    // Show modal with animation
    showModal(type, data = {}) {
        const template = this.modalTemplates[type];
        if (!template) {
            console.error(`Modal type "${type}" not found`);
            return;
        }

        // Create modal HTML
        const modalHtml = template(data);
        
        // Add to container
        const container = document.getElementById('modal-container');
        container.innerHTML = modalHtml;
        
        // Get modal element
        const modal = container.querySelector('.modal');
        const overlay = container.querySelector('.modal-overlay');
        
        // Add animation classes
        setTimeout(() => {
            modal.classList.add('modal-active');
            overlay.classList.add('modal-overlay-active');
        }, 10);
        
        this.activeModal = modal;
        
        // Setup modal specific event handlers
        this.setupModalHandlers(type, modal, data);
        
        return modal;
    }

    // Close current modal
    closeModal() {
        if (this.activeModal) {
            const modal = this.activeModal;
            const overlay = modal.parentElement.querySelector('.modal-overlay');
            
            modal.classList.remove('modal-active');
            if (overlay) overlay.classList.remove('modal-overlay-active');
            
            setTimeout(() => {
                if (modal.parentElement) {
                    modal.parentElement.innerHTML = '';
                }
                this.activeModal = null;
            }, 300);
        }
    }

    // Setup modal specific handlers
    setupModalHandlers(type, modal, data) {
        switch(type) {
            case 'cart':
                this.setupCartModalHandlers(modal, data);
                break;
            case 'checkout':
                this.setupCheckoutModalHandlers(modal, data);
                break;
            case 'appDetails':
                this.setupAppDetailsModalHandlers(modal, data);
                break;
            case 'login':
                this.setupLoginModalHandlers(modal, data);
                break;
        }
    }

    // Cart Modal Handlers
    setupCartModalHandlers(modal, data) {
        const closeBtn = modal.querySelector('.modal-close');
        const checkoutBtn = modal.querySelector('.checkout-btn');
        const clearCartBtn = modal.querySelector('.clear-cart-btn');
        const continueShoppingBtn = modal.querySelector('.continue-shopping');
        
        if (closeBtn) closeBtn.onclick = () => this.closeModal();
        if (continueShoppingBtn) continueShoppingBtn.onclick = () => this.closeModal();
        if (clearCartBtn) clearCartBtn.onclick = () => {
            if (confirm('Are you sure you want to clear your cart?')) {
                cartManager.clearCart();
                this.updateCartModal();
            }
        };
        if (checkoutBtn) checkoutBtn.onclick = () => {
            this.closeModal();
            this.showModal('checkout', { cart: cartManager.cart, total: cartManager.getTotal() });
        };
    }

    // Checkout Modal Handlers
    setupCheckoutModalHandlers(modal, data) {
        const closeBtn = modal.querySelector('.modal-close');
        const backBtn = modal.querySelector('.back-to-cart');
        const submitBtn = modal.querySelector('.submit-order');
        
        if (closeBtn) closeBtn.onclick = () => this.closeModal();
        if (backBtn) backBtn.onclick = () => {
            this.closeModal();
            this.showModal('cart');
        };
        if (submitBtn) submitBtn.onclick = () => {
            const form = modal.querySelector('#checkout-form');
            if (form && form.checkValidity()) {
                this.showModal('success', { 
                    message: 'Order placed successfully!',
                    orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
                });
                cartManager.clearCart();
            } else if (form) {
                form.reportValidity();
            }
        };
    }

    // App Details Modal Handlers
    setupAppDetailsModalHandlers(modal, data) {
        const closeBtn = modal.querySelector('.modal-close');
        const addToCartBtn = modal.querySelector('.add-to-cart-modal');
        
        if (closeBtn) closeBtn.onclick = () => this.closeModal();
        if (addToCartBtn && data.app) {
            addToCartBtn.onclick = () => {
                cartManager.addToCart(data.app);
                this.closeModal();
                this.showModal('success', { 
                    message: `${data.app.name} added to cart!`,
                    icon: data.app.icon
                });
            };
        }
    }

    // Login Modal Handlers
    setupLoginModalHandlers(modal, data) {
        const closeBtn = modal.querySelector('.modal-close');
        const loginForm = modal.querySelector('#login-form');
        
        if (closeBtn) closeBtn.onclick = () => this.closeModal();
        if (loginForm) {
            loginForm.onsubmit = (e) => {
                e.preventDefault();
                const email = loginForm.querySelector('#email').value;
                const password = loginForm.querySelector('#password').value;
                
                // Simulate login
                setTimeout(() => {
                    this.closeModal();
                    this.showModal('success', { 
                        message: `Welcome back! You've successfully logged in.`,
                        email: email
                    });
                }, 500);
            };
        }
    }

    // Update cart modal content
    updateCartModal() {
        const modal = document.querySelector('.modal[data-modal-type="cart"]');
        if (modal) {
            const cartContent = modal.querySelector('.modal-cart-content');
            if (cartContent) {
                cartContent.innerHTML = this.getCartContent();
            }
        }
    }

    // Get cart content HTML
    getCartContent() {
        if (cartManager.cart.length === 0) {
            return `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any apps to your cart yet.</p>
                    <button class="btn-primary" onclick="modalManager.closeModal()">Continue Shopping</button>
                </div>
            `;
        }

        let itemsHtml = '';
        cartManager.cart.forEach(item => {
            itemsHtml += `
                <div class="cart-item-modal">
                    <div class="cart-item-icon">${item.icon || '📱'}</div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Platform: ${item.platform}</p>
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        <div>$${(item.price * item.quantity).toFixed(2)}</div>
                        <button class="remove-btn" onclick="cartManager.removeFromCart('${item.id}')">Remove</button>
                    </div>
                </div>
            `;
        });

        return `
            <div class="cart-items-list">
                ${itemsHtml}
            </div>
            <div class="cart-summary-modal">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${cartManager.getTotal().toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (10%):</span>
                    <span>$${(cartManager.getTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>$${(cartManager.getTotal() * 1.1).toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    // Modal Templates
    getCartModalTemplate() {
        return `
            <div class="modal-overlay">
                <div class="modal modal-large" data-modal-type="cart">
                    <div class="modal-header">
                        <h2>Your Shopping Cart</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-cart-content">
                            ${this.getCartContent()}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary continue-shopping">Continue Shopping</button>
                        <button class="btn-danger clear-cart-btn">Clear Cart</button>
                        <button class="btn-primary checkout-btn">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        `;
    }

    getCheckoutModalTemplate(data) {
        return `
            <div class="modal-overlay">
                <div class="modal modal-large" data-modal-type="checkout">
                    <div class="modal-header">
                        <h2>Checkout</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="checkout-form">
                            <div class="form-section">
                                <h3>Contact Information</h3>
                                <div class="form-group">
                                    <label>Email Address *</label>
                                    <input type="email" required placeholder="your@email.com">
                                </div>
                                <div class="form-group">
                                    <label>Full Name *</label>
                                    <input type="text" required placeholder="John Doe">
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Payment Information</h3>
                                <div class="form-group">
                                    <label>Card Number *</label>
                                    <input type="text" required placeholder="1234 5678 9012 3456">
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expiry Date *</label>
                                        <input type="text" required placeholder="MM/YY">
                                    </div>
                                    <div class="form-group">
                                        <label>CVV *</label>
                                        <input type="text" required placeholder="123">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="order-summary">
                                <h3>Order Summary</h3>
                                <div class="summary-item">
                                    <span>Subtotal:</span>
                                    <span>$${data.total ? data.total.toFixed(2) : '0.00'}</span>
                                </div>
                                <div class="summary-item">
                                    <span>Tax (10%):</span>
                                    <span>$${data.total ? (data.total * 0.1).toFixed(2) : '0.00'}</span>
                                </div>
                                <div class="summary-item total">
                                    <span>Total:</span>
                                    <span>$${data.total ? (data.total * 1.1).toFixed(2) : '0.00'}</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary back-to-cart">Back to Cart</button>
                        <button class="btn-primary submit-order">Place Order</button>
                    </div>
                </div>
            </div>
        `;
    }

    getAppDetailsModalTemplate(data) {
        const app = data.app || {};
        return `
            <div class="modal-overlay">
                <div class="modal" data-modal-type="appDetails">
                    <div class="modal-header">
                        <h2>${app.name || 'App Details'}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="app-details">
                            <div class="app-details-icon">${app.icon || '📱'}</div>
                            <div class="app-details-info">
                                <p class="app-details-platform">Platform: ${app.platform || 'All Platforms'}</p>
                                <p class="app-details-price">${app.price === 0 ? 'Free' : `$${app.price}`}</p>
                                <p class="app-details-description">${app.description || 'No description available.'}</p>
                                <div class="app-details-features">
                                    <h4>Features:</h4>
                                    <ul>
                                        <li>✓ Easy to use interface</li>
                                        <li>✓ Regular updates</li>
                                        <li>✓ 24/7 support</li>
                                        <li>✓ Secure download</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary modal-close">Close</button>
                        <button class="btn-primary add-to-cart-modal">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    }

    getLoginModalTemplate() {
        return `
            <div class="modal-overlay">
                <div class="modal" data-modal-type="login">
                    <div class="modal-header">
                        <h2>Login to Your Account</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="login-form">
                            <div class="form-group">
                                <label>Email Address</label>
                                <input type="email" id="email" required placeholder="Enter your email">
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" id="password" required placeholder="Enter your password">
                            </div>
                            <div class="form-options">
                                <label>
                                    <input type="checkbox"> Remember me
                                </label>
                                <a href="#" class="forgot-password">Forgot password?</a>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary modal-close">Cancel</button>
                        <button class="btn-primary" onclick="document.getElementById('login-form').requestSubmit()">Login</button>
                    </div>
                </div>
            </div>
        `;
    }

    getConfirmationModalTemplate(data) {
        return `
            <div class="modal-overlay">
                <div class="modal modal-small" data-modal-type="confirmation">
                    <div class="modal-header">
                        <h2>${data.title || 'Confirm Action'}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${data.message || 'Are you sure you want to proceed?'}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary modal-close">Cancel</button>
                        <button class="btn-primary" onclick="${data.onConfirm || 'modalManager.closeModal()'}">Confirm</button>
                    </div>
                </div>
            </div>
        `;
    }

    getSuccessModalTemplate(data) {
        return `
            <div class="modal-overlay">
                <div class="modal modal-small" data-modal-type="success">
                    <div class="modal-header success">
                        <div class="success-icon">✓</div>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h3>${data.message || 'Success!'}</h3>
                        ${data.orderId ? `<p>Order ID: ${data.orderId}</p>` : ''}
                        ${data.email ? `<p>Welcome back, ${data.email}!</p>` : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary modal-close">Continue</button>
                    </div>
                </div>
            </div>
        `;
    }

    getErrorModalTemplate(data) {
        return `
            <div class="modal-overlay">
                <div class="modal modal-small" data-modal-type="error">
                    <div class="modal-header error">
                        <div class="error-icon">!</div>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <h3>${data.title || 'Error'}</h3>
                        <p>${data.message || 'Something went wrong. Please try again.'}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary modal-close">OK</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize modal manager
const modalManager = new ModalManager();

// Helper functions for global access
function showAppDetails(app) {
    modalManager.showModal('appDetails', { app });
}

function showLoginModal() {
    modalManager.showModal('login');
}

function showCartModal() {
    modalManager.showModal('cart');
}

function showCheckoutModal() {
    modalManager.showModal('checkout', { 
        cart: cartManager.cart, 
        total: cartManager.getTotal() 
    });
}