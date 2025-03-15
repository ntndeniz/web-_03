export default {
  beforeMount(el, binding) {
    function loadImage() {
      const imageElement = el.tagName === 'IMG' ? el : el.querySelector('img')
      
      if (imageElement) {
        // Orijinal resim URL'sini data-src'den al
        const imageUrl = binding.value || el.getAttribute('data-src')
        
        if (imageUrl) {
          // Yeni bir Image objesi oluştur
          const img = new Image()
          
          img.onload = () => {
            if (imageElement.tagName === 'IMG') {
              imageElement.src = imageUrl
            } else {
              imageElement.style.backgroundImage = `url('${imageUrl}')`
            }
            el.classList.add('loaded')
            el.classList.remove('loading')
          }

          img.onerror = () => {
            // Hata durumunda placeholder göster
            const fallback = el.getAttribute('data-fallback') || '/images/placeholder.png'
            if (imageElement.tagName === 'IMG') {
              imageElement.src = fallback
            } else {
              imageElement.style.backgroundImage = `url('${fallback}')`
            }
            el.classList.add('error')
            el.classList.remove('loading')
          }

          // Yüklemeye başla
          el.classList.add('loading')
          img.src = imageUrl
        }
      }
    }

    function handleIntersect(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          observer.unobserve(el)
        }
      })
    }

    // IntersectionObserver ile görünür olduğunda yükle
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '50px',
      threshold: 0
    })

    observer.observe(el)
  }
}

// Kullanım örnekleri:
// <img v-lazy-load="imageUrl" data-fallback="/fallback.jpg">
// <div v-lazy-load="imageUrl" class="bg-cover"> 