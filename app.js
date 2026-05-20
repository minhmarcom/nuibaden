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
        'dinh':   { adult: 450000, child: 350000, label: 'Vé Đỉnh Vân Sơn' },
        'chua':   { adult: 250000, child: 150000, label: 'Vé Chùa Hang' },
        'chua1c': { adult: 150000, child: 100000, label: 'Vé Chùa Hang 1 chiều' },
        'taman':  { adult: 450000, child: 350000, label: 'Vé Tuyến Cáp Tâm An' },
        'combo':  { adult: 650000, child: 500000, label: 'Vé Combo Đỉnh + Chùa' },
        
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
        
        // Student Prices (Single Flat Rate)
        'dinh_sv': { price: 300000, label: 'Vé SV Đỉnh Vân Sơn' },
        'chua_sv': { price: 250000, label: 'Vé SV Chùa Hang' },
        'taman_sv': { price: 300000, label: 'Vé SV Tuyến Tâm An' },
        'combo_sv': { price: 400000, label: 'Combo SV Đỉnh + Chùa' },
        'dinh_buffet_sv': { price: 500000, label: 'Combo SV Đỉnh + Buffet' },
        'combo_buffet_sv_all': { price: 600000, label: 'Combo SV Đỉnh + Chùa + Buffet' },
        
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
            { value: 'buffet', text: 'Vé Buffet Vân Sơn lẻ - 300k/200k' },
            { value: 'cong', text: 'Vé cổng Khu du lịch - 10k/5k' }
        ],
        'student': [
            { value: 'dinh_sv', text: 'Vé SV Tuyến Đỉnh Vân Sơn (Khứ hồi) - 300k' },
            { value: 'chua_sv', text: 'Vé SV Tuyến Chùa Hang (Khứ hồi) - 250k' },
            { value: 'taman_sv', text: 'Vé SV Tuyến Cáp Tâm An (Khứ hồi) - 300k' },
            { value: 'combo_sv', text: 'Combo SV Đỉnh + Chùa (Khứ hồi) - 400k' },
            { value: 'dinh_buffet_sv', text: 'Combo SV Đỉnh + Buffet - 500k' },
            { value: 'combo_buffet_sv_all', text: 'Combo SV Đỉnh + Chùa + Buffet - 600k' }
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
        
        'dinh_sv': 'Vé SV Đỉnh Vân Sơn (Khứ hồi)',
        'chua_sv': 'Vé SV Chùa Hang (Khứ hồi)',
        'taman_sv': 'Vé SV Tuyến Tâm An (Khứ hồi)',
        'combo_sv': 'Combo SV Đỉnh + Chùa (Khứ hồi)',
        'dinh_buffet_sv': 'Combo SV Đỉnh + Buffet',
        'combo_buffet_sv_all': 'Combo SV Đỉnh + Chùa + Buffet',
        
        'dinh_tn': 'Vé Tây Ninh Đỉnh Vân Sơn (Khứ hồi)',
        'chua_tn': 'Vé Tây Ninh Chùa Hang (Khứ hồi)',
        'taman_tn': 'Vé Tây Ninh Tuyến Tâm An (Khứ hồi)',
        'combo_tn': 'Combo Tây Ninh Đỉnh + Chùa (Khứ hồi)'
    };

    // Booking state
    let bookingData = {
        category: 'standard',
        route: 'dinh',
        date: '',
        isNightTicket: false,
        isWowPass: false,
        adultQty: 1,
        childQty: 0,
        totalPrice: 0
    };

    // DOM Elements
    const categorySelect = document.getElementById('wizard-category');
    const routeSelect = document.getElementById('wizard-route');
    const dateInput = document.getElementById('wizard-date');
    const nightCheckbox = document.getElementById('wizard-night');
    const wowpassCheckbox = document.getElementById('wizard-wowpass');
    const adultQtyText = document.getElementById('qty-adult');
    const childQtyText = document.getElementById('qty-child');
    const btnAdultMinus = document.getElementById('btn-adult-minus');
    const btnAdultPlus = document.getElementById('btn-adult-plus');
    const btnChildMinus = document.getElementById('btn-child-minus');
    const btnChildPlus = document.getElementById('btn-child-plus');
    const btnZaloBooking = document.getElementById('btn-zalo-booking');
    
    // Summary DOM elements
    const summaryRouteText = document.getElementById('summary-route');
    const summaryDateText = document.getElementById('summary-date');
    const summaryAdultText = document.getElementById('summary-adult-details');
    const summaryChildText = document.getElementById('summary-child-details');
    const summaryWowpassRow = document.getElementById('summary-wowpass-row');
    const summaryWowpassText = document.getElementById('summary-wowpass-details');
    const summaryTotalText = document.getElementById('summary-total-price');

    // Initialize current date as default date
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.value = today;
        dateInput.min = today;
        bookingData.date = today;
    }

    // Populate routes dropdown based on selected category
    function populateRoutes(category) {
        if (!routeSelect) return;
        routeSelect.innerHTML = '';
        
        const routes = ROUTES_BY_CATEGORY[category] || [];
        routes.forEach(route => {
            const opt = document.createElement('option');
            opt.value = route.value;
            opt.textContent = route.text;
            routeSelect.appendChild(opt);
        });
        
        if (routes.length > 0) {
            bookingData.route = routes[0].value;
            routeSelect.value = routes[0].value;
        }
    }

    // Toggle Night Checkbox display based on category and route availability
    function updateNightCheckboxVisibility() {
        const nightContainer = document.getElementById('night-checkbox-container');
        const route = bookingData.route;
        const cat = bookingData.category;
        
        const isNightAvailable = (cat === 'standard' && (route === 'dinh' || route === 'chua' || route === 'taman' || route === 'combo'));
        
        if (nightContainer) {
            if (isNightAvailable) {
                nightContainer.style.display = 'flex';
            } else {
                nightContainer.style.display = 'none';
                bookingData.isNightTicket = false;
                if (nightCheckbox) nightCheckbox.checked = false;
            }
        }
    }

    // Populate standard options on init
    populateRoutes('standard');

    // Event listeners for inputs
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            bookingData.category = e.target.value;
            populateRoutes(bookingData.category);
            
            // Adjust UI for Student
            const childRow = document.getElementById('child-counter-row');
            const adultTitle = document.getElementById('adult-label-title');
            const adultDesc = document.getElementById('adult-label-desc');
            
            if (bookingData.category === 'student') {
                if (childRow) childRow.style.display = 'none';
                bookingData.childQty = 0;
                if (childQtyText) childQtyText.textContent = '0';
                
                if (adultTitle) adultTitle.textContent = 'Vé Sinh Viên';
                if (adultDesc) adultDesc.textContent = 'Áp dụng cho học sinh, sinh viên có thẻ HSSV hợp lệ';
            } else {
                if (childRow) childRow.style.display = 'flex';
                
                if (adultTitle) adultTitle.textContent = 'Vé Người Lớn';
                if (adultDesc) adultDesc.textContent = 'Du khách cao từ 1.4m trở lên';
            }
            
            updateNightCheckboxVisibility();
            calculateTotal();
        });
    }

    if (routeSelect) {
        routeSelect.addEventListener('change', (e) => {
            bookingData.route = e.target.value;
            updateNightCheckboxVisibility();
            calculateTotal();
        });
    }

    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            bookingData.date = e.target.value;
            calculateTotal();
        });
    }

    if (nightCheckbox) {
        nightCheckbox.addEventListener('change', (e) => {
            bookingData.isNightTicket = e.target.checked;
            calculateTotal();
        });
    }

    if (wowpassCheckbox) {
        wowpassCheckbox.addEventListener('change', (e) => {
            bookingData.isWowPass = e.target.checked;
            calculateTotal();
        });
    }

    // Counter buttons logic
    if (btnAdultMinus && btnAdultPlus) {
        btnAdultMinus.addEventListener('click', () => {
            if (bookingData.adultQty > 1) {
                bookingData.adultQty--;
                adultQtyText.textContent = bookingData.adultQty;
                calculateTotal();
            }
        });
        btnAdultPlus.addEventListener('click', () => {
            if (bookingData.adultQty < 99) {
                bookingData.adultQty++;
                adultQtyText.textContent = bookingData.adultQty;
                calculateTotal();
            }
        });
    }

    if (btnChildMinus && btnChildPlus) {
        btnChildMinus.addEventListener('click', () => {
            if (bookingData.childQty > 0) {
                bookingData.childQty--;
                childQtyText.textContent = bookingData.childQty;
                calculateTotal();
            }
        });
        btnChildPlus.addEventListener('click', () => {
            if (bookingData.childQty < 99) {
                bookingData.childQty++;
                childQtyText.textContent = bookingData.childQty;
                calculateTotal();
            }
        });
    }

    // Helper: format currency
    function formatVND(amount) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    }

    // Core Price calculation function
    function calculateTotal() {
        const route = bookingData.route;
        const category = bookingData.category;
        const isNight = bookingData.isNightTicket;
        const dateVal = bookingData.date;
        
        let adultPrice = 0;
        let childPrice = 0;
        
        // Determine weekday vs weekend
        const d = new Date(dateVal);
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        
        if (category === 'standard') {
            if (isNight) {
                const nightPrice = NIGHT_PRICES[route];
                if (nightPrice) {
                    adultPrice = nightPrice.adult;
                    childPrice = nightPrice.child;
                }
            } else {
                if (route === 'dinh_buffet' || route === 'combo_buffet') {
                    const priceSet = isWeekend ? PRICES[route].weekend : PRICES[route].weekday;
                    adultPrice = priceSet.adult;
                    childPrice = priceSet.child;
                } else {
                    const priceSet = PRICES[route];
                    if (priceSet) {
                        adultPrice = priceSet.adult;
                        childPrice = priceSet.child;
                    }
                }
            }
        } else if (category === 'student') {
            const priceSet = PRICES[route];
            if (priceSet) {
                adultPrice = priceSet.price;
                childPrice = 0;
            }
        } else if (category === 'local') {
            const priceSet = PRICES[route];
            if (priceSet) {
                adultPrice = priceSet.adult;
                childPrice = priceSet.child;
            }
        }
        
        const adultTotal = bookingData.adultQty * adultPrice;
        const childTotal = bookingData.childQty * childPrice;
        
        let subtotal = adultTotal + childTotal;
        let wowpassTotal = 0;
        const wowpassQty = bookingData.adultQty + bookingData.childQty;
        
        if (bookingData.isWowPass) {
            wowpassTotal = wowpassQty * 300000;
        }
        
        bookingData.totalPrice = subtotal + wowpassTotal;

        // Update UI counters disable states
        if (btnAdultMinus) btnAdultMinus.disabled = bookingData.adultQty <= 1;
        if (btnChildMinus) btnChildMinus.disabled = bookingData.childQty <= 0;

        // Update Summary Panel
        if (summaryRouteText) {
            let labelSuffix = '';
            if (category === 'standard') {
                if (isNight) labelSuffix = ' (Vé Đêm)';
                else if (route === 'dinh_buffet' || route === 'combo_buffet') {
                    labelSuffix = isWeekend ? ' (Buffet Cuối tuần)' : ' (Buffet Ngày thường)';
                } else {
                    labelSuffix = ' (Vé Ngày)';
                }
            } else if (category === 'student') {
                labelSuffix = ' (Sinh Viên)';
            } else if (category === 'local') {
                labelSuffix = ' (Người Tây Ninh)';
            }
            summaryRouteText.textContent = (ROUTE_LABELS[route] || 'Vé Cáp Treo') + labelSuffix;
        }
        if (summaryDateText) {
            const dateStr = !isNaN(d.getTime()) ? `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}` : dateVal;
            summaryDateText.textContent = dateStr;
        }
        if (summaryAdultText) {
            const labelText = category === 'student' ? 'Sinh viên' : 'Người lớn';
            summaryAdultText.textContent = `${bookingData.adultQty} x ${formatVND(adultPrice)}`;
            
            const summaryAdultLabel = summaryAdultText.previousElementSibling || summaryAdultText.parentElement.querySelector('.summary-item-label');
            if (summaryAdultLabel) {
                summaryAdultLabel.textContent = `${labelText}:`;
            }
        }
        if (summaryChildText) {
            if (category !== 'student' && bookingData.childQty > 0) {
                summaryChildText.parentElement.style.display = 'flex';
                summaryChildText.textContent = `${bookingData.childQty} x ${formatVND(childPrice)}`;
            } else {
                summaryChildText.parentElement.style.display = 'none';
            }
        }
        if (summaryWowpassRow && summaryWowpassText) {
            if (bookingData.isWowPass) {
                summaryWowpassRow.style.display = 'flex';
                summaryWowpassText.textContent = `${wowpassQty} x ${formatVND(300000)}`;
            } else {
                summaryWowpassRow.style.display = 'none';
            }
        }
        if (summaryTotalText) {
            summaryTotalText.textContent = formatVND(bookingData.totalPrice);
        }
    }

    // Run once at start to setup prices
    calculateTotal();

    // Direct CTA navigation from anywhere to Booking Section
    const startBookingCTA = (routeType = 'dinh') => {
        let mappedRoute = routeType;
        let mappedCategory = 'standard';
        
        if (routeType === 'dinh' || routeType === 'chua' || routeType === 'combo' || routeType === 'taman') {
            mappedCategory = 'standard';
            mappedRoute = routeType;
        } else if (routeType.endsWith('_sv')) {
            mappedCategory = 'student';
            mappedRoute = routeType;
        } else if (routeType.endsWith('_tn')) {
            mappedCategory = 'local';
            mappedRoute = routeType;
        }
        
        bookingData.category = mappedCategory;
        if (categorySelect) categorySelect.value = mappedCategory;
        
        populateRoutes(mappedCategory);
        
        bookingData.route = mappedRoute;
        if (routeSelect) routeSelect.value = mappedRoute;
        
        const childRow = document.getElementById('child-counter-row');
        const adultTitle = document.getElementById('adult-label-title');
        const adultDesc = document.getElementById('adult-label-desc');
        
        if (mappedCategory === 'student') {
            if (childRow) childRow.style.display = 'none';
            bookingData.childQty = 0;
            if (childQtyText) childQtyText.textContent = '0';
            if (adultTitle) adultTitle.textContent = 'Vé Sinh Viên';
            if (adultDesc) adultDesc.textContent = 'Áp dụng cho học sinh, sinh viên có thẻ HSSV hợp lệ';
        } else {
            if (childRow) childRow.style.display = 'flex';
            if (adultTitle) adultTitle.textContent = 'Vé Người Lớn';
            if (adultDesc) adultDesc.textContent = 'Du khách cao từ 1.4m trở lên';
        }
        
        updateNightCheckboxVisibility();
        calculateTotal();
        
        const bookingSection = document.getElementById('dat-ve');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Bind Hero banner buttons
    const heroBtn = document.querySelector('.btn-book-submit');
    if (heroBtn) {
        heroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedRoute = document.getElementById('hero-route').value;
            const selectedDate = document.getElementById('hero-date').value;
            
            bookingData.route = selectedRoute;
            bookingData.date = selectedDate;
            if (routeSelect) routeSelect.value = selectedRoute;
            if (dateInput) dateInput.value = selectedDate;
            
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
            const routeLabel = ROUTE_LABELS[bookingData.route] || 'Vé Cáp Treo';
            const isNight = bookingData.isNightTicket;
            const category = bookingData.category;
            
            let categoryStr = 'Khách du lịch (Vé Cơ Bản)';
            if (category === 'student') categoryStr = 'Vé Sinh Viên (Cần xuất trình thẻ HSSV)';
            if (category === 'local') categoryStr = 'Vé Người dân Tây Ninh (Cần xuất trình CCCD)';
            
            const d = new Date(bookingData.date);
            const dayOfWeek = d.getDay();
            const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
            let timeStr = 'Ngày thường';
            
            if (isNight) {
                timeStr = 'Khung giờ đêm (sau 17h)';
            } else if (isWeekend && (bookingData.route === 'dinh_buffet' || bookingData.route === 'combo_buffet')) {
                timeStr = 'Cuối tuần (Thứ 7 / CN)';
            }
            
            const dateStr = !isNaN(d.getTime()) ? `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()}` : bookingData.date;
            
            let detailsText = `Chào đại lý Riviu Asia, tôi muốn đặt vé cáp treo Núi Bà Đen:\n`;
            detailsText += `- Đối tượng: ${categoryStr}\n`;
            detailsText += `- Tuyến: ${routeLabel}\n`;
            detailsText += `- Ngày đi: ${dateStr} (${timeStr})\n`;
            
            if (category === 'student') {
                detailsText += `- Số lượng: ${bookingData.adultQty} sinh viên`;
            } else {
                detailsText += `- Số lượng: ${bookingData.adultQty} người lớn`;
                if (bookingData.childQty > 0) {
                    detailsText += `, ${bookingData.childQty} trẻ em`;
                }
            }
            if (bookingData.isWowPass) {
                const totalTickets = bookingData.adultQty + bookingData.childQty;
                detailsText += `\n- Dịch vụ đi kèm: WOW PASS Lối đi nhanh (${totalTickets} vé)`;
            }
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
