<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Ödeme</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2 space-y-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Teslimat Adresi</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-gray-700 mb-2">Ad Soyad</label>
              <input 
                type="text" 
                v-model="address.name"
                class="w-full px-4 py-2 border rounded"
              >
            </div>
            <div>
              <label class="block text-gray-700 mb-2">Adres</label>
              <textarea 
                v-model="address.street"
                rows="3"
                class="w-full px-4 py-2 border rounded"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-2">Şehir</label>
                <input 
                  type="text" 
                  v-model="address.city"
                  class="w-full px-4 py-2 border rounded"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-2">Posta Kodu</label>
                <input 
                  type="text" 
                  v-model="address.zipCode"
                  class="w-full px-4 py-2 border rounded"
                >
              </div>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>
          <form class="space-y-4">
            <div>
              <label class="block text-gray-700 mb-2">Kart Numarası</label>
              <input 
                type="text" 
                v-model="payment.cardNumber"
                class="w-full px-4 py-2 border rounded"
              >
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-gray-700 mb-2">Son Kullanma Tarihi</label>
                <input 
                  type="text" 
                  v-model="payment.expiry"
                  class="w-full px-4 py-2 border rounded"
                  placeholder="MM/YY"
                >
              </div>
              <div>
                <label class="block text-gray-700 mb-2">CVV</label>
                <input 
                  type="text" 
                  v-model="payment.cvv"
                  class="w-full px-4 py-2 border rounded"
                >
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 h-fit">
        <h2 class="text-xl font-semibold mb-4">Sipariş Özeti</h2>
        <div class="space-y-4">
          <div v-for="item in cartItems" :key="item.id" class="flex justify-between">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>{{ item.price * item.quantity }} TL</span>
          </div>
          <hr>
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
          @click="handleCheckout"
          class="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Siparişi Tamamla
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckoutView',
  data() {
    return {
      address: {
        name: '',
        street: '',
        city: '',
        zipCode: ''
      },
      payment: {
        cardNumber: '',
        expiry: '',
        cvv: ''
      }
    }
  },
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
    async handleCheckout() {
      try {
        await this.$store.dispatch('order/create', {
          items: this.cartItems,
          address: this.address,
          payment: this.payment,
          total: this.total
        })
        this.$router.push('/order-confirmation')
        this.$toast.success('Siparişiniz başarıyla oluşturuldu')
      } catch (error) {
        this.$toast.error('Sipariş oluşturulurken hata oluştu')
      }
    }
  }
}
</script> 