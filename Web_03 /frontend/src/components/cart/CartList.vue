<template>
  <div class="space-y-6">
    <!-- Yükleniyor -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Sepet Boş -->
    <div 
      v-else-if="!cartItems.length"
      class="rounded-lg border-2 border-dashed p-12 text-center"
    >
      <div class="mb-4 text-gray-400">
        <i class="fas fa-shopping-cart text-6xl"></i>
      </div>
      <h3 class="mb-2 text-lg font-medium">Sepetiniz Boş</h3>
      <p class="mb-6 text-gray-600">
        Sepetinizde henüz ürün bulunmuyor. Alışverişe başlamak için ürünlerimizi inceleyebilirsiniz.
      </p>
      <router-link 
        to="/urunler"
        class="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Alışverişe Başla
      </router-link>
    </div>

    <!-- Sepet Listesi -->
    <div v-else>
      <div class="space-y-4">
        <CartItem 
          v-for="item in cartItems"
          :key="item.id"
          :item="item"
          @update-quantity="updateQuantity"
          @remove="removeFromCart"
        />
      </div>

      <!-- Alt Toplam -->
      <div class="mt-6 rounded-lg bg-gray-50 p-6">
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">Ara Toplam</span>
            <span class="font-medium">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">KDV (%18)</span>
            <span class="font-medium">{{ formatPrice(tax) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Kargo</span>
            <span class="font-medium">{{ shipping > 0 ? formatPrice(shipping) : 'Ücretsiz' }}</span>
          </div>
          <div class="border-t pt-2">
            <div class="flex justify-between">
              <span class="text-lg font-medium">Toplam</span>
              <span class="text-lg font-bold text-blue-600">{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>

        <!-- Ödeme Butonu -->
        <button 
          @click="proceedToCheckout"
          class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700"
        >
          Ödemeye Geç
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CartItem from './CartItem.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'CartList',
  components: {
    CartItem,
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(true)

    const cartItems = computed(() => store.getters['cart/items'])
    const subtotal = computed(() => store.getters['cart/subtotal'])
    const tax = computed(() => subtotal.value * 0.18)
    const shipping = computed(() => subtotal.value >= 150 ? 0 : 14.99)
    const total = computed(() => subtotal.value + tax.value + shipping.value)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const updateQuantity = async (itemId, quantity) => {
      try {
        await store.dispatch('cart/updateQuantity', { itemId, quantity })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Miktar güncellenirken bir hata oluştu'
        })
      }
    }

    const removeFromCart = async (itemId) => {
      try {
        await store.dispatch('cart/removeFromCart', itemId)
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Ürün sepetten kaldırıldı'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Ürün kaldırılırken bir hata oluştu'
        })
      }
    }

    const proceedToCheckout = () => {
      if (!store.getters['auth/isLoggedIn']) {
        store.dispatch('ui/showToast', {
          type: 'warning',
          message: 'Ödeme yapmak için giriş yapmalısınız'
        })
        router.push('/giris?redirect=/odeme')
        return
      }
      router.push('/odeme')
    }

    onMounted(async () => {
      try {
        await store.dispatch('cart/fetchCart')
      } catch (error) {
        console.error('Sepet yüklenirken hata:', error)
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      cartItems,
      subtotal,
      tax,
      shipping,
      total,
      formatPrice,
      updateQuantity,
      removeFromCart,
      proceedToCheckout
    }
  }
}
</script> 