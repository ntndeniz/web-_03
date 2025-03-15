<template>
  <div class="container mx-auto px-4 py-8">
    <article v-if="post" class="max-w-4xl mx-auto">
      <!-- Hero Image -->
      <div class="relative rounded-xl overflow-hidden mb-8">
        <img 
          :src="post.image" 
          :alt="post.title"
          class="w-full h-96 object-cover"
        >
        <div class="absolute top-4 left-4">
          <span class="bg-primary-500 text-white px-4 py-2 rounded-full">
            {{ post.category }}
          </span>
        </div>
      </div>

      <!-- Article Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
        
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img 
              :src="post.author.avatar" 
              :alt="post.author.name"
              class="w-12 h-12 rounded-full"
            >
            <div class="ml-4">
              <p class="font-medium">{{ post.author.name }}</p>
              <p class="text-gray-500">{{ post.date }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4 text-gray-500">
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ post.views }} görüntülenme
            </span>
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {{ post.comments }} yorum
            </span>
          </div>
        </div>
      </div>

      <!-- Article Content -->
      <div class="prose prose-lg max-w-none mb-12">
        <p>{{ post.content }}</p>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-12">
        <span 
          v-for="tag in post.tags" 
          :key="tag"
          class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Share Buttons -->
      <div class="flex items-center space-x-4 mb-12">
        <span class="text-gray-700">Paylaş:</span>
        <button class="text-primary-500 hover:text-primary-600">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
        <button class="text-primary-400 hover:text-primary-500">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
        <button class="text-primary-600 hover:text-primary-700">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>
      </div>

      <!-- Author Bio -->
      <div class="bg-gray-100 rounded-xl p-8 mb-12">
        <div class="flex items-center mb-4">
          <img 
            :src="post.author.avatar" 
            :alt="post.author.name"
            class="w-16 h-16 rounded-full"
          >
          <div class="ml-4">
            <h3 class="text-xl font-bold">{{ post.author.name }}</h3>
            <p class="text-gray-600">{{ post.author.bio }}</p>
          </div>
        </div>
        <p class="text-gray-700">
          {{ post.author.description }}
        </p>
      </div>

      <!-- Comments Section -->
      <div class="border-t pt-12">
        <h2 class="text-2xl font-bold mb-8">Yorumlar ({{ post.comments }})</h2>
        <!-- Comment Form -->
        <form @submit.prevent="submitComment" class="mb-8">
          <textarea 
            v-model="newComment"
            rows="4"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Yorumunuzu yazın..."
          ></textarea>
          <button 
            type="submit"
            class="mt-4 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Yorum Yap
          </button>
        </form>

        <!-- Comments List -->
        <div class="space-y-8">
          <div 
            v-for="comment in post.commentsList" 
            :key="comment.id"
            class="flex space-x-4"
          >
            <img 
              :src="comment.avatar" 
              :alt="comment.name"
              class="w-12 h-12 rounded-full"
            >
            <div>
              <div class="flex items-center mb-1">
                <h4 class="font-medium mr-2">{{ comment.name }}</h4>
                <span class="text-gray-500 text-sm">{{ comment.date }}</span>
              </div>
              <p class="text-gray-700">{{ comment.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'BlogDetail',
  setup() {
    const route = useRoute()
    const post = ref(null)
    const newComment = ref('')

    onMounted(() => {
      // API'den blog detayı çekilecek
      // Şimdilik örnek veri kullanıyoruz
      post.value = {
        id: route.params.id,
        title: 'Yapay Zeka ve Gelecek',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        category: 'Teknoloji',
        author: {
          name: 'Ahmet Yılmaz',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          bio: 'Teknoloji Yazarı',
          description: 'Yapay zeka ve teknoloji alanında 10 yıllık deneyime sahip yazar ve danışman.'
        },
        date: '12 Mart 2024',
        views: '1.2K',
        comments: 24,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        tags: ['YapayZeka', 'Teknoloji', 'Gelecek', 'İnovasyon'],
        commentsList: [
          {
            id: 1,
            name: 'Mehmet Demir',
            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
            date: '13 Mart 2024',
            text: 'Harika bir yazı olmuş, teşekkürler.'
          }
        ]
      }
    })

    const submitComment = () => {
      if (!newComment.value.trim()) return

      // Yorum API'ye gönderilecek
      console.log('Yeni yorum:', newComment.value)
      newComment.value = ''
    }

    return {
      post,
      newComment,
      submitComment
    }
  }
}
</script> 