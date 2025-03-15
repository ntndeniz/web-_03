import api from './api'

export default {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get('/user/profile')
    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put('/user/profile', profileData)
    return response.data
  },

  async changePassword(passwordData) {
    const response = await api.post('/user/change-password', passwordData)
    return response.data
  },

  async getAddresses() {
    const response = await api.get('/user/addresses')
    return response.data
  },

  async addAddress(addressData) {
    const response = await api.post('/user/addresses', addressData)
    return response.data
  },

  async updateAddress(id, addressData) {
    const response = await api.put(`/user/addresses/${id}`, addressData)
    return response.data
  },

  async deleteAddress(id) {
    const response = await api.delete(`/user/addresses/${id}`)
    return response.data
  }
} 