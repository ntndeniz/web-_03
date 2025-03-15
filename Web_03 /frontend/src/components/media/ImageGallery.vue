<template>
  <div class="image-gallery">
    <div class="gallery-main">
      <img
        :src="currentImage.url"
        :alt="currentImage.alt"
        class="main-image"
        @click="openLightbox"
      />
      
      <button 
        v-if="images.length > 1"
        class="nav-button prev"
        @click="prevImage"
      >
        <span class="sr-only">Önceki</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        v-if="images.length > 1"
        class="nav-button next"
        @click="nextImage"
      >
        <span class="sr-only">Sonraki</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div v-if="images.length > 1" class="gallery-thumbs">
      <button
        v-for="(image, index) in images"
        :key="index"
        class="thumb-button"
        :class="{ 'is-active': index === currentIndex }"
        @click="setCurrentImage(index)"
      >
        <img :src="image.thumbnail || image.url" :alt="image.alt" class="thumb-image" />
      </button>
    </div>

    <div v-if="showLightbox" class="lightbox" @click.self="closeLightbox">
      <button class="close-button" @click="closeLightbox">
        <span class="sr-only">Kapat</span>
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img :src="currentImage.url" :alt="currentImage.alt" class="lightbox-image" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageGallery',

  props: {
    images: {
      type: Array,
      required: true,
      validator: value => value.every(image => 
        typeof image.url === 'string' && 
        typeof image.alt === 'string'
      )
    }
  },

  data() {
    return {
      currentIndex: 0,
      showLightbox: false
    }
  },

  computed: {
    currentImage() {
      return this.images[this.currentIndex]
    }
  },

  methods: {
    setCurrentImage(index) {
      this.currentIndex = index
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length
    },
    openLightbox() {
      this.showLightbox = true
      document.body.style.overflow = 'hidden'
    },
    closeLightbox() {
      this.showLightbox = false
      document.body.style.overflow = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.image-gallery {
  @apply space-y-4;
}

.gallery-main {
  @apply relative rounded-lg overflow-hidden;
}

.main-image {
  @apply w-full h-96 object-cover cursor-pointer;
}

.nav-button {
  @apply absolute top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white
         p-2 rounded-full hover:bg-opacity-75 focus:outline-none focus:bg-opacity-75;

  &.prev {
    @apply left-4;
  }

  &.next {
    @apply right-4;
  }
}

.gallery-thumbs {
  @apply flex space-x-2 overflow-x-auto py-2;
}

.thumb-button {
  @apply flex-shrink-0 focus:outline-none;

  &.is-active {
    @apply ring-2 ring-primary-500;
  }
}

.thumb-image {
  @apply w-20 h-20 object-cover rounded;
}

.lightbox {
  @apply fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50;
}

.close-button {
  @apply absolute top-4 right-4 text-white hover:text-gray-300 
         focus:outline-none focus:text-gray-300;
}

.lightbox-image {
  @apply max-w-full max-h-[90vh] object-contain;
}
</style> 