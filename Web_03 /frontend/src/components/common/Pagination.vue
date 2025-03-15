<template>
  <div class="flex justify-center space-x-2">
    <button
      v-for="page in pages"
      :key="page"
      @click="$emit('page-change', page)"
      class="px-3 py-1 rounded"
      :class="[
        currentPage === page
          ? 'bg-primary-600 text-white'
          : 'bg-gray-100 hover:bg-gray-200'
      ]"
    >
      {{ page }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  },
  computed: {
    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1)
    }
  }
}
</script> 