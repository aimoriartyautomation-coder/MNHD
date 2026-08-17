/* =============================================================================
   MADINET MASR - MAIN SCRIPT
   Clean, Professional, Brand-Aligned
   ============================================================================= */

/* ---- PRELOADER ---- */
(function () {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloaderProgress');
    if (!preloader) return;

    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 18;
        if (width >= 100) {
            width = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 350);
        }
        if (progress) progress.style.width = width + '%';
    }, 100);

    window.addEventListener('load', () => {
        clearInterval(interval);
        if (progress) progress.style.width = '100%';
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 400);
    });
})();

/* ---- SCROLL PROGRESS BAR ---- */
window.addEventListener('scroll', () => {
    const sp = document.getElementById('scrollProgress');
    if (!sp) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    sp.style.width = ((scrollTop / docHeight) * 100) + '%';
}, { passive: true });

/* ---- NAVBAR SCROLL EFFECT ---- */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const logoImg = document.getElementById('logoImg');
    if (!nav) return;
    
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
        if (logoImg) {
            const scrolledSrc = logoImg.getAttribute('data-scrolled-src');
            if (scrolledSrc && logoImg.src !== scrolledSrc) {
                logoImg.src = scrolledSrc;
                logoImg.style.filter = 'none';
            }
        }
    } else {
        nav.classList.remove('scrolled');
        if (logoImg) {
            const originalSrc = logoImg.getAttribute('data-original-src');
            if (originalSrc && logoImg.src !== originalSrc) {
                logoImg.src = originalSrc;
                logoImg.style.filter = '';
            }
        }
    }
}, { passive: true });

// Store original src on load
document.addEventListener('DOMContentLoaded', () => {
    const logoImg = document.getElementById('logoImg');
    if (logoImg) {
        logoImg.setAttribute('data-original-src', logoImg.src);
    }
});

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    // Close on link click
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });
}

/* ---- SMOOTH SCROLL FOR NAV LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !document.querySelector(targetId)) return;
        e.preventDefault();
        const target = document.querySelector(targetId);
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    });
});

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');
const floatingCta = document.getElementById('floatingCta');

window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    if (backToTop) {
        backToTop.style.opacity = show ? '1' : '0';
        backToTop.style.pointerEvents = show ? 'all' : 'none';
    }
    if (floatingCta) {
        floatingCta.style.opacity = show ? '1' : '0';
        floatingCta.style.pointerEvents = show ? 'all' : 'none';
    }
}, { passive: true });

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- BOOKING MODAL ---- */
function openBookingModal(source) {
    const modal = document.getElementById('bookingModal');
    const src = document.getElementById('modalSource');
    if (modal) {
        if (src) src.value = source || 'General';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function handleModalSubmit(e) {
    e.preventDefault();
    const success = document.getElementById('modalSuccess');
    const btn = e.target.querySelector('[type="submit"]');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>جاري الإرسال...</span>';
    }
    setTimeout(() => {
        if (success) success.style.display = 'flex';
        if (btn) btn.style.display = 'none';
        setTimeout(() => { window.location.href = 'thankyou.html'; }, 1200);
    }, 900);
}

// Close modal on overlay click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBookingModal();
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('formSubmit');
        const success = document.getElementById('formSuccess');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<span>جاري الإرسال...</span>';
        }
        setTimeout(() => {
            if (success) success.style.display = 'flex';
            if (btn) btn.style.display = 'none';
            setTimeout(() => { window.location.href = 'thankyou.html'; }, 1200);
        }, 900);
    });
}

/* ---- INSTALLMENT CALCULATOR ---- */
function getProjectPrice() {
    const sel = document.getElementById('calcProject');
    if (!sel) return 4000000;
    if (sel.value === 'custom') {
        const customInput = document.getElementById('calcCustomPrice');
        return customInput ? parseInt(customInput.value) || 5000000 : 5000000;
    }
    return parseInt(sel.value) || 4000000;
}

function updateCalcDefaults() {
    const sel = document.getElementById('calcProject');
    const customGroup = document.getElementById('customPriceGroup');
    const yearsSlider = document.getElementById('calcYears');

    if (sel && customGroup) {
        customGroup.style.display = sel.value === 'custom' ? 'block' : 'none';
    }
    if (sel && yearsSlider) {
        const defaultYears = sel.options[sel.selectedIndex].getAttribute('data-years');
        if (defaultYears) yearsSlider.value = defaultYears;
    }
    calculateInstallments();
}

function calculateInstallments() {
    const price = getProjectPrice();
    const downPctSlider = document.getElementById('calcDownPaymentPercent');
    const yearsSlider = document.getElementById('calcYears');
    const downLabel = document.getElementById('calcDownPercentLabel');
    const yearsLabel = document.getElementById('calcYearsLabel');
    const downResult = document.getElementById('calcDownPaymentResult');
    const monthResult = document.getElementById('calcMonthlyResult');

    if (!downPctSlider || !yearsSlider) return;

    const downPct = parseInt(downPctSlider.value) || 5;
    const years = parseInt(yearsSlider.value) || 10;

    if (downLabel) downLabel.textContent = downPct + '%';
    if (yearsLabel) yearsLabel.textContent = years + ' سنوات';

    const downPayment = Math.round(price * downPct / 100);
    const remaining = price - downPayment;
    const monthly = Math.round(remaining / (years * 12));

    if (downResult) downResult.textContent = formatNum(downPayment);
    if (monthResult) monthResult.textContent = formatNum(monthly);
}

function formatNum(n) {
    return n.toLocaleString('ar-EG');
}

// Init calculator
document.addEventListener('DOMContentLoaded', () => {
    calculateInstallments();
});

/* ---- COUNTER ANIMATION ---- */
function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current >= target) {
                el.textContent = target.toLocaleString('ar-EG');
                return;
            }
            el.textContent = Math.floor(current).toLocaleString('ar-EG');
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    });
}

/* ---- INTERSECTION OBSERVER ---- */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger counter when stats bar visible
            if (entry.target.classList.contains('hero-stats')) {
                animateCounters();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Observe animate targets
    document.querySelectorAll('.animate-fade-up, .about-grid, .project-info-grid, .contact-grid, .calculator-card, .hero-stats, .sub-grid').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(el);
    });
});

// Add 'visible' CSS class handler
const styleEl = document.createElement('style');
styleEl.textContent = `
    .animate-fade-up.visible,
    .about-grid.visible,
    .project-info-grid.visible,
    .contact-grid.visible,
    .calculator-card.visible,
    .hero-stats.visible,
    .sub-grid.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(styleEl);

/* ---- CUSTOM CURSOR (desktop only) ---- */
(function () {
    if (window.innerWidth <= 768) return;
    const dot = document.getElementById('customCursorDot');
    const circle = document.getElementById('customCursorCircle');
    if (!dot || !circle) return;

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateCircle() {
        circleX += (mouseX - circleX) * 0.12;
        circleY += (mouseY - circleY) * 0.12;
        circle.style.left = circleX + 'px';
        circle.style.top = circleY + 'px';
        requestAnimationFrame(animateCircle);
    }
    animateCircle();

    document.querySelectorAll('a, button, .btn-primary, .btn-ghost, .social-btn, .sub-card, .unit-type').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            circle.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            circle.classList.remove('hover');
        });
    });
})();
