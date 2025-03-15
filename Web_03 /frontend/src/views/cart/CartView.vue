<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Alışveriş Sepeti</h1>

    <div v-if="cartItems.length" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="divide-y">
            <div 
              v-for="item in cartItems" 
              :key="item.id"
              class="p-6 flex items-center space-x-4"
            >
              <!-- Product Image -->
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-24 h-24 object-cover rounded-lg"
              >

              <!-- Product Details -->
              <div class="flex-1">
                <h3 class="text-lg font-semibold">{{ item.name }}</h3>
                <p class="text-gray-600 text-sm">{{ item.description }}</p>
                <div class="mt-2 text-blue-600 font-bold">
                  {{ formatPrice(item.price) }} TL
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center space-x-2">
                <button 
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  class="p-1 rounded-full hover:bg-gray-100"
                  :disabled="item.quantity <= 1"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                
                <span class="w-8 text-center">{{ item.quantity }}</span>
                
                <button 
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="p-1 rounded-full hover:bg-gray-100"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                </button>
              </div>

              <!-- Remove Button -->
              <button 
                @click="removeFromCart(item.id)"
                class="text-red-500 hover:text-red-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold mb-4">Sipariş Özeti</h2>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-600">Ara Toplam</span>
              <span>{{ formatPrice(cartTotal) }} TL</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Kargo</span>
              <span>{{ formatPrice(shippingCost) }} TL</span>
            </div>
            <div v-if="discount" class="flex justify-between text-green-600">
              <span>İndirim</span>
              <span>-{{ formatPrice(discount) }} TL</span>
            </div>
            <div class="border-t pt-3">
              <div class="flex justify-between font-bold text-lg">
                <span>Toplam</span>
                <span>{{ formatPrice(total) }} TL</span>
              </div>
            </div>
          </div>

          <!-- Coupon Code -->
          <div class="mb-6">
            <div class="flex space-x-2">
              <input 
                v-model="couponCode"
                type="text"
                placeholder="İndirim kodu"
                class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <button 
                @click="applyCoupon"
                class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Uygula
              </button>
            </div>
          </div>

          <!-- Checkout Button -->
          <button 
            @click="proceedToCheckout"
            class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ödemeye Geç
          </button>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div 
      v-else 
      class="text-center py-12"
    >
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h2>
      <p class="text-gray-600 mb-6">Alışverişe başlamak için ürünlerimize göz atın.</p>
      <router-link 
        to="/products"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Alışverişe Başla
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

export default {
  name: 'CartView',
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()
    
    const couponCode = ref('')
    const discount = ref(0)
    const shippingCost = ref(29.90)

    const cartItems = computed(() => store.getters['cart/cartItems'])
    const cartTotal = computed(() => store.getters['cart/cartTotal'])
    
    const total = computed(() => 
      cartTotal.value + shippingCost.value - discount.value
    )

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR').format(price)
    }

    const updateQuantity = (productId, quantity) => {
      if (quantity < 1) return
      
      store.dispatch('cart/updateQuantity', { productId, quantity })
    }

    const removeFromCart = (productId) => {
      store.dispatch('cart/removeFromCart', productId)
      toast.success('Ürün sepetten kaldırıldı')
    }

    const applyCoupon = () => {
      if (couponCode.value.trim() === 'INDIRIM20') {
        discount.value = cartTotal.value * 0.2
        toast.success('İndirim kodu uygulandı')
      } else {
        toast.error('Geçersiz indirim kodu')
      }
      couponCode.value = ''
    }

    const proceedToCheckout = () => {
      router.push('/checkout')
    }

    return {
      cartItems,
      cartTotal,
      total,
      couponCode,
      discount,
      shippingCost,
      formatPrice,
      updateQuantity,
      removeFromCart,
      applyCoupon,
      proceedToCheckout
    }
  }
}
</script> 