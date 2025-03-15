<template>
  <TransitionGroup
    tag="div"
    class="toast-container"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="[
        `variant-${toast.variant}`,
        { 'with-action': toast.action }
      ]"
    >
      <div class="toast-icon" v-if="toast.variant !== 'default'">
        <svg v-if="toast.variant === 'success'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else-if="toast.variant === 'error'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg v-else-if="toast.variant === 'warning'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <svg v-else-if="toast.variant === 'info'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div class="toast-content">
        <p class="toast-message">{{ toast.message }}</p>
        <button
          v-if="toast.action"
          class="toast-action"
          @click="handleAction(toast)"
        >
          {{ toast.action.label }}
        </button>
      </div>

      <button
        class="toast-close"
        @click="removeToast(toast.id)"
      >
        <span class="sr-only">Kapat</span>
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div 
        v-if="toast.duration"
        class="toast-progress"
        :style="{ animationDuration: `${toast.duration}ms` }"
      />
    </div>
  </TransitionGroup>
</template>

<script>
export default {
  name: 'Toast',

  props: {
    toasts: {
      type: Array,
      required: true,
      validator: value => value.every(toast => 
        typeof toast.id === 'string' &&
        typeof toast.message === 'string' &&
        (!toast.variant || ['default', 'success', 'error', 'warning', 'info'].includes(toast.variant)) &&
        (!toast.duration || typeof toast.duration === 'number') &&
        (!toast.action || (typeof toast.action === 'object' && typeof toast.action.label === 'string'))
      )
    }
  },

  emits: ['remove', 'action'],

  methods: {
    removeToast(id) {
      this.$emit('remove', id)
    },
    handleAction(toast) {
      this.$emit('action', toast)
    }
  }
}
</script>

<style lang="scss" scoped>
.toast-container {
  @apply fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2;
}

.toast {
  @apply flex items-start p-4 min-w-[320px] max-w-md rounded-lg shadow-lg bg-white
         border-l-4 border-transparent;

  &.variant-success {
    @apply border-green-500;
    .toast-icon { @apply text-green-500; }
  }

  &.variant-error {
    @apply border-red-500;
    .toast-icon { @apply text-red-500; }
  }

  &.variant-warning {
    @apply border-yellow-500;
    .toast-icon { @apply text-yellow-500; }
  }

  &.variant-info {
    @apply border-blue-500;
    .toast-icon { @apply text-blue-500; }
  }

  &.with-action {
    .toast-content {
      @apply flex-1 flex justify-between items-center;
    }
  }
}

.toast-icon {
  @apply flex-shrink-0 mr-3;
}

.toast-content {
  @apply flex-1 mr-2;
}

.toast-message {
  @apply text-sm text-gray-900;
}

.toast-action {
  @apply ml-4 text-sm font-medium text-primary-600 hover:text-primary-500;
}

.toast-close {
  @apply flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500;
}

.toast-progress {
  @apply absolute bottom-0 left-0 h-1 bg-primary-500;
  animation: progress-bar linear forwards;
  width: 100%;
}

@keyframes progress-bar {
  from { width: 100%; }
  to { width: 0%; }
}
</style> 