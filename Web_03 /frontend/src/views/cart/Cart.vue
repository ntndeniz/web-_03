<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Alışveriş Sepeti</h1>

    <div v-if="cartItems.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6 mb-4" v-for="item in cartItems" :key="item.id">
          <div class="flex items-center">
            <img :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded">
            <div class="ml-4 flex-1">
              <h3 class="text-lg font-semibold">{{ item.name }}</h3>
              <p class="text-gray-600">{{ item.price }} TL</p>
            </div>
            <div class="flex items-center">
              <button 
                @click="updateQuantity(item, item.quantity - 1)"
                class="text-gray-500 hover:text-gray-700"
              >
                -
              </button>
              <span class="mx-2">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item, item.quantity + 1)"
                class="text-gray-500 hover:text-gray-700"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 h-fit">
        <h2 class="text-xl font-semibold mb-4">Sipariş Özeti</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Ara Toplam</span>
            <span>{{ subtotal }} TL</span>
          </div>
          <div class="flex justify-between">
            <span>KDV</span>
            <span>{{ tax }} TL</span>
          </div>
          <div class="flex justify-between font-semibold">
            <span>Toplam</span>
            <span>{{ total }} TL</span>
          </div>
        </div>
        <button 
          @click="$router.push('/checkout')"
          class="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ödemeye Geç
        </button>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-600">Sepetiniz boş</p>
      <router-link 
        to="/products"
        class="inline-block mt-4 text-blue-600 hover:text-blue-800"
      >
        Alışverişe Başla
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  computed: {
    cartItems() {
      return this.$store.state.cart.items
    },
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    tax() {
      return this.subtotal * 0.18
    },
    total() {
      return this.subtotal + this.tax
    }
  },
  methods: {
    updateQuantity(item, quantity) {
      if (quantity < 1) {
        this.$store.dispatch('cart/removeItem', item)
      } else {
        this.$store.dispatch('cart/updateQuantity', { item, quantity })
      }
    }
  }
}
</script> 