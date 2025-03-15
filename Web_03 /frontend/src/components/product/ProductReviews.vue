<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Değerlendirmeler</h2>

    <!-- Değerlendirme Özeti -->
    <div class="bg-gray-50 p-6 rounded-lg mb-8">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center mb-2">
            <StarRating :rating="averageRating" />
            <span class="ml-2 text-lg font-semibold">{{ averageRating.toFixed(1) }}/5</span>
          </div>
          <p class="text-gray-600">{{ reviews.length }} değerlendirme</p>
        </div>
        
        <button 
          v-if="!showReviewForm"
          @click="showReviewForm = true"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Değerlendirme Yap
        </button>
      </div>

      <!-- Yıldız Dağılımı -->
      <div class="mt-6 space-y-2">
        <div v-for="i in 5" :key="i" class="flex items-center">
          <span class="w-12 text-sm">{{ 6-i }} yıldız</span>
          <div class="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-yellow-400"
              :style="{ width: `${getStarPercentage(6-i)}%` }"
            ></div>
          </div>
          <span class="w-12 text-sm text-right">{{ getStarCount(6-i) }}</span>
        </div>
      </div>
    </div>

    <!-- Değerlendirme Formu -->
    <div v-if="showReviewForm" class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 class="text-lg font-semibold mb-4">Değerlendirmenizi Yazın</h3>
      <form @submit.prevent="submitReview">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Puanınız</label>
          <div class="flex space-x-2">
            <button 
              v-for="i in 5" 
              :key="i"
              type="button"
              @click="newReview.rating = i"
              class="text-2xl focus:outline-none"
              :class="i <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </button>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
          <input 
            v-model="newReview.title"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            required
          >
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Yorumunuz</label>
          <textarea 
            v-model="newReview.comment"
            rows="4"
            class="w-full px-3 py-2 border rounded-md"
            required
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button 
            type="button"
            @click="showReviewForm = false"
            class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            İptal
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Gönder
          </button>
        </div>
      </form>
    </div>

    <!-- Değerlendirme Listesi -->
    <div class="space-y-6">
      <div v-for="review in reviews" :key="review.id" class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between mb-4">
          <div>
            <h4 class="font-semibold">{{ review.title }}</h4>
            <div class="flex items-center mt-1">
              <StarRating :rating="review.rating" :showRating="false" />
              <span class="ml-2 text-sm text-gray-600">{{ review.date }}</span>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium">{{ review.author }}</p>
            <p class="text-sm text-gray-600">Doğrulanmış Alıcı</p>
          </div>
        </div>
        <p class="text-gray-600">{{ review.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import StarRating from '@/components/common/StarRating.vue'

export default {
  name: 'ProductReviews',
  components: {
    StarRating
  },
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const reviews = ref([])
    const showReviewForm = ref(false)
    const newReview = ref({
      rating: 0,
      title: '',
      comment: ''
    })

    const averageRating = computed(() => {
      if (reviews.value.length === 0) return 0
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
      return sum / reviews.value.length
    })

    const getStarCount = (stars) => {
      return reviews.value.filter(review => review.rating === stars).length
    }

    const getStarPercentage = (stars) => {
      if (reviews.value.length === 0) return 0
      return (getStarCount(stars) / reviews.value.length) * 100
    }

    const submitReview = async () => {
      try {
        // API'ye yorum gönderme işlemi
        const review = {
          ...newReview.value,
          id: Date.now(),
          author: 'Kullanıcı',
          date: new Date().toLocaleDateString('tr-TR'),
          productId: props.productId
        }
        
        reviews.value.unshift(review)
        emit('add-review', review)
        
        showReviewForm.value = false
        newReview.value = { rating: 0, title: '', comment: '' }
      } catch (error) {
        console.error('Error submitting review:', error)
      }
    }

    return {
      reviews,
      showReviewForm,
      newReview,
      averageRating,
      getStarCount,
      getStarPercentage,
      submitReview
    }
  }
}
</script> 