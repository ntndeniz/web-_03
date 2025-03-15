<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else class="error-boundary">
      <h2>Bir hata oluştu</h2>
      <button @click="resetError">Tekrar Dene</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false
    }
  },
  methods: {
    handleError(error) {
      this.hasError = true
      console.error(error)
    },
    resetError() {
      this.hasError = false
    }
  }
}
</script> 