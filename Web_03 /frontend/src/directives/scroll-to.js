export default {
  beforeMount(el, binding) {
    el.scrollToEvent = () => {
      const options = {
        behavior: binding.modifiers.smooth ? 'smooth' : 'auto',
        block: binding.modifiers.start ? 'start' : binding.modifiers.end ? 'end' : 'center'
      }

      let target

      // Hedef bir seçici ise
      if (typeof binding.value === 'string') {
        target = document.querySelector(binding.value)
      }
      // Hedef bir sayı ise (piksel)
      else if (typeof binding.value === 'number') {
        window.scrollTo({
          top: binding.value,
          ...options
        })
        return
      }
      // Hedef bir element ise
      else if (binding.value instanceof HTMLElement) {
        target = binding.value
      }

      if (target) {
        target.scrollIntoView(options)
      }
    }

    el.addEventListener('click', el.scrollToEvent)
  },
  unmounted(el) {
    el.removeEventListener('click', el.scrollToEvent)
  }
}

// Kullanım örnekleri:
// <button v-scroll-to="'#target'">Hedefe Git</button>
// <button v-scroll-to.smooth="'#target'">Yumuşak Kaydırma</button>
// <button v-scroll-to.start="'#target'">Üste Hizala</button> 