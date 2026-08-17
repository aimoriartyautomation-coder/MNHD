/* =====================================================
   FORM HANDLER — Google Sheets Integration
   مدينة نصر للإسكان والتعمير
   ===================================================== */

// ======================================================
// ⚙️  CONFIG — ضع رابط Google Apps Script هنا
// ======================================================
const SHEETS_CONFIG = {
    // 👉 بعد إعداد Google Apps Script، ضع الرابط هنا:
    scriptUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec',
    sheetName: 'Leads'
};

// ======================================================
// 📤  DJANGO SENDER — يرسل البيانات للباك أند الخاص بنا
// ======================================================
async function sendToDjangoBackend(payload) {
    try {
        const response = await fetch('/api/leads/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            console.log('✅ Data sent to Django Backend successfully');
            return true;
        } else {
            console.error('❌ Django Backend returned error:', response.statusText);
            return false;
        }
    } catch (err) {
        console.error('❌ Failed to send to Django Backend:', err);
        return false;
    }
}

// ======================================================
// 📤  CORE SENDER — يرسل البيانات لـ Google Sheets والباك أند
// ======================================================
async function sendToGoogleSheets(data) {
    const payload = {
        ...data,
        timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
        page: document.title,
        url: window.location.href,
        device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    };

    // إرسال البيانات للباك أند الخاص بنا (Django)
    await sendToDjangoBackend(payload);

    // لو الرابط لسه مش متضافه، بس اطبعه في الكونسول
    if (SHEETS_CONFIG.scriptUrl.includes('YOUR_SCRIPT_ID')) {
        console.log('📋 Form Data (Google Sheets not configured yet):', payload);
        return true;
    }

    try {
        await fetch(SHEETS_CONFIG.scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        console.log('✅ Data sent to Google Sheets:', payload);
        return true;
    } catch (err) {
        console.error('❌ Failed to send to Google Sheets:', err);
        return false;
    }
}

// ======================================================
// 🎯  UNIFIED SUBMIT — يستدعى من كل الفورمات
// ======================================================
async function submitForm({ name, phone, project, unit, source, btnId, successId, formId }) {
    const btn = document.getElementById(btnId);
    const successEl = document.getElementById(successId);
    const formEl = formId ? document.getElementById(formId) : null;

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'جاري الإرسال...';
    }

    await sendToGoogleSheets({ name, phone, project, unit, source });

    setTimeout(() => {
        if (btn) btn.style.display = 'none';
        if (successEl) {
            successEl.style.display = 'flex';
            successEl.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>تم استلام طلبك! جاري تحويلك...</span>`;
        }
        
        // Redirect to thank you page
        setTimeout(() => {
            window.location.href = 'thankyou.html';
        }, 800);
    }, 900);
}

// ======================================================
// 📌  POPUP — يظهر بعد 15 ثانية (مرة واحدة فقط)
// ======================================================
function initLeadPopup() {
    // لو المستخدم شاف الـ popup في نفس الجلسة، ما تعرضوش
    if (sessionStorage.getItem('popupShown')) return;

    const popup = document.getElementById('leadPopup');
    if (!popup) return;

    setTimeout(() => {
        popup.classList.add('popup-visible');
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('popupShown', '1');
    }, 15000); // 15 seconds
}

function closeLeadPopup() {
    const popup = document.getElementById('leadPopup');
    if (popup) {
        popup.classList.remove('popup-visible');
        document.body.style.overflow = '';
    }
}

async function handleLeadPopupSubmit(e) {
    e.preventDefault();
    const name    = document.getElementById('popupName')?.value || '';
    const phone   = document.getElementById('popupPhone')?.value || '';
    const project = document.getElementById('popupProject')?.value || '';

    await submitForm({
        name, phone, project,
        source: 'Popup — 15s Auto',
        btnId: 'popupSubmitBtn',
        successId: 'popupSuccess'
    });

    setTimeout(closeLeadPopup, 2500);
}

// ======================================================
// 🔁  HOOK EXISTING FORMS
// ======================================================

// ---- index.html & talala.html — Calculator / Contact form ----
window.handleContactFormGS = async function(e, btnId, successId) {
    e.preventDefault();
    const name  = e.target.querySelector('[name="name"], #leadName, #contactName, input[type="text"]')?.value || '';
    const phone = e.target.querySelector('[name="phone"], #leadPhone, #contactPhone, input[type="tel"]')?.value || '';
    await submitForm({ name, phone, source: document.title, btnId, successId });
};

// ---- sarai.html — Esse contact form ----
window.handleEsseFormGS = async function(e) {
    e.preventDefault();
    const name  = document.getElementById('esseName')?.value || document.getElementById('contactName')?.value || '';
    const phone = document.getElementById('essePhone')?.value || document.getElementById('contactPhone')?.value || '';
    await sendToGoogleSheets({ name, phone, source: 'Esse Sarai — Contact Form', project: 'سراي — إيس' });
    const btn = document.getElementById('esseSubmitBtn') || e.target.querySelector('button[type="submit"]');
    const suc = document.getElementById('esseFormSuccess') || e.target.querySelector('.esse-form-success, .form-success');
    if (btn) { btn.disabled = true; btn.textContent = 'جاري الإرسال...'; }
    setTimeout(() => {
        if (btn) btn.style.display = 'none';
        if (suc) suc.style.display = 'flex';
    }, 900);
};

// ---- butterfly.html — Contact form ----
window.handleBfFormGS = async function(e) {
    e.preventDefault();
    const name  = document.getElementById('bfName')?.value || '';
    const phone = document.getElementById('bfPhone')?.value || '';
    const unit  = document.getElementById('bfUnit')?.value || '';
    await submitForm({
        name, phone, unit,
        source: 'Butterfly — Contact Form',
        project: 'ذا باترفلاي',
        btnId: 'bfSubmitBtn',
        successId: 'bfFormSuccess'
    });
};

// ---- butterfly.html — Modal form ----
window.handleBfModalGS = async function(e) {
    e.preventDefault();
    const name  = document.getElementById('bfModalName')?.value || '';
    const phone = document.getElementById('bfModalPhone')?.value || '';
    const unit  = document.getElementById('bfModalUnit')?.value || '';
    await submitForm({
        name, phone, unit,
        source: 'Butterfly — Modal Booking',
        project: 'ذا باترفلاي',
        btnId: 'bfModalSubmit',
        successId: 'bfModalSuccess'
    });
};

// ---- Global modal (index.html, talala.html) ----
window.handleModalSubmitGS = async function(e) {
    e.preventDefault();
    const name    = document.getElementById('modalName')?.value || '';
    const phone   = document.getElementById('modalPhone')?.value || '';
    const project = document.getElementById('modalProject')?.value || document.getElementById('modalUnit')?.value || '';
    const source  = document.getElementById('modalSource')?.value || document.title;
    await submitForm({
        name, phone, project, source,
        btnId: 'modalSubmitBtn',
        successId: 'modalSuccess'
    });
};

// ---- sarai.html — Booking form ----
window.handleBookingFormGS = async function(e) {
    e.preventDefault();
    const name  = document.getElementById('bookingName')?.value || '';
    const phone = document.getElementById('bookingPhone')?.value || '';
    const unit  = document.getElementById('bookingUnit')?.value || '';
    await submitForm({
        name, phone, unit,
        source: 'Sarai — Booking Form',
        project: 'سراي',
        btnId: 'bookingSubmitBtn',
        successId: 'bookingSuccess'
    });
};

// ======================================================
// 🚀  INIT
// ======================================================
document.addEventListener('DOMContentLoaded', () => {
    // ربط كل الفورمات
    document.getElementById('bfContactForm')?.setAttribute('onsubmit', 'handleBfFormGS(event)');
    document.getElementById('bfModalForm')?.setAttribute('onsubmit', 'handleBfModalGS(event)');
    document.getElementById('modalForm')?.setAttribute('onsubmit', 'handleModalSubmitGS(event)');
    document.getElementById('bookingForm')?.setAttribute('onsubmit', 'handleBookingFormGS(event)');

    // Sarai form
    const esseForm = document.getElementById('esseContactForm');
    if (esseForm) esseForm.setAttribute('onsubmit', 'handleEsseFormGS(event)');

    // الـ popup
    initLeadPopup();
});
