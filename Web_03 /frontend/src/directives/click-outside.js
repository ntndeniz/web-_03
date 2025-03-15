export default {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      // Tıklanan element veya alt elementlerinden biri değilse
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Kullanım örneği:
// <div v-click-outside="handleClickOutside">...</div> 