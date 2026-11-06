/* ============================================
   ПРЕЛОАДЕР
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('preloader').classList.add('hidden');
});

/* ============================================
   СТАТУС "ОТКРЫТО/ЗАКРЫТО"
   ============================================ */
function updateOpenStatus() {
    const now = new Date();
    const hour = now.getHours();
    const statusEl = document.getElementById('statusOpen');
    
    // Открытие в 11:00 (время закрытия 23:00 — предположение, уточните)
    const isOpen = hour >= 11 && hour < 23;
    
    if (statusEl) {
        statusEl.textContent = isOpen ? 'Открыто' : 'Закрыто';
        statusEl.style.color = isOpen ? '#27ae60' : '#e74c3c';
    }
}

updateOpenStatus();
setInterval(updateOpenStatus, 60000);

/* ============================================
   МОБИЛЬНОЕ МЕНЮ
   ============================================ */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const header = document.getElementById('header');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* ============================================
   ЭФФЕКТ ШАПКИ + КНОПКА НАВЕРХ
   ============================================ */
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    if (scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    highlightActiveLink();
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ
   ============================================ */
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   ПЛАВНАЯ ПРОКРУТКА
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const headerHeight = header.offsetHeight + 36; // + info-bar
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   ВКЛАДКИ МЕНЮ
   ============================================ */
const tabBtns = document.querySelectorAll('.tab-btn');
const menuCategories = document.querySelectorAll('.menu-category');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        menuCategories.forEach(cat => {
            cat.classList.remove('active');
            if (cat.dataset.category === category) {
                cat.classList.add('active');
            }
        });
    });
});

/* ============================================
   АНИМАЦИЯ ПОЯВЛЕНИЯ
   ============================================ */
const fadeElements = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

fadeElements.forEach(el => fadeObserver.observe(el));

/* ============================================
   АНИМИРОВАННЫЕ СЧЁТЧИКИ
   ============================================ */
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

function animateCounters() {
    statNumbers.forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const isDecimal = counter.dataset.decimal !== undefined || target % 1 !== 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = isDecimal 
                    ? current.toFixed(1) 
                    : Math.floor(current).toLocaleString('ru-RU');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = isDecimal 
                    ? target.toFixed(1) 
                    : target.toLocaleString('ru-RU');
            }
        };
        
        updateCounter();
    });
}

/* ============================================
   МАСКА ДЛЯ ТЕЛЕФОНА
   ============================================ */
function setupPhoneMask(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('8')) value = '7' + value.slice(1);
        if (!value.startsWith('7') && value.length > 0) value = '7' + value;
        
        let formatted = '';
        if (value.length > 0) formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.slice(1, 4);
        if (value.length > 4) formatted += ') ' + value.slice(4, 7);
        if (value.length > 7) formatted += '-' + value.slice(7, 9);
        if (value.length > 9) formatted += '-' + value.slice(9, 11);
        
        e.target.value = formatted;
    });
}

document.querySelectorAll('input[type="tel"]').forEach(setupPhoneMask);

/* ============================================
   БРОНИРОВАНИЕ: ДАТЫ И ВРЕМЯ
   ============================================ */
const dateInput = document.getElementById('bookDate');
const timeSelect = document.getElementById('bookTime');

// Минимальная дата — сегодня
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
}

// Генерация временных слотов
if (timeSelect) {
    const times = [];
    for (let h = 10; h < 23; h++) {
        times.push(`${h.toString().padStart(2, '0')}:00`);
        times.push(`${h.toString().padStart(2, '0')}:30`);
    }
    times.push('23:00', '23:30', '00:00', '00:30');
    
    times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
}

/* ============================================
   ВАЛИДАЦИЯ ФОРМЫ БРОНИРОВАНИЯ
   ============================================ */
const bookingForm = document.getElementById('bookingForm');
const successModal = document.getElementById('successModal');

function showError(input, message) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = message;
}

function clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = '';
}

// Валидация в реальном времени
['bookName', 'bookPhone', 'bookDate', 'bookTime', 'bookGuests'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
        input.addEventListener('blur', () => validateBookingField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateBookingField(input);
        });
    }
});

function validateBookingField(input) {
    const value = input.value.trim();
    
    if (!value) {
        showError(input, 'Обязательное поле');
        return false;
    }
    
    if (input.id === 'bookName' && value.length < 2) {
        showError(input, 'Минимум 2 символа');
        return false;
    }
    
    if (input.id === 'bookPhone') {
        const digits = value.replace(/\D/g, '');
        if (digits.length !== 11) {
            showError(input, 'Некорректный номер');
            return false;
        }
    }
    
    clearError(input);
    return true;
}

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fields = ['bookName', 'bookPhone', 'bookDate', 'bookTime', 'bookGuests'];
    let isValid = true;
    
    fields.forEach(id => {
        const input = document.getElementById(id);
        if (!validateBookingField(input)) isValid = false;
    });
    
    const agree = document.getElementById('bookAgree');
    if (!agree.checked) {
        alert('Необходимо согласие на обработку данных');
        return;
    }
    
    if (isValid) {
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            successModal.classList.add('active');
            bookingForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Сброс даты на сегодня
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }, 1500);
    }
});

document.getElementById('closeSuccess').addEventListener('click', () => {
    successModal.classList.remove('active');
});

successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

/* ============================================
   QR-КОД ДЛЯ МЕНЮ
   ============================================ */
document.getElementById('generateQR').addEventListener('click', () => {
    const qrContainer = document.getElementById('qrCode');
    const menuUrl = window.location.href.split('#')[0] + '#menu';
    
    // Используем бесплатный сервис генерации QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(menuUrl)}`;
    
    qrContainer.innerHTML = `<img src="${qrUrl}" alt="QR-код меню">`;
});

/* ============================================
   МОДАЛЬНОЕ ОКНО ДЛЯ ГАЛЕРЕИ (если есть)
   ============================================ */
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.dataset.img;
        if (imgSrc) {
            modalImg.src = imgSrc;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        successModal.classList.remove('active');
    }
});

/* ============================================
   АНИМАЦИЯ PARALLAX (только десктоп)
   ============================================ */
if (window.innerWidth > 768) {
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

/* ============================================
   КОНСОЛЬНОЕ СООБЩЕНИЕ
   ============================================ */
console.log('%c🍽️ Семейное кафе В2', 'font-size: 24px; color: #8B4513; font-weight: bold;');
console.log('%cСайт создан с любовью ❤️', 'font-size: 14px; color: #D2691E;');