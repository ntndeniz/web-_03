<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Değerlendirmelerim</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="filter"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tüm Değerlendirmeler</option>
          <option value="5">5 Yıldız</option>
          <option value="4">4 Yıldız</option>
          <option value="3">3 Yıldız</option>
          <option value="2">2 Yıldız</option>
          <option value="1">1 Yıldız</option>
        </select>

        <select 
          v-model="sortBy"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="rating_high">Puan (Yüksek-Düşük)</option>
          <option value="rating_low">Puan (Düşük-Yüksek)</option>
        </select>
      </div>
    </div>

    <!-- Değerlendirme Listesi -->
    <div v-if="filteredReviews.length" class="space-y-6">
      <div 
        v-for="review in filteredReviews"
        :key="review.id"
        class="rounded-lg border p-4"
      >
        <!-- Ürün Bilgisi -->
        <div class="flex items-center space-x-4">
          <img 
            :src="review.product.image"
            :alt="review.product.name"
            class="h-16 w-16 rounded-md object-cover"
          />
          <div class="flex-1">
            <router-link 
              :to="`/product/${review.product.id}`"
              class="font-medium hover:text-blue-600"
            >
              {{ review.product.name }}
            </router-link>
            <div class="mt-1 flex items-center space-x-2">
              <div class="flex">
                <i 
                  v-for="star in 5"
                  :key="star"
                  class="fas fa-star text-sm"
                  :class="star <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                ></i>
              </div>
              <span class="text-sm text-gray-600">
                {{ formatDate(review.date) }}
              </span>
            </div>
          </div>

          <!-- Aksiyonlar -->
          <div class="flex items-center space-x-2">
            <button 
              @click="editReview(review)"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deleteReview(review.id)"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- Değerlendirme İçeriği -->
        <div class="mt-4 space-y-2">
          <p class="font-medium">{{ review.title }}</p>
          <p class="text-sm text-gray-600">{{ review.comment }}</p>
          
          <!-- Fotoğraflar -->
          <div v-if="review.photos?.length" class="mt-4 flex space-x-2">
            <div 
              v-for="photo in review.photos"
              :key="photo.id"
              class="relative h-16 w-16"
            >
              <img 
                :src="photo.url"
                :alt="review.product.name"
                class="h-full w-full rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-star text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz değerlendirme yapmamışsınız.</p>
    </div>

    <!-- Düzenleme Modal -->
    <Modal v-model="showEditModal">
      <template #title>Değerlendirmeyi Düzenle</template>
      <form @submit.prevent="saveReview" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Puan
          </label>
          <div class="mt-1 flex items-center space-x-1">
            <button 
              v-for="star in 5"
              :key="star"
              type="button"
              @click="editForm.rating = star"
              class="focus:outline-none"
            >
              <i 
                class="fas fa-star text-lg"
                :class="star <= editForm.rating ? 'text-yellow-400' : 'text-gray-300'"
              ></i>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Başlık
          </label>
          <input 
            v-model="editForm.title"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Yorum
          </label>
          <textarea 
            v-model="editForm.comment"
            required
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Fotoğraf Yükleme -->
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Fotoğraflar
          </label>
          <div class="mt-2 flex items-center space-x-4">
            <div 
              v-for="(photo, index) in editForm.photos"
              :key="index"
              class="relative h-16 w-16"
            >
              <img 
                :src="photo.url"
                class="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                @click="removePhoto(index)"
                class="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
            
            <button
              type="button"
              @click="$refs.photoInput.click()"
              class="flex h-16 w-16 items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <i class="fas fa-plus text-gray-400"></i>
            </button>
            <input
              ref="photoInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handlePhotoUpload"
              multiple
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showEditModal = false"
            class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="!loading">Kaydet</span>
            <LoadingSpinner v-else size="sm" color="white" />
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Modal from '../common/Modal.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'Reviews',
  components: {
    Modal,
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const filter = ref('all')
    const sortBy = ref('newest')
    const reviews = ref([])
    const showEditModal = ref(false)
    const editForm = ref({
      id: null,
      rating: 5,
      title: '',
      comment: '',
      photos: []
    })

    const filteredReviews = computed(() => {
      let filtered = [...reviews.value]
      
      // Yıldız filtresi
      if (filter.value !== 'all') {
        filtered = filtered.filter(r => r.rating === parseInt(filter.value))
      }
      
      // Sıralama
      filtered.sort((a, b) => {
        if (sortBy.value === 'newest') {
          return new Date(b.date) - new Date(a.date)
        } else if (sortBy.value === 'oldest') {
          return new Date(a.date) - new Date(b.date)
        } else if (sortBy.value === 'rating_high') {
          return b.rating - a.rating
        } else if (sortBy.value === 'rating_low') {
          return a.rating - b.rating
        }
        return 0
      })
      
      return filtered
    })

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: tr })
    }

    const editReview = (review) => {
      editForm.value = {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        photos: [...(review.photos || [])]
      }
      showEditModal.value = true
    }

    const handlePhotoUpload = async (event) => {
      const files = Array.from(event.target.files)
      
      for (const file of files) {
        if (file.size > 2 * 1024 * 1024) {
          store.dispatch('ui/showToast', {
            type: 'error',
            message: 'Fotoğraf boyutu 2MB\'dan küçük olmalıdır'
          })
          continue
        }

        try {
          const formData = new FormData()
          formData.append('photo', file)
          
          const response = await store.dispatch('reviews/uploadPhoto', formData)
          editForm.value.photos.push(response)
        } catch (error) {
          store.dispatch('ui/showToast', {
            type: 'error',
            message: 'Fotoğraf yüklenirken bir hata oluştu'
          })
        }
      }
      
      event.target.value = ''
    }

    const removePhoto = (index) => {
      editForm.value.photos.splice(index, 1)
    }

    const saveReview = async () => {
      loading.value = true
      try {
        await store.dispatch('reviews/updateReview', editForm.value)
        await loadReviews()
        
        showEditModal.value = false
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Değerlendirme başarıyla güncellendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Değerlendirme güncellenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const deleteReview = async (reviewId) => {
      if (!confirm('Bu değerlendirmeyi silmek istediğinizden emin misiniz?')) return

      try {
        await store.dispatch('reviews/deleteReview', reviewId)
        await loadReviews()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Değerlendirme başarıyla silindi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Değerlendirme silinirken bir hata oluştu'
        })
      }
    }

    const loadReviews = async () => {
      try {
        const response = await store.dispatch('reviews/getUserReviews')
        reviews.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Değerlendirmeler yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadReviews()
    })

    return {
      loading,
      filter,
      sortBy,
      filteredReviews,
      showEditModal,
      editForm,
      formatDate,
      editReview,
      handlePhotoUpload,
      removePhoto,
      saveReview,
      deleteReview
    }
  }
}
</script> 