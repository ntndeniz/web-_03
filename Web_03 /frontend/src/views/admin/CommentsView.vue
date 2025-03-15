<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Yorumlar</h2>
      </div>

      <!-- Filtreleme -->
      <div class="mb-6">
        <select 
          v-model="filterStatus"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tüm Yorumlar</option>
          <option value="pending">Onay Bekleyenler</option>
          <option value="approved">Onaylananlar</option>
          <option value="rejected">Reddedilenler</option>
        </select>
      </div>

      <!-- Yorumlar Listesi -->
      <div class="space-y-4">
        <div 
          v-for="comment in filteredComments" 
          :key="comment._id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-medium">{{ comment.author.name }}</h3>
              <p class="text-sm text-gray-500">
                {{ formatDate(comment.createdAt) }} - 
                {{ comment.post.title }}
              </p>
            </div>
            <div class="flex gap-2">
              <button 
                v-if="comment.status === 'pending'"
                @click="approveComment(comment._id)"
                class="text-green-600 hover:text-green-700"
              >
                Onayla
              </button>
              <button 
                v-if="comment.status === 'pending'"
                @click="rejectComment(comment._id)"
                class="text-red-600 hover:text-red-700"
              >
                Reddet
              </button>
              <button 
                @click="deleteComment(comment._id)"
                class="text-gray-600 hover:text-gray-700"
              >
                Sil
              </button>
            </div>
          </div>
          <p class="text-gray-700">{{ comment.content }}</p>
        </div>
      </div>

      <!-- Sayfalama -->
      <div class="mt-6 flex justify-center">
        <nav class="flex gap-2">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'px-3 py-1 rounded',
              currentPage === page 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

export default {
  name: 'CommentsView',
  setup() {
    const comments = ref([])
    const filterStatus = ref('all')
    const currentPage = ref(1)
    const totalPages = ref(1)

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/admin/comments`, {
          params: {
            page: currentPage.value,
            status: filterStatus.value
          }
        })
        comments.value = response.data.comments
        totalPages.value = response.data.totalPages
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error)
      }
    }

    const filteredComments = computed(() => {
      if (filterStatus.value === 'all') return comments.value
      return comments.value.filter(comment => comment.status === filterStatus.value)
    })

    const approveComment = async (commentId) => {
      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/admin/comments/${commentId}/approve`)
        await fetchComments()
      } catch (error) {
        console.error('Yorum onaylanırken hata:', error)
      }
    }

    const rejectComment = async (commentId) => {
      try {
        await axios.put(`${process.env.VUE_APP_API_URL}/api/admin/comments/${commentId}/reject`)
        await fetchComments()
      } catch (error) {
        console.error('Yorum reddedilirken hata:', error)
      }
    }

    const deleteComment = async (commentId) => {
      if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
        try {
          await axios.delete(`${process.env.VUE_APP_API_URL}/api/admin/comments/${commentId}`)
          await fetchComments()
        } catch (error) {
          console.error('Yorum silinirken hata:', error)
        }
      }
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR')
    }

    watch([filterStatus, currentPage], () => {
      fetchComments()
    })

    onMounted(() => {
      fetchComments()
    })

    return {
      comments,
      filterStatus,
      currentPage,
      totalPages,
      filteredComments,
      approveComment,
      rejectComment,
      deleteComment,
      formatDate
    }
  }
}
</script> 