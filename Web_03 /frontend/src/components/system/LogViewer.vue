<template>
  <div class="log-viewer">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Log Görüntüleyici</h3>

    <!-- Filtreler -->
    <div class="filters mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Log Seviyesi -->
        <div class="filter-group">
          <label class="form-label">Log Seviyesi</label>
          <select 
            v-model="filters.level"
            class="form-select"
          >
            <option value="all">Tümü</option>
            <option value="error">Hata</option>
            <option value="warning">Uyarı</option>
            <option value="info">Bilgi</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <!-- Tarih Aralığı -->
        <div class="filter-group">
          <label class="form-label">Tarih</label>
          <select 
            v-model="filters.dateRange"
            class="form-select"
          >
            <option value="today">Bugün</option>
            <option value="yesterday">Dün</option>
            <option value="week">Son 7 Gün</option>
            <option value="month">Son 30 Gün</option>
            <option value="custom">Özel Aralık</option>
          </select>
        </div>

        <!-- Kaynak -->
        <div class="filter-group">
          <label class="form-label">Kaynak</label>
          <select 
            v-model="filters.source"
            class="form-select"
          >
            <option value="all">Tümü</option>
            <option value="system">Sistem</option>
            <option value="auth">Kimlik Doğrulama</option>
            <option value="api">API</option>
            <option value="database">Veritabanı</option>
          </select>
        </div>

        <!-- Arama -->
        <div class="filter-group">
          <label class="form-label">Arama</label>
          <div class="relative">
            <input
              type="text"
              v-model="filters.search"
              class="form-input pl-10"
              placeholder="Log içeriğinde ara..."
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

    <!-- Log Listesi -->
    <div class="log-list mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Zaman
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seviye
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kaynak
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mesaj
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="log in filteredLogs" :key="log.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(log.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getLevelClass(log.level)" class="level-badge">
                  {{ log.level }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ log.source }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ log.message }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="text-primary-600 hover:text-primary-900"
                  @click="showDetails(log)"
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
          Sayfa başına gösterim
        </span>
        <select
          v-model="pagination.perPage"
          class="ml-2 form-select"
        >
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
      <div class="flex items-center space-x-2">
        <button
          class="pagination-button"
          :disabled="pagination.currentPage === 1"
          @click="prevPage"
        >
          Önceki
        </button>
        <span class="text-sm text-gray-700">
          Sayfa {{ pagination.currentPage }} / {{ totalPages }}
        </span>
        <button
          class="pagination-button"
          :disabled="pagination.currentPage === totalPages"
          @click="nextPage"
        >
          Sonraki
        </button>
      </div>
    </div>

    <!-- Log Detay Modalı -->
    <Modal v-if="selectedLog" @close="selectedLog = null">
      <div class="log-details p-6">
        <h4 class="text-lg font-medium text-gray-900 mb-4">Log Detayları</h4>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Zaman</label>
              <p class="mt-1 text-sm text-gray-900">
                {{ formatDate(selectedLog.timestamp) }}
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Seviye</label>
              <p class="mt-1">
                <span :class="getLevelClass(selectedLog.level)" class="level-badge">
                  {{ selectedLog.level }}
                </span>
              </p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Kaynak</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedLog.source }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">IP Adresi</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedLog.ip }}</p>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Mesaj</label>
            <p class="mt-1 text-sm text-gray-900">{{ selectedLog.message }}</p>
          </div>
          <div v-if="selectedLog.stack">
            <label class="text-sm font-medium text-gray-700">Stack Trace</label>
            <pre class="mt-1 p-4 bg-gray-50 rounded-lg text-sm text-gray-900 overflow-x-auto">
              {{ selectedLog.stack }}
            </pre>
          </div>
          <div v-if="selectedLog.context">
            <label class="text-sm font-medium text-gray-700">Bağlam</label>
            <pre class="mt-1 p-4 bg-gray-50 rounded-lg text-sm text-gray-900 overflow-x-auto">
              {{ JSON.stringify(selectedLog.context, null, 2) }}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import Modal from '@/components/shared/Modal.vue'

export default {
  name: 'LogViewer',
  
  components: {
    Modal
  },

  setup() {
    const filters = ref({
      level: 'all',
      dateRange: 'today',
      source: 'all',
      search: '',
      startDate: null,
      endDate: null
    })

    const pagination = ref({
      currentPage: 1,
      perPage: 25
    })

    const logs = ref([
      {
        id: 1,
        timestamp: new Date(),
        level: 'error',
        source: 'system',
        message: 'Veritabanı bağlantısı başarısız',
        ip: '192.168.1.1',
        stack: 'Error: Connection refused...',
        context: {
          database: 'main',
          attempt: 3
        }
      },
      // Diğer loglar...
    ])

    const selectedLog = ref(null)

    const filteredLogs = computed(() => {
      let filtered = [...logs.value]

      // Seviye filtresi
      if (filters.value.level !== 'all') {
        filtered = filtered.filter(log => log.level === filters.value.level)
      }

      // Kaynak filtresi
      if (filters.value.source !== 'all') {
        filtered = filtered.filter(log => log.source === filters.value.source)
      }

      // Arama filtresi
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(search) ||
          log.source.toLowerCase().includes(search)
        )
      }

      // Tarih filtresi
      if (filters.value.dateRange === 'custom' && filters.value.startDate && filters.value.endDate) {
        const start = new Date(filters.value.startDate)
        const end = new Date(filters.value.endDate)
        filtered = filtered.filter(log => {
          const date = new Date(log.timestamp)
          return date >= start && date <= end
        })
      }

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredLogs.value.length / pagination.value.perPage)
    })

    const showDetails = (log) => {
      selectedLog.value = log
    }

    const getLevelClass = (level) => {
      const classes = {
        error: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
        debug: 'bg-gray-100 text-gray-800'
      }
      return classes[level] || classes.info
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString('tr-TR')
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
      filteredLogs,
      selectedLog,
      totalPages,
      showDetails,
      getLevelClass,
      formatDate,
      prevPage,
      nextPage
    }
  }
}
</script>

<style lang="scss" scoped>
.log-viewer {
  @apply bg-white rounded-lg p-6;

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-input,
  .form-select {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .level-badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
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