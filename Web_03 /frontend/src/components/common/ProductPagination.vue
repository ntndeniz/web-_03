<template>
  <div class="flex justify-center space-x-2">
    <button 
      v-for="page in pages" 
      :key="page"
      @click="$emit('update:current', page)"
      :class="[
        'px-4 py-2 rounded-lg',
        current === page 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      ]"
    >
      {{ page }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'ProductPagination',
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