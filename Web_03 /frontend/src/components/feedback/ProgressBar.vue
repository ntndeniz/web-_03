<template>
  <div class="progress-bar" :class="{ 'with-label': showLabel }">
    <div class="progress-track">
      <div 
        class="progress-fill"
        :class="[
          `variant-${variant}`,
          { 'is-striped': striped },
          { 'is-animated': animated }
        ]"
        :style="{ width: `${clampedValue}%` }"
      />
    </div>
    <div v-if="showLabel" class="progress-label">
      {{ clampedValue }}%
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',

  props: {
    value: {
      type: Number,
      required: true
    },
    variant: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'success', 'warning', 'error'].includes(value)
    },
    striped: {
      type: Boolean,
      default: false
    },
    animated: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    clampedValue() {
      return Math.min(100, Math.max(0, this.value))
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  @apply flex items-center gap-4;

  &.with-label {
    .progress-track {
      @apply flex-1;
    }
  }
}

.progress-track {
  @apply w-full h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full transition-all duration-300 ease-out;

  &.variant-primary {
    @apply bg-primary-500;
  }

  &.variant-success {
    @apply bg-green-500;
  }

  &.variant-warning {
    @apply bg-yellow-500;
  }

  &.variant-error {
    @apply bg-red-500;
  }

  &.is-striped {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }

  &.is-animated {
    animation: progress-bar-stripes 1s linear infinite;
  }
}

.progress-label {
  @apply text-sm font-medium text-gray-700 min-w-[3rem] text-right;
}

@keyframes progress-bar-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}
</style> 