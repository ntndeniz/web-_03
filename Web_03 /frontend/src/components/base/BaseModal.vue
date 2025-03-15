<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
          enter-to-class="translate-y-0 opacity-100 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="translate-y-0 opacity-100 sm:scale-100"
          leave-to-class="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
        >
          <div class="modal-container" :class="[`size-${size}`]">
            <div v-if="$slots.header" class="modal-header">
              <slot name="header" />
              <button v-if="closable" class="close-button" @click="close">
                <span class="sr-only">Kapat</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="modal-body">
              <slot />
            </div>

            <div v-if="$slots.footer" class="modal-footer">
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
export default {
  name: 'BaseModal',

  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update:modelValue', 'close'],

  methods: {
    close() {
      this.$emit('update:modelValue', false)
      this.$emit('close')
    },
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50;
}

.modal-container {
  @apply bg-white rounded-lg max-h-[90vh] overflow-hidden relative;

  &.size-sm {
    @apply w-full max-w-md;
  }

  &.size-md {
    @apply w-full max-w-lg;
  }

  &.size-lg {
    @apply w-full max-w-xl;
  }

  &.size-xl {
    @apply w-full max-w-2xl;
  }

  &.size-full {
    @apply w-full h-full max-w-none rounded-none;
  }
}

.modal-header {
  @apply px-6 py-4 border-b border-gray-200 flex items-center justify-between;
}

.modal-body {
  @apply p-6 overflow-y-auto;
}

.modal-footer {
  @apply px-6 py-4 border-t border-gray-200;
}

.close-button {
  @apply text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500;
}
</style> 