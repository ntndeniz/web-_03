import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export function useAuth() {
  const store = useStore()
  const router = useRouter()

  const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
  const isAdmin = computed(() => store.getters['auth/isAdmin'])
  const user = computed(() => store.getters['auth/user'])
  const token = computed(() => store.getters['auth/token'])

  const login = async (credentials) => {
    try {
      await store.dispatch('auth/login', credentials)
      const redirectPath = store.getters['auth/redirectPath'] || '/'
      router.push(redirectPath)
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      await store.dispatch('auth/register', userData)
      router.push('/email-dogrulama')
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await store.dispatch('auth/logout')
      router.push('/giris')
    } catch (error) {
      throw error
    }
  }

  const forgotPassword = async (email) => {
    try {
      await store.dispatch('auth/forgotPassword', email)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (resetData) => {
    try {
      await store.dispatch('auth/resetPassword', resetData)
      router.push('/giris')
    } catch (error) {
      throw error
    }
  }

  const updatePassword = async (passwords) => {
    try {
      await store.dispatch('auth/updatePassword', passwords)
    } catch (error) {
      throw error
    }
  }

  const verifyEmail = async (token) => {
    try {
      await store.dispatch('auth/verifyEmail', token)
      router.push('/giris')
    } catch (error) {
      throw error
    }
  }

  return {
    isAuthenticated,
    isAdmin,
    user,
    token,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    verifyEmail
  }
} 