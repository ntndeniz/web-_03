<template>
  <div class="file-viewer">
    <div class="viewer-header">
      <div class="file-info">
        <div class="file-icon">
          <svg v-if="isImage" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg v-else-if="isPDF" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="file-details">
          <h3 class="file-name">{{ fileName }}</h3>
          <p class="file-meta">{{ fileSize }} - {{ fileType }}</p>
        </div>
      </div>

      <div class="viewer-actions">
        <button 
          v-if="canDownload"
          class="action-button"
          @click="downloadFile"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>İndir</span>
        </button>
        <button 
          v-if="canPrint && isPDF"
          class="action-button"
          @click="printFile"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Yazdır</span>
        </button>
      </div>
    </div>

    <div class="viewer-content" :class="{ 'is-loading': loading }">
      <template v-if="loading">
        <div class="loading-indicator">
          <svg class="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Yükleniyor...</span>
        </div>
      </template>

      <template v-else-if="error">
        <div class="error-message">
          <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p>{{ error }}</p>
        </div>
      </template>

      <template v-else>
        <img
          v-if="isImage"
          :src="fileUrl"
          :alt="fileName"
          class="image-preview"
          @load="handleLoad"
          @error="handleError"
        />
        <iframe
          v-else-if="isPDF"
          :src="fileUrl"
          class="pdf-preview"
          @load="handleLoad"
          @error="handleError"
        />
        <div v-else class="unsupported-format">
          <p>Bu dosya formatı önizleme için desteklenmiyor.</p>
          <button class="download-button" @click="downloadFile">
            Dosyayı İndir
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileViewer',

  props: {
    fileUrl: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    fileSize: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      default: ''
    },
    canDownload: {
      type: Boolean,
      default: true
    },
    canPrint: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      loading: true,
      error: null
    }
  },

  computed: {
    isImage() {
      return /\.(jpe?g|png|gif|svg|webp)$/i.test(this.fileName)
    },
    isPDF() {
      return /\.pdf$/i.test(this.fileName)
    }
  },

  methods: {
    handleLoad() {
      this.loading = false
      this.error = null
    },
    handleError(e) {
      this.loading = false
      this.error = 'Dosya yüklenirken bir hata oluştu.'
      this.$emit('error', e)
    },
    downloadFile() {
      window.open(this.fileUrl, '_blank')
    },
    printFile() {
      if (this.isPDF) {
        const iframe = this.$el.querySelector('iframe')
        if (iframe) {
          iframe.contentWindow.print()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.file-viewer {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.viewer-header {
  @apply flex items-center justify-between p-4 border-b border-gray-200;
}

.file-info {
  @apply flex items-center space-x-3;
}

.file-icon {
  @apply text-gray-400;
}

.file-details {
  @apply min-w-0;
}

.file-name {
  @apply text-sm font-medium text-gray-900 truncate;
}

.file-meta {
  @apply text-xs text-gray-500;
}

.viewer-actions {
  @apply flex items-center space-x-2;
}

.action-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
         text-gray-700 bg-white border border-gray-300 hover:bg-gray-50
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;

  svg {
    @apply -ml-1 mr-2;
  }
}

.viewer-content {
  @apply relative;
  min-height: 400px;

  &.is-loading {
    @apply bg-gray-50;
  }
}

.loading-indicator {
  @apply absolute inset-0 flex flex-col items-center justify-center text-gray-500;

  span {
    @apply mt-4 text-sm font-medium;
  }
}

.error-message {
  @apply absolute inset-0 flex flex-col items-center justify-center text-red-500;

  p {
    @apply mt-4 text-sm font-medium;
  }
}

.image-preview {
  @apply w-full h-full object-contain;
  max-height: 600px;
}

.pdf-preview {
  @apply w-full h-full border-0;
  height: 600px;
}

.unsupported-format {
  @apply p-8 text-center;

  p {
    @apply text-sm text-gray-500 mb-4;
  }
}

.download-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
         rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style>