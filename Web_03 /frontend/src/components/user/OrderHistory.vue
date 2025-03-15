<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Sipariş Geçmişi</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="filter"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tüm Siparişler</option>
          <option value="processing">İşlemde</option>
          <option value="shipped">Kargoda</option>
          <option value="delivered">Teslim Edildi</option>
          <option value="cancelled">İptal Edildi</option>
        </select>

        <select 
          v-model="period"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tüm Zamanlar</option>
          <option value="last_month">Son 1 Ay</option>
          <option value="last_3_months">Son 3 Ay</option>
          <option value="last_year">Son 1 Yıl</option>
        </select>
      </div>
    </div>

    <!-- Sipariş Listesi -->
    <div v-if="filteredOrders.length" class="space-y-6">
      <div 
        v-for="order in filteredOrders"
        :key="order.id"
        class="rounded-lg border"
      >
        <!-- Sipariş Başlığı -->
        <div class="flex items-center justify-between border-b p-4">
          <div>
            <p class="font-medium">Sipariş #{{ order.number }}</p>
            <p class="mt-1 text-sm text-gray-600">
              {{ formatDate(order.date) }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span 
              class="rounded-full px-3 py-1 text-sm"
              :class="getStatusClass(order.status)"
            >
              {{ getStatusText(order.status) }}
            </span>
            <button
              v-if="order.status === 'processing'"
              @click="cancelOrder(order.id)"
              class="text-sm text-red-600 hover:text-red-500"
            >
              İptal Et
            </button>
          </div>
        </div>

        <!-- Sipariş Detayları -->
        <div class="p-4">
          <!-- Ürünler -->
          <div class="space-y-4">
            <div 
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center space-x-4"
            >
              <img 
                :src="item.image"
                :alt="item.name"
                class="h-16 w-16 rounded-md object-cover"
              />
              <div class="flex-1">
                <router-link 
                  :to="`/product/${item.productId}`"
                  class="font-medium hover:text-blue-600"
                >
                  {{ item.name }}
                </router-link>
                <p class="mt-1 text-sm text-gray-600">
                  {{ item.quantity }} adet x {{ formatPrice(item.price) }}
                </p>
              </div>
              <span class="font-medium">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>

          <!-- Özet -->
          <div class="mt-6 border-t pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Ara Toplam</span>
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="mt-2 flex justify-between text-sm">
              <span class="text-gray-600">Kargo</span>
              <span>{{ formatPrice(order.shipping) }}</span>
            </div>
            <div v-if="order.discount" class="mt-2 flex justify-between text-sm">
              <span class="text-gray-600">İndirim</span>
              <span class="text-green-600">-{{ formatPrice(order.discount) }}</span>
            </div>
            <div class="mt-4 flex justify-between font-medium">
              <span>Toplam</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>

          <!-- Kargo Takibi -->
          <div 
            v-if="order.tracking"
            class="mt-6 rounded-md bg-gray-50 p-4"
          >
            <h4 class="font-medium">Kargo Takibi</h4>
            <div class="mt-2 flex items-center justify-between">
              <div class="text-sm">
                <p>{{ order.tracking.courier }}</p>
                <p class="mt-1 text-gray-600">
                  Takip No: {{ order.tracking.number }}
                </p>
              </div>
              <a 
                :href="order.tracking.url"
                target="_blank"
                rel="noopener"
                class="text-sm text-blue-600 hover:text-blue-500"
              >
                Kargom Nerede?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-shopping-bag text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz siparişiniz bulunmuyor.</p>
      <router-link 
        to="/products"
        class="mt-4 text-blue-600 hover:text-blue-500"
      >
        Alışverişe Başla
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
  name: 'OrderHistory',
  setup() {
    const store = useStore()
    const filter = ref('all')
    const period = ref('all')
    const orders = ref([])

    const filteredOrders = computed(() => {
      let filtered = [...orders.value]
      
      // Status filtresi
      if (filter.value !== 'all') {
        filtered = filtered.filter(o => o.status === filter.value)
      }
      
      // Tarih filtresi
      const now = new Date()
      if (period.value === 'last_month') {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1))
        filtered = filtered.filter(o => new Date(o.date) >= lastMonth)
      } else if (period.value === 'last_3_months') {
        const last3Months = new Date(now.setMonth(now.getMonth() - 3))
        filtered = filtered.filter(o => new Date(o.date) >= last3Months)
      } else if (period.value === 'last_year') {
        const lastYear = new Date(now.setFullYear(now.getFullYear() - 1))
        filtered = filtered.filter(o => new Date(o.date) >= lastYear)
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const getStatusClass = (status) => {
      const classes = {
        processing: 'bg-yellow-100 text-yellow-600',
        shipped: 'bg-blue-100 text-blue-600',
        delivered: 'bg-green-100 text-green-600',
        cancelled: 'bg-red-100 text-red-600'
      }
      return classes[status]
    }

    const getStatusText = (status) => {
      const texts = {
        processing: 'İşlemde',
        shipped: 'Kargoda',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      }
      return texts[status]
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: tr })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const cancelOrder = async (orderId) => {
      if (!confirm('Bu siparişi iptal etmek istediğinizden emin misiniz?')) return

      try {
        await store.dispatch('order/cancelOrder', orderId)
        await loadOrders()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Sipariş başarıyla iptal edildi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Sipariş iptal edilirken bir hata oluştu'
        })
      }
    }

    const loadOrders = async () => {
      try {
        const response = await store.dispatch('order/getOrders')
        orders.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Siparişler yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadOrders()
    })

    return {
      filter,
      period,
      filteredOrders,
      getStatusClass,
      getStatusText,
      formatDate,
      formatPrice,
      cancelOrder
    }
  }
}
</script> 