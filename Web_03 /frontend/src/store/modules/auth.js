import { auth, db } from '@/firebase'
import AuthService from '@/services/auth.service'
import router from '@/router'

export default {
  namespaced: true,

  state: {
    user: null,
    profile: null,
    loading: false,
    error: null,
    isLoggedIn: false,
    token: localStorage.getItem('token') || null,
    isVerifying: false
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      state.isLoggedIn = !!user
    },
    SET_PROFILE(state, profile) {
      state.profile = profile
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_VERIFYING(state, status) {
      state.isVerifying = status
    }
  },

  actions: {
    // Oturum açma
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true)
        const response = await AuthService.login(credentials)
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.token)
        router.push('/')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Oturum kapatma
    logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_PROFILE', null)
      commit('SET_TOKEN', null)
      router.push('/login')
    },

    // Oturum durumu değişikliği
    async handleAuthStateChange({ commit, dispatch }) {
      auth.onAuthStateChanged(async user => {
        if (user) {
          try {
            const profile = await db.collection('users').doc(user.uid).get()
            
            if (profile.exists && profile.data().isAdmin) {
              commit('SET_USER', {
                id: user.uid,
                email: user.email
              })
              commit('SET_PROFILE', profile.data())
            } else {
              await dispatch('logout')
            }
          } catch (error) {
            commit('SET_ERROR', error.message)
          }
        } else {
          commit('SET_USER', null)
          commit('SET_PROFILE', null)
        }
      })
    },

    // Şifre sıfırlama
    async resetPassword({ commit }, { token, newPassword }) {
      try {
        commit('SET_LOADING', true)
        await AuthService.resetPassword(token, newPassword)
        router.push('/login')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Profil güncelleme
    async updateProfile({ commit, state }, profileData) {
      commit('SET_LOADING', true)
      
      try {
        await db.collection('users').doc(state.user.id).update(profileData)
        commit('SET_PROFILE', { ...state.profile, ...profileData })
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true)
        const response = await AuthService.register(userData)
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.token)
        router.push('/verify-email')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async verifyEmail({ commit }, token) {
      try {
        commit('SET_VERIFYING', true)
        await AuthService.verifyEmail(token)
        router.push('/login')
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_VERIFYING', false)
      }
    },

    async forgotPassword({ commit }, email) {
      try {
        commit('SET_LOADING', true)
        await AuthService.forgotPassword(email)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.profile?.isAdmin || false,
    userProfile: state => state.profile,
    userId: state => state.user?.id,
    currentUser: state => state.user,
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    getError: state => state.error,
    isVerifyingEmail: state => state.isVerifying
  }
} 