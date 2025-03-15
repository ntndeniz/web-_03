import { computed } from 'vue'
import { useStore } from 'vuex'

export function useUser() {
  const store = useStore()

  const profile = computed(() => store.getters['user/profile'])
  const addresses = computed(() => store.getters['user/addresses'])
  const orders = computed(() => store.getters['user/orders'])
  const wishlist = computed(() => store.getters['user/wishlist'])
  const notifications = computed(() => store.getters['user/notifications'])

  const updateProfile = async (profileData) => {
    try {
      await store.dispatch('user/updateProfile', profileData)
      store.dispatch('ui/showToast', {
        message: 'Profil güncellendi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Profil güncellenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const addAddress = async (address) => {
    try {
      await store.dispatch('user/addAddress', address)
      store.dispatch('ui/showToast', {
        message: 'Adres eklendi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Adres eklenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const updateAddress = async (addressId, address) => {
    try {
      await store.dispatch('user/updateAddress', { id: addressId, address })
      store.dispatch('ui/showToast', {
        message: 'Adres güncellendi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Adres güncellenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const deleteAddress = async (addressId) => {
    try {
      await store.dispatch('user/deleteAddress', addressId)
      store.dispatch('ui/showToast', {
        message: 'Adres silindi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Adres silinirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const fetchOrders = async () => {
    try {
      await store.dispatch('user/fetchOrders')
    } catch (error) {
      throw error
    }
  }

  const addToWishlist = async (productId) => {
    try {
      await store.dispatch('user/addToWishlist', productId)
      store.dispatch('ui/showToast', {
        message: 'Ürün favorilere eklendi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Ürün favorilere eklenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      await store.dispatch('user/removeFromWishlist', productId)
      store.dispatch('ui/showToast', {
        message: 'Ürün favorilerden kaldırıldı',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Ürün favorilerden kaldırılırken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  return {
    profile,
    addresses,
    orders,
    wishlist,
    notifications,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchOrders,
    addToWishlist,
    removeFromWishlist
  }
} 