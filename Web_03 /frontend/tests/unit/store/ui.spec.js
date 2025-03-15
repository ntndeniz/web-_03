import { expect } from 'chai'
import { createStore } from 'vuex'
import ui from '@/store/modules/ui'

describe('UI Store', () => {
  let store

  beforeEach(() => {
    store = createStore({
      modules: {
        ui: {
          ...ui
        }
      }
    })
  })

  describe('mutations', () => {
    it('SET_SIDEBAR_OPEN mutation sidebar durumunu güncellemeli', () => {
      store.commit('ui/SET_SIDEBAR_OPEN', true)
      expect(store.state.ui.isSidebarOpen).to.be.true

      store.commit('ui/SET_SIDEBAR_OPEN', false)
      expect(store.state.ui.isSidebarOpen).to.be.false
    })

    it('SET_THEME mutation tema ayarını güncellemeli', () => {
      store.commit('ui/SET_THEME', 'dark')
      expect(store.state.ui.theme).to.equal('dark')
    })

    it('SET_LOADING mutation yükleme durumunu güncellemeli', () => {
      store.commit('ui/SET_LOADING', true)
      expect(store.state.ui.loading).to.be.true
    })

    it('SET_TOAST mutation toast mesajını güncellemeli', () => {
      const toast = {
        message: 'Test mesajı',
        type: 'success',
        duration: 3000
      }
      store.commit('ui/SET_TOAST', toast)
      expect(store.state.ui.toast).to.deep.equal(toast)
    })

    it('CLEAR_TOAST mutation toast mesajını temizlemeli', () => {
      store.commit('ui/SET_TOAST', { message: 'Test' })
      store.commit('ui/CLEAR_TOAST')
      expect(store.state.ui.toast).to.be.null
    })
  })

  describe('actions', () => {
    it('toggleSidebar action sidebar durumunu değiştirebilmeli', () => {
      store.dispatch('ui/toggleSidebar')
      expect(store.state.ui.isSidebarOpen).to.be.true

      store.dispatch('ui/toggleSidebar')
      expect(store.state.ui.isSidebarOpen).to.be.false
    })

    it('setTheme action tema ayarını kaydedebilmeli', () => {
      store.dispatch('ui/setTheme', 'dark')
      expect(store.state.ui.theme).to.equal('dark')
      expect(localStorage.getItem('theme')).to.equal('dark')
    })

    it('showToast action toast gösterebilmeli', async () => {
      const toast = {
        message: 'Test başarılı',
        type: 'success'
      }

      store.dispatch('ui/showToast', toast)
      expect(store.state.ui.toast).to.deep.include(toast)

      // Toast otomatik kapanma kontrolü
      await new Promise(resolve => setTimeout(resolve, 3000))
      expect(store.state.ui.toast).to.be.null
    })
  })

  describe('getters', () => {
    it('isDarkTheme getter tema durumunu kontrol etmeli', () => {
      store.commit('ui/SET_THEME', 'light')
      expect(store.getters['ui/isDarkTheme']).to.be.false

      store.commit('ui/SET_THEME', 'dark')
      expect(store.getters['ui/isDarkTheme']).to.be.true
    })

    it('isLoading getter yükleme durumunu kontrol etmeli', () => {
      expect(store.getters['ui/isLoading']).to.be.false

      store.commit('ui/SET_LOADING', true)
      expect(store.getters['ui/isLoading']).to.be.true
    })

    it('hasActiveToast getter toast durumunu kontrol etmeli', () => {
      expect(store.getters['ui/hasActiveToast']).to.be.false

      store.commit('ui/SET_TOAST', { message: 'Test' })
      expect(store.getters['ui/hasActiveToast']).to.be.true
    })
  })
}) 