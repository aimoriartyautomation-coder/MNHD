# 🏗️ Madinet Masr — Landing Page

موقع العرض الترويجي لمشاريع **مدينة مصر للإسكان والتعمير** — سراي · ذا بترفلاي · تلالا

---

## 🐳 تشغيل المشروع بـ Docker

### المتطلبات
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) مثبت على الجهاز

---

### 🚀 تشغيل سريع (الطريقة الأسهل)

```bash
# من داخل مجلد المشروع
docker compose up -d --build
```

ثم افتح المتصفح على: **http://localhost**

---

### إيقاف الموقع

```bash
docker compose down
```

---

### إعادة بناء الصورة بعد تعديل الملفات

```bash
docker compose up -d --build
```

---

## 📁 هيكل الملفات

```
مشروع مدينه مصر/
├── index.html          ← الصفحة الرئيسية
├── sarai.html          ← صفحة سراي
├── butterfly.html      ← صفحة ذا بترفلاي
├── talala.html         ← صفحة تلالا
├── thankyou.html       ← صفحة شكراً بعد التسجيل
├── css/
│   └── style.css       ← ملف التنسيق الرئيسي
├── images/
│   ├── logo.webp        ← الشعار الرئيسي
│   ├── logo_white.webp  ← الشعار باللون الأبيض
│   └── logo_transparent.webp ← الشعار الشفاف
├── js/
│   ├── script.js       ← السكريبت الرئيسي
│   ├── formHandler.js  ← معالج النماذج → Google Sheets
│   └── translate.js    ← نظام تبديل اللغة عربي/إنجليزي
├── Dockerfile          ← إعداد Docker
├── docker-compose.yml  ← Docker Compose
└── nginx.conf          ← إعدادات الويب سيرفر
```

---

## ⚙️ ربط Google Sheets

افتح ملف [`formHandler.js`](./js/formHandler.js) وابحث عن:

```js
scriptUrl: 'YOUR_SCRIPT_ID_HERE'
```

استبدل `YOUR_SCRIPT_ID_HERE` بـ URL المشروع من Google Apps Script.

---

## 🛠️ تطوير محلي بدون Docker

```bash
# إذا كان Python مثبتاً
python -m http.server 8000

# ثم افتح: http://localhost:8000
```
