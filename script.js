// ============================================
// منظمة التجديد الطلابي - فرع الجديدة
// script.js — منطق الصفحة (بدون أي إطار عمل، JS خام)
// ============================================

// عدّل هذا الرابط إذا تغيّر اسم المستودع أو النطاق
const SITE_URL = 'https://abdelwahab100.github.io/OremaEljdida-links/';
const SITE_TITLE = 'منظمة التجديد الطلابي - فرع الجديدة';
const SITE_DESCRIPTION =
  'إطار طلابي مدني يهتم بشؤون الطلبة الجامعيين بمدينة الجديدة.';

// ============================================
// 1) الوضع الفاتح / الداكن
// ============================================

const THEME_KEY = 'orema-eljadida-theme';
const root = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const iconMoon = document.getElementById('icon-moon');
const iconSun = document.getElementById('icon-sun');

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    root.classList.add('dark');
    iconMoon.style.display = 'none';
    iconSun.style.display = 'block';
  } else {
    root.classList.remove('dark');
    iconMoon.style.display = 'block';
    iconSun.style.display = 'none';
  }
}

let currentTheme = getInitialTheme();
applyTheme(currentTheme);

themeToggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, currentTheme);
  applyTheme(currentTheme);
});

// اتباع تفضيل النظام تلقائيًا إذا لم يختر المستخدم يدويًا من قبل
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const hasManualPreference = localStorage.getItem(THEME_KEY);
  if (!hasManualPreference) {
    currentTheme = e.matches ? 'dark' : 'light';
    applyTheme(currentTheme);
  }
});

// ============================================
// 2) توليد QR Code (محليًا بالكامل عبر مكتبة qrcodejs)
// ============================================

const qrContainer = document.getElementById('qrcode');

if (window.QRCode && qrContainer) {
  new QRCode(qrContainer, {
    text: SITE_URL,
    width: 128,
    height: 128,
    colorDark: '#229954',
    colorLight: '#00000000',
    correctLevel: QRCode.CorrectLevel.M,
  });
} else if (qrContainer) {
  qrContainer.textContent = 'تعذّر توليد رمز QR';
}

// ============================================
// 3) المشاركة (Web Share API) + نسخ الرابط + Toast
// ============================================

const shareBtn = document.getElementById('share-btn');
const toast = document.getElementById('toast');
let toastTimeout;

function showToast() {
  clearTimeout(toastTimeout);
  toast.classList.add('visible');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2200);
}

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: SITE_TITLE,
    text: SITE_DESCRIPTION,
    url: SITE_URL,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // المستخدم ألغى المشاركة — لا حاجة لأي إجراء
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(SITE_URL);
    showToast();
  } catch (err) {
    // فشل النسخ (نادر) — لا نعرض خطأ مزعج
  }
});
