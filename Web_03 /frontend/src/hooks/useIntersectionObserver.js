import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(options = {}) {
  const isIntersecting = ref(false)
  const target = ref(null)
  let observer = null

  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  }

  const observe = (element) => {
    if (!element) return
    target.value = element
    
    observer = new IntersectionObserver(([entry]) => {
      isIntersecting.value = entry.isIntersecting
    }, defaultOptions)

    observer.observe(element)
  }

  onMounted(() => {
    if (target.value) {
      observe(target.value)
    }
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    isIntersecting,
    observe
  }
} 