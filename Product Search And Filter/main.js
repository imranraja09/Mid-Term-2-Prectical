
        const products = [
            { id: 1, title: "Wireless Noise-Canceling Headphones", category: "electronics", price: 299.99, desc: "Immersive sound quality with active noise cancellation and 30-hour battery life.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
            { id: 2, title: "Minimalist Ergonomic Watch", category: "lifestyle", price: 149.50, desc: "Sleek stainless steel design crafted for everyday elegance and durability.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" },
            { id: 3, title: "Performance Running Sneakers", category: "apparel", price: 120.00, desc: "Ultra-lightweight cushioning designed to elevate your daily runs and workouts.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80" },
            { id: 4, title: "Smart Fitness Activity Tracker", category: "electronics", price: 89.99, desc: "Track heart rate, sleep patterns, and daily fitness goals seamlessly.", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80" },
            { id: 5, title: "Classic Premium Leather Jacket", category: "apparel", price: 249.00, desc: "Genuine soft leather jacket featuring timeless tailoring and rugged comfort.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80" },
            { id: 6, title: "Insulated Stainless Steel Bottle", category: "lifestyle", price: 34.99, desc: "Keeps your beverages ice cold for 24 hours or piping hot for up to 12 hours.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80" },
            { id: 7, title: "Compact Mechanical Keyboard", category: "electronics", price: 110.00, desc: "Responsive tactile switches housed in a stunning customizable RGB chassis.", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80" },
            { id: 8, title: "Canvas Urban Daypack", category: "lifestyle", price: 79.00, desc: "Durable water-resistant canvas backpack with dedicated laptop compartment.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" }
        ];

        let cart = JSON.parse(localStorage.getItem('elite_cart')) || [];
        let currentCategory = 'all';
        let searchQuery = '';
        let currentSort = 'default';

        const productGrid = document.getElementById('productGrid');
        const searchInput = document.getElementById('searchInput');
        const categorySelect = document.getElementById('categorySelect');
        const sortSelect = document.getElementById('sortSelect');
        const gridBtns = document.querySelectorAll('.grid-btn');
        const cartToggleBtn = document.getElementById('cartToggleBtn');
        const cartCount = document.getElementById('cartCount');
        const cartModal = document.getElementById('cartModal');
        const closeModal = document.getElementById('closeModal');
        const cartItemsList = document.getElementById('cartItemsList');
        const cartTotalPrice = document.getElementById('cartTotalPrice');
        const checkoutBtn = document.getElementById('checkoutBtn');

        function saveCart() {
            localStorage.setItem('elite_cart', JSON.stringify(cart));
            updateCartUI();
        }

        function updateCartUI() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;

            if (cart.length === 0) {
                cartItemsList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">Your cart is empty.</div>`;
                cartTotalPrice.textContent = "0.00";
                return;
            }

            let total = 0;
            cartItemsList.innerHTML = cart.map(item => {
                total += item.price * item.quantity;
                return `
                    <div class="cart-item">
                        <div>
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        </div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
            }).join('');

            cartTotalPrice.textContent = total.toFixed(2);
        }

        window.removeFromCart = function(id) {
            cart = cart.filter(item => item.id !== id);
            saveCart();
            renderProducts();
        }

        function renderProducts() {
            let filtered = products.filter(item => {
                const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
                const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            if (currentSort === 'low-high') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'high-low') {
                filtered.sort((a, b) => b.price - a.price);
            } else if (currentSort === 'name') {
                filtered.sort((a, b) => a.title.localeCompare(b.title));
            }

            if (filtered.length === 0) {
                productGrid.innerHTML = `<div class="no-results">No products found matching your criteria.</div>`;
                return;
            }

            productGrid.innerHTML = filtered.map(item => {
                const inCart = cart.some(cartItem => cartItem.id === item.id);
                return `
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${item.image}" alt="${item.title}" class="product-image">
                            <span class="category-tag">${item.category}</span>
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${item.title}</h3>
                            <p class="product-desc">${item.desc}</p>
                            <div class="product-footer">
                                <span class="product-price">$${item.price.toFixed(2)}</span>
                                <button class="buy-btn ${inCart ? 'added' : ''}" onclick="toggleCart(${item.id})">
                                    ${inCart ? 'Added ✓' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        window.toggleCart = function(id) {
            const product = products.find(p => p.id === id);
            const existing = cart.find(item => item.id === id);

            if (existing) {
                cart = cart.filter(item => item.id !== id);
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            saveCart();
            renderProducts();
        }

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim();
            renderProducts();
        });

        categorySelect.addEventListener('change', (e) => {
            currentCategory = e.target.value;
            renderProducts();
        });

        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderProducts();
        });

        gridBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                gridBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const gridClass = btn.getAttribute('data-grid');
                productGrid.className = `product-grid ${gridClass}`;
            });
        });

        cartToggleBtn.addEventListener('click', () => {
            cartModal.classList.add('open');
        });

        closeModal.addEventListener('click', () => {
            cartModal.classList.remove('open');
        });

        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) cartModal.classList.remove('open');
        });

        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Order placed successfully! Thank you for shopping with us 🎉');
            cart = [];
            saveCart();
            renderProducts();
            cartModal.classList.remove('open');
        });

        updateCartUI();
        renderProducts();
