<template>
  <div 
    class="skeleton"
    :class="[
      variant,
      { 'is-animated': animated }
    ]"
    :style="computedStyle"
  >
    <span class="sr-only">Yükleniyor...</span>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',

  props: {
    variant: {
      type: String,
      default: 'text',
      validator: value => ['text', 'circle', 'rect'].includes(value)
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: null
    },
    animated: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    computedStyle() {
      const style = {}

      if (typeof this.width === 'number') {
        style.width = `${this.width}px`
      } else {
        style.width = this.width
      }

      if (this.height) {
        if (typeof this.height === 'number') {
          style.height = `${this.height}px`
        } else {
          style.height = this.height
        }
      }

      return style
    }
  }
}
</script>

<style lang="scss" scoped>
.skeleton {
  @apply bg-gray-200 rounded overflow-hidden;

  &.text {
    @apply h-4;
  }

  &.circle {
    @apply rounded-full;
    aspect-ratio: 1;
  }

  &.rect {
    @apply h-full;
  }

  &.is-animated {
    position: relative;
    overflow: hidden;

    &::after {
      @apply absolute inset-0;
      content: '';
      animation: skeleton-loading 1.5s infinite;
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.2) 20%,
        rgba(255, 255, 255, 0.5) 60%,
        rgba(255, 255, 255, 0)
      );
    }
  }
}

@keyframes skeleton-loading {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}
</style> 