import { createI18n } from 'vue-i18n';

// Dil dosyalarını içe aktar
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

// Varsayılan dil ve desteklenen diller
const DEFAULT_LOCALE = 'tr';
const SUPPORTED_LOCALES = ['tr', 'en'];

// Tarayıcı dilini al
const getBrowserLocale = () => {
  const navigatorLocale = navigator.language.split('-')[0];
  return SUPPORTED_LOCALES.includes(navigatorLocale) ? navigatorLocale : DEFAULT_LOCALE;
};

// Kaydedilmiş dil tercihini al
const getSavedLocale = () => {
  return localStorage.getItem('locale') || getBrowserLocale();
};

// i18n yapılandırması
const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    tr,
    en
  },
  numberFormats: {
    tr: {
      currency: {
        style: 'currency',
        currency: 'TRY',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    },
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard'
      },
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      },
      percent: {
        style: 'percent',
        useGrouping: false
      }
    }
  },
  datetimeFormats: {
    tr: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    },
    en: {
      short: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
});

// Dil değiştirme fonksiyonu
export const setLocale = locale => {
  if (SUPPORTED_LOCALES.includes(locale)) {
    i18n.global.locale.value = locale;
    localStorage.setItem('locale', locale);
    document.querySelector('html').setAttribute('lang', locale);
  }
};

export const availableLocales = SUPPORTED_LOCALES;
export default i18n; 