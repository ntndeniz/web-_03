import axios from 'axios';
import store from '@/store';
import router from '@/router';
import ErrorHandler from '@/utils/errorHandler';

// Axios instance oluştur
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// İstek öncesi interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Loading durumunu başlat
    store.commit('ui/SET_LOADING', true);

    // Token varsa ekle
    const token = store.getters['auth/token'];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    store.commit('ui/SET_LOADING', false);
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
axiosInstance.interceptors.response.use(
  response => {
    store.commit('ui/SET_LOADING', false);
    return response;
  },
  error => {
    store.commit('ui/SET_LOADING', false);

    // Hata işleme
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token geçersiz veya süresi dolmuş
          store.dispatch('auth/logout');
          router.push('/giris');
          store.dispatch('ui/showToast', {
            message: 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.',
            type: 'error'
          });
          break;

        case 403:
          // Yetkisiz erişim
          router.push('/yetkisiz');
          store.dispatch('ui/showToast', {
            message: 'Bu işlem için yetkiniz bulunmuyor.',
            type: 'error'
          });
          break;

        case 404:
          // Sayfa bulunamadı
          router.push('/404');
          break;

        case 422:
          // Validasyon hatası
          const validationErrors = error.response.data.errors;
          Object.keys(validationErrors).forEach(field => {
            store.dispatch('ui/showToast', {
              message: validationErrors[field][0],
              type: 'error'
            });
          });
          break;

        case 500:
          // Sunucu hatası
          store.dispatch('ui/showToast', {
            message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            type: 'error'
          });
          break;
      }
    }

    // Hata yönetimi
    ErrorHandler.handleApiError(error);

    return Promise.reject(error);
  }
);

// Plugin olarak kaydet
export default {
  install: (app) => {
    app.config.globalProperties.$axios = axiosInstance;
  }
};

// Instance'ı dışa aktar
export { axiosInstance }; 