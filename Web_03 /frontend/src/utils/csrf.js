import { store } from '@/store'
import { captureException } from '@/config/sentry'

class CsrfProtection {
  constructor() {
    this.token = null
    this.headerName = 'X-CSRF-TOKEN'
  }

  async initialize() {
    try {
      await this.fetchToken()
      this.setupAxiosInterceptor()
    } catch (error) {
      this.handleError(error)
    }
  }

  async fetchToken() {
    try {
      const response = await fetch('/api/csrf-token')
      const data = await response.json()
      this.token = data.token
      this.storeCookie(this.token)
    } catch (error) {
      this.handleError(error)
      throw new Error('CSRF token alınamadı')
    }
  }

  setupAxiosInterceptor() {
    const axios = store.state.axios

    axios.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers[this.headerName] = this.token
        }
        return config
      },
      (error) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 419) {
          // CSRF token geçersiz, yeni token al
          return this.handleTokenExpired(error.config)
        }
        return Promise.reject(error)
      }
    )
  }

  async handleTokenExpired(failedRequest) {
    try {
      await this.fetchToken()
      failedRequest.headers[this.headerName] = this.token
      return axios(failedRequest)
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  storeCookie(token) {
    document.cookie = `XSRF-TOKEN=${token}; path=/; secure; samesite=strict`
  }

  validateToken(token) {
    return typeof token === 'string' && token.length >= 40
  }

  getTokenFromCookie() {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='))
    return tokenCookie ? tokenCookie.split('=')[1] : null
  }

  private handleError(error) {
    console.error('CSRF hatası:', error)
    captureException(error, {
      service: 'CsrfProtection',
      token: this.token ? 'exists' : 'missing'
    })
  }
}

export const csrfProtection = new CsrfProtection()

export const initializeCsrfProtection = () => {
  return csrfProtection.initialize()
}

export default csrfProtection 