<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <h2 class="text-xl font-semibold">Kuponlarım</h2>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="coupon in coupons" 
          :key="coupon.id"
          class="border rounded-lg overflow-hidden"
        >
          <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold mb-1">{{ coupon.title }}</h3>
                <p class="text-sm opacity-90">{{ coupon.description }}</p>
              </div>
              <div class="text-2xl font-bold">
                %{{ coupon.discountRate }}
              </div>
            </div>
          </div>

          <div class="p-4">
            <div class="flex justify-between items-center mb-4">
              <div class="text-sm text-gray-600">
                <div>Minimum Sepet Tutarı:</div>
                <div class="font-semibold">{{ formatPrice(coupon.minAmount) }}</div>
              </div>
              <div class="text-sm text-gray-600 text-right">
                <div>Son Kullanım:</div>
                <div class="font-semibold">{{ formatDate(coupon.expiryDate) }}</div>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="flex-1 bg-gray-100 px-4 py-2 rounded font-mono text-sm select-all">
                {{ coupon.code }}
              </div>
              <button 
                @click="copyCouponCode(coupon.code)"
                class="text-blue-600 hover:text-blue-800"
              >
                <span class="material-icons">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div v-if="coupons.length === 0" class="text-center py-8">
        <span class="material-icons text-6xl text-gray-400 mb-4">local_offer</span>
        <p class="text-gray-600">Henüz kuponunuz bulunmuyor.</p>
        <router-link 
          to="/kampanyalar"
          class="inline-block mt-4 text-blue-600 hover:text-blue-800"
        >
          Kampanyaları İncele
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Coupons',
  computed: {
    coupons() {
      return this.$store.state.user.coupons
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    async copyCouponCode(code) {
      try {
        await navigator.clipboard.writeText(code)
        this.$toast.success('Kupon kodu kopyalandı')
      } catch (error) {
        this.$toast.error('Kupon kodu kopyalanırken bir hata oluştu')
      }
    }
  },
  created() {
    this.$store.dispatch('user/fetchCoupons')
  }
}
</script> 