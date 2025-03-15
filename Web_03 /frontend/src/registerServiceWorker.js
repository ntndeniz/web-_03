import { register } from 'register-service-worker'

export function registerServiceWorker() {
  if (process.env.NODE_ENV === 'production') {
    register(`${process.env.BASE_URL}service-worker.js`, {
      ready() {
        console.log('Uygulama service worker\'dan sunuluyor.')
      },
      
      registered(registration) {
        console.log('Service worker başarıyla kaydedildi.')
        
        // Her 1 saatte bir güncelleme kontrolü yap
        setInterval(() => {
          registration.update()
        }, 1000 * 60 * 60)
      },
      
      cached() {
        console.log('İçerik önbelleğe alındı.')
      },
      
      updatefound() {
        console.log('Yeni içerik indiriliyor.')
      },
      
      updated(registration) {
        console.log('Yeni içerik mevcut. Lütfen sayfayı yenileyin.')
        document.dispatchEvent(
          new CustomEvent('swUpdated', { detail: registration })
        )
      },
      
      offline() {
        console.log('İnternet bağlantısı bulunamadı. Uygulama çevrimdışı modda.')
      },
      
      error(error) {
        console.error('Service worker kayıt hatası:', error)
      }
    })
  }
} 