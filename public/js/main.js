document.addEventListener('DOMContentLoaded', () => {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    
    // Load items
    fetch('http://localhost:3000/api/items')
        .then(res => res.json())
        .then(items => {
            document.getElementById('items').innerHTML = items.map(item => `
                <div class="col-md-4">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="${item.name}">
                        <div class="card-body">
                            <h5 class="card-title">${item.name}</h5>
                            <p class="card-text">$${item.price.toFixed(2)}</p>
                            <button class="btn btn-primary" onclick="addToCart(${item.id})">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        });

    // Cart functionality
    document.getElementById('cart-btn').addEventListener('click', () => {
        updateCart();
        cartModal.show();
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        fetch('http://localhost:3000/api/purchase', {
            method: 'POST'
        })
        .then(() => {
            updateCart();
            cartModal.hide();
            alert('Purchase successful!');
        });
    });
});

function addToCart(itemId) {
    fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId, quantity: 1 })
    })
    .then(() => {
        updateCartCount();
    });
}

function updateCart() {
    fetch('http://localhost:3000/api/cart')
        .then(res => res.json())
        .then(items => {
            const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            document.getElementById('cart-items').innerHTML = items.map(item => `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            document.getElementById('cart-total').textContent = total.toFixed(2);
            updateCartCount();
        });
}

function updateCartCount() {
    fetch('http://localhost:4000/api/cart')
        .then(res => res.json())
        .then(items => {
            const count = items.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        });
}


// Cart state
let cart = [];

// Product prices
const prices = {
    'bananas': 0.99,
    'milk': 3.99,
    'bread': 2.49,
    'eggs': 4.99,
    'apples': 1.99,
    'chicken': 5.99
};

// Add to cart function
function addToCart(itemId) {
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: itemId,
            name: getItemName(itemId),
            price: prices[itemId],
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

// Get item name helper function
function getItemName(itemId) {
    const titleElement = document.querySelector(`button[onclick="addToCart('${itemId}')"]`)
        .closest('.card-body')
        .querySelector('.card-title');
    return titleElement.textContent;
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <h6 class="mb-0">${item.name}</h6>
                <small class="text-muted">$${item.price.toFixed(2)} each</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Update quantity function
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
        updateCartDisplay();
    }
}

// Checkout function
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your purchase!');
    cart = [];
    updateCartDisplay();
    
    const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    cartModal.hide();
});

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});