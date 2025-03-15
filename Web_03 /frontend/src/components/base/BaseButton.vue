<template>
  <button
    :type="type"
    :class="[
      'base-button',
      `variant-${variant}`,
      `size-${size}`,
      { 'is-loading': loading },
      { 'is-block': block },
      { 'is-rounded': rounded }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner" />
    <span v-else-if="$slots.icon" class="icon">
      <slot name="icon" />
    </span>
    <span class="content">
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  
  props: {
    type: {
      type: String,
      default: 'button'
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    }
  },

  emits: ['click'],

  methods: {
    handleClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-button {
  @apply inline-flex items-center justify-center font-medium transition-colors duration-200 
         focus:outline-none focus:ring-2 focus:ring-offset-2;

  &.variant-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }

  &.variant-secondary {
    @apply bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500;
  }

  &.variant-success {
    @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
  }

  &.variant-danger {
    @apply bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }

  &.variant-warning {
    @apply bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500;
  }

  &.variant-info {
    @apply bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500;
  }

  &.size-sm {
    @apply px-3 py-1.5 text-sm;
  }

  &.size-md {
    @apply px-4 py-2 text-base;
  }

  &.size-lg {
    @apply px-6 py-3 text-lg;
  }

  &.is-loading {
    @apply opacity-75 cursor-not-allowed;
  }

  &.is-block {
    @apply w-full;
  }

  &.is-rounded {
    @apply rounded-full;
  }

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }

  .spinner {
    @apply w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2;
  }

  .icon {
    @apply -ml-1 mr-2;
  }
}
</style> 