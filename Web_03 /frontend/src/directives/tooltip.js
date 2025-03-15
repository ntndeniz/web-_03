export default {
  beforeMount(el, binding) {
    // Tooltip elementi oluştur
    const tooltip = document.createElement('div')
    tooltip.className = 'tooltip hidden'
    tooltip.textContent = binding.value

    // Pozisyon ayarları
    const position = binding.modifiers.top ? 'top' :
                    binding.modifiers.right ? 'right' :
                    binding.modifiers.bottom ? 'bottom' : 'left'

    tooltip.classList.add(`tooltip-${position}`)

    // Tooltip'i body'e ekle
    document.body.appendChild(tooltip)

    // Mouse olayları
    el.addEventListener('mouseenter', () => {
      const rect = el.getBoundingClientRect()
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Pozisyona göre tooltip konumu
      switch (position) {
        case 'top':
          tooltip.style.top = rect.top + scrollTop - tooltip.offsetHeight - 5 + 'px'
          tooltip.style.left = rect.left + scrollLeft + (rect.width - tooltip.offsetWidth) / 2 + 'px'
          break
        case 'right':
          tooltip.style.top = rect.top + scrollTop + (rect.height - tooltip.offsetHeight) / 2 + 'px'
          tooltip.style.left = rect.right + scrollLeft + 5 + 'px'
          break
        case 'bottom':
          tooltip.style.top = rect.bottom + scrollTop + 5 + 'px'
          tooltip.style.left = rect.left + scrollLeft + (rect.width - tooltip.offsetWidth) / 2 + 'px'
          break
        case 'left':
          tooltip.style.top = rect.top + scrollTop + (rect.height - tooltip.offsetHeight) / 2 + 'px'
          tooltip.style.left = rect.left + scrollLeft - tooltip.offsetWidth - 5 + 'px'
          break
      }

      tooltip.classList.remove('hidden')
    })

    el.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden')
    })

    // Element kaldırıldığında tooltip'i de kaldır
    el._tooltip = tooltip
  },
  updated(el, binding) {
    el._tooltip.textContent = binding.value
  },
  unmounted(el) {
    el._tooltip.remove()
  }
}

// Kullanım örnekleri:
// <button v-tooltip="'İpucu metni'">Düğme</button>
// <div v-tooltip.top="'Üstte göster'">Element</div> 