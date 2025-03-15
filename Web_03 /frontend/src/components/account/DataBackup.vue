<template>
  <div class="data-backup">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Veri Yedekleme</h3>

    <!-- Yedekleme Durumu -->
    <div class="backup-status mb-6">
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h4 class="text-sm font-medium text-gray-900">Son Yedekleme</h4>
          <p class="text-sm text-gray-500">
            {{ lastBackup ? formatDate(lastBackup) : 'Henüz yedekleme yapılmadı' }}
          </p>
        </div>
        <div class="status-indicator" :class="backupStatusClass">
          <i :class="backupStatusIcon"></i>
          <span class="ml-2">{{ backupStatusText }}</span>
        </div>
      </div>
    </div>

    <!-- Yedekleme Ayarları -->
    <div class="backup-settings mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Yedekleme Ayarları</h4>
      
      <!-- Otomatik Yedekleme -->
      <div class="setting-item mb-4">
        <div class="flex items-center justify-between">
          <div>
            <label class="text-sm font-medium text-gray-700">
              Otomatik Yedekleme
            </label>
            <p class="text-xs text-gray-500">
              Belirli aralıklarla otomatik yedekleme yapılır
            </p>
          </div>
          <div class="flex items-center">
            <label class="switch">
              <input 
                type="checkbox"
                v-model="settings.autoBackup"
                @change="saveSettings"
              >
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Yedekleme Sıklığı -->
      <div class="setting-item mb-4" v-if="settings.autoBackup">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Yedekleme Sıklığı
        </label>
        <select 
          v-model="settings.frequency"
          class="frequency-select"
          @change="saveSettings"
        >
          <option value="daily">Günlük</option>
          <option value="weekly">Haftalık</option>
          <option value="monthly">Aylık</option>
        </select>
      </div>

      <!-- Yedekleme Kapsamı -->
      <div class="setting-item">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Yedekleme Kapsamı
        </label>
        <div class="grid grid-cols-2 gap-4">
          <label 
            v-for="option in backupOptions" 
            :key="option.value"
            class="scope-option"
          >
            <input 
              type="checkbox"
              v-model="settings.scope"
              :value="option.value"
              class="sr-only"
              @change="saveSettings"
            >
            <span class="option-text">
              <i :class="option.icon" class="mr-2"></i>
              {{ option.label }}
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- Yedekleme Listesi -->
    <div class="backup-list">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Yedeklemeler</h4>
      <div class="space-y-3">
        <div 
          v-for="backup in backups" 
          :key="backup.id"
          class="backup-item"
        >
          <div class="flex items-center justify-between p-4 bg-white rounded-lg border">
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ formatDate(backup.date) }}
              </p>
              <p class="text-xs text-gray-500">
                Boyut: {{ formatFileSize(backup.size) }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button 
                class="action-button"
                @click="downloadBackup(backup)"
              >
                <i class="fas fa-download"></i>
              </button>
              <button 
                class="action-button text-red-600 hover:text-red-800"
                @click="deleteBackup(backup.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Manuel Yedekleme -->
    <div class="manual-backup mt-6">
      <button 
        class="backup-button w-full"
        :disabled="isProcessing"
        @click="createBackup"
      >
        <i class="fas fa-plus mr-2"></i>
        Yeni Yedekleme Oluştur
      </button>
    </div>

    <!-- İşlem Durumu -->
    <div v-if="isProcessing" class="processing-status mt-4">
      <div class="flex items-center justify-center mb-2">
        <i class="fas fa-spinner fa-spin text-primary-500 mr-2"></i>
        <span class="text-sm text-gray-600">{{ processingText }}</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatDate, formatFileSize } from '@/utils/format'

export default {
  name: 'DataBackup',

  setup() {
    const settings = ref({
      autoBackup: true,
      frequency: 'daily',
      scope: ['database', 'files']
    })

    const backupOptions = [
      { value: 'database', label: 'Veritabanı', icon: 'fas fa-database' },
      { value: 'files', label: 'Dosyalar', icon: 'fas fa-folder' },
      { value: 'settings', label: 'Ayarlar', icon: 'fas fa-cog' },
      { value: 'logs', label: 'Loglar', icon: 'fas fa-history' }
    ]

    const backups = ref([
      {
        id: 1,
        date: new Date('2024-03-15'),
        size: 2500000 // 2.5MB
      },
      {
        id: 2,
        date: new Date('2024-03-14'),
        size: 2300000 // 2.3MB
      }
    ])

    const isProcessing = ref(false)
    const processingText = ref('')
    const progress = ref(0)
    const lastBackup = computed(() => {
      return backups.value[0]?.date
    })

    const backupStatusClass = computed(() => {
      if (!lastBackup.value) return 'text-yellow-500'
      const daysSinceLastBackup = (new Date() - lastBackup.value) / (1000 * 60 * 60 * 24)
      return daysSinceLastBackup > 7 ? 'text-red-500' : 'text-green-500'
    })

    const backupStatusIcon = computed(() => {
      if (!lastBackup.value) return 'fas fa-exclamation-triangle'
      const daysSinceLastBackup = (new Date() - lastBackup.value) / (1000 * 60 * 60 * 24)
      return daysSinceLastBackup > 7 ? 'fas fa-exclamation-circle' : 'fas fa-check-circle'
    })

    const backupStatusText = computed(() => {
      if (!lastBackup.value) return 'Yedekleme gerekiyor'
      const daysSinceLastBackup = (new Date() - lastBackup.value) / (1000 * 60 * 60 * 24)
      return daysSinceLastBackup > 7 ? 'Yedekleme gerekiyor' : 'Güncel'
    })

    const saveSettings = () => {
      // Ayarları kaydet
      console.log('Ayarlar kaydedildi:', settings.value)
    }

    const createBackup = async () => {
      isProcessing.value = true
      processingText.value = 'Yedekleme oluşturuluyor...'
      progress.value = 0

      try {
        // Simüle edilmiş yedekleme işlemi
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 500))
          progress.value = i
        }

        const newBackup = {
          id: Date.now(),
          date: new Date(),
          size: Math.random() * 5000000 // 0-5MB arası
        }
        backups.value.unshift(newBackup)
      } finally {
        isProcessing.value = false
      }
    }

    const downloadBackup = (backup) => {
      // Yedekleme dosyasını indir
      console.log('Yedekleme indiriliyor:', backup)
    }

    const deleteBackup = async (id) => {
      if (confirm('Bu yedeklemeyi silmek istediğinizden emin misiniz?')) {
        backups.value = backups.value.filter(b => b.id !== id)
      }
    }

    return {
      settings,
      backupOptions,
      backups,
      isProcessing,
      processingText,
      progress,
      lastBackup,
      backupStatusClass,
      backupStatusIcon,
      backupStatusText,
      formatDate,
      formatFileSize,
      saveSettings,
      createBackup,
      downloadBackup,
      deleteBackup
    }
  }
}
</script>

<style lang="scss" scoped>
.data-backup {
  @apply bg-white rounded-lg p-6;

  .switch {
    @apply relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
           border-2 border-transparent transition-colors duration-200 ease-in-out
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .frequency-select {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .scope-option {
    @apply relative flex cursor-pointer rounded-lg border p-4
           focus:outline-none;

    input:checked + .option-text {
      @apply border-primary-500 ring-2 ring-primary-500;
    }
  }

  .action-button {
    @apply p-2 rounded-md hover:bg-gray-100 focus:outline-none
           focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }

  .backup-button {
    @apply inline-flex items-center justify-center px-6 py-3 border border-transparent
           rounded-md shadow-sm text-base font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .progress-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;

    .progress {
      @apply h-full bg-primary-500 transition-all duration-300;
    }
  }
}
</style> 