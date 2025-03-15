<template>
  <div class="review-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Puan -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Puanınız
        </label>
        <div class="mt-2 flex items-center space-x-2">
          <button
            v-for="star in 5"
            :key="star"
            type="button"
            @click="form.rating = star"
            class="focus:outline-none"
          >
            <star-icon
              :class="[
                'h-6 w-6',
                star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
              ]"
            />
          </button>
        </div>
        <p v-if="errors.rating" class="mt-2 text-sm text-red-600">
          {{ errors.rating }}
        </p>
      </div>

      <!-- Başlık -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">
          Başlık
        </label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="input-field mt-1"
          :class="{ 'error': errors.title }"
          placeholder="Değerlendirmeniz için kısa bir başlık"
        />
        <p v-if="errors.title" class="mt-2 text-sm text-red-600">
          {{ errors.title }}
        </p>
      </div>

      <!-- Yorum -->
      <div>
        <label for="comment" class="block text-sm font-medium text-gray-700">
          Yorumunuz
        </label>
        <textarea
          id="comment"
          v-model="form.comment"
          rows="4"
          class="input-field mt-1"
          :class="{ 'error': errors.comment }"
          placeholder="Ürün hakkında deneyimlerinizi paylaşın"
        />
        <p v-if="errors.comment" class="mt-2 text-sm text-red-600">
          {{ errors.comment }}
        </p>
      </div>

      <!-- Fotoğraflar -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Fotoğraflar (İsteğe Bağlı)
        </label>
        <div class="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div
            v-for="(photo, index) in photos"
            :key="index"
            class="relative"
          >
            <img
              :src="photo.preview"
              class="h-24 w-24 object-cover rounded-lg"
            />
            <button
              type="button"
              @click="removePhoto(index)"
              class="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600"
            >
              <x-icon class="h-4 w-4" />
            </button>
          </div>
          <button
            v-if="photos.length < 5"
            type="button"
            @click="triggerFileInput"
            class="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-500"
          >
            <plus-icon class="h-8 w-8" />
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>

      <!-- Gönder Butonu -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          <spinner v-if="loading" class="h-5 w-5 mr-2" />
          <span>Değerlendirmeyi Gönder</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useToast } from '@/composables/useToast'
import { StarIcon, PlusIcon, XIcon } from '@heroicons/vue/solid'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'ReviewForm',

  components: {
    StarIcon,
    PlusIcon,
    XIcon,
    Spinner
  },

  props: {
    productId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true
    }
  },

  emits: ['submitted'],

  setup(props, { emit }) {
    const store = useStore()
    const toast = useToast()
    const fileInput = ref(null)

    const loading = ref(false)
    const photos = ref([])
    const errors = reactive({})

    const form = reactive({
      rating: 0,
      title: '',
      comment: ''
    })

    const validateForm = () => {
      errors.rating = !form.rating ? 'Lütfen bir puan verin' : ''
      errors.title = !form.title.trim() ? 'Başlık alanı zorunludur' : ''
      errors.comment = !form.comment.trim() ? 'Yorum alanı zorunludur' : ''

      return !Object.values(errors).some(error => error)
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        if (file.type.startsWith('image/') && photos.value.length < 5) {
          const reader = new FileReader()
          reader.onload = (e) => {
            photos.value.push({
              file,
              preview: e.target.result
            })
          }
          reader.readAsDataURL(file)
        }
      })
      fileInput.value.value = ''
    }

    const removePhoto = (index) => {
      photos.value.splice(index, 1)
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        const formData = new FormData()
        formData.append('productId', props.productId)
        formData.append('orderId', props.orderId)
        formData.append('rating', form.rating)
        formData.append('title', form.title)
        formData.append('comment', form.comment)
        photos.value.forEach(photo => {
          formData.append('photos[]', photo.file)
        })

        await store.dispatch('review/createReview', formData)
        toast.success('Değerlendirmeniz başarıyla gönderildi')
        emit('submitted')
      } catch (error) {
        toast.error('Değerlendirme gönderilirken bir hata oluştu')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      photos,
      errors,
      fileInput,
      triggerFileInput,
      handleFileChange,
      removePhoto,
      handleSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.input-field {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
         placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  
  &.error {
    @apply border-red-500;
  }
}

.btn-primary {
  @apply inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
         disabled:opacity-50 disabled:cursor-not-allowed;
}
</style> 