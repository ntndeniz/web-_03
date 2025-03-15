<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold">Siparişler</h1>

        <!-- Filtreler -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Tarih Filtresi -->
          <div class="flex items-center gap-2">
            <input 
              type="date"
              v-model="filters.startDate"
              class="px-3 py-2 border rounded-lg"
            />
            <span>-</span>
            <input 
              type="date"
              v-model="filters.endDate"
              class="px-3 py-2 border rounded-lg"
            />
          </div>

          <!-- Durum Filtresi -->
          <select 
            v-model="filters.status"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="">Tüm Durumlar</option>
            <option value="pending">Onay Bekliyor</option>
            <option value="processing">Hazırlanıyor</option>
            <option value="shipped">Kargoya Verildi</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal Edildi</option>
          </select>

          <!-- Arama -->
          <div class="relative">
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Sipariş No veya Müşteri Ara..."
              class="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sipariş Listesi -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="p-4 font-medium">Sipariş No</th>
            <th class="p-4 font-medium">Müşteri</th>
            <th class="p-4 font-medium">Tarih</th>
            <th class="p-4 font-medium">Tutar</th>
            <th class="p-4 font-medium">Durum</th>
            <th class="p-4 font-medium">Ödeme</th>
            <th class="p-4 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr 
            v-for="order in filteredOrders" 
            :key="order.id"
            class="hover:bg-gray-50"
          >
            <td class="p-4">
              <div class="font-medium">{{ order.number }}</div>
              <div class="text-sm text-gray-600">{{ order.items.length }} ürün</div>
            </td>
            <td class="p-4">
              <div class="font-medium">{{ order.customer.name }}</div>
              <div class="text-sm text-gray-600">{{ order.customer.email }}</div>
            </td>
            <td class="p-4">
              <div>{{ formatDate(order.createdAt) }}</div>
              <div class="text-sm text-gray-600">{{ formatTime(order.createdAt) }}</div>
            </td>
            <td class="p-4 font-medium">
              {{ formatPrice(order.total) }}
            </td>
            <td class="p-4">
              <select 
                v-model="order.status"
                class="px-3 py-1.5 border rounded-lg"
                :class="getStatusSelectClass(order.status)"
                @change="updateOrderStatus(order)"
              >
                <option value="pending">Onay Bekliyor</option>
                <option value="processing">Hazırlanıyor</option>
                <option value="shipped">Kargoya Verildi</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-1.5">
                <span class="material-icons text-sm" :class="getPaymentStatusColor(order.paymentStatus)">
                  {{ getPaymentStatusIcon(order.paymentStatus) }}
                </span>
                {{ getPaymentStatusText(order.paymentStatus) }}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="viewOrderDetails(order)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <span class="material-icons">visibility</span>
                </button>
                <button 
                  @click="printOrder(order)"
                  class="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                >
                  <span class="material-icons">print</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sayfalama -->
    <div class="p-4 border-t">
      <div class="flex items-center justify-between">
        <div class="text-gray-600">
          Toplam {{ totalOrders }} sipariş
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <span>Sayfa {{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Sipariş Detay Modal -->
    <Modal v-if="selectedOrder" @close="selectedOrder = null">
      <template #title>
        Sipariş Detayı - {{ selectedOrder.number }}
      </template>
      <template #content>
        <OrderDetails :order="selectedOrder" />
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'
import OrderDetails from '@/components/admin/OrderDetails.vue'

export default {
  name: 'AdminOrders',
  components: {
    Modal,
    OrderDetails
  },
  data() {
    return {
      filters: {
        search: '',
        status: '',
        startDate: '',
        endDate: ''
      },
      currentPage: 1,
      selectedOrder: null
    }
  },
  computed: {
    orders() {
      return this.$store.state.admin.orders
    },
    totalOrders() {
      return this.$store.state.admin.totalOrders
    },
    totalPages() {
      return Math.ceil(this.totalOrders / 20)
    },
    filteredOrders() {
      let filtered = [...this.orders]

      // Arama filtresi
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(order => 
          order.number.toLowerCase().includes(search) ||
          order.customer.name.toLowerCase().includes(search)
        )
      }

      // Durum filtresi
      if (this.filters.status) {
        filtered = filtered.filter(order => order.status === this.filters.status)
      }

      // Tarih filtresi
      if (this.filters.startDate && this.filters.endDate) {
        const start = new Date(this.filters.startDate)
        const end = new Date(this.filters.endDate)
        filtered = filtered.filter(order => {
          const date = new Date(order.createdAt)
          return date >= start && date <= end
        })
      }

      return filtered
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString('tr-TR')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getStatusSelectClass(status) {
      const classes = {
        pending: 'text-yellow-600 border-yellow-200',
        processing: 'text-blue-600 border-blue-200',
        shipped: 'text-purple-600 border-purple-200',
        delivered: 'text-green-600 border-green-200',
        cancelled: 'text-red-600 border-red-200'
      }
      return classes[status] || ''
    },
    getPaymentStatusIcon(status) {
      const icons = {
        pending: 'pending',
        completed: 'check_circle',
        failed: 'error'
      }
      return icons[status] || 'help'
    },
    getPaymentStatusColor(status) {
      const colors = {
        pending: 'text-yellow-600',
        completed: 'text-green-600',
        failed: 'text-red-600'
      }
      return colors[status] || ''
    },
    getPaymentStatusText(status) {
      const texts = {
        pending: 'Bekliyor',
        completed: 'Tamamlandı',
        failed: 'Başarısız'
      }
      return texts[status] || status
    },
    async updateOrderStatus(order) {
      try {
        await this.$store.dispatch('admin/updateOrderStatus', {
          orderId: order.id,
          status: order.status
        })
        this.$toast.success('Sipariş durumu güncellendi')
      } catch (error) {
        this.$toast.error('Sipariş durumu güncellenirken bir hata oluştu')
      }
    },
    viewOrderDetails(order) {
      this.selectedOrder = order
    },
    printOrder(order) {
      // Sipariş yazdırma işlemi
      window.print()
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchOrders()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchOrders()
      }
    },
    async fetchOrders() {
      try {
        await this.$store.dispatch('admin/fetchOrders', {
          page: this.currentPage,
          ...this.filters
        })
      } catch (error) {
        this.$toast.error('Siparişler yüklenirken bir hata oluştu')
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.fetchOrders()
      }
    }
  },
  created() {
    this.fetchOrders()
  }
}
</script> 