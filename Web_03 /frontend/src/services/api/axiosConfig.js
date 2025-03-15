import axios from 'axios';
import authService from './authService';

// Request interceptor
axios.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser();
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Token expire olmuşsa
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token ile yeni token al
                const user = authService.getCurrentUser();
                const response = await axios.post('/auth/refresh-token', {
                    refreshToken: user.refreshToken
                });

                const { token } = response.data;

                // Yeni token'ı kaydet
                user.token = token;
                localStorage.setItem('user', JSON.stringify(user));

                // Önceki isteği yeni token ile tekrarla
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axios(originalRequest);
            } catch (err) {
                // Refresh token da geçersizse kullanıcıyı çıkış yaptır
                authService.logout();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
); 