<template>
  <div class="import-export">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Veri İçe/Dışa Aktarma</h3>

    <!-- İçe Aktarma -->
    <div class="import-section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Veri İçe Aktar</h4>
      <div class="flex items-start space-x-4">
        <div class="flex-1">
          <div class="file-upload-area">
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept=".csv,.xlsx"
              @change="handleFileSelect"
            >
            <div 
              class="upload-zone"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleFileDrop"
            >
              <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-600">
                Dosyayı sürükleyin veya seçin
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Desteklenen formatlar: CSV, XLSX
              </p>
            </div>
          </div>
          <div v-if="selectedFile" class="selected-file mt-2">
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span class="text-sm text-gray-600">{{ selectedFile.name }}</span>
              <button @click="clearFile" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
        <button 
          class="import-button"
          :disabled="!selectedFile || isProcessing"
          @click="importData"
        >
          <i class="fas fa-file-import mr-2"></i>
          İçe Aktar
        </button>
      </div>
    </div>

    <!-- Dışa Aktarma -->
    <div class="export-section">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Veri Dışa Aktar</h4>
      <div class="export-options space-y-4">
        <div class="format-selection">
          <label class="block text-sm text-gray-700 mb-2">Format Seçin</label>
          <div class="flex space-x-4">
            <label class="format-option">
              <input 
                type="radio" 
                v-model="exportFormat" 
                value="csv"
                class="sr-only"
              >
              <span class="option-text">
                <i class="fas fa-file-csv mr-2"></i>
                CSV
              </span>
            </label>
            <label class="format-option">
              <input 
                type="radio" 
                v-model="exportFormat" 
                value="xlsx"
                class="sr-only"
              >
              <span class="option-text">
                <i class="fas fa-file-excel mr-2"></i>
                Excel
              </span>
            </label>
          </div>
        </div>

        <div class="data-selection">
          <label class="block text-sm text-gray-700 mb-2">Veri Seçin</label>
          <div class="grid grid-cols-2 gap-4">
            <label 
              v-for="option in exportOptions" 
              :key="option.value"
              class="data-option"
            >
              <input 
                type="checkbox"
                v-model="selectedData"
                :value="option.value"
                class="sr-only"
              >
              <span class="option-text">
                <i :class="option.icon" class="mr-2"></i>
                {{ option.label }}
              </span>
            </label>
          </div>
        </div>

        <button 
          class="export-button w-full"
          :disabled="selectedData.length === 0 || isProcessing"
          @click="exportData"
        >
          <i class="fas fa-file-export mr-2"></i>
          Dışa Aktar
        </button>
      </div>
    </div>

    <!-- İşlem Durumu -->
    <div v-if="isProcessing" class="processing-status mt-6">
      <div class="flex items-center justify-center">
        <i class="fas fa-spinner fa-spin text-primary-500 mr-2"></i>
        <span class="text-sm text-gray-600">İşlem devam ediyor...</span>
      </div>
      <div class="progress-bar mt-2">
        <div 
          class="progress"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ImportExport',

  setup() {
    const fileInput = ref(null)
    const selectedFile = ref(null)
    const exportFormat = ref('csv')
    const selectedData = ref([])
    const isProcessing = ref(false)
    const progress = ref(0)

    const exportOptions = [
      { value: 'users', label: 'Kullanıcılar', icon: 'fas fa-users' },
      { value: 'orders', label: 'Siparişler', icon: 'fas fa-shopping-cart' },
      { value: 'products', label: 'Ürünler', icon: 'fas fa-box' },
      { value: 'customers', label: 'Müşteriler', icon: 'fas fa-user-friends' }
    ]

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        selectedFile.value = file
      }
    }

    const handleFileDrop = (event) => {
      const file = event.dataTransfer.files[0]
      if (file) {
        selectedFile.value = file
      }
    }

    const clearFile = () => {
      selectedFile.value = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const importData = async () => {
      if (!selectedFile.value) return

      try {
        isProcessing.value = true
        progress.value = 0

        // Simüle edilmiş içe aktarma işlemi
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 500))
          progress.value = i
        }

        // İşlem başarılı
        alert('Veriler başarıyla içe aktarıldı')
      } catch (error) {
        alert('Hata: ' + error.message)
      } finally {
        isProcessing.value = false
        clearFile()
      }
    }

    const exportData = async () => {
      if (selectedData.value.length === 0) return

      try {
        isProcessing.value = true
        progress.value = 0

        // Simüle edilmiş dışa aktarma işlemi
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 300))
          progress.value = i
        }

        // İşlem başarılı
        const format = exportFormat.value.toUpperCase()
        alert(`Veriler başarıyla ${format} formatında dışa aktarıldı`)
      } catch (error) {
        alert('Hata: ' + error.message)
      } finally {
        isProcessing.value = false
      }
    }

    return {
      fileInput,
      selectedFile,
      exportFormat,
      selectedData,
      exportOptions,
      isProcessing,
      progress,
      handleFileSelect,
      handleFileDrop,
      clearFile,
      importData,
      exportData
    }
  }
}
</script>

<style lang="scss" scoped>
.import-export {
  @apply bg-white rounded-lg p-6;

  .upload-zone {
    @apply flex flex-col items-center justify-center p-6 border-2 border-dashed
           border-gray-300 rounded-lg cursor-pointer hover:border-primary-500
           transition-colors duration-150;
  }

  .format-option,
  .data-option {
    @apply flex-1 relative flex cursor-pointer rounded-lg border p-4
           focus:outline-none;

    input:checked + .option-text {
      @apply border-primary-500 ring-2 ring-primary-500;
    }
  }

  .import-button,
  .export-button {
    @apply inline-flex items-center px-4 py-2 border border-transparent
           rounded-md shadow-sm text-sm font-medium text-white bg-primary-600
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