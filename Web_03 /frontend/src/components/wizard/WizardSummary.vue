<template>
  <div class="wizard-summary">
    <div v-if="title || subtitle" class="summary-header">
      <h3 class="summary-title">{{ title }}</h3>
      <p v-if="subtitle" class="summary-subtitle">{{ subtitle }}</p>
    </div>

    <div class="summary-content">
      <div 
        v-for="(section, index) in sections" 
        :key="index"
        class="summary-section"
      >
        <div class="section-header">
          <h4 class="section-title">{{ section.title }}</h4>
          <button 
            v-if="editable" 
            class="edit-button"
            @click="$emit('edit', index)"
          >
            <span class="sr-only">Düzenle</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>

        <dl class="section-details">
          <template v-for="(item, itemIndex) in section.items" :key="itemIndex">
            <dt class="detail-label">{{ item.label }}</dt>
            <dd class="detail-value">{{ item.value }}</dd>
          </template>
        </dl>
      </div>
    </div>

    <div v-if="$slots.actions" class="summary-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WizardSummary',

  props: {
    title: {
      type: String,
      default: 'Özet'
    },
    subtitle: {
      type: String,
      default: ''
    },
    sections: {
      type: Array,
      required: true,
      validator: value => value.every(section => 
        typeof section.title === 'string' && 
        Array.isArray(section.items) &&
        section.items.every(item => 
          typeof item.label === 'string' && 
          (typeof item.value === 'string' || typeof item.value === 'number')
        )
      )
    },
    editable: {
      type: Boolean,
      default: true
    }
  },

  emits: ['edit']
}
</script>

<style lang="scss" scoped>
.wizard-summary {
  @apply space-y-8;
}

.summary-header {
  @apply space-y-1;
}

.summary-title {
  @apply text-lg font-medium text-gray-900;
}

.summary-subtitle {
  @apply text-sm text-gray-500;
}

.summary-section {
  @apply bg-white rounded-lg border border-gray-200 overflow-hidden;

  & + & {
    @apply mt-6;
  }
}

.section-header {
  @apply px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center;
}

.section-title {
  @apply text-sm font-medium text-gray-900;
}

.edit-button {
  @apply text-primary-600 hover:text-primary-700 focus:outline-none focus:text-primary-700;
}

.section-details {
  @apply px-6 py-4 grid grid-cols-3 gap-4;
}

.detail-label {
  @apply text-sm font-medium text-gray-500;
}

.detail-value {
  @apply text-sm text-gray-900 col-span-2;
}

.summary-actions {
  @apply flex justify-end space-x-4;
}
</style> 