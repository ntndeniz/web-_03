<template>
  <div class="relative bg-primary-500 overflow-hidden">
    <div class="max-w-7xl mx-auto">
      <div class="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
        <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div class="sm:text-center lg:text-left">
            <h1 class="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span class="block">Teknoloji Dünyasına</span>
              <span class="block text-gold-400">Hoş Geldiniz</span>
            </h1>
            <p class="mt-3 text-base text-primary-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              En son teknoloji ürünleri ve aksesuarları uygun fiyatlarla sizlerle buluşuyor.
            </p>
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div class="rounded-md shadow">
                <router-link to="/products" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gold-400 hover:bg-gold-500 md:py-4 md:text-lg md:px-10">
                  Alışverişe Başla
                </router-link>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <router-link to="/about" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10">
                  Hakkımızda
                </router-link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'HeroSection',
  setup() {
    const slides = ref([
      {
        id: 1,
        title: 'Yeni Sezon Ürünleri',
        description: 'En yeni koleksiyonumuzu keşfedin. Sınırlı sayıda ürün!',
        image: '/images/hero/slide1.jpg',
        link: '/kategori/yeni-sezon',
        buttonText: 'Hemen İncele'
      },
      {
        id: 2,
        title: 'Büyük Yaz İndirimi',
        description: 'Seçili ürünlerde %50\'ye varan indirimler sizi bekliyor.',
        image: '/images/hero/slide2.jpg',
        link: '/kampanyalar/yaz-indirimi',
        buttonText: 'İndirimleri Gör'
      },
      {
        id: 3,
        title: 'Ücretsiz Kargo Fırsatı',
        description: '150 TL ve üzeri alışverişlerinizde kargo bedava!',
        image: '/images/hero/slide3.jpg',
        link: '/kampanyalar/ucretsiz-kargo',
        buttonText: 'Alışverişe Başla'
      }
    ])

    const currentSlide = ref(0)
    let autoplayInterval = null

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.value.length
    }

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
    }

    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000)
    }

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval)
      }
    }

    onMounted(() => {
      startAutoplay()
    })

    onUnmounted(() => {
      stopAutoplay()
    })

    return {
      slides,
      currentSlide,
      nextSlide,
      prevSlide
    }
  }
}
</script> 