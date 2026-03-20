// Cart functionality using cookies
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartDisplay();
    }

    // Load cart from cookie
    loadCart() {
        const cartCookie = this.getCookie('app_cart');
        if (cartCookie) {
            try {
                return JSON.parse(cartCookie);
            } catch (e) {
                return [];
            }
        }
        return [];
    }

    // Save cart to cookie (expires in 30 days)
    saveCart() {
        const cartJson = JSON.stringify(this.cart);
        this.setCookie('app_cart', cartJson, 30);
        this.updateCartDisplay();
    }

    // Set cookie
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // Get cookie
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

    // Add item to cart
    addToCart(app) {
        const existingItem = this.cart.find(item => item.id === app.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: app.id,
                name: app.name,
                platform: app.platform,
                // price: app.price,
                icon: app.imgSrc,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`${app.name} added to cart!`);
        return true;
    }

    // Remove item from cart
    removeFromCart(appId) {
        this.cart = this.cart.filter(item => item.id !== appId);
        this.saveCart();
        this.updateCartDisplay();
    }

    // Update quantity
    updateQuantity(appId, quantity) {
        const item = this.cart.find(item => item.id === appId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(appId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.showNotification('Cart cleared!');
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get total items count
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Update all cart displays
    updateCartDisplay() {
        // Update cart count
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getItemCount();
        }

        // Update cart preview
        this.updateCartPreview();
        
        // Update modal if it's open
        const modal = document.getElementById('cart-modal');
        if (modal && modal.style.display === 'block') {
            this.updateCartModal();
        }
    }

    // Update cart preview dropdown
    updateCartPreview() {
        const cartPreview = document.getElementById('cartDropdown');
        const cartItemsContainer = document.getElementById('nav-sect-cart');
        
        if (!cartItemsContainer) return;
        
        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="light-100">Your cart is empty</p>';
            // document.getElementById('cart-total').textContent = '0';
            return;
        }
        
        let itemsHtml = '';
        this.cart.forEach(item => {
            itemsHtml += `
                <div class="cart-item">
                    <img src="${item.icon}" class="cart-item-img">
                    <h6 class="cart-item-title">${item.name}</h6>
                    <button type="button" class="cart-remove-btn light-100" title="Remove from cart">-</a>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHtml;
        // document.getElementById('cart-total').textContent = this.getTotal().toFixed(2);
    }

    // Update cart modal
    updateCartModal() {
        const modalContainer = document.getElementById('nav-sect-cart');
        if (!modalContainer) return;
        
        if (this.cart.length === 0) {
            modalContainer.innerHTML = '<p>Your cart is empty</p>';
            // document.getElementById('modal-cart-total').textContent = '0';
            return;
        }
        
        let itemsHtml = '';
        this.cart.forEach(item => {
            itemsHtml += `
                <div class="cart-item">
                    <img src="${item.icon}" class="cart-item-img">
                    <h6 class="cart-item-title">${item.name}</h6>
                    <button type="button" class="cart-remove-btn light-100" title="Remove from cart">-</a>
                </div>
            `;
        });
        
        modalContainer.innerHTML = itemsHtml;
        // document.getElementById('modal-cart-total').textContent = this.getTotal().toFixed(2);
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Checkout
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Here you would typically send the cart data to your backend
        alert(`Proceeding to checkout!\nTotal: $${this.getTotal().toFixed(2)}\nItems: ${this.getItemCount()}`);
        
        // Optional: Clear cart after checkout
        // this.clearCart();
    }
}// Initialize cart manager
const cartManager = new CartManager();

// Helper functions for global access
function viewCart() {
    const modal = document.getElementById('cart-modal');
    cartManager.updateCartModal();
    modal.classList.add('active');
    // modal.style.display = 'flex';
}

// Helper functions for global access
function hideCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('active');
    // modal.style.display = 'flex';
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cartManager.clearCart();
        cartManager.updateCartModal();
    }
}

function checkout() {
    cartManager.checkout();
}



// Close modal when clicking X or outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('cart-modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Cart icon hover preview
    const cartIcon = document.querySelector('.cart-icon');
    const cartPreview = document.getElementById('cart-preview');
    
    if (cartIcon && cartPreview) {
        cartIcon.addEventListener('mouseenter', () => {
            cartPreview.style.display = 'block';
        });
        
        cartIcon.addEventListener('mouseleave', () => {
            cartPreview.style.display = 'none';
        });
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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



const CartMgr = new CartManager();
