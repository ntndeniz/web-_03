<template>
  <div
    v-if="show"
    class="alert"
    :class="[
      `variant-${variant}`,
      { 'is-dismissible': dismissible }
    ]"
    role="alert"
  >
    <div class="alert-icon" v-if="icon">
      <svg v-if="variant === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="variant === 'error'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <svg v-else-if="variant === 'warning'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <svg v-else-if="variant === 'info'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <div class="alert-content">
      <h4 v-if="title" class="alert-title">{{ title }}</h4>
      <div class="alert-message">
        <slot />
      </div>
    </div>

    <button
      v-if="dismissible"
      class="alert-close"
      @click="dismiss"
    >
      <span class="sr-only">Kapat</span>
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Alert',

  props: {
    variant: {
      type: String,
      default: 'info',
      validator: value => ['info', 'success', 'warning', 'error'].includes(value)
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: Boolean,
      default: true
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    }
  },

  emits: ['dismiss', 'update:show'],

  methods: {
    dismiss() {
      this.$emit('dismiss')
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  @apply relative flex p-4 rounded-lg;

  &.variant-success {
    @apply bg-green-50 text-green-800;
    .alert-icon { @apply text-green-400; }
  }

  &.variant-error {
    @apply bg-red-50 text-red-800;
    .alert-icon { @apply text-red-400; }
  }

  &.variant-warning {
    @apply bg-yellow-50 text-yellow-800;
    .alert-icon { @apply text-yellow-400; }
  }

  &.variant-info {
    @apply bg-blue-50 text-blue-800;
    .alert-icon { @apply text-blue-400; }
  }
}

.alert-icon {
  @apply flex-shrink-0 mr-3;
}

.alert-content {
  @apply flex-1;
}

.alert-title {
  @apply text-sm font-medium mb-1;
}

.alert-message {
  @apply text-sm;
}

.alert-close {
  @apply absolute top-4 right-4 text-current opacity-50 
         hover:opacity-75 focus:outline-none focus:opacity-75;
}
</style> 