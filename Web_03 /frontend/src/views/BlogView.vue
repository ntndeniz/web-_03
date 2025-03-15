<template>
  <div>
    <!-- Modern Blog Header with Sliding Background -->
    <div class="relative h-[600px] overflow-hidden">
      <!-- Kayan Arkaplan Görselleri -->
      <div class="absolute inset-0">
        <transition-group name="fade">
          <div
            v-for="(image, index) in backgroundImages"
            :key="image"
            v-show="currentImageIndex === index"
            class="absolute inset-0 transition-opacity duration-1000"
          >
            <div 
              class="absolute inset-0 bg-cover bg-center"
              :style="{ backgroundImage: `url(${image})` }"
            ></div>
            <div class="absolute inset-0 bg-blue-900/70 backdrop-blur-sm"></div>
          </div>
        </transition-group>
      </div>

      <!-- Header Content -->
      <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Bilgi & İlham
          </h1>
          <p class="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Teknoloji ve tasarım dünyasından en güncel içerikler
          </p>
        </div>
      </div>

      <!-- Dekoratif alt dalga -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
          <path d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
        </svg>
      </div>
    </div>

    <!-- Yeni Kategori Tasarımı -->
    <div class="bg-white py-8 shadow-md sticky top-0 z-20">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-center space-x-2 md:space-x-4 overflow-x-auto pb-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="selectedCategory = category.id"
            class="flex items-center px-6 py-3 rounded-lg transition-all duration-200 whitespace-nowrap"
            :class="selectedCategory === category.id 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            <i :class="getCategoryIcon(category.id)" class="mr-2"></i>
            {{ category.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Blog Posts Grid -->
    <div class="container mx-auto px-4 py-12">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>

      <div v-else-if="error" class="text-center text-red-600 py-8">
        {{ error }}
      </div>

      <div v-else-if="posts.length === 0" class="text-center py-8">
        <p class="text-gray-600">Henüz blog yazısı bulunmuyor.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="post in posts" 
          :key="post._id"
          class="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div class="relative">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-full h-56 object-cover"
              @error="handleImageError"
            >
            <div class="absolute top-4 left-4">
              <span class="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                {{ getCategoryName(post.category) }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center text-sm text-gray-500 mb-4">
              <i class="far fa-calendar mr-2"></i>
              {{ formatDate(post.date) }}
              <span class="mx-2">•</span>
              <i class="far fa-clock mr-2"></i>
              {{ post.readTime }} dk okuma
            </div>

            <h2 class="text-xl font-bold mb-4 line-clamp-2">
              {{ post.title }}
            </h2>

            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ post.excerpt }}
            </p>

            <router-link 
              :to="`/blog/${post.slug}`"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Devamını Oku
              <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
          </div>
        </article>
      </div>

      <!-- Debug bilgisi -->
      <div class="mt-8 p-4 bg-gray-100 rounded-lg">
        <p>Debug Bilgisi:</p>
        <p>Yükleniyor: {{ loading }}</p>
        <p>Hata: {{ error }}</p>
        <p>Post Sayısı: {{ posts.length }}</p>
      </div>

      <!-- Sayfalama -->
      <div v-if="totalPages > 1" class="mt-12">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import Pagination from '@/components/common/Pagination.vue'

export default {
  name: 'BlogView',
  components: { Pagination },

  setup() {
    const posts = ref([])
    const loading = ref(true)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const selectedCategory = ref(null)
    const error = ref(null)
    
    // Arkaplan görselleri
    const backgroundImages = [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1600',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600',
      'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1600'
    ]
    
    const currentImageIndex = ref(0)
    let imageInterval

    // Kategoriler ve ikonları
    const categories = ref([
      { id: null, name: 'Tümü', icon: 'fas fa-th-large' },
      { id: 1, name: 'Teknoloji', icon: 'fas fa-microchip' },
      { id: 2, name: 'Tasarım', icon: 'fas fa-palette' },
      { id: 3, name: 'Geliştirme', icon: 'fas fa-code' },
      { id: 4, name: 'Haberler', icon: 'fas fa-newspaper' }
    ])

    // Kategori ikonunu getir
    const getCategoryIcon = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.icon : 'fas fa-th-large'
    }

    // Arkaplan görsellerini değiştir
    const startImageSlider = () => {
      imageInterval = setInterval(() => {
        currentImageIndex.value = (currentImageIndex.value + 1) % backgroundImages.length
      }, 5000)
    }

    const fetchPosts = async () => {
      loading.value = true
      error.value = null
      
      try {
        console.log('API isteği yapılıyor:', `${process.env.VUE_APP_API_URL}/api/blog/posts`)
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/blog/posts`)
        console.log('API yanıtı:', response.data)
        
        if (response.data && response.data.posts) {
          posts.value = response.data.posts
        } else {
          throw new Error('API yanıtı geçersiz format')
        }
      } catch (err) {
        console.error('API Hatası:', err)
        error.value = `Blog yazıları yüklenirken bir hata oluştu: ${err.message}`
        posts.value = [] // Hata durumunda posts'u temizle
      } finally {
        loading.value = false
      }
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      fetchPosts()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c.id === categoryId)
      return category ? category.name : ''
    }

    const handleImageError = () => {
      console.error('Resim yüklenirken hata oluştu')
    }

    // API bağlantısını test et
    const testConnection = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/test`)
        console.log('API test başarılı:', response.data)
      } catch (err) {
        console.error('API test hatası:', err)
      }
    }

    onMounted(() => {
      testConnection()
      fetchPosts()
      startImageSlider()
    })

    onBeforeUnmount(() => {
      if (imageInterval) clearInterval(imageInterval)
    })

    return {
      posts,
      loading,
      categories,
      selectedCategory,
      currentPage,
      totalPages,
      backgroundImages,
      currentImageIndex,
      getCategoryIcon,
      handlePageChange,
      formatDate,
      getCategoryName,
      error,
      handleImageError
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
