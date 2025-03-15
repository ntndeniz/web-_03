<template>
    <div class="review-gallery">
      <!-- Galeri Başlığı -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-900">Müşteri Fotoğrafları</h3>
        <p class="mt-1 text-sm text-gray-500">{{ images.length }} fotoğraf</p>
      </div>
  
      <!-- Fotoğraf Galerisi -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div v-for="(image, index) in images" :key="index" class="gallery-item">
          <img 
            :src="image.url" 
            :alt="image.caption"
            class="image"
            @click="openLightbox(index)"
          />
        </div>
      </div>
  
      <!-- Lightbox -->
      <Modal v-if="selectedImage !== null" @close="closeLightbox">
        <div class="lightbox">
          <img :src="images[selectedImage].url" :alt="images[selectedImage].caption" />
          <p class="caption">{{ images[selectedImage].caption }}</p>
        </div>
      </Modal>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import Modal from '@/components/common/Modal.vue'
  
  export default {
    name: 'ReviewGallery',
    
    components: {
      Modal
    },
  
    props: {
      images: {
        type: Array,
        required: true,
        default: () => []
      }
    },
  
    setup() {
      const selectedImage = ref(null)
  
      const openLightbox = (index) => {
        selectedImage.value = index
      }
  
      const closeLightbox = () => {
        selectedImage.value = null
      }
  
      return {
        selectedImage,
        openLightbox,
        closeLightbox
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .gallery-item {
    @apply relative aspect-square overflow-hidden rounded-lg cursor-pointer;
  
    &:hover .image {
      @apply transform scale-110;
    }
  }
  
  .image {
    @apply w-full h-full object-cover transition duration-300;
  }
  
  .lightbox {
    @apply max-w-4xl mx-auto;
  
    img {
      @apply w-full h-auto rounded-lg;
    }
  
    .caption {
      @apply mt-4 text-center text-gray-600;
    }
  }
  </style>