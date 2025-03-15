<template>
  <div class="system-status">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h3>

    <!-- Genel Durum -->
    <div class="overview-section mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="status-card" :class="getStatusColorClass(systemHealth)">
          <div class="card-content">
            <h4 class="card-title">Sistem Sağlığı</h4>
            <p class="status-value">{{ systemHealth }}%</p>
            <p class="status-text">{{ getHealthStatus(systemHealth) }}</p>
          </div>
        </div>

        <div class="status-card">
          <div class="card-content">
            <h4 class="card-title">Aktif Kullanıcılar</h4>
            <p class="status-value">{{ activeUsers }}</p>
            <p class="status-text">Son 5 dakika</p>
          </div>
        </div>

        <div class="status-card">
          <div class="card-content">
            <h4 class="card-title">Sunucu Yanıt Süresi</h4>
            <p class="status-value">{{ responseTime }}ms</p>
            <p class="status-text">Ortalama</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistem Kaynakları -->
    <div class="resources-section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Sistem Kaynakları</h4>
      
      <!-- CPU Kullanımı -->
      <div class="resource-item mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">CPU Kullanımı</span>
          <span class="text-sm text-gray-500">{{ cpuUsage }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress"
            :style="{ width: `${cpuUsage}%` }"
            :class="getResourceClass(cpuUsage)"
          ></div>
        </div>
      </div>

      <!-- RAM Kullanımı -->
      <div class="resource-item mb-4">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">RAM Kullanımı</span>
          <span class="text-sm text-gray-500">{{ ramUsage }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress"
            :style="{ width: `${ramUsage}%` }"
            :class="getResourceClass(ramUsage)"
          ></div>
        </div>
      </div>

      <!-- Disk Kullanımı -->
      <div class="resource-item">
        <div class="flex justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Disk Kullanımı</span>
          <span class="text-sm text-gray-500">{{ diskUsage }}%</span>
        </div>
        <div class="progress-bar">
          <div 
            class="progress"
            :style="{ width: `${diskUsage}%` }"
            :class="getResourceClass(diskUsage)"
          ></div>
        </div>
      </div>
    </div>

    <!-- Servis Durumları -->
    <div class="services-section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Servis Durumları</h4>
      <div class="space-y-3">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="service-item"
        >
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div 
                class="status-dot"
                :class="getServiceStatusClass(service.status)"
              ></div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-900">
                  {{ service.name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ service.description }}
                </p>
              </div>
            </div>
            <button 
              v-if="service.status === 'down'"
              @click="restartService(service.id)"
              class="restart-button"
            >
              <i class="fas fa-redo-alt mr-2"></i>
              Yeniden Başlat
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sistem Olayları -->
    <div class="events-section">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Son Sistem Olayları</h4>
      <div class="space-y-3">
        <div 
          v-for="event in systemEvents" 
          :key="event.id"
          class="event-item"
        >
          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <i :class="getEventIcon(event.type)" class="event-icon"></i>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">
                {{ event.message }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDate(event.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'SystemStatus',
  
  setup() {
    const systemHealth = ref(95)
    const activeUsers = ref(127)
    const responseTime = ref(245)
    const cpuUsage = ref(65)
    const ramUsage = ref(78)
    const diskUsage = ref(42)

    const services = ref([
      {
        id: 1,
        name: 'API Servisi',
        description: 'REST API endpoints',
        status: 'up'
      },
      {
        id: 2,
        name: 'Veritabanı',
        description: 'PostgreSQL',
        status: 'up'
      },
      {
        id: 3,
        name: 'Cache Servisi',
        description: 'Redis',
        status: 'down'
      }
    ])

    const systemEvents = ref([
      {
        id: 1,
        type: 'warning',
        message: 'Yüksek CPU kullanımı tespit edildi',
        timestamp: new Date()
      },
      // Diğer olaylar...
    ])

    let statusInterval

    onMounted(() => {
      // Her 30 saniyede bir durumu güncelle
      statusInterval = setInterval(updateStatus, 30000)
    })

    onUnmounted(() => {
      clearInterval(statusInterval)
    })

    const updateStatus = () => {
      // Gerçek zamanlı güncelleme mantığı
    }

    const getStatusColorClass = (health) => {
      if (health >= 90) return 'bg-green-50 text-green-700'
      if (health >= 70) return 'bg-yellow-50 text-yellow-700'
      return 'bg-red-50 text-red-700'
    }

    const getHealthStatus = (health) => {
      if (health >= 90) return 'Mükemmel'
      if (health >= 70) return 'İyi'
      if (health >= 50) return 'Orta'
      return 'Kritik'
    }

    const getResourceClass = (usage) => {
      if (usage < 70) return 'bg-green-500'
      if (usage < 90) return 'bg-yellow-500'
      return 'bg-red-500'
    }

    const getServiceStatusClass = (status) => {
      return status === 'up' ? 'bg-green-500' : 'bg-red-500'
    }

    const getEventIcon = (type) => {
      const icons = {
        info: 'fas fa-info-circle text-blue-500',
        warning: 'fas fa-exclamation-triangle text-yellow-500',
        error: 'fas fa-times-circle text-red-500',
        success: 'fas fa-check-circle text-green-500'
      }
      return icons[type] || icons.info
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleString('tr-TR')
    }

    const restartService = async (serviceId) => {
      try {
        // Servis yeniden başlatma API çağrısı
        console.log('Servis yeniden başlatılıyor:', serviceId)
      } catch (error) {
        console.error('Hata:', error)
      }
    }

    return {
      systemHealth,
      activeUsers,
      responseTime,
      cpuUsage,
      ramUsage,
      diskUsage,
      services,
      systemEvents,
      getStatusColorClass,
      getHealthStatus,
      getResourceClass,
      getServiceStatusClass,
      getEventIcon,
      formatDate,
      restartService
    }
  }
}
</script>

<style lang="scss" scoped>
.system-status {
  @apply bg-white rounded-lg p-6;

  .status-card {
    @apply p-6 rounded-lg;

    .card-content {
      @apply text-center;
    }

    .card-title {
      @apply text-sm font-medium mb-2;
    }

    .status-value {
      @apply text-3xl font-bold mb-1;
    }

    .status-text {
      @apply text-sm;
    }
  }

  .progress-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;

    .progress {
      @apply h-full transition-all duration-300;
    }
  }

  .status-dot {
    @apply w-3 h-3 rounded-full;
  }

  .restart-button {
    @apply inline-flex items-center px-3 py-1 border border-gray-300
           rounded-md text-sm font-medium text-gray-700 bg-white
           hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500;
  }

  .event-icon {
    @apply text-lg;
  }
}
</style> 