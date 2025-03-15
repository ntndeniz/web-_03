<template>
  <div class="space-y-4">
    <div v-for="(variant, type) in variants" :key="type" class="space-y-2">
      <label class="block font-medium">{{ type }}</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in variant.options"
          :key="option.value"
          @click="selectVariant(type, option)"
          :class="[
            'px-4 py-2 border rounded-lg',
            isSelected(type, option) ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          ]"
          :disabled="!option.available"
        >
          <span :class="{ 'text-gray-400': !option.available }">
            {{ option.label }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductVariants',
  props: {
    variants: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedVariants: {},
      error: ''
    }
  },
  methods: {
    selectVariant(type, option) {
      if (!option.available) return

      this.selectedVariants = {
        ...this.selectedVariants,
        [type]: option.value
      }

      this.$emit('variant-selected', this.selectedVariants)
      this.error = ''
    },
    isSelected(type, option) {
      return this.selectedVariants[type] === option.value
    },
    validateSelection() {
      const variantTypes = Object.keys(this.variants)
      const selectedTypes = Object.keys(this.selectedVariants)

      if (variantTypes.length !== selectedTypes.length) {
        this.error = 'Lütfen tüm varyantları seçin'
        return false
      }

      this.error = ''
      return true
    }
  }
}
</script> 