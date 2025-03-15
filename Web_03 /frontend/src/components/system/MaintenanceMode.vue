<template>
  <div class="maintenance-mode">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Bakım Modu</h3>

    <!-- Bakım Modu Durumu -->
    <div class="status-section mb-6">
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 class="text-sm font-medium text-gray-900">Mevcut Durum</h4>
          <p class="text-sm text-gray-500">
            {{ isMaintenanceActive ? 'Bakım modu aktif' : 'Sistem normal çalışıyor' }}
          </p>
        </div>
        <div class="flex items-center">
          <label class="switch">
            <input 
              type="checkbox"
              v-model="isMaintenanceActive"
              @change="toggleMaintenance"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Bakım Ayarları -->
    <div class="settings-section mb-8" v-if="isMaintenanceActive">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Bakım Ayarları</h4>
      
      <!-- Planlanan Süre -->
      <div class="form-group mb-4">
        <label class="form-label">Planlanan Süre (Saat)</label>
        <input
          type="number"
          v-model="settings.duration"
          min="1"
          class="form-input"
        >
      </div>

      <!-- Bakım Mesajı -->
      <div class="form-group mb-4">
        <label class="form-label">Bakım Mesajı</label>
        <textarea
          v-model="settings.message"
          rows="3"
          class="form-textarea"
          placeholder="Ziyaretçilere gösterilecek mesaj..."
        ></textarea>
      </div>

      <!-- İzin Verilen IP'ler -->
      <div class="form-group">
        <label class="form-label">İzin Verilen IP Adresleri</label>
        <div class="space-y-2">
          <div 
            v-for="(ip, index) in settings.allowedIps" 
            :key="index"
            class="flex items-center space-x-2"
          >
            <input
              type="text"
              v-model="settings.allowedIps[index]"
              class="form-input flex-1"
              placeholder="örn: 192.168.1.1"
            >
            <button 
              @click="removeIp(index)"
              class="delete-button"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <button 
            @click="addIp"
            class="add-button mt-2"
          >
            <i class="fas fa-plus mr-2"></i>
            IP Ekle
          </button>
        </div>
      </div>
    </div>

    <!-- Bakım Geçmişi -->
    <div class="history-section">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Bakım Geçmişi</h4>
      <div class="space-y-3">
        <div 
          v-for="record in maintenanceHistory" 
          :key="record.id"
          class="history-item"
        >
          <div class="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(record.startDate) }}
              </p>
              <p class="text-sm text-gray-500">
                Süre: {{ record.duration }} saat
              </p>
              <p class="text-sm text-gray-500">
                {{ record.message }}
              </p>
            </div>
            <span :class="getStatusClass(record.status)">
              {{ record.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'MaintenanceMode',
  
  setup() {
    const isMaintenanceActive = ref(false)
    const settings = reactive({
      duration: 1,
      message: '',
      allowedIps: ['127.0.0.1']
    })

    const maintenanceHistory = ref([
      {
        id: 1,
        startDate: new Date('2024-01-15'),
        duration: 2,
        message: 'Sistem güncellemesi',
        status: 'Tamamlandı'
      },
      // Diğer geçmiş kayıtları...
    ])

    const toggleMaintenance = async () => {
      try {
        // API çağrısı yapılacak
        console.log('Bakım modu değiştirildi:', isMaintenanceActive.value)
      } catch (error) {
        console.error('Hata:', error)
        isMaintenanceActive.value = !isMaintenanceActive.value // Hata durumunda geri al
      }
    }

    const addIp = () => {
      settings.allowedIps.push('')
    }

    const removeIp = (index) => {
      settings.allowedIps.splice(index, 1)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusClass = (status) => {
      const classes = {
        'Tamamlandı': 'text-green-600',
        'Devam Ediyor': 'text-blue-600',
        'İptal Edildi': 'text-red-600'
      }
      return `text-sm font-medium ${classes[status] || 'text-gray-600'}`
    }

    return {
      isMaintenanceActive,
      settings,
      maintenanceHistory,
      toggleMaintenance,
      addIp,
      removeIp,
      formatDate,
      getStatusClass
    }
  }
}
</script>

<style lang="scss" scoped>
.maintenance-mode {
  @apply bg-white rounded-lg p-6;

  .switch {
    @apply relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
           border-2 border-transparent transition-colors duration-200 ease-in-out
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-input,
  .form-textarea {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .delete-button {
    @apply p-2 text-red-600 hover:text-red-800 focus:outline-none;
  }

  .add-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300
           rounded-md shadow-sm text-sm font-medium text-gray-700
           bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500;
  }
}
</style> 