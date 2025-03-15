<template>
  <div class="flex justify-center space-x-2">
    <button 
      class="px-4 py-2 border border-primary-500 text-primary-500 rounded hover:bg-primary-50"
    >
      Önceki
    </button>
    <button 
      v-for="page in totalPages"
      :key="page"
      :class="[
        'px-4 py-2 rounded',
        currentPage === page 
          ? 'bg-primary-500 text-white' 
          : 'border border-primary-500 text-primary-500 hover:bg-primary-50'
      ]"
    >
      {{ page }}
    </button>
    <button 
      class="px-4 py-2 border border-primary-500 text-primary-500 rounded hover:bg-primary-50"
    >
      Sonraki
    </button>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    current: {
      type: Number,
      required: true
    }
  },
  computed: {
    pages() {
      return Array.from({ length: this.total }, (_, i) => i + 1)
    }
  },
  emits: ['update:current']
}
</script> 