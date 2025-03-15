import axios from 'axios';
import { API_URL } from '../config';

const authService = {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async forgotPassword(email) {
        try {
            const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    async resetPassword(token, newPassword) {
        try {
            const response = await axios.post(`${API_URL}/auth/reset-password`, {
                token,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    handleError(error) {
        if (error.response) {
            // Server tarafından dönen hata
            return error.response.data;
        } else if (error.request) {
            // İstek yapıldı ama cevap alınamadı
            return { message: 'Sunucuya ulaşılamıyor' };
        } else {
            // İstek oluşturulurken hata oluştu
            return { message: 'Bir hata oluştu' };
        }
    }
};

export default authService; 