<template>
  <div class="review-summary">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <!-- Genel Puan -->
        <div class="flex items-center space-x-4">
          <div class="text-center">
            <div class="text-5xl font-bold text-gray-900">
              {{ averageRating.toFixed(1) }}
            </div>
            <div class="mt-1 flex justify-center">
              <star-icon
                v-for="star in 5"
                :key="star"
                :class="[
                  'h-5 w-5',
                  star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                ]"
              />
            </div>
            <p class="mt-1 text-sm text-gray-500">
              {{ totalReviews }} değerlendirme
            </p>
          </div>

          <!-- Puan Dağılımı -->
          <div class="flex-1 space-y-2">
            <div
              v-for="rating in [5, 4, 3, 2, 1]"
              :key="rating"
              class="flex items-center"
            >
              <div class="w-12 text-sm text-gray-600">
                {{ rating }} yıldız
              </div>
              <div class="flex-1 mx-2">
                <div class="h-2 rounded-full bg-gray-200">
                  <div
                    class="h-2 rounded-full bg-yellow-400"
                    :style="{
                      width: `${(ratingCounts[rating] / totalReviews) * 100}%`
                    }"
                  />
                </div>
              </div>
              <div class="w-12 text-sm text-gray-600 text-right">
                {{ ratingCounts[rating] }}
              </div>
            </div>
          </div>
        </div>

        <!-- İstatistikler -->
        <div class="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ verifiedPurchaseCount }}
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Onaylı Alışveriş
            </p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ photoCount }}
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Fotoğraf
            </p>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">
              {{ recommendationRate }}%
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Tavsiye Ediyor
            </p>
          </div>
        </div>

        <!-- Değerlendirme Yaz -->
        <div v-if="canReview" class="mt-6 border-t border-gray-200 pt-6">
          <button
            @click="$emit('write-review')"
            class="btn-primary w-full"
          >
            Değerlendirme Yaz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { StarIcon } from '@heroicons/vue/solid'

export default {
  name: 'ReviewSummary',

  components: {
    StarIcon
  },

  props: {
    productId: {
      type: String,
      required: true
    }
  },

  emits: ['write-review'],

  setup(props) {
    const store = useStore()

    const reviews = computed(() => store.state.review.reviews)
    const user = computed(() => store.state.auth.user)

    const totalReviews = computed(() => reviews.value.length)

    const ratingCounts = computed(() => {
      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      reviews.value.forEach(review => {
        counts[review.rating]++
      })
      return counts
    })

    const averageRating = computed(() => {
      if (totalReviews.value === 0) return 0
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0)
      return sum / totalReviews.value
    })

    const verifiedPurchaseCount = computed(() => 
      reviews.value.filter(review => review.isVerifiedPurchase).length
    )

    const photoCount = computed(() => 
      reviews.value.reduce((acc, review) => acc + review.photos.length, 0)
    )

    const recommendationRate = computed(() => {
      if (totalReviews.value === 0) return 0
      const recommendCount = reviews.value.filter(review => review.rating >= 4).length
      return Math.round((recommendCount / totalReviews.value) * 100)
    })

    const canReview = computed(() => {
      if (!user.value) return false
      const hasReviewed = reviews.value.some(review => review.user.id === user.value.id)
      const hasPurchased = store.getters['order/hasUserPurchasedProduct'](props.productId)
      return !hasReviewed && hasPurchased
    })

    return {
      totalReviews,
      ratingCounts,
      averageRating,
      verifiedPurchaseCount,
      photoCount,
      recommendationRate,
      canReview
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-primary {
  @apply inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style> 