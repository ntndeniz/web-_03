<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <h2 class="text-xl font-semibold">Siparişlerim</h2>
    </div>

    <div class="divide-y">
      <div v-for="order in orders" :key="order.id" class="p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="text-sm text-gray-600 mb-1">
              Sipariş No: {{ order.number }}
            </div>
            <div class="text-sm text-gray-600">
              {{ formatDate(order.createdAt) }}
            </div>
          </div>
          <div class="text-right">
            <div class="font-semibold mb-1">
              {{ formatPrice(order.total) }}
            </div>
            <div class="text-sm" :class="getStatusColor(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="flex gap-4"
          >
            <img 
              :src="item.product.image" 
              :alt="item.product.name"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="flex-1">
              <router-link 
                :to="`/urun/${item.product.id}`"
                class="font-semibold hover:text-blue-600"
              >
                {{ item.product.name }}
              </router-link>
              <div class="text-sm text-gray-600">
                {{ item.quantity }} adet x {{ formatPrice(item.price) }}
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-4">
          <button 
            v-if="canCancelOrder(order)"
            @click="cancelOrder(order.id)"
            class="text-red-600 hover:text-red-800"
          >
            Siparişi İptal Et
          </button>
          <router-link 
            :to="`/siparis/${order.id}`"
            class="text-blue-600 hover:text-blue-800"
          >
            Detayları Görüntüle
          </router-link>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div v-if="orders.length === 0" class="p-8 text-center">
      <span class="material-icons text-6xl text-gray-400 mb-4">shopping_bag</span>
      <p class="text-gray-600">Henüz siparişiniz bulunmuyor.</p>
      <router-link 
        to="/urunler"
        class="inline-block mt-4 text-blue-600 hover:text-blue-800"
      >
        Alışverişe Başla
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  computed: {
    orders() {
      return this.$store.state.orders.items
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getStatusText(status) {
      const statuses = {
        pending: 'Onay Bekliyor',
        processing: 'Hazırlanıyor',
        shipped: 'Kargoya Verildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      }
      return statuses[status] || status
    },
    getStatusColor(status) {
      const colors = {
        pending: 'text-yellow-600',
        processing: 'text-blue-600',
        shipped: 'text-purple-600',
        delivered: 'text-green-600',
        cancelled: 'text-red-600'
      }
      return colors[status] || ''
    },
    canCancelOrder(order) {
      return ['pending', 'processing'].includes(order.status)
    },
    async cancelOrder(orderId) {
      try {
        await this.$store.dispatch('orders/cancelOrder', orderId)
        this.$toast.success('Sipariş başarıyla iptal edildi')
      } catch (error) {
        this.$toast.error('Sipariş iptal edilirken bir hata oluştu')
      }
    }
  },
  created() {
    this.$store.dispatch('orders/fetchOrders')
  }
}
</script> 