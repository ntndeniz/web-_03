<template>
  <div class="review-list">
    <!-- Filtreler -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Puan Filtresi -->
        <select
          v-model="filters.rating"
          class="select-field"
        >
          <option value="">Tüm Puanlar</option>
          <option v-for="rating in 5" :key="rating" :value="rating">
            {{ rating }} Yıldız
          </option>
        </select>

        <!-- Sıralama -->
        <select
          v-model="filters.sort"
          class="select-field"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="highest">En Yüksek Puan</option>
          <option value="lowest">En Düşük Puan</option>
        </select>
      </div>

      <!-- Sadece Fotoğraflılar -->
      <label class="flex items-center space-x-2">
        <input
          v-model="filters.hasPhotos"
          type="checkbox"
          class="checkbox"
        />
        <span class="text-sm text-gray-700">Sadece Fotoğraflı Değerlendirmeler</span>
      </label>
    </div>

    <!-- Değerlendirme Listesi -->
    <div class="space-y-6">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="bg-white shadow sm:rounded-lg overflow-hidden"
      >
        <div class="px-4 py-5 sm:p-6">
          <!-- Başlık ve Puan -->
          <div class="flex items-start justify-between">
            <div>
              <h4 class="text-lg font-medium text-gray-900">
                {{ review.title }}
              </h4>
              <div class="mt-1 flex items-center">
                <div class="flex">
                  <star-icon
                    v-for="star in 5"
                    :key="star"
                    :class="[
                      'h-5 w-5',
                      star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                    ]"
                  />
                </div>
                <span class="ml-2 text-sm text-gray-500">
                  {{ formatDate(review.createdAt) }}
                </span>
              </div>
            </div>
            <user-badge
              :verified="review.isVerifiedPurchase"
              :name="review.user.name"
            />
          </div>

          <!-- Yorum -->
          <p class="mt-4 text-gray-700">
            {{ review.comment }}
          </p>

          <!-- Fotoğraflar -->
          <div v-if="review.photos.length" class="mt-4">
            <div class="flex space-x-2 overflow-x-auto">
              <button
                v-for="(photo, index) in review.photos"
                :key="index"
                @click="openGallery(review.photos, index)"
                class="flex-shrink-0"
              >
                <img
                  :src="photo.thumbnail"
                  :alt="`Değerlendirme fotoğrafı ${index + 1}`"
                  class="h-20 w-20 object-cover rounded-lg"
                />
              </button>
            </div>
          </div>

          <!-- Faydalı Bulma -->
          <div class="mt-4 flex items-center space-x-4">
            <button
              @click="handleHelpful(review)"
              :class="[
                'text-sm flex items-center space-x-1',
                review.isHelpful ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <thumb-up-icon class="h-4 w-4" />
              <span>Faydalı ({{ review.helpfulCount }})</span>
            </button>
            <button
              v-if="canReport(review)"
              @click="reportReview(review)"
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              <flag-icon class="h-4 w-4" />
              <span>Bildir</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Yükleniyor -->
    <div
      v-if="loading"
      class="flex justify-center py-8"
    >
      <spinner class="h-8 w-8 text-primary-600" />
    </div>

    <!-- Daha Fazla Yükle -->
    <div
      v-if="hasMore && !loading"
      class="flex justify-center mt-6"
    >
      <button
        @click="loadMore"
        class="btn-secondary"
      >
        Daha Fazla Göster
      </button>
    </div>

    <!-- Fotoğraf Galerisi Modal -->
    <photo-gallery
      v-if="showGallery"
      :photos="galleryPhotos"
      :initial-index="galleryIndex"
      @close="closeGallery"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/utils/formatters'
import {
  StarIcon,
  ThumbUpIcon,
  FlagIcon
} from '@heroicons/vue/solid'
import UserBadge from './UserBadge.vue'
import PhotoGallery from './PhotoGallery.vue'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'ReviewList',

  components: {
    StarIcon,
    ThumbUpIcon,
    FlagIcon,
    UserBadge,
    PhotoGallery,
    Spinner
  },

  props: {
    productId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const toast = useToast()

    const loading = ref(false)
    const page = ref(1)
    const hasMore = ref(true)
    const showGallery = ref(false)
    const galleryPhotos = ref([])
    const galleryIndex = ref(0)

    const filters = reactive({
      rating: '',
      sort: 'newest',
      hasPhotos: false
    })

    const reviews = computed(() => store.state.review.reviews)

    const filteredReviews = computed(() => {
      let result = [...reviews.value]

      if (filters.rating) {
        result = result.filter(review => review.rating === Number(filters.rating))
      }

      if (filters.hasPhotos) {
        result = result.filter(review => review.photos.length > 0)
      }

      switch (filters.sort) {
        case 'oldest':
          result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'highest':
          result.sort((a, b) => b.rating - a.rating)
          break
        case 'lowest':
          result.sort((a, b) => a.rating - b.rating)
          break
        default: // newest
          result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }

      return result
    })

    const fetchReviews = async () => {
      loading.value = true
      try {
        const response = await store.dispatch('review/fetchReviews', {
          productId: props.productId,
          page: page.value,
          ...filters
        })
        hasMore.value = response.hasMore
      } catch (error) {
        toast.error('Değerlendirmeler yüklenirken bir hata oluştu')
      } finally {
        loading.value = false
      }
    }

    const loadMore = () => {
      page.value++
      fetchReviews()
    }

    const handleHelpful = async (review) => {
      try {
        await store.dispatch('review/markHelpful', review.id)
        toast.success('Geri bildiriminiz için teşekkürler')
      } catch (error) {
        toast.error('Bir hata oluştu')
      }
    }

    const canReport = (review) => {
      const user = store.state.auth.user
      return user && user.id !== review.user.id && !review.isReported
    }

    const reportReview = async (review) => {
      try {
        await store.dispatch('review/reportReview', review.id)
        toast.success('Değerlendirme başarıyla bildirildi')
      } catch (error) {
        toast.error('Bildirim gönderilirken bir hata oluştu')
      }
    }

    const openGallery = (photos, index) => {
      galleryPhotos.value = photos
      galleryIndex.value = index
      showGallery.value = true
    }

    const closeGallery = () => {
      showGallery.value = false
    }

    onMounted(() => {
      fetchReviews()
    })

    return {
      loading,
      hasMore,
      filters,
      filteredReviews,
      showGallery,
      galleryPhotos,
      galleryIndex,
      formatDate,
      loadMore,
      handleHelpful,
      canReport,
      reportReview,
      openGallery,
      closeGallery
    }
  }
}
</script>

<style lang="scss" scoped>
.select-field {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
         focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md;
}

.checkbox {
  @apply h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm 
         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style> 