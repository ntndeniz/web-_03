export const showNotification = (message, type = 'info') => {
  console.log(`${type}: ${message}`) // type parametresini kullanıyoruz
}

export const showError = (error) => {
  showNotification(error.message, 'error')
} 