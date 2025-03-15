import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export function useCart() {
  const store = useStore()
  const router = useRouter()

  const cartItems = computed(() => store.getters['cart/items'])
  const cartTotal = computed(() => store.getters['cart/total'])
  const cartCount = computed(() => store.getters['cart/count'])
  const cartSubtotal = computed(() => store.getters['cart/subtotal'])
  const cartTax = computed(() => store.getters['cart/tax'])
  const cartShipping = computed(() => store.getters['cart/shipping'])
  const cartDiscount = computed(() => store.getters['cart/discount'])

  const addToCart = async (product, quantity = 1) => {
    try {
      await store.dispatch('cart/addItem', { product, quantity })
      store.dispatch('ui/showToast', {
        message: 'Ürün sepete eklendi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Ürün sepete eklenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      await store.dispatch('cart/updateQuantity', { productId, quantity })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Ürün miktarı güncellenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const removeFromCart = async (productId) => {
    try {
      await store.dispatch('cart/removeItem', productId)
      store.dispatch('ui/showToast', {
        message: 'Ürün sepetten kaldırıldı',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Ürün sepetten kaldırılırken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const clearCart = async () => {
    try {
      await store.dispatch('cart/clearCart')
    } catch (error) {
      throw error
    }
  }

  const applyCoupon = async (code) => {
    try {
      await store.dispatch('cart/applyCoupon', code)
      store.dispatch('ui/showToast', {
        message: 'Kupon kodu uygulandı',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Kupon kodu uygulanırken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  const removeCoupon = async () => {
    try {
      await store.dispatch('cart/removeCoupon')
    } catch (error) {
      throw error
    }
  }

  const proceedToCheckout = () => {
    if (cartItems.value.length === 0) {
      store.dispatch('ui/showToast', {
        message: 'Sepetiniz boş',
        type: 'warning'
      })
      return
    }
    router.push('/odeme')
  }

  return {
    cartItems,
    cartTotal,
    cartCount,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartDiscount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    proceedToCheckout
  }
} 