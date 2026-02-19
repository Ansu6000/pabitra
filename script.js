document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // PRODUCT DATA
    // =========================================================
    const products = [
        { id: 1, name: 'Aura Minimalist Pendant', tag: 'Pendant', price: 249, img: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&q=80&w=600' },
        { id: 2, name: 'Orbital Glass Sconce', tag: 'Wall Sconce', price: 189, img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' },
        { id: 3, name: 'Nova Linear Chandelier', tag: 'Chandelier', price: 899, img: 'https://images.unsplash.com/photo-1543167653-e8220942c733?auto=format&fit=crop&q=80&w=600' },
        { id: 4, name: 'Zen Marble Base Lamp', tag: 'Table Lamp', price: 159, img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600' },
        { id: 5, name: 'Eclipse Arc Floor Lamp', tag: 'Floor Lamp', price: 329, img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0bc074?auto=format&fit=crop&q=80&w=600' },
        { id: 6, name: 'Lumina Directional Spot', tag: 'Spotlight', price: 129, img: 'https://images.unsplash.com/photo-1542728929-79730594326f?auto=format&fit=crop&q=80&w=600' },
    ];

    // =========================================================
    // CART STATE
    // =========================================================
    let cart = JSON.parse(localStorage.getItem('pabitraCart') || '[]');

    function saveCart() {
        localStorage.setItem('pabitraCart', JSON.stringify(cart));
    }

    function getCartItem(productId) {
        return cart.find(item => item.id === productId);
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        const existing = getCartItem(productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        saveCart();
        updateCartUI();
        showCartToast(product.name);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartUI();
    }

    function changeQty(productId, delta) {
        const item = getCartItem(productId);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(productId);
        else {
            saveCart();
            updateCartUI();
        }
    }

    function getTotalCount() {
        return cart.reduce((sum, item) => sum + item.qty, 0);
    }

    function getTotalPrice() {
        return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    }

    // =========================================================
    // CART UI
    // =========================================================
    const cartCount = document.querySelector('.cart-count');

    function updateCartUI() {
        // Badge
        const count = getTotalCount();
        cartCount.textContent = count;
        cartCount.style.display = count === 0 ? 'none' : 'flex';

        // Items list
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');
        const cartEmptyEl = document.getElementById('cart-empty');
        const cartFooter = document.querySelector('.cart-footer');

        if (!cartItemsEl) return;

        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartEmptyEl.style.display = 'flex';
            cartFooter.style.display = 'none';
        } else {
            cartEmptyEl.style.display = 'none';
            cartFooter.style.display = 'block';
            cart.forEach(item => {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        <div class="cart-qty-controls">
                            <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
                            <span class="qty-value">${item.qty}</span>
                            <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                        </div>
                    </div>
                    <button class="cart-remove-btn" data-id="${item.id}" title="Remove">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                cartItemsEl.appendChild(el);
            });

            // Qty control events
            cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    const delta = parseInt(btn.dataset.delta);
                    changeQty(id, delta);
                });
            });

            // Remove events
            cartItemsEl.querySelectorAll('.cart-remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.dataset.id);
                    removeFromCart(id);
                });
            });

            cartTotalEl.textContent = `$${getTotalPrice().toFixed(2)}`;
        }
    }

    // Cart Drawer Open/Close
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartIconLink = document.querySelector('.cart-icon');

    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (cartIconLink) {
        cartIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // =========================================================
    // TOAST NOTIFICATION
    // =========================================================
    function showCartToast(name) {
        const toast = document.getElementById('cart-toast');
        if (!toast) return;
        toast.querySelector('.toast-msg').textContent = `"${name}" added to cart!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // =========================================================
    // ADD TO CART BUTTONS
    // =========================================================
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-card');
            const productId = parseInt(card.dataset.productId);
            addToCart(productId);

            // Visual feedback on button
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.add('added');
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-plus"></i>';
                btn.classList.remove('added');
            }, 1200);
        });
    });

    // =========================================================
    // SEARCH OVERLAY
    // =========================================================
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchIconBtn = document.querySelector('.search-icon-btn');

    function openSearch() {
        searchOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 200);
    }

    function closeSearch() {
        searchOverlay.classList.remove('open');
        document.body.style.overflow = '';
        searchInput.value = '';
        searchResults.innerHTML = '';
    }

    if (searchIconBtn) searchIconBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    searchOverlay && searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSearch();
            closeCart();
            closeMobileMenu();
        }
    });

    // Live Search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            searchResults.innerHTML = '';

            if (query.length < 2) return;

            const matches = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.tag.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                searchResults.innerHTML = '<p class="no-results">No products found for "<strong>' + searchInput.value + '</strong>"</p>';
                return;
            }

            matches.forEach(p => {
                const el = document.createElement('div');
                el.className = 'search-result-item';
                el.innerHTML = `
                    <img src="${p.img}" alt="${p.name}" class="search-result-img">
                    <div class="search-result-info">
                        <p class="search-result-tag">${p.tag}</p>
                        <p class="search-result-name">${p.name}</p>
                        <p class="search-result-price">$${p.price.toFixed(2)}</p>
                    </div>
                    <button class="search-add-cart" data-id="${p.id}">
                        <i class="fas fa-shopping-bag"></i> Add
                    </button>
                `;
                el.querySelector('.search-add-cart').addEventListener('click', () => {
                    addToCart(p.id);
                    closeSearch();
                    openCart();
                });
                searchResults.appendChild(el);
            });
        });
    }

    // =========================================================
    // MOBILE MENU
    // =========================================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        mobileMenuOverlay.classList.add('open');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenuOverlay.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-nav-links a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // =========================================================
    // NAVBAR SCROLL
    // =========================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let current = '';
        document.querySelectorAll('section').forEach(section => {
            if (window.scrollY >= section.offsetTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // =========================================================
    // SMOOTH SCROLL
    // =========================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================================
    // REVEAL ANIMATIONS
    // =========================================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // =========================================================
    // NEWSLETTER FORM
    // =========================================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
            input.value = '';
            input.placeholder = 'Thank you for subscribing!';
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                btn.style.background = '';
                input.placeholder = 'Email address';
            }, 3000);
        });
    }

    // =========================================================
    // INIT
    // =========================================================
    updateCartUI();
});
