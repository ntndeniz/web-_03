<template>
  <transition name="fade">
    <button 
      v-show="isVisible"
      @click="scrollToTop"
      class="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors z-50"
      aria-label="Yukarı çık"
    >
      <i class="fas fa-arrow-up text-xl"></i>
    </button>
  </transition>
</template>

<script>
export default {
  name: 'BackToTop',
  data() {
    return {
      isVisible: false,
      scrollThreshold: 300
    }
  },
  mounted() {
    window.addEventListener('scroll', this.toggleVisibility)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.toggleVisibility)
  },
  methods: {
    toggleVisibility() {
      this.isVisible = window.pageYOffset > this.scrollThreshold
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 