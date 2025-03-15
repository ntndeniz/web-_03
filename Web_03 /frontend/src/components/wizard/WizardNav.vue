<template>
  <nav class="wizard-nav">
    <ol class="nav-list">
      <li 
        v-for="(step, index) in steps" 
        :key="index"
        class="nav-item"
        :class="{
          'is-active': currentStep === index,
          'is-completed': index < currentStep
        }"
      >
        <button
          class="nav-button"
          :disabled="!canNavigate(index)"
          @click="handleStepClick(index)"
        >
          <span class="step-indicator">
            <template v-if="index < currentStep">
              <svg class="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </template>
            <span v-else>{{ index + 1 }}</span>
          </span>
          <span class="step-label">{{ step.title }}</span>
        </button>

        <div v-if="index < steps.length - 1" class="connector" />
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'WizardNav',

  props: {
    steps: {
      type: Array,
      required: true,
      validator: value => value.every(step => typeof step.title === 'string')
    },
    currentStep: {
      type: Number,
      required: true
    },
    allowNavigation: {
      type: Boolean,
      default: true
    }
  },

  emits: ['step-click'],

  methods: {
    canNavigate(stepIndex) {
      if (!this.allowNavigation) return false
      return stepIndex <= this.currentStep
    },
    handleStepClick(stepIndex) {
      if (this.canNavigate(stepIndex)) {
        this.$emit('step-click', stepIndex)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wizard-nav {
  @apply py-4;
}

.nav-list {
  @apply flex items-center;
}

.nav-item {
  @apply flex items-center flex-1;

  &:last-child {
    @apply flex-none;
  }
}

.nav-button {
  @apply flex items-center text-sm font-medium;

  &:disabled {
    @apply cursor-not-allowed opacity-50;
  }
}

.step-indicator {
  @apply flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
         border-2 border-gray-300 bg-white text-gray-500;

  .is-active & {
    @apply border-primary-500 bg-primary-500 text-white;
  }

  .is-completed & {
    @apply border-primary-500 bg-primary-500 text-white;
  }
}

.check-icon {
  @apply w-5 h-5;
}

.step-label {
  @apply ml-3 text-sm font-medium text-gray-900;

  .is-active & {
    @apply text-primary-600;
  }

  .is-completed & {
    @apply text-primary-600;
  }
}

.connector {
  @apply flex-1 mx-4 h-0.5 bg-gray-300;

  .is-completed + .nav-item & {
    @apply bg-primary-500;
  }
}
</style> 