<template>
  <div class="flex items-center">
    <div class="flex">
      <i v-for="i in 5" :key="i"
         class="fas fa-star"
         :class="getStarClass(i)"
      ></i>
    </div>
    <span v-if="showRating" class="ml-2 text-sm text-gray-600">
      {{ rating.toFixed(1) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      required: true
    },
    showRating: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getStarClass(position) {
      if (position <= this.rating) {
        return 'text-yellow-400'
      } else if (position - 0.5 <= this.rating) {
        return 'text-yellow-400 opacity-50'
      }
      return 'text-gray-300'
    }
  }
}
</script> 