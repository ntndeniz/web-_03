<template>
  <div class="empty-state">
    <div class="empty-state-icon">
      <slot name="icon">
        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </slot>
    </div>
    
    <h3 class="empty-state-title">
      <slot name="title">{{ title }}</slot>
    </h3>
    
    <p class="empty-state-description">
      <slot name="description">{{ description }}</slot>
    </p>
    
    <div v-if="$slots.action" class="empty-state-action">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',

  props: {
    title: {
      type: String,
      default: 'Veri bulunamadı'
    },
    description: {
      type: String,
      default: 'Bu liste için henüz hiç veri eklenmemiş.'
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-state {
  @apply flex flex-col items-center justify-center py-12 px-4;
}

.empty-state-icon {
  @apply mx-auto text-gray-400;
}

.empty-state-title {
  @apply mt-4 text-lg font-medium text-gray-900;
}

.empty-state-description {
  @apply mt-2 text-sm text-gray-500 text-center max-w-sm;
}

.empty-state-action {
  @apply mt-6;
}
</style> 