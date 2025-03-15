<template>
  <div class="text-center py-12">
    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="text-lg font-medium text-gray-900">{{ message }}</h3>
    <p class="mt-1 text-gray-500">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductEmptyState',
  props: {
    message: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script> 