import axios from './axios.config';

class ApiService {
    constructor() {
        this.axios = axios;
    }

    async get(endpoint, params = {}) {
        try {
            const response = await this.axios.get(endpoint, { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async post(endpoint, data = {}) {
        try {
            const response = await this.axios.post(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async put(endpoint, data = {}) {
        try {
            const response = await this.axios.put(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async delete(endpoint) {
        try {
            const response = await this.axios.delete(endpoint);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async upload(endpoint, file, onProgress) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await this.axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    }
                }
            });

            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            // Server kaynaklı hata
            const status = error.response.status;
            const data = error.response.data;

            switch (status) {
                case 400:
                    throw new Error(data.message || 'Geçersiz istek');
                case 401:
                    throw new Error(data.message || 'Yetkisiz erişim');
                case 403:
                    throw new Error(data.message || 'Erişim reddedildi');
                case 404:
                    throw new Error(data.message || 'Kaynak bulunamadı');
                case 422:
                    throw new Error(data.message || 'Doğrulama hatası');
                default:
                    throw new Error(data.message || 'Sunucu hatası');
            }
        } else if (error.request) {
            // İstek yapıldı ama cevap alınamadı
            throw new Error('Sunucuya ulaşılamıyor');
        } else {
            // İstek oluşturulurken hata oluştu
            throw new Error('İstek oluşturulamadı');
        }
    }
}

export default new ApiService(); 