<template>
  <div class="error-page">
    <div class="error-content">
      <img src="@/assets/images/404.svg" alt="404 Error" class="error-image" />
      <h1 class="error-title">Sayfa Bulunamadı</h1>
      <p class="error-message">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <div class="error-actions">
        <router-link to="/" class="btn-primary">
          Ana Sayfaya Dön
        </router-link>
        <button @click="goBack" class="btn-secondary">
          Geri Git
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',

  setup() {
    const goBack = () => {
      window.history.length > 1
        ? window.history.go(-1)
        : window.location.href = '/'
    }

    return {
      goBack
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
    @apply flex justify-center space-x-4;

    .btn-primary {
      @apply px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors;
    }

    .btn-secondary {
      @apply px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors;
    }
  }
}
</style> 