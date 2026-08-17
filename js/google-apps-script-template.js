// =====================================================
// Google Apps Script — مدينة نصر للإسكان والتعمير
// Lead Capture → Google Sheets
//
// طريقة الإعداد:
// 1. افتح script.google.com
// 2. أنشئ مشروع جديد (New Project)
// 3. الصق هذا الكود
// 4. غيّر SPREADSHEET_ID برقم الـ Sheet الخاص بك
// 5. اضغط Deploy → New Deployment → Web App
// 6. الصلاحيات: Execute as Me, Access: Anyone
// 7. انسخ الـ URL وضعه في formHandler.js
// =====================================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // 👈 غيّر هذا

function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);

        const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
        let sheet   = ss.getSheetByName('Leads');

        // إنشاء الـ sheet لو مش موجود
        if (!sheet) {
            sheet = ss.insertSheet('Leads');
            // رؤوس الأعمدة
            sheet.appendRow([
                'التاريخ والوقت',
                'الاسم',
                'رقم الهاتف',
                'المشروع',
                'نوع الوحدة',
                'المصدر',
                'الصفحة',
                'الرابط',
                'الجهاز'
            ]);
            // تنسيق الرأس
            sheet.getRange(1, 1, 1, 9)
                .setBackground('#1a1a2e')
                .setFontColor('#ffffff')
                .setFontWeight('bold');
        }

        // إضافة الصف الجديد
        sheet.appendRow([
            data.timestamp    || new Date().toLocaleString('ar-EG'),
            data.name         || '',
            data.phone        || '',
            data.project      || '',
            data.unit         || '',
            data.source       || '',
            data.page         || '',
            data.url          || '',
            data.device       || ''
        ]);

        return ContentService
            .createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ success: false, error: err.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// للتأكد إن الـ Web App شغال
function doGet(e) {
    return ContentService.createTextOutput('✅ Madinet Masr Lead Sheet — OK');
}
