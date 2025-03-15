<template>
  <div class="audit-log">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Denetim Günlüğü</h3>

    <!-- Filtreler -->
    <div class="filters mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Tarih Aralığı -->
        <div class="filter-item">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tarih Aralığı
          </label>
          <select 
            v-model="filters.dateRange"
            class="filter-select"
          >
            <option value="today">Bugün</option>
            <option value="week">Son 7 Gün</option>
            <option value="month">Son 30 Gün</option>
            <option value="custom">Özel Aralık</option>
          </select>
        </div>

        <!-- Etkinlik Tipi -->
        <div class="filter-item">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Etkinlik Tipi
          </label>
          <select 
            v-model="filters.eventType"
            class="filter-select"
          >
            <option value="all">Tümü</option>
            <option value="login">Giriş</option>
            <option value="update">Güncelleme</option>
            <option value="delete">Silme</option>
            <option value="create">Oluşturma</option>
          </select>
        </div>

        <!-- Kullanıcı -->
        <div class="filter-item">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kullanıcı
          </label>
          <select 
            v-model="filters.user"
            class="filter-select"
          >
            <option value="all">Tüm Kullanıcılar</option>
            <option 
              v-for="user in users" 
              :key="user.id"
              :value="user.id"
            >
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Özel Tarih Aralığı -->
      <div v-if="filters.dateRange === 'custom'" class="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Başlangıç Tarihi
          </label>
          <input
            type="date"
            v-model="filters.startDate"
            class="filter-input"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bitiş Tarihi
          </label>
          <input
            type="date"
            v-model="filters.endDate"
            class="filter-input"
          >
        </div>
      </div>
    </div>

    <!-- Log Listesi -->
    <div class="log-list">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih/Saat
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etkinlik
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detay
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Adresi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in filteredLogs" :key="log.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(log.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="text-xs font-medium">
                      {{ getInitials(log.user.name) }}
                    </span>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      {{ log.user.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ log.user.role }}
                    </p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="event-badge"
                  :class="getEventTypeClass(log.eventType)"
                >
                  {{ log.eventType }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ log.details }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ log.ipAddress }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sayfalama -->
    <div class="pagination mt-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <select 
            v-model="pagination.perPage"
            class="per-page-select"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-700 ml-2">
            Kayıt gösteriliyor
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            class="pagination-button"
            :disabled="pagination.currentPage === 1"
            @click="prevPage"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="text-sm text-gray-700">
            Sayfa {{ pagination.currentPage }} / {{ totalPages }}
          </span>
          <button 
            class="pagination-button"
            :disabled="pagination.currentPage === totalPages"
            @click="nextPage"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatDateTime } from '@/utils/format'

export default {
  name: 'AuditLog',

  setup() {
    const filters = ref({
      dateRange: 'week',
      eventType: 'all',
      user: 'all',
      startDate: null,
      endDate: null
    })

    const pagination = ref({
      currentPage: 1,
      perPage: 25
    })

    // Örnek kullanıcı verileri
    const users = [
      { id: 1, name: 'Ahmet Yılmaz', role: 'Admin' },
      { id: 2, name: 'Mehmet Demir', role: 'Editor' },
      { id: 3, name: 'Ayşe Kaya', role: 'User' }
    ]

    // Örnek log verileri
    const logs = [
      {
        id: 1,
        timestamp: new Date('2024-03-15T10:30:00'),
        user: users[0],
        eventType: 'login',
        details: 'Başarılı giriş',
        ipAddress: '192.168.1.100'
      },
      {
        id: 2,
        timestamp: new Date('2024-03-15T11:15:00'),
        user: users[1],
        eventType: 'update',
        details: 'Ürün güncellendi: #12345',
        ipAddress: '192.168.1.101'
      }
      // Diğer log kayıtları...
    ]

    const filteredLogs = computed(() => {
      let filtered = [...logs]

      // Filtreleme mantığı...

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredLogs.value.length / pagination.value.perPage)
    })

    const getInitials = (name) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
    }

    const getEventTypeClass = (type) => {
      const classes = {
        login: 'bg-blue-100 text-blue-800',
        update: 'bg-yellow-100 text-yellow-800',
        delete: 'bg-red-100 text-red-800',
        create: 'bg-green-100 text-green-800'
      }
      return classes[type] || 'bg-gray-100 text-gray-800'
    }

    const prevPage = () => {
      if (pagination.value.currentPage > 1) {
        pagination.value.currentPage--
      }
    }

    const nextPage = () => {
      if (pagination.value.currentPage < totalPages.value) {
        pagination.value.currentPage++
      }
    }

    return {
      filters,
      pagination,
      users,
      filteredLogs,
      totalPages,
      formatDateTime,
      getInitials,
      getEventTypeClass,
      prevPage,
      nextPage
    }
  }
}
</script>

<style lang="scss" scoped>
.audit-log {
  @apply bg-white rounded-lg p-6;

  .filter-select,
  .filter-input {
    @apply block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .event-badge {
    @apply px-2 py-1 text-xs font-medium rounded-full;
  }

  .per-page-select {
    @apply block rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .pagination-button {
    @apply inline-flex items-center px-3 py-2 border border-gray-300
           rounded-md text-sm font-medium text-gray-700 bg-white
           hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  table {
    @apply min-w-full divide-y divide-gray-200;

    th {
      @apply px-6 py-3 bg-gray-50 text-left text-xs font-medium
             text-gray-500 uppercase tracking-wider;
    }

    td {
      @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500;
    }
  }
}
</style> 