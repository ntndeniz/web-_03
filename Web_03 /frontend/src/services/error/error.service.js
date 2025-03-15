import { toast } from 'react-toastify';
import * as Sentry from '@sentry/browser';

class ErrorService {
    constructor() {
        this.defaultOptions = {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        };
    }

    handle(error, options = {}) {
        // Hata loglama
        console.error(error);
        
        // Sentry'ye gönder
        if (process.env.NODE_ENV === 'production') {
            Sentry.captureException(error);
        }

        // Kullanıcıya bildirim göster
        this.notify(error.message, { ...this.defaultOptions, ...options });

        return error;
    }

    notify(message, options = {}) {
        toast.error(message, options);
    }
}

export default new ErrorService(); 