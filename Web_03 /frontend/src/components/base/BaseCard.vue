<template>
  <div 
    class="base-card"
    :class="[
      `shadow-${shadow}`,
      { 'is-hoverable': hoverable },
      { 'is-bordered': bordered }
    ]"
  >
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    
    <div class="card-body">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  
  props: {
    shadow: {
      type: String,
      default: 'md',
      validator: value => ['none', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    hoverable: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.base-card {
  @apply bg-white rounded-lg overflow-hidden;

  &.shadow-none {
    @apply shadow-none;
  }

  &.shadow-sm {
    @apply shadow-sm;
  }

  &.shadow-md {
    @apply shadow-md;
  }

  &.shadow-lg {
    @apply shadow-lg;
  }

  &.shadow-xl {
    @apply shadow-xl;
  }

  &.is-hoverable {
    @apply transition-shadow duration-200 hover:shadow-lg;
  }

  &.is-bordered {
    @apply border border-gray-200;
  }

  .card-header {
    @apply px-6 py-4 border-b border-gray-200;
  }

  .card-body {
    @apply p-6;
  }

  .card-footer {
    @apply px-6 py-4 border-t border-gray-200;
  }
}
</style> 