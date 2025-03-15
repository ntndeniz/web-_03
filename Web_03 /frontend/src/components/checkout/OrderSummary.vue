<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <h2 class="text-lg font-medium text-gray-900 mb-4">Sipariş Özeti</h2>

    <!-- Ürün Listesi -->
    <div class="space-y-4 mb-6">
      <div v-for="item in items" :key="item.id" class="flex justify-between">
        <div class="flex-1">
          <p class="text-sm text-gray-600">
            {{ item.name }}
            <span class="text-gray-500">({{ item.quantity }}x)</span>
          </p>
          <p v-if="item.variant" class="text-xs text-gray-500">
            {{ item.variant }}
          </p>
        </div>
        <p class="text-sm font-medium text-gray-900">
          {{ formatPrice(item.price * item.quantity) }}
        </p>
      </div>
    </div>

    <!-- Ara Toplam -->
    <div class="border-t border-gray-200 pt-4 space-y-4">
      <div class="flex justify-between text-sm">
        <p class="text-gray-600">Ara Toplam</p>
        <p class="font-medium text-gray-900">{{ formatPrice(subtotal) }}</p>
      </div>

      <!-- Kargo -->
      <div class="flex justify-between text-sm">
        <p class="text-gray-600">Kargo</p>
        <p class="font-medium text-gray-900">{{ formatPrice(shipping) }}</p>
      </div>

      <!-- İndirim -->
      <div v-if="discount > 0" class="flex justify-between text-sm">
        <p class="text-green-600">İndirim</p>
        <p class="font-medium text-green-600">-{{ formatPrice(discount) }}</p>
      </div>

      <!-- Toplam -->
      <div class="flex justify-between pt-4 border-t border-gray-200">
        <p class="text-base font-medium text-gray-900">Toplam</p>
        <p class="text-base font-medium text-gray-900">
          {{ formatPrice(total) }}
        </p>
      </div>
    </div>

    <!-- Kupon Kodu -->
    <div class="mt-6">
      <div class="flex space-x-4">
        <input
          v-model="couponCode"
          type="text"
          placeholder="Kupon Kodu"
          class="flex-1 min-w-0 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        <button
          @click="applyCoupon"
          :disabled="!couponCode || applyingCoupon"
          class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <i v-if="applyingCoupon" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Uygula</span>
        </button>
      </div>
      <p v-if="couponError" class="mt-2 text-sm text-red-600">
        {{ couponError }}
      </p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'OrderSummary',

  props: {
    items: {
      type: Array,
      required: true
    },
    shipping: {
      type: Number,
      default: 0
    }
  },

  setup(props) {
    const store = useStore()
    const couponCode = ref('')
    const couponError = ref('')
    const applyingCoupon = ref(false)

    const subtotal = computed(() => {
      return props.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0)
    })

    const discount = computed(() => {
      return store.state.cart.discount || 0
    })

    const total = computed(() => {
      return subtotal.value + props.shipping - discount.value
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const applyCoupon = async () => {
      if (!couponCode.value || applyingCoupon.value) return

      applyingCoupon.value = true
      couponError.value = ''

      try {
        await store.dispatch('cart/applyCoupon', couponCode.value)
        couponCode.value = ''
      } catch (error) {
        couponError.value = error.message || 'Kupon uygulanırken bir hata oluştu'
      } finally {
        applyingCoupon.value = false
      }
    }

    return {
      couponCode,
      couponError,
      applyingCoupon,
      subtotal,
      discount,
      total,
      formatPrice,
      applyCoupon
    }
  }
}
</script> 