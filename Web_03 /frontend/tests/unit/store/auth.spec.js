import { expect } from 'chai'
import { createStore } from 'vuex'
import auth from '@/store/modules/auth'
import AuthService from '@/services/auth.service'
import sinon from 'sinon'

describe('Auth Store', () => {
  let store
  let mockAuthService

  beforeEach(() => {
    mockAuthService = {
      login: sinon.stub(),
      register: sinon.stub(),
      logout: sinon.stub(),
      verifyEmail: sinon.stub()
    }

    store = createStore({
      modules: {
        auth: {
          ...auth,
          actions: {
            ...auth.actions,
            $authService: mockAuthService
          }
        }
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_USER mutation kullanıcı bilgisini güncellemeli', () => {
      const user = { id: 1, name: 'Test User' }
      store.commit('auth/SET_USER', user)
      expect(store.state.auth.user).to.deep.equal(user)
    })

    it('SET_TOKEN mutation token bilgisini güncellemeli', () => {
      const token = 'test-token'
      store.commit('auth/SET_TOKEN', token)
      expect(store.state.auth.token).to.equal(token)
    })

    it('CLEAR_AUTH mutation state\'i temizlemeli', () => {
      store.commit('auth/SET_USER', { id: 1 })
      store.commit('auth/SET_TOKEN', 'token')
      store.commit('auth/CLEAR_AUTH')
      
      expect(store.state.auth.user).to.be.null
      expect(store.state.auth.token).to.be.null
    })
  })

  describe('actions', () => {
    it('login action başarılı olmalı', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const response = {
        data: {
          user: { id: 1, email: credentials.email },
          token: 'test-token'
        }
      }

      mockAuthService.login.resolves(response)

      await store.dispatch('auth/login', credentials)

      expect(store.state.auth.user).to.deep.equal(response.data.user)
      expect(store.state.auth.token).to.equal(response.data.token)
      expect(mockAuthService.login.calledWith(credentials)).to.be.true
    })

    it('register action başarılı olmalı', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const response = {
        data: {
          user: { id: 1, ...userData },
          token: 'test-token'
        }
      }

      mockAuthService.register.resolves(response)

      await store.dispatch('auth/register', userData)

      expect(store.state.auth.user).to.deep.equal(response.data.user)
      expect(store.state.auth.token).to.equal(response.data.token)
      expect(mockAuthService.register.calledWith(userData)).to.be.true
    })

    it('logout action state\'i temizlemeli', async () => {
      store.commit('auth/SET_USER', { id: 1 })
      store.commit('auth/SET_TOKEN', 'token')

      await store.dispatch('auth/logout')

      expect(store.state.auth.user).to.be.null
      expect(store.state.auth.token).to.be.null
      expect(mockAuthService.logout.called).to.be.true
    })

    it('verifyEmail action başarılı olmalı', async () => {
      const token = 'verification-token'
      mockAuthService.verifyEmail.resolves()

      await store.dispatch('auth/verifyEmail', token)

      expect(store.state.auth.isVerified).to.be.true
      expect(mockAuthService.verifyEmail.calledWith(token)).to.be.true
    })
  })

  describe('getters', () => {
    it('isAuthenticated getter doğru çalışmalı', () => {
      expect(store.getters['auth/isAuthenticated']).to.be.false

      store.commit('auth/SET_TOKEN', 'test-token')
      expect(store.getters['auth/isAuthenticated']).to.be.true
    })

    it('currentUser getter kullanıcı bilgisini döndürmeli', () => {
      const user = { id: 1, name: 'Test User' }
      store.commit('auth/SET_USER', user)
      expect(store.getters['auth/currentUser']).to.deep.equal(user)
    })
  })
}) 