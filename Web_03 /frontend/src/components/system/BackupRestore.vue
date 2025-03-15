<template>
  <div class="backup-restore">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Yedekleme ve Geri Yükleme</h3>

    <!-- Yedekleme Bölümü -->
    <div class="backup-section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Sistem Yedekleme</h4>
      
      <!-- Yedekleme Seçenekleri -->
      <div class="options-grid mb-6">
        <div 
          v-for="option in backupOptions" 
          :key="option.id"
          class="option-card"
          :class="{ 'selected': selectedOptions.includes(option.id) }"
          @click="toggleOption(option.id)"
        >
          <i :class="option.icon" class="option-icon"></i>
          <h5 class="option-title">{{ option.name }}</h5>
          <p class="option-description">{{ option.description }}</p>
          <p class="option-size">{{ formatSize(option.size) }}</p>
        </div>
      </div>

      <!-- Yedekleme Ayarları -->
      <div class="backup-settings mb-6">
        <div class="form-group mb-4">
          <label class="form-label">Yedekleme Adı</label>
          <input
            type="text"
            v-model="backupName"
            class="form-input"
            placeholder="örn: tam_yedekleme_20240115"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Açıklama</label>
          <textarea
            v-model="backupDescription"
            rows="3"
            class="form-textarea"
            placeholder="Yedekleme hakkında notlar..."
          ></textarea>
        </div>
      </div>

      <!-- Yedekleme Butonu -->
      <button 
        class="backup-button"
        :disabled="isProcessing || selectedOptions.length === 0"
        @click="startBackup"
      >
        <i class="fas fa-download mr-2"></i>
        Yedekleme Başlat
      </button>
    </div>

    <!-- Geri Yükleme Bölümü -->
    <div class="restore-section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Geri Yükleme</h4>
      
      <!-- Yedek Seçimi -->
      <div class="backup-list space-y-3 mb-6">
        <div 
          v-for="backup in backups" 
          :key="backup.id"
          class="backup-item"
          :class="{ 'selected': selectedBackup === backup.id }"
          @click="selectBackup(backup.id)"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <h5 class="backup-name">{{ backup.name }}</h5>
              <p class="backup-info">
                {{ formatDate(backup.date) }} • {{ formatSize(backup.size) }}
              </p>
              <p class="backup-description">{{ backup.description }}</p>
            </div>
            <div class="backup-actions">
              <button 
                class="action-button"
                @click.stop="downloadBackup(backup)"
              >
                <i class="fas fa-download"></i>
              </button>
              <button 
                class="action-button text-red-600"
                @click.stop="deleteBackup(backup.id)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Geri Yükleme Butonu -->
      <button 
        class="restore-button"
        :disabled="isProcessing || !selectedBackup"
        @click="startRestore"
      >
        <i class="fas fa-upload mr-2"></i>
        Geri Yükle
      </button>
    </div>

    <!-- İşlem Durumu -->
    <div v-if="isProcessing" class="processing-status">
      <div class="status-content">
        <p class="status-text">{{ processingText }}</p>
        <div class="progress-bar mt-2">
          <div 
            class="progress"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'BackupRestore',
  
  setup() {
    const backupOptions = [
      {
        id: 1,
        name: 'Veritabanı',
        description: 'Tüm veritabanı yedeklemesi',
        icon: 'fas fa-database',
        size: 1024 * 1024 * 50 // 50MB
      },
      {
        id: 2,
        name: 'Dosya Sistemi',
        description: 'Yüklenen dosyalar ve medya',
        icon: 'fas fa-folder',
        size: 1024 * 1024 * 500 // 500MB
      },
      {
        id: 3,
        name: 'Ayarlar',
        description: 'Sistem ayarları ve yapılandırma',
        icon: 'fas fa-cog',
        size: 1024 * 1024 * 1 // 1MB
      }
    ]

    const backups = ref([
      {
        id: 1,
        name: 'tam_yedekleme_20240115',
        description: 'Haftalık tam yedekleme',
        date: new Date('2024-01-15'),
        size: 1024 * 1024 * 550 // 550MB
      },
      // Diğer yedeklemeler...
    ])

    const selectedOptions = ref([])
    const selectedBackup = ref(null)
    const backupName = ref('')
    const backupDescription = ref('')
    const isProcessing = ref(false)
    const processingText = ref('')
    const progress = ref(0)

    const toggleOption = (optionId) => {
      const index = selectedOptions.value.indexOf(optionId)
      if (index === -1) {
        selectedOptions.value.push(optionId)
      } else {
        selectedOptions.value.splice(index, 1)
      }
    }

    const selectBackup = (backupId) => {
      selectedBackup.value = backupId
    }

    const startBackup = async () => {
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
          name: backupName.value,
          description: backupDescription.value,
          date: new Date(),
          size: calculateTotalSize()
        }
        backups.value.unshift(newBackup)
      } finally {
        isProcessing.value = false
        backupName.value = ''
        backupDescription.value = ''
        selectedOptions.value = []
      }
    }

    const startRestore = async () => {
      isProcessing.value = true
      processingText.value = 'Geri yükleme yapılıyor...'
      progress.value = 0

      try {
        // Simüle edilmiş geri yükleme işlemi
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 500))
          progress.value = i
        }
      } finally {
        isProcessing.value = false
        selectedBackup.value = null
      }
    }

    const downloadBackup = (backup) => {
      // Yedekleme dosyasını indir
      console.log('Yedekleme indiriliyor:', backup)
    }

    const deleteBackup = async (backupId) => {
      if (confirm('Bu yedeklemeyi silmek istediğinizden emin misiniz?')) {
        backups.value = backups.value.filter(b => b.id !== backupId)
      }
    }

    const calculateTotalSize = () => {
      return selectedOptions.value.reduce((total, optionId) => {
        const option = backupOptions.find(o => o.id === optionId)
        return total + (option ? option.size : 0)
      }, 0)
    }

    const formatSize = (bytes) => {
      const sizes = ['B', 'KB', 'MB', 'GB']
      let i = 0
      while (bytes >= 1024 && i < sizes.length - 1) {
        bytes /= 1024
        i++
      }
      return `${bytes.toFixed(1)} ${sizes[i]}`
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

    return {
      backupOptions,
      backups,
      selectedOptions,
      selectedBackup,
      backupName,
      backupDescription,
      isProcessing,
      processingText,
      progress,
      toggleOption,
      selectBackup,
      startBackup,
      startRestore,
      downloadBackup,
      deleteBackup,
      formatSize,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
.backup-restore {
  @apply bg-white rounded-lg p-6;

  .options-grid {
    @apply grid grid-cols-1 md:grid-cols-3 gap-4;
  }

  .option-card {
    @apply p-4 border-2 border-gray-200 rounded-lg cursor-pointer
           hover:border-primary-200 transition-all;

    &.selected {
      @apply border-primary-500 bg-primary-50;
    }

    .option-icon {
      @apply text-2xl text-gray-400 mb-2;
    }

    .option-title {
      @apply text-sm font-medium text-gray-900 mb-1;
    }

    .option-description {
      @apply text-sm text-gray-500 mb-2;
    }

    .option-size {
      @apply text-xs text-gray-400;
    }
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-input,
  .form-textarea {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .backup-button,
  .restore-button {
    @apply inline-flex items-center justify-center px-6 py-3 border border-transparent
           rounded-md shadow-sm text-base font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .backup-item {
    @apply p-4 border border-gray-200 rounded-lg cursor-pointer
           hover:bg-gray-50 transition-colors;

    &.selected {
      @apply border-primary-500 ring-2 ring-primary-500;
    }

    .backup-name {
      @apply text-sm font-medium text-gray-900;
    }

    .backup-info {
      @apply text-xs text-gray-500 mt-1;
    }

    .backup-description {
      @apply text-sm text-gray-600 mt-2;
    }
  }

  .action-button {
    @apply p-2 hover:bg-gray-100 rounded-full focus:outline-none
           focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }

  .progress-bar {
    @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;

    .progress {
      @apply h-full bg-primary-500 transition-all duration-300;
    }
  }
}
</style> 