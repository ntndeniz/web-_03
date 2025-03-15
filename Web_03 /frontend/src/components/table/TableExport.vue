<template>
  <div class="table-export">
    <div class="flex items-center space-x-4">
      <!-- Export Formatı Seçimi -->
      <select
        v-model="selectedFormat"
        class="form-select"
      >
        <option value="excel">Excel</option>
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>

      <!-- Export Butonu -->
      <button
        @click="exportData"
        class="export-button"
        :disabled="loading"
      >
        <span v-if="loading">
          <LoadingSpinner class="w-4 h-4 mr-2" />
          Dışa Aktarılıyor...
        </span>
        <span v-else>
          <i class="fas fa-download mr-2"></i>
          Dışa Aktar
        </span>
      </button>
    </div>

    <!-- Bildirim -->
    <div
      v-if="notification"
      :class="[
        'mt-2 p-2 rounded text-sm',
        notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      ]"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { exportToExcel, exportToCsv, exportToPdf } from '@/utils/export'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'TableExport',

  components: {
    LoadingSpinner
  },

  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    filename: {
      type: String,
      default: 'export'
    }
  },

  setup(props) {
    const selectedFormat = ref('excel')
    const loading = ref(false)
    const notification = ref(null)

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type }
      setTimeout(() => {
        notification.value = null
      }, 3000)
    }

    const exportData = async () => {
      loading.value = true
      try {
        const exportFunctions = {
          excel: exportToExcel,
          csv: exportToCsv,
          pdf: exportToPdf
        }

        const exportFunction = exportFunctions[selectedFormat.value]
        await exportFunction(props.data, props.columns, props.filename)
        
        showNotification('Dışa aktarma başarıyla tamamlandı')
      } catch (error) {
        console.error('Dışa aktarma hatası:', error)
        showNotification('Dışa aktarma sırasında bir hata oluştu', 'error')
      } finally {
        loading.value = false
      }
    }

    return {
      selectedFormat,
      loading,
      notification,
      exportData
    }
  }
}
</script>

<style scoped>
.form-select {
  @apply border border-gray-300 rounded-md px-3 py-2 focus:ring-2 
         focus:ring-primary-500 focus:border-primary-500 outline-none;
}

.export-button {
  @apply flex items-center px-4 py-2 bg-primary-600 text-white rounded-md
         hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style> 