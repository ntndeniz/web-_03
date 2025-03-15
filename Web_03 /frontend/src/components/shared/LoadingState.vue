<template>
  <div class="loading-state" :class="{ overlay }">
    <div class="loading-content">
      <div class="spinner" :class="size" />
      <p v-if="text" class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',

  props: {
    text: {
      type: String,
      default: 'Yükleniyor...'
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    overlay: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading-state {
  @apply flex items-center justify-center p-8;

  &.overlay {
    @apply fixed inset-0 bg-white bg-opacity-75 z-50;
  }
}

.loading-content {
  @apply flex flex-col items-center;
}

.spinner {
  @apply animate-spin rounded-full border-t-transparent;

  &.sm {
    @apply h-6 w-6 border-2;
  }

  &.md {
    @apply h-8 w-8 border-3;
  }

  &.lg {
    @apply h-12 w-12 border-4;
  }

  @apply border-primary-500;
}

.loading-text {
  @apply mt-4 text-sm font-medium text-gray-700;
}
</style> 