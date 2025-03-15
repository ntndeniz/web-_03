<template>
  <div class="relative">
    <!-- Carousel Container -->
    <div class="overflow-hidden rounded-lg">
      <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="(slide, index) in slides" :key="index" class="w-full flex-shrink-0">
          <img :src="slide.image" :alt="slide.title" class="w-full h-[400px] object-cover">
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h2 class="text-white text-2xl font-bold">{{ slide.title }}</h2>
            <p class="text-white/90">{{ slide.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button 
      @click="prevSlide" 
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
    >
      <span class="sr-only">Önceki</span>
      <i class="fas fa-chevron-left"></i>
    </button>
    <button 
      @click="nextSlide" 
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
    >
      <span class="sr-only">Sonraki</span>
      <i class="fas fa-chevron-right"></i>
    </button>

    <!-- Indicators -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        @click="goToSlide(index)"
        class="w-2 h-2 rounded-full"
        :class="currentSlide === index ? 'bg-white' : 'bg-white/50'"
      >
        <span class="sr-only">Slayt {{ index + 1 }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCarousel',
  data() {
    return {
      currentSlide: 0,
      slides: [
        {
          image: '/images/carousel/slide1.jpg',
          title: 'Yeni Sezon Ürünleri',
          description: 'En yeni ürünlerimizi keşfedin'
        },
        {
          image: '/images/carousel/slide2.jpg',
          title: 'Büyük İndirim',
          description: '%50\'ye varan indirimler'
        },
        {
          image: '/images/carousel/slide3.jpg',
          title: 'Özel Koleksiyon',
          description: 'Sınırlı sayıda üretilen özel parçalar'
        }
      ]
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length
    },
    prevSlide() {
      this.currentSlide = this.currentSlide === 0 
        ? this.slides.length - 1 
        : this.currentSlide - 1
    },
    goToSlide(index) {
      this.currentSlide = index
    }
  },
  mounted() {
    // Otomatik geçiş için interval
    setInterval(this.nextSlide, 5000)
  }
}
</script> 