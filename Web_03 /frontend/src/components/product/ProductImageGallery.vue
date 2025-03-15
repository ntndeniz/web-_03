<template>
  <div class="relative">
    <!-- Ana Görsel -->
    <div class="relative pb-[100%] rounded-lg overflow-hidden mb-4">
      <img 
        :src="currentImage.url" 
        :alt="currentImage.alt"
        class="absolute top-0 left-0 w-full h-full object-contain"
      />
    </div>

    <!-- Küçük Görseller -->
    <div class="grid grid-cols-5 gap-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="selectImage(index)"
        class="relative pb-[100%] rounded-lg overflow-hidden border-2"
        :class="{ 'border-blue-500': currentIndex === index, 'border-transparent': currentIndex !== index }"
      >
        <img 
          :src="image.url" 
          :alt="image.alt"
          class="absolute top-0 left-0 w-full h-full object-cover"
        />
      </button>
    </div>

    <!-- Zoom Modal -->
    <div v-if="showZoom" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <button @click="showZoom = false" class="absolute top-4 right-4 text-white">
        <span class="material-icons text-3xl">close</span>
      </button>
      
      <img 
        :src="currentImage.url" 
        :alt="currentImage.alt"
        class="max-w-full max-h-[90vh] object-contain"
      />
      
      <button 
        @click="previousImage" 
        class="absolute left-4 text-white"
        :disabled="currentIndex === 0"
      >
        <span class="material-icons text-4xl">chevron_left</span>
      </button>
      
      <button 
        @click="nextImage" 
        class="absolute right-4 text-white"
        :disabled="currentIndex === images.length - 1"
      >
        <span class="material-icons text-4xl">chevron_right</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductImageGallery',
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentIndex: 0,
      showZoom: false
    }
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex]
    }
  },
  methods: {
    selectImage(index) {
      this.currentIndex = index
    },
    previousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    nextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++
      }
    }
  }
}
</script> 