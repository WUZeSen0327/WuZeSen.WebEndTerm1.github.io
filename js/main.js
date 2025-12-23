// 模拟数据库 - 使用localStorage存储数据
const STORAGE_KEYS = {
    USERS: 'smartShopUsers',
    PRODUCTS: 'smartShopProducts',
    CART: 'smartShopCart',
    ORDERS: 'smartShopOrders',
    CURRENT_USER: 'smartShopCurrentUser'
};

// 初始化数据
function initData() {
    // 如果还没有用户数据，初始化默认用户
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            {
                id: 1,
                username: 'demo',
                email: 'demo@example.com',
                password: '123456',
                registerTime: '2023-10-01',
                level: '黄金会员'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    
    // 如果还没有商品数据，初始化默认商品
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        const defaultProducts = [
            {
                id: 1,
                name: '智能手机',
                description: '最新款智能手机，配备高清摄像头和大容量电池',
                price: 2999,
                category: 'electronics',
                image: 'images/products/product1.jpg',
                stock: 50,
                sales: 120
            },
            {
                id: 2,
                name: '无线蓝牙耳机',
                description: '降噪无线蓝牙耳机，续航时间长达30小时',
                price: 599,
                category: 'electronics',
                image: 'images/products/product2.jpg',
                stock: 100,
                sales: 85
            },
            {
                id: 3,
                name: '男士休闲衬衫',
                description: '纯棉男士休闲衬衫，舒适透气，多色可选',
                price: 199,
                category: 'clothing',
                image: 'images/products/product3.jpg',
                stock: 200,
                sales: 156
            },
            {
                id: 4,
                name: '女士连衣裙',
                description: '夏季新款女士连衣裙，优雅时尚',
                price: 399,
                category: 'clothing',
                image: 'images/products/product4.jpg',
                stock: 150,
                sales: 98
            },
            {
                id: 5,
                name: 'JavaScript高级程序设计',
                description: '前端开发经典书籍，深入讲解JavaScript',
                price: 89,
                category: 'books',
                image: 'images/products/product5.jpg',
                stock: 80,
                sales: 45
            },
            {
                id: 6,
                name: '智能台灯',
                description: '可调光智能台灯，支持手机APP控制',
                price: 159,
                category: 'home',
                image: 'images/products/product6.jpg',
                stock: 120,
                sales: 67
            },
            {
                id: 7,
                name: '运动跑步鞋',
                description: '轻便透气运动跑步鞋，适合多种运动场景',
                price: 499,
                category: 'sports',
                image: 'images/products/product7.jpg',
                stock: 90,
                sales: 78
            },
            {
                id: 8,
                name: '进口咖啡豆',
                description: '精选进口咖啡豆，口感浓郁醇厚',
                price: 129,
                category: 'food',
                image: 'images/products/product8.jpg',
                stock: 300,
                sales: 210
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
    }
    
    // 如果还没有购物车数据，初始化空购物车
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    
    // 如果还没有订单数据，初始化空订单
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
}

// 用户管理
class UserManager {
    static getUsers() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    }
    
    static getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }
    
    static getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }
    
    static addUser(user) {
        const users = this.getUsers();
        // 生成新用户ID
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        user.id = newId;
        user.registerTime = new Date().toISOString().split('T')[0];
        user.level = '普通会员';
        users.push(user);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return user;
    }
    
    static updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users[index] = {...users[index], ...updates};
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
            return users[index];
        }
        return null;
    }
    
    static setCurrentUser(user) {
        if (user) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    }
    
    static getCurrentUser() {
        const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return userJson ? JSON.parse(userJson) : null;
    }
    
    static logout() {
        this.setCurrentUser(null);
    }
}

// 商品管理
class ProductManager {
    static getProducts() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    }
    
    static getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id === id);
    }
    
    static getProductsByCategory(category) {
        const products = this.getProducts();
        if (category === 'all') return products;
        return products.filter(product => product.category === category);
    }
    
    static searchProducts(keyword) {
        const products = this.getProducts();
        const lowerKeyword = keyword.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(lowerKeyword) || 
            product.description.toLowerCase().includes(lowerKeyword)
        );
    }
}

// 购物车管理
class CartManager {
    static getCart() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
    }
    
    static addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const product = ProductManager.getProductById(productId);
        
        if (!product) {
            return { success: false, message: '商品不存在' };
        }
        
        const existingItem = cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // 如果商品已在购物车中，增加数量
            existingItem.quantity += quantity;
        } else {
            // 否则添加新商品到购物车
            cart.push({
                productId,
                quantity,
                addedTime: new Date().toISOString()
            });
        }
        
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        return { success: true, message: '已添加到购物车' };
    }
    
    static updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            if (quantity <= 0) {
                // 如果数量为0或负数，从购物车中移除
                this.removeFromCart(productId);
                return { success: true, message: '已更新购物车' };
            }
            
            item.quantity = quantity;
            localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
            return { success: true, message: '已更新购物车' };
        }
        
        return { success: false, message: '购物车中无此商品' };
    }
    
    static removeFromCart(productId) {
        const cart = this.getCart();
        const newCart = cart.filter(item => item.productId !== productId);
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(newCart));
        return { success: true, message: '已从购物车移除' };
    }
    
    static clearCart() {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
    
    static getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    static getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => {
            const product = ProductManager.getProductById(item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    }
    
    static getCartItemsWithDetails() {
        const cart = this.getCart();
        return cart.map(item => {
            const product = ProductManager.getProductById(item.productId);
            return {
                ...item,
                product: product || null
            };
        }).filter(item => item.product !== null);
    }
}

// 订单管理
class OrderManager {
    static getOrders() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    }
    
    static createOrder(cartItems, shippingAddress, totalAmount) {
        const orders = this.getOrders();
        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        const currentUser = UserManager.getCurrentUser();
        
        const order = {
            id: newId,
            userId: currentUser ? currentUser.id : null,
            items: cartItems.map(item => ({
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                price: item.product.price
            })),
            shippingAddress,
            totalAmount,
            status: 'pending',
            orderTime: new Date().toISOString()
        };
        
        orders.push(order);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        
        // 清空购物车
        CartManager.clearCart();
        
        return order;
    }
    
    static getUserOrders(userId) {
        const orders = this.getOrders();
        return orders.filter(order => order.userId === userId);
    }
}

// DOM元素引用
const dom = {
    // 导航
    navLinks: document.querySelectorAll('.nav-link'),
    pages: document.querySelectorAll('.page'),
    
    // 用户相关
    userName: document.getElementById('userName'),
    currentUserName: document.getElementById('currentUserName'),
    authModal: document.getElementById('authModal'),
    authModalClose: document.getElementById('authModalClose'),
    authTabs: document.querySelectorAll('.auth-tab'),
    authForms: document.querySelectorAll('.auth-form'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // 商品相关
    productGrid: document.getElementById('productGrid'),
    allProductsGrid: document.getElementById('allProductsGrid'),
    categoryItems: document.querySelectorAll('.category-item'),
    filterButtons: document.querySelectorAll('.product-filter .btn'),
    
    // 购物车相关
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    cartModal: document.getElementById('cartModal'),
    cartModalClose: document.getElementById('cartModalClose'),
    cartItems: document.getElementById('cartItems'),
    cartTotalItems: document.getElementById('cartTotalItems'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartShipping: document.getElementById('cartShipping'),
    cartTotal: document.getElementById('cartTotal'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // 商品详情
    productDetailModal: document.getElementById('productDetailModal'),
    productDetailModalClose: document.getElementById('productDetailModalClose'),
    productDetailContent: document.getElementById('productDetailContent'),
    
    // 搜索
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    
    // 个人中心
    userMenuLinks: document.querySelectorAll('.user-menu-link'),
    userSections: document.querySelectorAll('.user-section'),
    profileUsername: document.getElementById('profileUsername'),
    profileEmail: document.getElementById('profileEmail'),
    profileRegisterTime: document.getElementById('profileRegisterTime'),
    profileLevel: document.getElementById('profileLevel'),
    orderHistory: document.getElementById('orderHistory'),
    addressList: document.getElementById('addressList'),
    addAddressBtn: document.getElementById('addAddressBtn'),
    changePasswordBtn: document.getElementById('changePasswordBtn'),
    
    // 轮播图
    carouselSlides: document.querySelectorAll('.carousel-slide'),
    carouselDots: document.querySelectorAll('.carousel-dot')
};

// 应用状态
const state = {
    currentUser: null,
    currentPage: 'home',
    currentFilter: 'all',
    currentSlide: 0,
    slideInterval: null
};

// 初始化应用
function initApp() {
    // 初始化数据
    initData();
    
    // 设置当前用户
    state.currentUser = UserManager.getCurrentUser();
    updateUserDisplay();
    
    // 初始化轮播图
    initCarousel();
    
    // 加载商品
    loadProducts();
    loadAllProducts();
    
    // 更新购物车显示
    updateCartDisplay();
    
    // 绑定事件监听器
    bindEvents();
    
    // 如果用户已登录，加载个人中心数据
    if (state.currentUser) {
        loadUserProfile();
        loadUserOrders();
        loadUserAddresses();
    }
}

// 初始化轮播图
function initCarousel() {
    // 自动轮播
    state.slideInterval = setInterval(nextSlide, 5000);
    
    // 点击指示点切换
    dom.carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

// 轮播图控制
function nextSlide() {
    state.currentSlide = (state.currentSlide + 1) % dom.carouselSlides.length;
    updateCarousel();
}

function goToSlide(index) {
    state.currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    // 更新幻灯片
    dom.carouselSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === state.currentSlide);
    });
    
    // 更新指示点
    dom.carouselDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === state.currentSlide);
    });
    
    // 重置自动轮播计时器
    clearInterval(state.slideInterval);
    state.slideInterval = setInterval(nextSlide, 5000);
}

// 加载商品到首页
function loadProducts() {
    const products = ProductManager.getProducts();
    // 取前6个商品作为推荐
    const featuredProducts = products.slice(0, 6);
    
    dom.productGrid.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        dom.productGrid.appendChild(productCard);
    });
}

// 加载所有商品到商品中心
function loadAllProducts(filter = 'all') {
    const products = filter === 'all' 
        ? ProductManager.getProducts() 
        : ProductManager.getProductsByCategory(filter);
    
    dom.allProductsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        dom.allProductsGrid.appendChild(productCard);
    });
}

// 创建商品卡片
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">¥${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> 加入购物车
                </button>
                <button class="btn btn-outline view-detail-btn" data-product-id="${product.id}">
                    查看详情
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 更新购物车显示
function updateCartDisplay() {
    const cartCount = CartManager.getCartCount();
    dom.cartCount.textContent = cartCount;
    
    // 更新购物车模态框内容
    updateCartModal();
}

// 更新购物车模态框
function updateCartModal() {
    const cartItems = CartManager.getCartItemsWithDetails();
    
    dom.cartItems.innerHTML = '';
    
    if (cartItems.length === 0) {
        dom.cartItems.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">购物车空空如也</div>';
        dom.cartTotalItems.textContent = '0';
        dom.cartSubtotal.textContent = '¥0.00';
        dom.cartShipping.textContent = '¥0.00';
        dom.cartTotal.textContent = '¥0.00';
        dom.checkoutBtn.disabled = true;
        return;
    }
    
    // 计算购物车总计
    const subtotal = CartManager.getCartTotal();
    const shipping = subtotal > 0 ? (subtotal > 99 ? 0 : 10) : 0;
    const total = subtotal + shipping;
    
    dom.cartTotalItems.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    dom.cartSubtotal.textContent = `¥${subtotal.toFixed(2)}`;
    dom.cartShipping.textContent = `¥${shipping.toFixed(2)}`;
    dom.cartTotal.textContent = `¥${total.toFixed(2)}`;
    dom.checkoutBtn.disabled = false;
    
    // 添加购物车商品
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.product.image}" alt="${item.product.name}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.product.name}</div>
                <div class="cart-item-price">¥${item.product.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn minus-btn" data-product-id="${item.productId}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn plus-btn" data-product-id="${item.productId}">+</button>
                </div>
                <button class="remove-item" data-product-id="${item.productId}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        dom.cartItems.appendChild(cartItemElement);
    });
    
    // 绑定购物车商品事件
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const cartItem = CartManager.getCartItemsWithDetails().find(item => item.productId === productId);
            if (cartItem) {
                CartManager.updateQuantity(productId, cartItem.quantity - 1);
                updateCartDisplay();
            }
        });
    });
    
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const cartItem = CartManager.getCartItemsWithDetails().find(item => item.productId === productId);
            if (cartItem) {
                CartManager.updateQuantity(productId, cartItem.quantity + 1);
                updateCartDisplay();
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            CartManager.removeFromCart(productId);
            updateCartDisplay();
        });
    });
}

// 显示商品详情
function showProductDetail(productId) {
    const product = ProductManager.getProductById(productId);
    if (!product) return;
    
    // 获取分类名称
    const categoryNames = {
        electronics: '电子产品',
        clothing: '服装服饰',
        books: '图书音像',
        home: '家居生活',
        sports: '运动户外',
        food: '食品饮料'
    };
    
    dom.productDetailContent.innerHTML = `
        <div class="product-detail-container">
            <div class="product-detail-main">
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <div class="product-detail-price">
                        ¥${product.price.toFixed(2)}
                    </div>
                    <div class="product-detail-category">
                        <span>${categoryNames[product.category] || product.category}</span>
                    </div>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-stats">
                        <div class="stat-item">
                            <div class="stat-label">库存</div>
                            <div class="stat-value">${product.stock} 件</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">销量</div>
                            <div class="stat-value">${product.sales} 件</div>
                        </div>
                    </div>
                    <button class="btn btn-primary product-detail-add-cart" id="addToCartFromDetail" data-product-id="${productId}">
                        <i class="fas fa-cart-plus"></i> 加入购物车
                    </button>
                </div>
            </div>
            <div class="product-detail-extra">
                <h3>商品详情</h3>
                <p>这是一款优质的商品，具有良好的用户评价。购买后享受7天无理由退货服务，30天质量保证。如有任何问题，请联系我们的客服人员。</p>
            </div>
        </div>
    `;
    
    // 绑定添加到购物车按钮事件
    document.getElementById('addToCartFromDetail').addEventListener('click', function() {
        const productId = parseInt(this.dataset.productId);
        const result = CartManager.addToCart(productId, 1);
        alert(result.message);
        updateCartDisplay();
        dom.productDetailModal.classList.remove('active');
    });
    
    // 显示模态框
    dom.productDetailModal.classList.add('active');
}

// 更新用户显示
function updateUserDisplay() {
    if (state.currentUser) {
        dom.userName.textContent = `欢迎回来，${state.currentUser.username}`;
        dom.currentUserName.textContent = state.currentUser.username;
        
        // 隐藏登录提示，显示用户信息
        document.querySelector('.user-info span').style.fontWeight = '600';
    } else {
        dom.userName.textContent = '欢迎来到智能购物商城';
        dom.currentUserName.textContent = '未登录用户';
        
        // 添加登录提示
        const loginHint = document.createElement('span');
        loginHint.textContent = '请登录';
        loginHint.style.color = 'var(--primary-color)';
        loginHint.style.cursor = 'pointer';
        loginHint.style.marginLeft = '10px';
        loginHint.addEventListener('click', () => {
            dom.authModal.classList.add('active');
        });
        
        // 如果已经存在登录提示，先移除
        const existingHint = document.querySelector('.login-hint');
        if (existingHint) {
            existingHint.remove();
        }
        
        loginHint.className = 'login-hint';
        dom.userName.appendChild(loginHint);
    }
}

// 加载用户个人信息
function loadUserProfile() {
    if (!state.currentUser) return;
    
    dom.profileUsername.value = state.currentUser.username;
    dom.profileEmail.value = state.currentUser.email;
    dom.profileRegisterTime.value = state.currentUser.registerTime;
    dom.profileLevel.value = state.currentUser.level;
}

// 加载用户订单
function loadUserOrders() {
    if (!state.currentUser) return;
    
    const userOrders = OrderManager.getUserOrders(state.currentUser.id);
    dom.orderHistory.innerHTML = '';
    
    if (userOrders.length === 0) {
        dom.orderHistory.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">暂无订单</div>';
        return;
    }
    
    userOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        
        const statusClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
        const statusText = order.status === 'completed' ? '已完成' : '待处理';
        
        orderElement.innerHTML = `
            <div class="order-header">
                <div>
                    <strong>订单号：</strong> ${order.id.toString().padStart(6, '0')}
                </div>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            <div style="margin-bottom: 10px;">
                <strong>订单时间：</strong> ${order.orderTime.split('T')[0]}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>商品数量：</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)} 件
            </div>
            <div>
                <strong>订单总额：</strong> <span style="color: var(--primary-color); font-weight: 700;">¥${order.totalAmount.toFixed(2)}</span>
            </div>
        `;
        
        dom.orderHistory.appendChild(orderElement);
    });
}

// 加载用户地址
function loadUserAddresses() {
    // 模拟地址数据
    const addresses = [
        {
            id: 1,
            name: '张三',
            phone: '13800138000',
            address: '北京市海淀区中关村大街1号',
            isDefault: true
        },
        {
            id: 2,
            name: '张三',
            phone: '13800138001',
            address: '上海市浦东新区张江高科技园区',
            isDefault: false
        }
    ];
    
    dom.addressList.innerHTML = '';
    
    addresses.forEach(address => {
        const addressElement = document.createElement('div');
        addressElement.className = 'order-item';
        addressElement.style.marginBottom = '15px';
        
        addressElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div style="font-weight: 600; margin-bottom: 5px;">${address.name}</div>
                    <div style="color: #666; margin-bottom: 5px;">${address.phone}</div>
                    <div style="color: #666;">${address.address}</div>
                </div>
                <div>
                    ${address.isDefault ? '<span style="background-color: var(--primary-color); color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">默认</span>' : ''}
                </div>
            </div>
        `;
        
        dom.addressList.appendChild(addressElement);
    });
}

// 表单验证
function validateLoginForm() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    let isValid = true;
    
    // 清除之前的错误信息
    document.getElementById('loginUsernameError').style.display = 'none';
    document.getElementById('loginPasswordError').style.display = 'none';
    
    // 验证用户名
    if (!username) {
        document.getElementById('loginUsernameError').textContent = '用户名不能为空';
        document.getElementById('loginUsernameError').style.display = 'block';
        isValid = false;
    }
    
    // 验证密码
    if (!password) {
        document.getElementById('loginPasswordError').textContent = '密码不能为空';
        document.getElementById('loginPasswordError').style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

function validateRegisterForm() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
    let isValid = true;
    
    // 清除之前的错误信息
    document.getElementById('registerUsernameError').style.display = 'none';
    document.getElementById('registerEmailError').style.display = 'none';
    document.getElementById('registerPasswordError').style.display = 'none';
    document.getElementById('registerConfirmPasswordError').style.display = 'none';
    
    // 验证用户名
    if (!username) {
        document.getElementById('registerUsernameError').textContent = '用户名不能为空';
        document.getElementById('registerUsernameError').style.display = 'block';
        isValid = false;
    } else if (username.length < 3 || username.length > 10) {
        document.getElementById('registerUsernameError').textContent = '用户名长度应为3-10位字符';
        document.getElementById('registerUsernameError').style.display = 'block';
        isValid = false;
    } else if (UserManager.getUserByUsername(username)) {
        document.getElementById('registerUsernameError').textContent = '用户名已存在';
        document.getElementById('registerUsernameError').style.display = 'block';
        isValid = false;
    }
    
    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        document.getElementById('registerEmailError').textContent = '邮箱不能为空';
        document.getElementById('registerEmailError').style.display = 'block';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('registerEmailError').textContent = '邮箱格式不正确';
        document.getElementById('registerEmailError').style.display = 'block';
        isValid = false;
    }
    
    // 验证密码
    if (!password) {
        document.getElementById('registerPasswordError').textContent = '密码不能为空';
        document.getElementById('registerPasswordError').style.display = 'block';
        isValid = false;
    } else if (password.length < 6 || password.length > 12) {
        document.getElementById('registerPasswordError').textContent = '密码长度应为6-12位字符';
        document.getElementById('registerPasswordError').style.display = 'block';
        isValid = false;
    }
    
    // 验证确认密码
    if (!confirmPassword) {
        document.getElementById('registerConfirmPasswordError').textContent = '确认密码不能为空';
        document.getElementById('registerConfirmPasswordError').style.display = 'block';
        isValid = false;
    } else if (password !== confirmPassword) {
        document.getElementById('registerConfirmPasswordError').textContent = '两次输入的密码不一致';
        document.getElementById('registerConfirmPasswordError').style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// 切换页面
function switchPage(pageId) {
    // 更新导航活动状态
    dom.navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
    
    // 切换页面显示
    dom.pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });
    
    state.currentPage = pageId;
    
    // 如果是个人中心页面且用户未登录，显示登录模态框
    if (pageId === 'user-center' && !state.currentUser) {
        dom.authModal.classList.add('active');
        // 切换回首页
        switchPage('home');
    }
}

// 绑定事件监听器
function bindEvents() {
    // 导航链接点击事件
    dom.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            switchPage(pageId);
        });
    });
    
    // 用户菜单链接点击事件
    dom.userMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            
            // 更新活动状态
            dom.userMenuLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // 切换显示内容
            dom.userSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${sectionId}Section`).classList.add('active');
        });
    });
    
    // 登录表单提交
    dom.loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateLoginForm()) return;
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        
        const user = UserManager.getUserByUsername(username);
        
        if (user && user.password === password) {
            // 登录成功
            UserManager.setCurrentUser(user);
            state.currentUser = user;
            updateUserDisplay();
            loadUserProfile();
            loadUserOrders();
            loadUserAddresses();
            
            // 关闭登录模态框
            dom.authModal.classList.remove('active');
            
            // 清空表单
            this.reset();
            
            alert('登录成功！');
        } else {
            // 登录失败
            document.getElementById('loginPasswordError').textContent = '用户名或密码错误';
            document.getElementById('loginPasswordError').style.display = 'block';
        }
    });
    
    // 注册表单提交
    dom.registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateRegisterForm()) return;
        
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        
        const newUser = {
            username,
            email,
            password
        };
        
        const addedUser = UserManager.addUser(newUser);
        UserManager.setCurrentUser(addedUser);
        state.currentUser = addedUser;
        updateUserDisplay();
        loadUserProfile();
        loadUserOrders();
        loadUserAddresses();
        
        // 关闭注册模态框
        dom.authModal.classList.remove('active');
        
        // 清空表单
        this.reset();
        
        // 切换到登录标签
        dom.authTabs.forEach(tab => tab.classList.remove('active'));
        dom.authForms.forEach(form => form.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
        
        alert('注册成功！已自动登录。');
    });
    
    // 登录/注册标签切换
    dom.authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // 更新活动标签
            dom.authTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 切换表单
            dom.authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tabId}Form`).classList.add('active');
        });
    });
    
    // 关闭模态框
    dom.authModalClose.addEventListener('click', () => {
        dom.authModal.classList.remove('active');
    });
    
    dom.cartModalClose.addEventListener('click', () => {
        dom.cartModal.classList.remove('active');
    });
    
    dom.productDetailModalClose.addEventListener('click', () => {
        dom.productDetailModal.classList.remove('active');
    });
    
    // 点击模态框背景关闭
    [dom.authModal, dom.cartModal, dom.productDetailModal].forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // 购物车图标点击
    dom.cartIcon.addEventListener('click', () => {
        dom.cartModal.classList.add('active');
    });
    
    // 搜索功能
    dom.searchBtn.addEventListener('click', searchProducts);
    dom.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });
    
    // 分类点击
    dom.categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            switchPage('products');
            
            // 激活对应的筛选按钮
            dom.filterButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === category);
            });
            
            state.currentFilter = category;
            loadAllProducts(category);
        });
    });
    
    // 商品筛选
    dom.filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // 更新活动按钮
            dom.filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            state.currentFilter = filter;
            loadAllProducts(filter);
        });
    });
    
    // 退出登录
    dom.logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        UserManager.logout();
        state.currentUser = null;
        updateUserDisplay();
        switchPage('home');
        alert('已退出登录');
    });
    
    // 结算按钮
    dom.checkoutBtn.addEventListener('click', function() {
        if (!state.currentUser) {
            alert('请先登录后再结算');
            dom.authModal.classList.add('active');
            dom.cartModal.classList.remove('active');
            return;
        }
        
        const cartItems = CartManager.getCartItemsWithDetails();
        if (cartItems.length === 0) {
            alert('购物车为空，无法结算');
            return;
        }
        
        // 创建订单
        const totalAmount = CartManager.getCartTotal();
        const shippingAddress = "北京市海淀区中关村大街1号"; // 这里应该使用用户选择的地址
        const order = OrderManager.createOrder(cartItems, shippingAddress, totalAmount);
        
        // 关闭购物车模态框
        dom.cartModal.classList.remove('active');
        
        // 更新购物车显示
        updateCartDisplay();
        
        // 更新订单历史
        loadUserOrders();
        
        alert(`订单创建成功！订单号：${order.id.toString().padStart(6, '0')}`);
    });
    
    // 添加地址按钮
    dom.addAddressBtn.addEventListener('click', function() {
        alert('添加地址功能（模拟）');
    });
    
    // 修改密码按钮
    dom.changePasswordBtn.addEventListener('click', function() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (!newPassword || !confirmPassword) {
            alert('请填写完整信息');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        // 模拟修改密码
        alert('密码修改成功（模拟）');
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    });
    
    // 委托事件处理：商品添加到购物车
    document.addEventListener('click', function(e) {
        // 添加到购物车按钮
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = parseInt(e.target.closest('.add-to-cart-btn').dataset.productId);
            const result = CartManager.addToCart(productId, 1);
            alert(result.message);
            updateCartDisplay();
        }
        
        // 查看详情按钮
        if (e.target.closest('.view-detail-btn')) {
            const productId = parseInt(e.target.closest('.view-detail-btn').dataset.productId);
            showProductDetail(productId);
        }
        
        // 商品图片点击（跳转到详情）
        if (e.target.closest('.product-image img')) {
            const productId = parseInt(e.target.closest('.product-card').dataset.productId);
            showProductDetail(productId);
        }
    });
}

// 搜索商品
function searchProducts() {
    const keyword = dom.searchInput.value.trim();
    
    if (!keyword) {
        alert('请输入搜索关键词');
        return;
    }
    
    const results = ProductManager.searchProducts(keyword);
    
    if (results.length === 0) {
        alert(`未找到与"${keyword}"相关的商品`);
        return;
    }
    
    // 切换到商品中心页面
    switchPage('products');
    
    // 显示搜索结果
    dom.allProductsGrid.innerHTML = '';
    
    results.forEach(product => {
        const productCard = createProductCard(product);
        dom.allProductsGrid.appendChild(productCard);
    });
    
    // 更新筛选按钮状态
    dom.filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    dom.filterButtons[0].classList.add('active');
    
    state.currentFilter = 'all';
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);