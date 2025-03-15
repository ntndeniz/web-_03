<template>
  <nav class="pagination" aria-label="Sayfalama">
    <ul class="pagination-list">
      <li>
        <button
          class="pagination-button"
          :class="{ 'is-disabled': currentPage === 1 }"
          :disabled="currentPage === 1"
          @click="handlePageChange(currentPage - 1)"
        >
          <span class="sr-only">Önceki</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </li>

      <li v-for="page in visiblePages" :key="page">
        <button
          class="pagination-button"
          :class="{ 'is-active': page === currentPage }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
      </li>

      <li>
        <button
          class="pagination-button"
          :class="{ 'is-disabled': currentPage === totalPages }"
          :disabled="currentPage === totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          <span class="sr-only">Sonraki</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },

  emits: ['page-change'],

  computed: {
    visiblePages() {
      const pages = []
      let start = Math.max(1, this.currentPage - Math.floor(this.maxVisiblePages / 2))
      let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1)

      if (end - start + 1 < this.maxVisiblePages) {
        start = Math.max(1, end - this.maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }
  },

  methods: {
    handlePageChange(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('page-change', page)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  @apply flex justify-center mt-6;
}

.pagination-list {
  @apply flex items-center space-x-2;
}

.pagination-button {
  @apply inline-flex items-center justify-center px-3 py-2 border border-gray-300 
         bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
         focus:z-10 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500;

  &.is-active {
    @apply bg-primary-50 border-primary-500 text-primary-600;
  }

  &.is-disabled {
    @apply opacity-50 cursor-not-allowed hover:bg-white;
  }
}
</style> 