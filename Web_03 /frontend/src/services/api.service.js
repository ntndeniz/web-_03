import axios from 'axios';
import store from '@/store';
import router from '@/router';

const ApiService = {
  init() {
    axios.defaults.baseURL = process.env.VUE_APP_API_URL;
    
    // İstek öncesi interceptor
    axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Yanıt interceptor'ı
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          store.dispatch('auth/logout');
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );
  },

  get(resource, params) {
    return axios.get(resource, { params });
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },

  // Özel istekler
  customRequest(config) {
    return axios(config);
  }
};

export default ApiService; 