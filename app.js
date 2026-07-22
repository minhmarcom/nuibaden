/* 
   SUN WORLD BA DEN MOUNTAIN CABLE CAR TICKET BOOKING LANDING PAGE
   Author: Antigravity AI Pair Programmer
   Scripts: Interactive Booking, Lightbox, Tabs, and Carousel
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. STICKY HEADER & MOBILE MENU
    // ==========================================
    const header = document.querySelector('header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Active menu link on scroll
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
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

    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close menu when link clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    });


    // ==========================================
    // 2. INTERACTIVE ROUTES TABS
    // ==========================================
    const tabButtons = document.querySelectorAll('.routes-tab-btn');
    const tabPanes = document.querySelectorAll('.routes-tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRoute = btn.getAttribute('data-route');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`route-${targetRoute}`).classList.add('active');
        });
    });


    // ==========================================
    // 3. BOOKING WIZARD SYSTEM
    // ==========================================
    
    // Ticket Prices Definition
    const PRICES = {
        // Standard Basic Prices
        'cong':   { adult: 10000, child: 5000, label: 'Vé Cổng KDL' },
        'buffet': { adult: 300000, child: 200000, label: 'Vé Buffet Vân Sơn lẻ' },
        'food':   { adult: 150000, child: 150000, label: 'Vé Ẩm Thực' },
        'dinh':   { adult: 450000, child: 350000, label: 'Vé Đỉnh Vân Sơn' },
        'chua':   { adult: 250000, child: 150000, label: 'Vé Chùa Hang' },
        'chua1c': { adult: 150000, child: 100000, label: 'Vé Chùa Hang 1 chiều' },
        'taman':  { adult: 450000, child: 350000, label: 'Vé Tuyến Cáp Tâm An' },
        'combo':  { adult: 650000, child: 500000, label: 'Vé Combo Đỉnh + Chùa' },
        'dinh_food_night': { adult: 400000, child: 300000, label: 'Combo Hoàng Hôn Đỉnh + Ẩm Thực 17h' },
        'combo_food_night': { adult: 500000, child: 400000, label: 'Combo Hoàng Hôn Đỉnh + Chùa + Ẩm Thực 17h' },
        
        // Standard Buffet Combos (Weekday vs Weekend pricing)
        'dinh_buffet': {
            weekday: { adult: 650000, child: 450000 },
            weekend: { adult: 700000, child: 500000 },
            label: 'Combo Đỉnh Vân Sơn + Buffet'
        },
        'combo_buffet': {
            weekday: { adult: 800000, child: 600000 },
            weekend: { adult: 850000, child: 650000 },
            label: 'Combo Đỉnh + Chùa + Buffet'
        },
        
        // Local Resident (Tây Ninh) Prices
        'dinh_tn': { adult: 400000, child: 300000, label: 'Vé Tây Ninh Đỉnh Vân Sơn' },
        'chua_tn': { adult: 200000, child: 120000, label: 'Vé Tây Ninh Chùa Hang' },
        'taman_tn': { adult: 400000, child: 300000, label: 'Vé Tây Ninh Tuyến Tâm An' },
        'combo_tn': { adult: 600000, child: 400000, label: 'Combo Tây Ninh Đỉnh + Chùa' }
    };
    
    // Night Price discounts (Applied after 17:00 check)
    const NIGHT_PRICES = {
        'dinh':  { adult: 300000, child: 200000 },
        'chua':  { adult: 150000, child: 100000 },
        'taman': { adult: 300000, child: 200000 },
        'combo': { adult: 400000, child: 300000 }
    };

    // Category mappings for dropdown options
    const ROUTES_BY_CATEGORY = {
        'standard': [
            { value: 'dinh', text: 'Tuyến Đỉnh Vân Sơn (Khứ hồi) - 450k/350k' },
            { value: 'chua', text: 'Tuyến Chùa Hang (Khứ hồi) - 250k/150k' },
            { value: 'combo', text: 'Combo Đỉnh Vân Sơn + Chùa Hang (Khứ hồi) - 650k/500k' },
            { value: 'taman', text: 'Tuyến Cáp Tâm An (Khứ hồi) - 450k/350k' },
            { value: 'chua1c', text: 'Tuyến Chùa Hang (1 chiều) - 150k/100k' },
            { value: 'dinh_buffet', text: 'Combo Đỉnh Vân Sơn + Buffet - Từ 650k' },
            { value: 'combo_buffet', text: 'Combo Đỉnh + Chùa + Buffet - Từ 800k' },
            { value: 'dinh_food_night', text: 'Combo Hoàng Hôn Đỉnh + Ẩm Thực 17h - 400k/300k' },
            { value: 'combo_food_night', text: 'Combo Hoàng Hôn Đỉnh + Chùa + Ẩm Thực 17h - 500k/400k' },
            { value: 'buffet', text: 'Vé Buffet Vân Sơn lẻ - 300k/200k' },
            { value: 'food', text: 'Vé Ẩm Thực - 150k' },
            { value: 'cong', text: 'Vé cổng Khu du lịch - 10k/5k' }
        ],
        'local': [
            { value: 'dinh_tn', text: 'Vé Tây Ninh Đỉnh Vân Sơn (Khứ hồi) - 400k/300k' },
            { value: 'chua_tn', text: 'Vé Tây Ninh Chùa Hang (Khứ hồi) - 200k/120k' },
            { value: 'taman_tn', text: 'Vé Tây Ninh Tuyến Tâm An (Khứ hồi) - 400k/300k' },
            { value: 'combo_tn', text: 'Combo Tây Ninh Đỉnh + Chùa (Khứ hồi) - 600k/400k' }
        ]
    };

    const ROUTE_LABELS = {
        'cong': 'Vé cổng Khu du lịch',
        'buffet': 'Vé Buffet Vân Sơn lẻ',
        'dinh': 'Tuyến Đỉnh Vân Sơn (Khứ hồi)',
        'chua': 'Tuyến Chùa Hang (Khứ hồi)',
        'chua1c': 'Tuyến Chùa Hang (1 chiều)',
        'taman': 'Tuyến Cáp Tâm An (Khứ hồi)',
        'combo': 'Combo Đỉnh Vân Sơn + Chùa Hang (Khứ hồi)',
        'dinh_buffet': 'Combo Đỉnh Vân Sơn + Buffet',
        'combo_buffet': 'Combo Đỉnh + Chùa + Buffet',
        'dinh_food_night': 'Combo Hoàng Hôn Đỉnh Vân Sơn + Ẩm Thực 17h',
        'combo_food_night': 'Combo Hoàng Hôn Đỉnh + Chùa Hang + Ẩm Thực 17h',
        'food': 'Vé Ẩm Thực',
        'dinh_tn': 'Vé Tây Ninh Đỉnh Vân Sơn (Khứ hồi)',
        'chua_tn': 'Vé Tây Ninh Chùa Hang (Khứ hồi)',
        'taman_tn': 'Vé Tây Ninh Tuyến Tâm An (Khứ hồi)',
        'combo_tn': 'Combo Tây Ninh Đỉnh + Chùa (Khứ hồi)'
    };

    const CUSTOMER_TYPES = {
        standard_adult: { category: 'standard', age: 'adult', label: 'Khách du lịch - Người lớn' },
        standard_child: { category: 'standard', age: 'child', label: 'Khách du lịch - Trẻ em' },
        local_adult: { category: 'local', age: 'adult', label: 'Người Tây Ninh - Người lớn' },
        local_child: { category: 'local', age: 'child', label: 'Người Tây Ninh - Trẻ em' }
    };
    const NIGHT_ROUTES = ['dinh', 'chua', 'taman', 'combo'];
    const dateInput = document.getElementById('wizard-date');
    const ticketItemsList = document.getElementById('ticket-items-list');
    const addTicketItemBtn = document.getElementById('btn-add-ticket-item');
    const resetCalculatorBtn = document.getElementById('btn-reset-calculator');
    const summaryDateText = document.getElementById('summary-date');
    const summaryTicketItems = document.getElementById('summary-ticket-items');
    const summaryTotalText = document.getElementById('summary-total-price');
    const btnZaloBooking = document.getElementById('btn-zalo-booking');
    const today = new Date().toISOString().split('T')[0];
    let nextTicketItemId = 1;
    let bookingData = { date: today, items: [], totalPrice: 0 };

    function formatVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }
    function getRoutesForItem(item) {
        const type = CUSTOMER_TYPES[item.customerType];
        return ROUTES_BY_CATEGORY[type.category] || ROUTES_BY_CATEGORY.standard;
    }

    function createTicketItem(route = 'dinh', customerType = 'standard_adult') {
        const item = { id: nextTicketItemId++, customerType, route, time: 'day', quantity: 1, wowPass: false, unitPrice: 0, lineTotal: 0 };
        const routes = getRoutesForItem(item);
        if (!routes.some(option => option.value === route)) item.route = routes[0].value;
        return item;
    }

    function getUnitPrice(item) {
        const customer = CUSTOMER_TYPES[item.customerType];
        if (!customer) return 0;
        if (customer.category === 'standard' && item.time === 'night' && NIGHT_PRICES[item.route]) {
            return NIGHT_PRICES[item.route][customer.age];
        }
        const priceSet = PRICES[item.route];
        if (!priceSet) return 0;
        if (priceSet.weekday && priceSet.weekend) {
            const d = new Date(`${bookingData.date}T00:00:00`);
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            return (isWeekend ? priceSet.weekend : priceSet.weekday)[customer.age];
        }
        return priceSet[customer.age] || 0;
    }

    function customerOptions(selected) {
        return Object.entries(CUSTOMER_TYPES).map(([value, type]) =>
            `<option value="${value}"${value === selected ? ' selected' : ''}>${type.label}</option>`
        ).join('');
    }

    function routeOptions(item) {
        return getRoutesForItem(item).map(route =>
            `<option value="${route.value}"${route.value === item.route ? ' selected' : ''}>${route.text.replace(/ - .+$/, '')}</option>`
        ).join('');
    }

    function renderTicketItems() {
        if (!ticketItemsList) return;
        ticketItemsList.innerHTML = bookingData.items.map((item, index) => {
            const canUseNight = CUSTOMER_TYPES[item.customerType].category === 'standard' && NIGHT_ROUTES.includes(item.route);
            if (!canUseNight) item.time = 'day';
            return `<article class="ticket-line-item" data-item-id="${item.id}">
                <div class="ticket-line-heading">
                    <strong>Hạng mục ${index + 1}</strong>
                    <button type="button" class="remove-ticket-item-btn" data-action="remove" title="Loại bỏ hạng mục ${index + 1}" aria-label="Loại bỏ hạng mục ${index + 1}">
                        <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="ticket-line-grid">
                    <label><span>Đối tượng</span><select class="wizard-select" data-field="customerType">${customerOptions(item.customerType)}</select></label>
                    <label><span>Tuyến / dịch vụ</span><select class="wizard-select" data-field="route">${routeOptions(item)}</select></label>
                    <label><span>Khung giờ</span><select class="wizard-select" data-field="time"${canUseNight ? '' : ' disabled'}>
                        <option value="day"${item.time === 'day' ? ' selected' : ''}>Vé ngày</option>
                        ${canUseNight ? `<option value="night"${item.time === 'night' ? ' selected' : ''}>Sau 17h</option>` : ''}
                    </select></label>
                    <div class="ticket-line-quantity"><span>Số lượng</span><div class="counter-controls">
                        <button type="button" class="btn-counter" data-action="minus"${item.quantity <= 1 ? ' disabled' : ''} aria-label="Giảm số lượng"><i class="fa-solid fa-minus"></i></button>
                        <span class="counter-value">${item.quantity}</span>
                        <button type="button" class="btn-counter" data-action="plus" aria-label="Tăng số lượng"><i class="fa-solid fa-plus"></i></button>
                    </div></div>
                </div>
                <div class="ticket-line-footer">
                    <label class="ticket-wowpass-option"><input type="checkbox" data-field="wowPass"${item.wowPass ? ' checked' : ''}><span><i class="fa-solid fa-star" aria-hidden="true"></i> WOW PASS +300.000đ/vé</span></label>
                    <strong class="ticket-line-price">${formatVND(item.lineTotal)}</strong>
                </div>
            </article>`;
        }).join('');
    }

    function formatBookingDate() {
        const d = new Date(`${bookingData.date}T00:00:00`);
        return Number.isNaN(d.getTime()) ? bookingData.date : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    }

    function calculateTotal(renderItems = true) {
        bookingData.totalPrice = 0;
        bookingData.items.forEach(item => {
            item.unitPrice = getUnitPrice(item);
            item.lineTotal = item.quantity * (item.unitPrice + (item.wowPass ? 300000 : 0));
            bookingData.totalPrice += item.lineTotal;
        });
        if (renderItems) renderTicketItems();
        if (summaryDateText) summaryDateText.textContent = formatBookingDate();
        if (summaryTicketItems) {
            summaryTicketItems.innerHTML = bookingData.items.map((item, index) => {
                const type = CUSTOMER_TYPES[item.customerType];
                const timeLabel = item.time === 'night' ? 'Sau 17h' : 'Vé ngày';
                return `<div class="summary-ticket-line">
                    <div><strong>${index + 1}. ${ROUTE_LABELS[item.route] || 'Vé cáp treo'}</strong><span>${type.label} · ${timeLabel}${item.wowPass ? ' · WOW PASS' : ''}</span></div>
                    <span>${item.quantity} x ${formatVND(item.unitPrice + (item.wowPass ? 300000 : 0))}</span>
                </div>`;
            }).join('');
        }
        if (summaryTotalText) summaryTotalText.textContent = formatVND(bookingData.totalPrice);
    }

    function resetCalculator(route = 'dinh') {
        bookingData.items = [createTicketItem(route)];
        bookingData.date = today;
        if (dateInput) dateInput.value = today;
        calculateTotal();
    }

    if (dateInput) {
        dateInput.value = today;
        dateInput.min = today;
        dateInput.addEventListener('change', event => {
            bookingData.date = event.target.value || today;
            calculateTotal();
        });
    }
    if (addTicketItemBtn) addTicketItemBtn.addEventListener('click', () => {
        bookingData.items.push(createTicketItem());
        calculateTotal();
    });
    if (resetCalculatorBtn) resetCalculatorBtn.addEventListener('click', () => resetCalculator());
    if (ticketItemsList) {
        ticketItemsList.addEventListener('change', event => {
            const card = event.target.closest('[data-item-id]');
            const item = card && bookingData.items.find(entry => entry.id === Number(card.dataset.itemId));
            if (!item || !event.target.dataset.field) return;
            const field = event.target.dataset.field;
            item[field] = field === 'wowPass' ? event.target.checked : event.target.value;
            if (field === 'customerType') {
                const routes = getRoutesForItem(item);
                if (!routes.some(route => route.value === item.route)) item.route = routes[0].value;
            }
            calculateTotal();
        });
        ticketItemsList.addEventListener('click', event => {
            const button = event.target.closest('[data-action]');
            const card = event.target.closest('[data-item-id]');
            if (!button || !card) return;
            const itemIndex = bookingData.items.findIndex(entry => entry.id === Number(card.dataset.itemId));
            if (itemIndex < 0) return;
            const action = button.dataset.action;
            if (action === 'remove') {
                bookingData.items.splice(itemIndex, 1);
                if (!bookingData.items.length) bookingData.items.push(createTicketItem());
            } else if (action === 'minus' && bookingData.items[itemIndex].quantity > 1) {
                bookingData.items[itemIndex].quantity--;
            } else if (action === 'plus' && bookingData.items[itemIndex].quantity < 99) {
                bookingData.items[itemIndex].quantity++;
            }
            calculateTotal();
        });
    }

    resetCalculator();

    const startBookingCTA = (routeType = 'dinh') => {
        const isLocal = routeType.endsWith('_tn');
        const item = createTicketItem(routeType, isLocal ? 'local_adult' : 'standard_adult');
        bookingData.items = [item];
        calculateTotal();
        const bookingSection = document.getElementById('dat-ve');
        if (bookingSection) bookingSection.scrollIntoView({ behavior: 'smooth' });
    };

    // Bind Hero banner buttons
    const heroBtn = document.querySelector('.btn-book-submit');
    if (heroBtn) {
        heroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedRoute = document.getElementById('hero-route').value;
            const selectedDate = document.getElementById('hero-date').value;
            
            bookingData.date = selectedDate || today;
            if (dateInput) dateInput.value = bookingData.date;
            
            startBookingCTA(selectedRoute);
        });
    }

    // Bind cards buttons
    const cardBtns = document.querySelectorAll('.btn-card-select');
    cardBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const route = btn.getAttribute('data-route');
            startBookingCTA(route);
        });
    });

    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }

        return new Promise((resolve, reject) => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.top = '0';
            textarea.style.left = '-9999px';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                const copied = document.execCommand('copy');
                document.body.removeChild(textarea);
                copied ? resolve() : reject(new Error('Không thể sao chép nội dung'));
            } catch (err) {
                document.body.removeChild(textarea);
                reject(err);
            }
        });
    }

    function showZaloRedirectToast(copied) {
        const toast = document.createElement('div');
        toast.style.position = 'fixed';
        toast.style.bottom = '25px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#0068ff';
        toast.style.color = '#fff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '50px';
        toast.style.zIndex = '10000';
        toast.style.fontSize = '0.92rem';
        toast.style.boxShadow = '0 8px 25px rgba(0, 104, 255, 0.4)';
        toast.style.pointerEvents = 'none';
        toast.style.textAlign = 'center';
        toast.style.fontWeight = '500';
        toast.textContent = copied
            ? 'Đã sao chép thông tin vé. Đang mở Zalo...'
            : 'Đang mở Zalo. Nếu chưa thấy nội dung, vui lòng dán tin nhắn đã soạn.';
        document.body.appendChild(toast);
        return toast;
    }

    // Zalo booking redirect logic
    if (btnZaloBooking) {
        btnZaloBooking.addEventListener('click', () => {
            const zaloUrl = 'https://zalo.me/0334109119';
            let detailsText = `Chào đại lý Riviu Asia, tôi muốn đặt vé cáp treo Núi Bà Đen:\n`;
            detailsText += `- Ngày đi: ${formatBookingDate()}\n`;
            bookingData.items.forEach((item, index) => {
                const customer = CUSTOMER_TYPES[item.customerType];
                const timeLabel = item.time === 'night' ? 'sau 17h' : 'vé ngày';
                detailsText += `- Hạng mục ${index + 1}: ${ROUTE_LABELS[item.route]} | ${customer.label} | ${timeLabel} | ${item.quantity} vé`;
                if (item.wowPass) detailsText += ' | Có WOW PASS';
                detailsText += ` | ${formatVND(item.lineTotal)}\n`;
            });
            detailsText += `\n- Tổng tiền dự tính: ${formatVND(bookingData.totalPrice)}`;
            detailsText += `\n\nPhản hồi tư vấn xuất vé giúp tôi qua Zalo nhé. Xin cảm ơn!`;

            btnZaloBooking.disabled = true;
            btnZaloBooking.style.opacity = '0.82';

            copyTextToClipboard(detailsText)
                .then(() => {
                    showZaloRedirectToast(true);
                    setTimeout(() => {
                        window.location.assign(zaloUrl);
                    }, 650);
                })
                .catch(err => {
                    console.error('Lỗi copy clipboard:', err);
                    showZaloRedirectToast(false);
                    setTimeout(() => {
                        window.location.assign(zaloUrl);
                    }, 650);
                });
        });
    }





    // --- Detailed Pricing Tabs Click Handler ---
    const pricingTabButtons = document.querySelectorAll('.pricing-tab-btn');
    const pricingTabPanes = document.querySelectorAll('.pricing-tab-pane');

    pricingTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            pricingTabButtons.forEach(b => b.classList.remove('active'));
            pricingTabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to current elements
            btn.classList.add('active');
            const targetPane = document.getElementById(btn.getAttribute('data-tab'));
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });


    // ==========================================
    // 5. TESTIMONIALS SLIDER CAROUSEL
    // ==========================================
    const sliderTrack = document.querySelector('.reviews-slider-track');
    const slides = document.querySelectorAll('.review-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    let currentSlide = 0;
    let autoSlideInterval = null;

    function goToSlide(index) {
        if (!sliderTrack) return;
        currentSlide = index;
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, idx) => {
            dot.classList.remove('active');
            if (idx === currentSlide) {
                dot.classList.add('active');
            }
        });
    }

    if (dots.length > 0) {
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoSlide();
            });
        });
    }

    function startAutoSlide() {
        if (slides.length <= 1) return;
        autoSlideInterval = setInterval(() => {
            let next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }, 5000); // changes slides every 5 seconds
    }

    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }

    if (sliderTrack) {
        startAutoSlide();
    }


    // ==========================================
    // 6. ACCORDION FAQS SYSTEM
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');
        
        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other faqs
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
                otherItem.querySelector('.faq-body').style.maxHeight = null;
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                item.classList.remove('open');
                body.style.maxHeight = null;
            }
        });
    });


    // ==========================================
    // 7. SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing once triggered
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('revealed'));
    }
});
