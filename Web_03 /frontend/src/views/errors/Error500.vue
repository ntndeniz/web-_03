<template>
  <div class="error-page">
    <div class="error-content">
      <img src="@/assets/images/500.svg" alt="500 Error" class="error-image" />
      <h1 class="error-title">Sunucu Hatası</h1>
      <p class="error-message">
        Üzgünüz, bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.
      </p>
      <div class="error-actions">
        <button @click="retryRequest" class="btn-primary">
          Tekrar Dene
        </button>
        <router-link to="/" class="btn-secondary">
          Ana Sayfaya Dön
        </router-link>
      </div>
      <div v-if="showTechnicalDetails" class="technical-details">
        <p class="text-sm text-gray-500">
          Hata Kodu: {{ errorCode }}
        </p>
        <p class="text-sm text-gray-500">
          Hata Mesajı: {{ errorMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'Error500',

  props: {
    errorCode: {
      type: String,
      default: '500'
    },
    errorMessage: {
      type: String,
      default: 'Internal Server Error'
    },
    showTechnicalDetails: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const retryRequest = () => {
      window.location.reload()
    }

    return {
      retryRequest
    }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center bg-gray-100;

  .error-content {
    @apply text-center p-8;
  }

  .error-image {
    @apply w-64 h-64 mx-auto mb-8;
  }

  .error-title {
    @apply text-4xl font-bold text-gray-900 mb-4;
  }

  .error-message {
    @apply text-lg text-gray-600 mb-8;
  }

  .error-actions {
    @apply flex justify-center space-x-4 mb-8;

    .btn-primary {
      @apply px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors;
    }

    .btn-secondary {
      @apply px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors;
    }
  }

  .technical-details {
    @apply mt-8 p-4 bg-gray-50 rounded-lg;
  }
}
</style> 