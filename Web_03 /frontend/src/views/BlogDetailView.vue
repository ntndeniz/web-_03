<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>

    <article v-else-if="post" class="max-w-4xl mx-auto">
      <!-- Blog Başlığı -->
      <header class="text-center mb-12">
        <div class="mb-4">
          <span class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
            {{ post.category.name }}
          </span>
        </div>
        <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
        
        <!-- Meta Bilgiler -->
        <div class="flex items-center justify-center text-gray-500 space-x-4">
          <div class="flex items-center">
            <i class="far fa-calendar mr-2"></i>
            {{ formatDate(post.date) }}
          </div>
          <div class="flex items-center">
            <i class="far fa-clock mr-2"></i>
            {{ post.readTime }} dk okuma
          </div>
          <div class="flex items-center">
            <i class="far fa-eye mr-2"></i>
            {{ post.views }} görüntülenme
          </div>
        </div>
      </header>

      <!-- Blog Görseli -->
      <div class="mb-12">
        <img 
          :src="post.image" 
          :alt="post.title"
          class="w-full h-96 object-cover rounded-lg shadow-lg"
        >
      </div>

      <!-- Blog İçeriği -->
      <div class="prose prose-lg max-w-none mb-12" v-html="post.content"></div>

      <!-- Yazar Bilgisi -->
      <div class="border-t border-b py-8 my-12">
        <div class="flex items-center">
          <img 
            :src="post.author.avatar" 
            :alt="post.author.name"
            class="w-16 h-16 rounded-full"
          >
          <div class="ml-4">
            <h3 class="font-bold text-lg">{{ post.author.name }}</h3>
            <p class="text-gray-600">{{ post.author.bio }}</p>
          </div>
        </div>
      </div>

      <!-- İlgili Yazılar -->
      <div v-if="relatedPosts.length" class="my-12">
        <h2 class="text-2xl font-bold mb-6">İlgili Yazılar</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="relatedPost in relatedPosts" 
            :key="relatedPost.id"
            class="bg-white rounded-lg shadow overflow-hidden"
          >
            <img 
              :src="relatedPost.image" 
              :alt="relatedPost.title"
              class="w-full h-48 object-cover"
            >
            <div class="p-4">
              <h3 class="font-bold mb-2">{{ relatedPost.title }}</h3>
              <router-link 
                :to="`/blog/${relatedPost.slug}`"
                class="text-blue-600 hover:text-blue-700"
              >
                Devamını Oku
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Yorumlar -->
      <div class="my-12">
        <h2 class="text-2xl font-bold mb-6">Yorumlar</h2>
        <div v-if="post.comments.length" class="space-y-6">
          <div 
            v-for="comment in post.comments" 
            :key="comment.id"
            class="bg-gray-50 p-6 rounded-lg"
          >
            <div class="flex items-center mb-4">
              <img 
                :src="comment.user.avatar" 
                :alt="comment.user.name"
                class="w-10 h-10 rounded-full"
              >
              <div class="ml-4">
                <h4 class="font-bold">{{ comment.user.name }}</h4>
                <span class="text-sm text-gray-500">
                  {{ formatDate(comment.date) }}
                </span>
              </div>
            </div>
            <p>{{ comment.content }}</p>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">
          Henüz yorum yapılmamış. İlk yorumu siz yapın!
        </div>

        <!-- Yorum Formu -->
        <form @submit.prevent="submitComment" class="mt-8">
          <textarea 
            v-model="newComment"
            rows="4"
            class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Yorumunuzu yazın..."
          ></textarea>
          <button 
            type="submit"
            class="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Yorum Yap
          </button>
        </form>
      </div>
    </article>

    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold text-gray-600">Blog yazısı bulunamadı</h2>
      <router-link 
        to="/blog"
        class="mt-4 inline-block text-blue-600 hover:text-blue-700"
      >
        Blog sayfasına dön
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'BlogDetailView',

  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const post = ref(null)
    const loading = ref(true)
    const newComment = ref('')
    const relatedPosts = ref([])

    // Blog yazısını getir
    const fetchPost = async () => {
      loading.value = true
      try {
        const data = await store.dispatch('blog/fetchPost', route.params.slug)
        post.value = data
        fetchRelatedPosts()
      } catch (error) {
        router.push('/blog')
      } finally {
        loading.value = false
      }
    }

    // İlgili yazıları getir
    const fetchRelatedPosts = async () => {
      try {
        const response = await store.dispatch('blog/fetchPosts', {
          category: post.value.category.id,
          exclude: post.value.id
        })
        relatedPosts.value = response.posts.slice(0, 3)
      } catch (error) {
        console.error('İlgili yazılar yüklenemedi:', error)
      }
    }

    // Yorum gönder
    const submitComment = async () => {
      if (!newComment.value.trim()) return

      try {
        await store.dispatch('blog/addComment', {
          postId: post.value.id,
          content: newComment.value
        })
        newComment.value = ''
        await fetchPost() // Yorumları yenile
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Yorumunuz başarıyla eklendi'
        })
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Yorum eklenirken bir hata oluştu'
        })
      }
    }

    // Tarih formatla
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    onMounted(() => {
      fetchPost()
    })

    return {
      post,
      loading,
      newComment,
      relatedPosts,
      submitComment,
      formatDate
    }
  }
}
</script>