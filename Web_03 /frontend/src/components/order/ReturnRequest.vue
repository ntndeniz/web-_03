<template>
  <div class="return-request">
    <!-- Başlık -->
    <div class="bg-white shadow sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              İade Talebi Oluştur
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Sipariş #{{ order.orderNumber }}
            </p>
          </div>
          <button
            @click="$router.push(`/orders/${orderId}`)"
            class="btn-secondary"
          >
            Sipariş Detayına Dön
          </button>
        </div>
      </div>
    </div>

    <!-- İade Formu -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- İade Edilecek Ürünler -->
          <div>
            <h4 class="text-base font-medium text-gray-900 mb-4">
              İade Edilecek Ürünler
            </h4>
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <input
                  :id="`item-${item.id}`"
                  v-model="selectedItems"
                  :value="item.id"
                  type="checkbox"
                  class="checkbox mt-1"
                />
                <div class="flex flex-1 space-x-4">
                  <img
                    :src="item.product.image"
                    :alt="item.product.name"
                    class="h-20 w-20 object-cover rounded-md"
                  />
                  <div class="flex-1">
                    <label
                      :for="`item-${item.id}`"
                      class="text-sm font-medium text-gray-900"
                    >
                      {{ item.product.name }}
                    </label>
                    <p class="mt-1 text-sm text-gray-500">
                      {{ item.product.variant }}
                    </p>
                    <div class="mt-1 text-sm text-gray-500">
                      Adet: {{ item.quantity }} x {{ formatPrice(item.unitPrice) }} TL
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="errors.items" class="mt-2 text-sm text-red-600">
              {{ errors.items }}
            </p>
          </div>

          <!-- İade Nedeni -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-700">
              İade Nedeni
            </label>
            <select
              id="reason"
              v-model="form.reason"
              class="select-field mt-1"
              :class="{ 'error': errors.reason }"
            >
              <option value="">Seçiniz</option>
              <option value="wrong_size">Beden/Ölçü Uyumsuzluğu</option>
              <option value="defective">Ürün Kusurlu/Hasarlı</option>
              <option value="not_as_described">Ürün Görseldekinden Farklı</option>
              <option value="wrong_item">Yanlış Ürün Gönderildi</option>
              <option value="other">Diğer</option>
            </select>
            <p v-if="errors.reason" class="mt-2 text-sm text-red-600">
              {{ errors.reason }}
            </p>
          </div>

          <!-- Açıklama -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">
              Açıklama
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="input-field mt-1"
              :class="{ 'error': errors.description }"
              placeholder="İade nedeninizi detaylı açıklayınız"
            />
            <p v-if="errors.description" class="mt-2 text-sm text-red-600">
              {{ errors.description }}
            </p>
          </div>

          <!-- Fotoğraflar -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Fotoğraflar
            </label>
            <p class="mt-1 text-sm text-gray-500">
              İade etmek istediğiniz ürünün fotoğraflarını ekleyiniz
            </p>
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
            <p v-if="errors.photos" class="mt-2 text-sm text-red-600">
              {{ errors.photos }}
            </p>
          </div>

          <!-- Gönder Butonu -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
            >
              <spinner v-if="loading" class="h-5 w-5 mr-2" />
              <span>İade Talebini Gönder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { formatPrice } from '@/utils/formatters'
import { PlusIcon, XIcon } from '@heroicons/vue/outline'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'ReturnRequest',

  components: {
    PlusIcon,
    XIcon,
    Spinner
  },

  props: {
    orderId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()
    const fileInput = ref(null)

    const loading = ref(false)
    const selectedItems = ref([])
    const photos = ref([])
    const errors = reactive({})

    const order = computed(() => store.getters['order/getOrderById'](props.orderId))

    const form = reactive({
      reason: '',
      description: ''
    })

    const validateForm = () => {
      errors.items = selectedItems.value.length === 0 
        ? 'En az bir ürün seçmelisiniz'
        : ''
      errors.reason = !form.reason ? 'İade nedeni seçmelisiniz' : ''
      errors.description = !form.description.trim() 
        ? 'Açıklama alanı zorunludur'
        : ''
      errors.photos = photos.value.length === 0 
        ? 'En az bir fotoğraf eklemelisiniz'
        : ''

      return !Object.values(errors).some(error => error)
    }

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileChange = (event) => {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
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
        formData.append('orderId', props.orderId)
        formData.append('items', JSON.stringify(selectedItems.value))
        formData.append('reason', form.reason)
        formData.append('description', form.description)
        photos.value.forEach(photo => {
          formData.append('photos[]', photo.file)
        })

        await store.dispatch('order/createReturnRequest', formData)
        toast.success('İade talebiniz başarıyla oluşturuldu')
        router.push(`/orders/${props.orderId}`)
      } catch (error) {
        toast.error('İade talebi oluşturulurken bir hata oluştu')
      } finally {
        loading.value = false
      }
    }

    return {
      order,
      form,
      loading,
      selectedItems,
      photos,
      errors,
      fileInput,
      formatPrice,
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

.select-field {
  @apply block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none 
         focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md;
  
  &.error {
    @apply border-red-500;
  }
}

.checkbox {
  @apply h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded;
}

.btn-primary {
  @apply inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm 
         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style> 