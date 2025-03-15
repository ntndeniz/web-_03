<template>
  <div 
    class="wizard-step"
    :class="{
      'is-active': isActive,
      'is-completed': isCompleted
    }"
    v-show="isActive"
  >
    <div class="step-header" v-if="title || subtitle">
      <h3 class="step-title">{{ title }}</h3>
      <p v-if="subtitle" class="step-subtitle">{{ subtitle }}</p>
    </div>

    <div class="step-content">
      <slot />
    </div>

    <div class="step-actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WizardStep',

  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },

  emits: ['validate']
}
</script>

<style lang="scss" scoped>
.wizard-step {
  @apply w-full;

  &.is-active {
    @apply block;
  }

  &:not(.is-active) {
    @apply hidden;
  }
}

.step-header {
  @apply mb-6;
}

.step-title {
  @apply text-lg font-medium text-gray-900;
}

.step-subtitle {
  @apply mt-1 text-sm text-gray-500;
}

.step-content {
  @apply space-y-6;
}

.step-actions {
  @apply mt-8 flex justify-between items-center;
}
</style> 