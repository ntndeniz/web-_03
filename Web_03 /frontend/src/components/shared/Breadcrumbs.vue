<template>
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li 
        v-for="(item, index) in items" 
        :key="index"
        class="breadcrumb-item"
        :class="{ 'is-active': index === items.length - 1 }"
      >
        <router-link
          v-if="index !== items.length - 1"
          :to="item.to"
          class="breadcrumb-link"
        >
          <span v-if="index === 0" class="home-icon">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </span>
          {{ item.text }}
        </router-link>
        <span v-else class="breadcrumb-text">{{ item.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumbs',

  props: {
    items: {
      type: Array,
      required: true,
      validator: value => value.every(item => 
        typeof item.text === 'string' && 
        (!item.to || typeof item.to === 'string' || typeof item.to === 'object')
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
  @apply py-3;
}

.breadcrumb-list {
  @apply flex items-center space-x-2;
}

.breadcrumb-item {
  @apply flex items-center;

  &:not(:last-child)::after {
    content: '/';
    @apply mx-2 text-gray-400;
  }

  &.is-active {
    @apply text-gray-500;
  }
}

.breadcrumb-link {
  @apply text-gray-600 hover:text-gray-900 flex items-center;
}

.breadcrumb-text {
  @apply text-gray-900 font-medium;
}

.home-icon {
  @apply text-gray-400 mr-1;
}
</style> 