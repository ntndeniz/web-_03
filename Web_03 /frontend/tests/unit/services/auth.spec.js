import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import AuthService from '@/services/auth.service'
import store from '@/store'

describe('AuthService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
    localStorage.clear()
    store.commit('auth/RESET_STATE')
  })

  afterEach(() => {
    mock.restore()
  })

  describe('login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    it('başarılı login yapabilmeli', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: 1,
          email: credentials.email,
          name: 'Test User'
        }
      }

      mock.onPost('/auth/login', credentials).reply(200, mockResponse)

      const response = await AuthService.login(credentials)

      expect(response.data).to.deep.equal(mockResponse)
      expect(localStorage.getItem('token')).to.equal(mockResponse.token)
      expect(store.state.auth.user).to.deep.equal(mockResponse.user)
    })

    it('hatalı kimlik bilgilerinde hata fırlatmalı', async () => {
      mock.onPost('/auth/login', credentials).reply(401, {
        message: 'Geçersiz kimlik bilgileri'
      })

      try {
        await AuthService.login(credentials)
        expect.fail('Hata fırlatılmalıydı')
      } catch (error) {
        expect(error.response.status).to.equal(401)
        expect(localStorage.getItem('token')).to.be.null
        expect(store.state.auth.user).to.be.null
      }
    })
  })

  describe('register', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    }

    it('başarılı kayıt yapabilmeli', async () => {
      const mockResponse = {
        token: 'test-token',
        user: {
          id: 1,
          ...userData
        }
      }

      mock.onPost('/auth/register', userData).reply(201, mockResponse)

      const response = await AuthService.register(userData)

      expect(response.data).to.deep.equal(mockResponse)
      expect(localStorage.getItem('token')).to.equal(mockResponse.token)
      expect(store.state.auth.user).to.deep.equal(mockResponse.user)
    })
  })

  describe('logout', () => {
    it('kullanıcıyı logout yapabilmeli', async () => {
      // Önce login yapalım
      localStorage.setItem('token', 'test-token')
      store.commit('auth/SET_USER', { id: 1, name: 'Test User' })

      await AuthService.logout()

      expect(localStorage.getItem('token')).to.be.null
      expect(store.state.auth.user).to.be.null
    })
  })

  describe('verifyEmail', () => {
    it('email doğrulaması yapabilmeli', async () => {
      const token = 'verification-token'
      mock.onPost('/auth/verify-email', { token }).reply(200)

      await AuthService.verifyEmail(token)
      expect(store.state.auth.isVerified).to.be.true
    })
  })

  describe('forgotPassword', () => {
    it('şifre sıfırlama maili gönderebilmeli', async () => {
      const email = 'test@example.com'
      mock.onPost('/auth/forgot-password', { email }).reply(200)

      await AuthService.forgotPassword(email)
      // Success case kontrolü
    })
  })

  describe('resetPassword', () => {
    it('şifre sıfırlama yapabilmeli', async () => {
      const data = {
        token: 'reset-token',
        password: 'newpassword123'
      }
      mock.onPost('/auth/reset-password', data).reply(200)

      await AuthService.resetPassword(data)
      // Success case kontrolü
    })
  })
}) 