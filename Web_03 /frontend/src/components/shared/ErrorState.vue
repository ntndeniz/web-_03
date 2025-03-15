<template>
  <div class="error-state">
    <div class="error-icon">
      <slot name="icon">
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </slot>
    </div>

    <h3 class="error-title">
      <slot name="title">{{ title }}</slot>
    </h3>

    <p class="error-message">
      <slot name="message">{{ message }}</slot>
    </p>

    <div v-if="$slots.action || retryable" class="error-actions">
      <slot name="action">
        <button v-if="retryable" class="retry-button" @click="$emit('retry')">
          Tekrar Dene
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorState',

  props: {
    title: {
      type: String,
      default: 'Bir hata oluştu'
    },
    message: {
      type: String,
      default: 'İşlem sırasında beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
    },
    retryable: {
      type: Boolean,
      default: false
    }
  },

  emits: ['retry']
}
</script>

<style lang="scss" scoped>
.error-state {
  @apply flex flex-col items-center justify-center py-12 px-4;
}

.error-icon {
  @apply mx-auto text-red-400;
}

.error-title {
  @apply mt-4 text-lg font-medium text-gray-900;
}

.error-message {
  @apply mt-2 text-sm text-gray-500 text-center max-w-sm;
}

.error-actions {
  @apply mt-6;
}

.retry-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent 
         text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 
         hover:bg-primary-700 focus:outline-none focus:ring-2 
         focus:ring-offset-2 focus:ring-primary-500;
}
</style> 