import { ref } from 'vue'

export function useToast() {
  const message = ref('')
  const type = ref('success')
  const isVisible = ref(false)

  const show = (msg, t = 'success') => {
    message.value = msg
    type.value = t
    isVisible.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 3000)
  }

  return {
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    warning: (msg) => show(msg, 'warning'),
    info: (msg) => show(msg, 'info')
  }
} 