/**
 * Aura Feline - Centralized Shopping Cart Logic
 * Synchronized via localStorage
 */

let cart = JSON.parse(localStorage.getItem('aura-feline-cart')) || [];

function toggleCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    if (!cartDrawer || !cartOverlay) return;

    const isOpen = !cartDrawer.classList.contains('translate-x-full');
    
    if (isOpen) {
        cartDrawer.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0', 'pointer-events-none');
    } else {
        cartDrawer.classList.remove('translate-x-full');
        cartOverlay.classList.remove('opacity-0', 'pointer-events-none');
        updateCartUI();
    }
}

function addToCart(name, price) {
    if(window.event) window.event.stopPropagation();
    
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Auto-open cart to show feedback
    const cartDrawer = document.getElementById('cart-drawer');
    if (cartDrawer && cartDrawer.classList.contains('translate-x-full')) {
        toggleCart();
    }
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('aura-feline-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (!cartCountEl || !cartItemsEl || !cartTotalEl) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.innerText = totalItems;
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.innerText = `${totalPrice} €`;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="text-on-surface-variant/50 text-center mt-10">Dein Warenkorb ist leer.</p>';
    } else {
        cartItemsEl.innerHTML = cart.map(item => `
            <div class="flex items-center gap-4 bg-white dark:bg-surface-container rounded-xl p-4 border border-black/5 shadow-sm">
                <div class="flex-1">
                    <h4 class="font-headline italic text-on-background text-[13px]">${item.name}</h4>
                    <p class="text-tertiary font-bold text-xs">${item.price} €</p>
                </div>
                <div class="flex items-center gap-2 bg-surface-container px-2 py-1 rounded-full text-xs">
                    <button onclick="changeQuantity('${item.name}', -1)" class="w-5 h-5 flex items-center justify-center hover:bg-black/5 rounded-full">-</button>
                    <span class="font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 1)" class="w-5 h-5 flex items-center justify-center hover:bg-black/5 rounded-full">+</button>
                </div>
            </div>
        `).join('');
    }
}

function changeQuantity(name, delta) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    saveCart();
    updateCartUI();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', updateCartUI);
