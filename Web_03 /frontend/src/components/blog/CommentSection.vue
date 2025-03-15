<template>
  <div class="comment-section space-y-6">
    <!-- Yorum Başlığı -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Yorumlar ({{ comments.length }})</h2>
      <button 
        @click="showCommentForm = true"
        class="btn-primary"
      >
        Yorum Yaz
      </button>
    </div>

    <!-- Yorum Formu -->
    <form 
      v-if="showCommentForm" 
      @submit.prevent="handleSubmit"
      class="bg-gray-50 p-4 rounded-lg"
    >
      <div class="space-y-4">
        <div>
          <label class="block mb-1">Yorumunuz</label>
          <textarea
            v-model="newComment.content"
            rows="4"
            class="form-input w-full"
            placeholder="Yorumunuzu yazın..."
          ></textarea>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            type="submit"
            class="btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Gönderiliyor...' : 'Gönder' }}
          </button>
          <button 
            type="button"
            class="btn-secondary"
            @click="showCommentForm = false"
          >
            İptal
          </button>
        </div>
      </div>
    </form>

    <!-- Yorumlar Listesi -->
    <div class="space-y-4">
      <div 
        v-for="comment in comments" 
        :key="comment.id"
        class="bg-white p-4 rounded-lg shadow-sm"
      >
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-3">
            <img 
              :src="comment.user.avatar" 
              :alt="comment.user.name"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <h3 class="font-medium">{{ comment.user.name }}</h3>
              <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
            </div>
          </div>
          <div class="flex items-center space-x-2" v-if="isCommentOwner(comment)">
            <button 
              @click="editComment(comment)"
              class="text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deleteComment(comment.id)"
              class="text-gray-500 hover:text-red-600"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p class="mt-2 text-gray-700">{{ comment.content }}</p>
      </div>
    </div>

    <!-- Yükleniyor -->
    <div v-if="loading" class="flex justify-center">
      <LoadingSpinner />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'CommentSection',

  components: {
    LoadingSpinner
  },

  props: {
    postId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const toast = useToast()
    
    const loading = ref(false)
    const showCommentForm = ref(false)
    const newComment = ref({
      content: ''
    })

    const comments = computed(() => store.getters['blog/getCommentsByPostId'](props.postId))
    const currentUser = computed(() => store.getters['auth/currentUser'])

    const handleSubmit = async () => {
      try {
        loading.value = true
        await store.dispatch('blog/addComment', {
          postId: props.postId,
          content: newComment.value.content
        })
        newComment.value.content = ''
        showCommentForm.value = false
        toast.success('Yorumunuz başarıyla eklendi')
      } catch (error) {
        toast.error('Yorum eklenirken bir hata oluştu')
      } finally {
        loading.value = false
      }
    }

    const editComment = (comment) => {
      // TODO: Edit işlemi için modal açılacak
    }

    const deleteComment = async (commentId) => {
      try {
        loading.value = true
        await store.dispatch('blog/deleteComment', {
          postId: props.postId,
          commentId
        })
        toast.success('Yorum başarıyla silindi')
      } catch (error) {
        toast.error('Yorum silinirken bir hata oluştu')
      } finally {
        loading.value = false
      }
    }

    const isCommentOwner = (comment) => {
      return comment.userId === currentUser.value?.id
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR')
    }

    return {
      loading,
      comments,
      showCommentForm,
      newComment,
      handleSubmit,
      editComment,
      deleteComment,
      isCommentOwner,
      formatDate
    }
  }
}
</script>

<style scoped>
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 
         transition-colors disabled:opacity-50;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 
         transition-colors;
}

.form-input {
  @apply border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-primary-500 
         focus:border-transparent outline-none;
}
</style> 