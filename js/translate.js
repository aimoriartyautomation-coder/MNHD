/* =====================================================
   TRANSLATION SYSTEM — Bilingual (Arabic / English)
   مدينة نصر للإسكان والتعمير
   ===================================================== */

const LANG_KEY = 'madinet_masr_lang';

function getSelectedLanguage() {
    return localStorage.getItem(LANG_KEY) || 'ar';
}

function setLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLanguage(lang);
}

function applyLanguage(lang) {
    // 1. Direction and HTML attributes
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;

    // 2. Body Font override
    if (lang === 'en') {
        document.body.classList.add('en-mode');
        document.body.style.fontFamily = "'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    } else {
        document.body.classList.remove('en-mode');
        document.body.style.fontFamily = "'Cairo', sans-serif";
    }

    // 3. Switch all text elements with data-en/data-ar attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        const enVal = el.getAttribute('data-en');
        const arVal = el.getAttribute('data-ar') || el.innerHTML;
        
        // Save initial Arabic text in data-ar if not present
        if (!el.getAttribute('data-ar')) {
            el.setAttribute('data-ar', arVal);
        }

        if (lang === 'en') {
            el.innerHTML = enVal;
        } else {
            el.innerHTML = el.getAttribute('data-ar');
        }
    });

    // 4. Input Placeholders translation
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const enPl = el.getAttribute('data-en-placeholder');
        const arPl = el.getAttribute('data-ar-placeholder') || el.placeholder;

        if (!el.getAttribute('data-ar-placeholder')) {
            el.setAttribute('data-ar-placeholder', arPl);
        }

        if (lang === 'en') {
            el.placeholder = enPl;
        } else {
            el.placeholder = el.getAttribute('data-ar-placeholder');
        }
    });

    // 5. Update Switcher Button Label
    const globeIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-inline-end: 6px; vertical-align: middle;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    const btn = document.getElementById('langSwitch');
    if (btn) {
        btn.innerHTML = globeIcon + (lang === 'en' ? 'عربي' : 'English');
    }
    const btnMob = document.getElementById('langSwitchMobile');
    if (btnMob) {
        btnMob.innerHTML = globeIcon + (lang === 'en' ? 'عربي' : 'English');
    }
}

function toggleLanguage() {
    const current = getSelectedLanguage();
    const next = current === 'en' ? 'ar' : 'en';
    setLanguage(next);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(getSelectedLanguage());
});
