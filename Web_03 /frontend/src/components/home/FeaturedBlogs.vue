<template>
  <section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-8">Blog</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="post in blogPosts" :key="post.id" class="bg-white rounded-lg shadow overflow-hidden">
          <img :src="post.image" :alt="post.title" class="w-full h-48 object-cover">
          <div class="p-6">
            <div class="text-primary-500 text-sm font-semibold">{{ post.category }}</div>
            <h3 class="mt-2 text-xl font-semibold">{{ post.title }}</h3>
            <p class="mt-2 text-gray-600">{{ post.excerpt }}</p>
            <div class="mt-4 flex items-center text-sm text-gray-500">
              <span>{{ post.date }}</span>
              <span class="mx-2">•</span>
              <span>{{ post.readTime }} dk okuma</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'FeaturedBlogs',
  
  setup() {
    const router = useRouter()

    const blogPosts = [
      {
        id: 1,
        title: 'Teknolojide Son Trendler',
        excerpt: '2024 yılında öne çıkan teknoloji trendleri ve gelecek öngörüleri',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
        category: 'Teknoloji',
        date: '15 Mart 2024',
        readTime: 5
      },
      {
        id: 2,
        title: 'Yapay Zeka ve İş Dünyası',
        excerpt: 'Yapay zekanın iş süreçlerine etkileri ve gelecekteki rolü',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        category: 'Yapay Zeka',
        date: '12 Mart 2024',
        readTime: 7
      },
      {
        id: 3,
        title: 'Siber Güvenlik İpuçları',
        excerpt: 'Dijital dünyada güvende kalmanın yolları ve önemli güvenlik önlemleri',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3',
        category: 'Güvenlik',
        date: '10 Mart 2024',
        readTime: 4
      }
    ]

    const navigateToBlog = (blogId) => {
      router.push(`/blog/${blogId}`)
    }

    return {
      blogPosts,
      navigateToBlog
    }
  }
}
</script> 