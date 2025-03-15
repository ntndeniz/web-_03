<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="bg-gray-900 rounded-xl mb-8 relative overflow-hidden">
      <div class="relative py-16 px-8">
        <h1 class="text-4xl font-bold text-white mb-4">Blog</h1>
        <p class="text-gray-300 text-lg max-w-2xl">
          En son haberler, trend konular ve uzman görüşleri
        </p>
      </div>
    </div>

    <!-- Blog Categories -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button 
        v-for="category in blogCategories" 
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="[
          'px-4 py-2 rounded-full transition-colors',
          selectedCategory === category.id 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Blog Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article 
        v-for="post in filteredPosts" 
        :key="post.id"
        class="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
      >
        <router-link :to="`/blog/${post.id}`">
          <div class="relative">
            <img 
              :src="post.image" 
              :alt="post.title"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute top-4 left-4">
              <span class="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">
                {{ post.category }}
              </span>
            </div>
          </div>
          <div class="p-6">
            <h2 class="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
              {{ post.title }}
            </h2>
            <p class="text-gray-600 mb-4 line-clamp-2">
              {{ post.excerpt }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img 
                  :src="post.author.avatar" 
                  :alt="post.author.name"
                  class="w-10 h-10 rounded-full"
                >
                <div class="ml-3">
                  <p class="text-sm font-medium">{{ post.author.name }}</p>
                  <p class="text-sm text-gray-500">{{ post.date }}</p>
                </div>
              </div>
              <div class="flex items-center text-gray-500 text-sm">
                <span class="mr-3">
                  <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ post.views }}
                </span>
                <span>
                  <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {{ post.comments }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
      </article>
    </div>

    <!-- Pagination -->
    <div class="mt-12">
      <BasePagination
        :total="totalPages"
        v-model:current="currentPage"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import BasePagination from '@/components/common/BasePagination.vue'

export default {
  name: 'BlogList',
  components: {
    BasePagination
  },
  setup() {
    const selectedCategory = ref(null)
    const currentPage = ref(1)
    const itemsPerPage = 9

    const blogCategories = [
      { id: null, name: 'Tümü' },
      { id: 1, name: 'Teknoloji' },
      { id: 2, name: 'Yaşam' },
      { id: 3, name: 'Sağlık' },
      { id: 4, name: 'Spor' },
      { id: 5, name: 'Seyahat' }
    ]

    const posts = [
      {
        id: 1,
        title: 'Yapay Zeka ve Gelecek',
        excerpt: 'Yapay zeka teknolojilerinin günlük hayatımıza etkileri ve gelecekte bizi bekleyen değişimler...',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        category: 'Teknoloji',
        author: {
          name: 'Ahmet Yılmaz',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        date: '12 Mart 2024',
        views: '1.2K',
        comments: 24
      },
      // Daha fazla blog yazısı eklenebilir
    ]

    const filteredPosts = computed(() => {
      let result = [...posts]
      if (selectedCategory.value) {
        result = result.filter(post => post.category === selectedCategory.value)
      }
      return result
    })

    const totalPages = computed(() => 
      Math.ceil(filteredPosts.value.length / itemsPerPage)
    )

    return {
      selectedCategory,
      currentPage,
      blogCategories,
      filteredPosts,
      totalPages
    }
  }
}
</script> 