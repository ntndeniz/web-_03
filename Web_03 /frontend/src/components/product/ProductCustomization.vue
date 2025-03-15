<template>
  <div class="product-customization">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Ürün Özelleştirme</h3>

    <!-- Özelleştirme Seçenekleri -->
    <div class="space-y-6">
      <!-- Renk Seçimi -->
      <div v-if="options.colors" class="color-selection">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Renk Seçimi
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="color in options.colors"
            :key="color.code"
            class="color-option"
            :class="{ 'ring-2 ring-primary-500': selectedOptions.color === color.code }"
            :style="{ backgroundColor: color.code }"
            @click="selectOption('color', color.code)"
          >
            <span class="sr-only">{{ color.name }}</span>
          </button>
        </div>
      </div>

      <!-- Boyut Seçimi -->
      <div v-if="options.sizes" class="size-selection">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Boyut Seçimi
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="size in options.sizes"
            :key="size.code"
            class="size-option"
            :class="{ 'ring-2 ring-primary-500': selectedOptions.size === size.code }"
            @click="selectOption('size', size.code)"
          >
            {{ size.name }}
          </button>
        </div>
      </div>

      <!-- Metin Özelleştirme -->
      <div v-if="options.allowText" class="text-customization">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Özel Metin
        </label>
        <input
          type="text"
          v-model="selectedOptions.text"
          :maxlength="options.maxTextLength"
          class="text-input"
          placeholder="Özel metninizi girin"
        >
        <p class="mt-1 text-sm text-gray-500">
          {{ selectedOptions.text.length }}/{{ options.maxTextLength }} karakter
        </p>
      </div>

      <!-- Görsel Yükleme -->
      <div v-if="options.allowImage" class="image-upload">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Özel Görsel
        </label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <div v-if="!selectedOptions.image" class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
              <p class="text-sm text-gray-500">
                Görsel yüklemek için tıklayın veya sürükleyin
              </p>
              <p class="text-xs text-gray-500">
                PNG, JPG, GIF (max. {{ formatFileSize(options.maxImageSize) }})
              </p>
            </div>
            <div v-else class="preview-area">
              <img 
                :src="selectedOptions.imagePreview" 
                alt="Yüklenen görsel"
                class="mx-auto h-32 w-auto"
              >
              <button 
                @click="removeImage"
                class="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Görseli Kaldır
              </button>
            </div>
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept="image/*"
              @change="handleImageUpload"
            >
          </div>
        </div>
      </div>

      <!-- Notlar -->
      <div v-if="options.allowNotes" class="notes">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Özel Notlar
        </label>
        <textarea
          v-model="selectedOptions.notes"
          rows="3"
          class="notes-input"
          placeholder="Özel isteklerinizi belirtin"
        ></textarea>
      </div>
    </div>

    <!-- Önizleme -->
    <div v-if="showPreview" class="preview-section mt-8">
      <h4 class="text-sm font-medium text-gray-900 mb-2">Önizleme</h4>
      <div class="preview-content">
        <!-- Önizleme içeriği burada oluşturulacak -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'ProductCustomization',

  props: {
    options: {
      type: Object,
      required: true
    },
    showPreview: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update:options'],

  setup(props, { emit }) {
    const fileInput = ref(null)
    const selectedOptions = reactive({
      color: '',
      size: '',
      text: '',
      image: null,
      imagePreview: '',
      notes: ''
    })

    const selectOption = (type, value) => {
      selectedOptions[type] = value
      emitUpdate()
    }

    const handleImageUpload = (event) => {
      const file = event.target.files[0]
      if (file && isValidImage(file)) {
        selectedOptions.image = file
        selectedOptions.imagePreview = URL.createObjectURL(file)
        emitUpdate()
      }
    }

    const removeImage = () => {
      selectedOptions.image = null
      selectedOptions.imagePreview = ''
      fileInput.value.value = ''
      emitUpdate()
    }

    const isValidImage = (file) => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Geçersiz dosya formatı')
        return false
      }
      if (file.size > props.options.maxImageSize) {
        alert('Dosya boyutu çok büyük')
        return false
      }
      return true
    }

    const formatFileSize = (bytes) => {
      return Math.round(bytes / 1024 / 1024) + 'MB'
    }

    const emitUpdate = () => {
      emit('update:options', selectedOptions)
    }

    return {
      fileInput,
      selectedOptions,
      selectOption,
      handleImageUpload,
      removeImage,
      formatFileSize
    }
  }
}
</script>

<style lang="scss" scoped>
.product-customization {
  @apply bg-white rounded-lg p-6;

  .color-option {
    @apply w-8 h-8 rounded-full focus:outline-none;
  }

  .size-option {
    @apply px-4 py-2 border rounded-md text-sm focus:outline-none
           hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }

  .text-input {
    @apply mt-1 block w-full border-gray-300 rounded-md shadow-sm
           focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
  }

  .notes-input {
    @apply mt-1 block w-full border-gray-300 rounded-md shadow-sm
           focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
  }

  .upload-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300
           rounded-md shadow-sm text-sm font-medium text-gray-700
           bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500;
  }

  .preview-area {
    @apply mt-2 p-4 border border-gray-200 rounded-lg;
  }
}
</style> 