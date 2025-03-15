import ApiService from './api.service';

const AuthService = {
  async login(credentials) {
    try {
      const response = await ApiService.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw new Error('Giriş yapılırken bir hata oluştu');
    }
  },

  async register(userData) {
    try {
      const response = await ApiService.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response;
    } catch (error) {
      throw new Error('Kayıt olurken bir hata oluştu');
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  async forgotPassword(email) {
    try {
      return await ApiService.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error('Şifre sıfırlama isteği gönderilirken bir hata oluştu');
    }
  },

  async resetPassword(token, newPassword) {
    try {
      return await ApiService.post('/auth/reset-password', {
        token,
        newPassword
      });
    } catch (error) {
      throw new Error('Şifre sıfırlanırken bir hata oluştu');
    }
  },

  async verifyEmail(token) {
    try {
      return await ApiService.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error('E-posta doğrulanırken bir hata oluştu');
    }
  },

  async refreshToken() {
    try {
      const response = await ApiService.post('/auth/refresh-token');
      return response;
    } catch (error) {
      throw new Error('Token yenilenirken bir hata oluştu');
    }
  },

  async changePassword(passwords) {
    try {
      const response = await ApiService.post('/auth/change-password', passwords);
      return response;
    } catch (error) {
      throw new Error('Şifre değiştirilirken bir hata oluştu');
    }
  },

  async sendVerificationEmail() {
    try {
      const response = await ApiService.post('/auth/send-verification');
      return response;
    } catch (error) {
      throw new Error('Doğrulama e-postası gönderilirken bir hata oluştu');
    }
  },

  async validateResetToken(token) {
    try {
      const response = await ApiService.get(`/auth/validate-reset-token/${token}`);
      return response;
    } catch (error) {
      throw new Error('Sıfırlama tokeni doğrulanırken bir hata oluştu');
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await ApiService.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      throw new Error('Profil güncellenirken bir hata oluştu');
    }
  },

  async enable2FA() {
    try {
      return await ApiService.post('/auth/2fa/enable');
    } catch (error) {
      throw new Error('2FA etkinleştirilirken bir hata oluştu');
    }
  },

  async verify2FA(code) {
    try {
      return await ApiService.post('/auth/2fa/verify', { code });
    } catch (error) {
      throw new Error('2FA doğrulanırken bir hata oluştu');
    }
  },

  async disable2FA() {
    try {
      return await ApiService.post('/auth/2fa/disable');
    } catch (error) {
      throw new Error('2FA devre dışı bırakılırken bir hata oluştu');
    }
  }
};

export default AuthService; 