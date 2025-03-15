<template>
  <div class="order-management">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Sipariş Yönetimi</h3>

    <!-- Filtreler -->
    <div class="filters-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="filter-group">
          <label class="form-label">Durum</label>
          <select 
            v-model="filters.status"
            class="form-select"
          >
            <option value="">Tümü</option>
            <option value="pending">Beklemede</option>
            <option value="processing">İşleniyor</option>
            <option value="shipped">Kargoda</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="form-label">Tarih Aralığı</label>
          <select 
            v-model="filters.dateRange"
            class="form-select"
          >
            <option value="today">Bugün</option>
            <option value="week">Son 7 Gün</option>
            <option value="month">Son 30 Gün</option>
            <option value="custom">Özel Aralık</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="form-label">Ödeme Durumu</label>
          <select 
            v-model="filters.payment"
            class="form-select"
          >
            <option value="">Tümü</option>
            <option value="paid">Ödendi</option>
            <option value="pending">Beklemede</option>
            <option value="failed">Başarısız</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="form-label">Arama</label>
          <div class="relative">
            <input
              type="text"
              v-model="filters.search"
              class="form-input pl-10"
              placeholder="Sipariş no veya müşteri adı..."
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Özel Tarih Aralığı -->
      <div v-if="filters.dateRange === 'custom'" class="mt-4 grid grid-cols-2 gap-4">
        <div class="filter-group">
          <label class="form-label">Başlangıç Tarihi</label>
          <input
            type="date"
            v-model="filters.startDate"
            class="form-input"
          >
        </div>
        <div class="filter-group">
          <label class="form-label">Bitiş Tarihi</label>
          <input
            type="date"
            v-model="filters.endDate"
            class="form-input"
          >
        </div>
      </div>
    </div>

    <!-- Sipariş Listesi -->
    <div class="orders-list mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sipariş No
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Müşteri
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutar
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in filteredOrders" :key="order.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ order.orderNumber }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.customerName }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(order.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(order.status)" class="status-badge">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="action-button text-primary-600 hover:text-primary-900"
                  @click="viewOrderDetails(order)"
                >
                  Detaylar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sayfalama -->
    <div class="pagination flex items-center justify-between">
      <div class="flex items-center">
        <span class="text-sm text-gray-700">
          Sayfa <span class="font-medium">{{ pagination.currentPage }}</span> / {{ totalPages }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          class="pagination-button"
          :disabled="pagination.currentPage === 1"
          @click="prevPage"
        >
          Önceki
        </button>
        <button 
          class="pagination-button"
          :disabled="pagination.currentPage === totalPages"
          @click="nextPage"
        >
          Sonraki
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'OrderManagement',
  
  setup() {
    const filters = ref({
      status: '',
      dateRange: 'week',
      payment: '',
      search: '',
      startDate: null,
      endDate: null
    })

    const pagination = ref({
      currentPage: 1,
      perPage: 10
    })

    // Diğer veri ve fonksiyonlar...

    return {
      filters,
      pagination,
      filteredOrders,
      totalPages,
      formatDate,
      formatCurrency,
      getStatusClass,
      viewOrderDetails,
      prevPage,
      nextPage
    }
  }
}
</script>

<style lang="scss" scoped>
.order-management {
  @apply bg-white rounded-lg p-6;

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-input,
  .form-select {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .status-badge {
    @apply px-2 py-1 text-xs font-medium rounded-full;
  }

  .action-button {
    @apply text-sm font-medium focus:outline-none;
  }

  .pagination-button {
    @apply inline-flex items-center px-3 py-2 border border-gray-300
           rounded-md text-sm font-medium text-gray-700 bg-white
           hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
</style>