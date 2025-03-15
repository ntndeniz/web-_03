<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold mb-6">Siparişlerim</h1>

    <!-- Filtreler -->
    <div class="mb-6 flex flex-wrap gap-4">
      <select 
        v-model="filter.status"
        class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">Tüm Durumlar</option>
        <option value="pending">Bekleyen</option>
        <option value="processing">İşleniyor</option>
        <option value="shipped">Kargoda</option>
        <option value="delivered">Teslim Edildi</option>
        <option value="cancelled">İptal Edildi</option>
      </select>

      <select 
        v-model="filter.dateRange"
        class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Tüm Zamanlar</option>
        <option value="last30">Son 30 Gün</option>
        <option value="last90">Son 90 Gün</option>
        <option value="last180">Son 180 Gün</option>
      </select>
    </div>

    <!-- Sipariş Listesi -->
    <div v-if="orders.length" class="space-y-6">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="bg-white rounded-lg shadow p-6"
      >
        <div class="flex flex-wrap justify-between items-start gap-4">
          <!-- Sipariş Başlığı -->
          <div>
            <h3 class="font-medium">Sipariş #{{ order.number }}</h3>
            <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
          </div>

          <!-- Sipariş Durumu -->
          <div 
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getStatusClass(order.status)"
          >
            {{ getStatusText(order.status) }}
          </div>
        </div>

        <!-- Ürünler -->
        <div class="mt-4 divide-y">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="py-4 flex items-center gap-4"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-16 h-16 object-cover rounded"
            />
            <div class="flex-grow">
              <h4 class="font-medium">{{ item.name }}</h4>
              <p class="text-sm text-gray-500">
                {{ item.quantity }} adet x {{ formatPrice(item.price) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Sipariş Özeti -->
        <div class="mt-4 pt-4 border-t flex flex-wrap justify-between items-center gap-4">
          <div class="text-sm">
            <span class="font-medium">Toplam:</span>
            {{ formatPrice(order.total) }}
          </div>

          <!-- Aksiyonlar -->
          <div class="flex gap-2">
            <router-link 
              :to="`/siparis/${order.id}`"
              class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Detaylar
            </router-link>
            <button 
              v-if="order.status === 'pending'"
              @click="cancelOrder(order.id)"
              class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500"
            >
              İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="text-center py-12 bg-white rounded-lg"
    >
      <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
      <h3 class="text-lg font-medium text-gray-900">Henüz siparişiniz yok</h3>
      <p class="mt-1 text-gray-500">Alışverişe başlamak için ürünlerimize göz atın</p>
      <router-link 
        to="/urunler"
        class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Alışverişe Başla
      </router-link>
    </div>

    <!-- Sayfalama -->
    <Pagination
      v-if="orders.length"
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-change="handlePageChange"
      class="mt-6"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate, formatPrice } from '@/utils/formatters'
import Pagination from '@/components/common/Pagination.vue'

export default {
  name: 'OrdersView',

  components: {
    Pagination
  },

  setup() {
    const store = useStore()
    const filter = ref({
      status: '',
      dateRange: 'all'
    })
    const currentPage = ref(1)

    // Siparişleri getir
    const orders = computed(() => store.state.order.orders)
    const totalPages = computed(() => store.state.order.pagination.totalPages)

    // Filtrelenmiş siparişler
    const filteredOrders = computed(() => {
      let result = [...orders.value]

      // Durum filtresi
      if (filter.value.status) {
        result = result.filter(order => order.status === filter.value.status)
      }

      // Tarih filtresi
      if (filter.value.dateRange !== 'all') {
        const now = new Date()
        const days = {
          last30: 30,
          last90: 90,
          last180: 180
        }[filter.value.dateRange]

        const cutoff = new Date(now.setDate(now.getDate() - days))
        result = result.filter(order => new Date(order.createdAt) >= cutoff)
      }

      return result
    })

    // Durum sınıfları
    const getStatusClass = (status) => ({
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }[status])

    // Durum metinleri
    const getStatusText = (status) => ({
      'pending': 'Bekliyor',
      'processing': 'İşleniyor',
      'shipped': 'Kargoda',
      'delivered': 'Teslim Edildi',
      'cancelled': 'İptal Edildi'
    }[status])

    // Sayfa değişimi
    const handlePageChange = (page) => {
      currentPage.value = page
      store.dispatch('order/fetchOrders', { 
        page,
        ...filter.value
      })
    }

    // Sipariş iptali
    const cancelOrder = async (orderId) => {
      try {
        await store.dispatch('order/cancelOrder', orderId)
        store.dispatch('ui/showToast', {
          message: 'Sipariş başarıyla iptal edildi',
          type: 'success'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          message: 'Sipariş iptal edilirken bir hata oluştu',
          type: 'error'
        })
      }
    }

    return {
      filter,
      orders,
      filteredOrders,
      currentPage,
      totalPages,
      formatDate,
      formatPrice,
      getStatusClass,
      getStatusText,
      handlePageChange,
      cancelOrder
    }
  },

  // Sayfa meta verileri
  head: {
    title: 'Siparişlerim',
    meta: [
      {
        name: 'description',
        content: 'Siparişlerinizi görüntüleyin ve yönetin.'
      }
    ]
  }
}
</script> 