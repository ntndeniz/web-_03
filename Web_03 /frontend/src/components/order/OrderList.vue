<template>
  <div class="order-list">
    <!-- Başlık ve Filtreler -->
    <div class="bg-white shadow sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            Siparişlerim
          </h3>
          <div class="flex space-x-4">
            <!-- Durum Filtresi -->
            <select
              v-model="filters.status"
              class="select-field"
            >
              <option value="">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="processing">İşleniyor</option>
              <option value="shipped">Kargoda</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="cancelled">İptal Edildi</option>
            </select>

            <!-- Tarih Filtresi -->
            <select
              v-model="filters.dateRange"
              class="select-field"
            >
              <option value="all">Tüm Zamanlar</option>
              <option value="last30">Son 30 Gün</option>
              <option value="last90">Son 90 Gün</option>
              <option value="last180">Son 180 Gün</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Sipariş Listesi -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="overflow-x-auto">
        <table v-if="filteredOrders.length" class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">Sipariş No</th>
              <th class="table-header">Tarih</th>
              <th class="table-header">Tutar</th>
              <th class="table-header">Durum</th>
              <th class="table-header">İşlemler</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-gray-50"
            >
              <td class="table-cell font-medium">
                #{{ order.orderNumber }}
              </td>
              <td class="table-cell text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="table-cell">
                {{ formatPrice(order.totalAmount) }} TL
              </td>
              <td class="table-cell">
                <order-status-badge :status="order.status" />
              </td>
              <td class="table-cell">
                <div class="flex space-x-2">
                  <button
                    @click="viewOrderDetails(order)"
                    class="btn-icon text-gray-600"
                    title="Detaylar"
                  >
                    <eye-icon class="h-5 w-5" />
                  </button>
                  <button
                    v-if="order.status === 'shipped'"
                    @click="trackOrder(order)"
                    class="btn-icon text-primary-600"
                    title="Kargo Takip"
                  >
                    <truck-icon class="h-5 w-5" />
                  </button>
                  <button
                    v-if="canRequestReturn(order)"
                    @click="initiateReturn(order)"
                    class="btn-icon text-red-600"
                    title="İade Talebi"
                  >
                    <refresh-icon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center py-12">
          <shopping-bag-icon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Sipariş Bulunamadı</h3>
          <p class="mt-1 text-sm text-gray-500">
            Seçili filtrelere uygun sipariş bulunmamaktadır.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { formatDate, formatPrice } from '@/utils/formatters'
import {
  EyeIcon,
  TruckIcon,
  RefreshIcon,
  ShoppingBagIcon
} from '@heroicons/vue/outline'
import OrderStatusBadge from './OrderStatusBadge.vue'

export default {
  name: 'OrderList',

  components: {
    OrderStatusBadge,
    EyeIcon,
    TruckIcon,
    RefreshIcon,
    ShoppingBagIcon
  },

  setup() {
    const store = useStore()
    const router = useRouter()

    const filters = ref({
      status: '',
      dateRange: 'all'
    })

    const orders = computed(() => store.state.order.orders)

    const filteredOrders = computed(() => {
      let result = [...orders.value]

      // Durum filtresi
      if (filters.value.status) {
        result = result.filter(order => order.status === filters.value.status)
      }

      // Tarih filtresi
      const now = new Date()
      switch (filters.value.dateRange) {
        case 'last30':
          result = result.filter(order => 
            new Date(order.createdAt) > new Date(now - 30 * 24 * 60 * 60 * 1000)
          )
          break
        case 'last90':
          result = result.filter(order => 
            new Date(order.createdAt) > new Date(now - 90 * 24 * 60 * 60 * 1000)
          )
          break
        case 'last180':
          result = result.filter(order => 
            new Date(order.createdAt) > new Date(now - 180 * 24 * 60 * 60 * 1000)
          )
          break
      }

      return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

    const viewOrderDetails = (order) => {
      router.push(`/orders/${order.id}`)
    }

    const trackOrder = (order) => {
      router.push(`/orders/${order.id}/tracking`)
    }

    const initiateReturn = (order) => {
      router.push(`/orders/${order.id}/return`)
    }

    const canRequestReturn = (order) => {
      const deliveredDate = new Date(order.deliveredAt)
      const now = new Date()
      const daysSinceDelivery = (now - deliveredDate) / (1000 * 60 * 60 * 24)
      
      return order.status === 'delivered' && daysSinceDelivery <= 14
    }

    return {
      filters,
      filteredOrders,
      formatDate,
      formatPrice,
      viewOrderDetails,
      trackOrder,
      initiateReturn,
      canRequestReturn
    }
  }
}
</script>

<style lang="scss" scoped>
.select-field {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
         focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md;
}

.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm;
}

.btn-icon {
  @apply p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 
         focus:ring-primary-500;
}
</style> 