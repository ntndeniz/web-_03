<template>
  <div class="flex items-center">
    <!-- Yıldızlar -->
    <div class="flex">
      <button
        v-for="i in 5"
        :key="i"
        @click="!readonly && updateRating(i)"
        @mouseenter="!readonly && setHoverRating(i)"
        @mouseleave="!readonly && setHoverRating(0)"
        class="p-1 focus:outline-none"
        :disabled="readonly"
        :class="{ 'cursor-pointer': !readonly, 'cursor-default': readonly }"
      >
        <i
          class="fas fa-star"
          :class="[
            i <= (hoverRating || modelValue) ? 'text-yellow-400' : 'text-gray-300',
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          ]"
        ></i>
      </button>
    </div>

    <!-- Puan Gösterimi -->
    <span
      v-if="showRating"
      :class="[
        'ml-2',
        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
        readonly ? 'text-gray-600' : 'text-gray-700'
      ]"
    >
      {{ modelValue || 0 }}/5
    </span>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'RatingStars',

  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'base',
      validator: value => ['sm', 'base', 'lg'].includes(value)
    },
    showRating: {
      type: Boolean,
      default: false
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const hoverRating = ref(0)

    const updateRating = (rating) => {
      emit('update:modelValue', rating)
    }

    const setHoverRating = (rating) => {
      hoverRating.value = rating
    }

    return {
      hoverRating,
      updateRating,
      setHoverRating
    }
  }
}
</script> 