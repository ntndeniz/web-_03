<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h3 class="text-lg font-semibold mb-4">Sipariş Özeti</h3>
    
    <div class="space-y-3 text-sm">
      <div class="flex justify-between">
        <span>Ara Toplam</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      
      <div v-if="discount" class="flex justify-between text-green-600">
        <span>İndirim</span>
        <span>-{{ formatPrice(discount) }}</span>
      </div>
      
      <div class="flex justify-between">
        <span>Kargo</span>
        <span>{{ shipping > 0 ? formatPrice(shipping) : 'Ücretsiz' }}</span>
      </div>
      
      <div class="border-t pt-3 font-semibold">
        <div class="flex justify-between">
          <span>Toplam</span>
          <span>{{ formatPrice(total) }}</span>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <button 
        @click="proceedToCheckout"
        class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        :disabled="!hasItems"
      >
        Ödemeye Geç
      </button>
    </div>

    <!-- Kupon Kodu -->
    <div class="mt-6 pt-6 border-t">
      <div class="flex gap-2">
        <input 
          v-model="couponCode"
          type="text"
          placeholder="Kupon Kodu"
          class="flex-1 px-4 py-2 border rounded-lg"
        />
        <button 
          @click="applyCoupon"
          class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          :disabled="!couponCode"
        >
          Uygula
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CartSummary',
  setup() {
    const store = useStore()
    const router = useRouter()
    const couponCode = ref('')

    const subtotal = computed(() => store.getters['cart/subtotal'])
    const discount = computed(() => store.state.cart.discount)
    const shipping = computed(() => store.getters['cart/shippingCost'])
    const total = computed(() => store.getters['cart/total'])
    const hasItems = computed(() => store.state.cart.items.length > 0)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const applyCoupon = async () => {
      try {
        await store.dispatch('cart/applyCoupon', couponCode.value)
        couponCode.value = ''
      } catch (error) {
        console.error('Kupon uygulanırken hata:', error)
      }
    }

    const proceedToCheckout = () => {
      router.push('/odeme')
    }

    return {
      couponCode,
      subtotal,
      discount,
      shipping,
      total,
      hasItems,
      formatPrice,
      applyCoupon,
      proceedToCheckout
    }
  }
}
</script> 