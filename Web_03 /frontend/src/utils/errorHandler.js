import store from '@/store'
import router from '@/router'
import { ERROR_MESSAGES } from '@/utils/constants'

class ErrorHandler {
  constructor() {
    this.store = store
  }

  handle(error) {
    console.error('Error:', error)

    if (!error.response) {
      return this.handleNetworkError(error)
    }

    switch (error.response.status) {
      case 400:
        return this.handleValidationError(error)
      case 401:
        return this.handleAuthenticationError(error)
      case 403:
        return this.handleForbiddenError(error)
      case 404:
        return this.handleNotFoundError(error)
      case 422:
        return this.handleValidationError(error)
      case 500:
        return this.handleServerError(error)
      default:
        return this.handleDefaultError(error)
    }
  }

  handleNetworkError(error) {
    this.showError(ERROR_MESSAGES.NETWORK_ERROR)
    return Promise.reject(error)
  }

  handleAuthenticationError(error) {
    this.store.dispatch('auth/logout')
    router.push('/login')
    this.showError(ERROR_MESSAGES.AUTH_ERROR)
    return Promise.reject(error)
  }

  handleForbiddenError(error) {
    router.push('/unauthorized')
    this.showError('Bu işlem için yetkiniz bulunmuyor.')
    return Promise.reject(error)
  }

  handleNotFoundError(error) {
    router.push('/404')
    this.showError(ERROR_MESSAGES.NOT_FOUND)
    return Promise.reject(error)
  }

  handleValidationError(error) {
    const message = error.response?.data?.message || ERROR_MESSAGES.VALIDATION_ERROR
    this.showError(message)
    return Promise.reject(error)
  }

  handleServerError(error) {
    this.showError(ERROR_MESSAGES.SERVER_ERROR)
    return Promise.reject(error)
  }

  handleDefaultError(error) {
    this.showError('Beklenmeyen bir hata oluştu.')
    return Promise.reject(error)
  }

  showError(message) {
    this.store.dispatch('ui/showToast', {
      type: 'error',
      message
    })
  }
}

export default new ErrorHandler() 