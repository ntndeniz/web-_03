<template>
  <div class="space-y-4">
    <!-- Yükleme Alanı -->
    <div
      class="relative border-2 border-dashed rounded-lg p-6"
      :class="[
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500'
      ]"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="!disabled && $refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        class="hidden"
        :disabled="disabled"
        @change="handleFileSelect"
      />

      <div class="text-center">
        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
        <p class="text-sm text-gray-600">
          Resim yüklemek için tıklayın veya sürükleyip bırakın
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ acceptText }}
        </p>
      </div>
    </div>

    <!-- Yüklenen Resimler -->
    <div v-if="previewUrls.length > 0" class="grid grid-cols-4 gap-4">
      <div
        v-for="(url, index) in previewUrls"
        :key="index"
        class="relative group"
      >
        <img
          :src="url"
          class="w-full h-24 object-cover rounded-lg"
          :alt="`Yüklenen resim ${index + 1}`"
        />
        <button
          @click="removeImage(index)"
          class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          :disabled="disabled"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Yükleme Durumu -->
    <div v-if="uploading" class="relative pt-1">
      <div class="flex mb-2 items-center justify-between">
        <div>
          <span class="text-xs font-semibold inline-block text-blue-600">
            Yükleniyor...
          </span>
        </div>
        <div class="text-right">
          <span class="text-xs font-semibold inline-block text-blue-600">
            {{ progress }}%
          </span>
        </div>
      </div>
      <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
        <div
          :style="{ width: progress + '%' }"
          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
        ></div>
      </div>
    </div>

    <!-- Hata Mesajı -->
    <p v-if="error" class="text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ImageUploader',

  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['upload', 'remove', 'error'],

  setup(props, { emit }) {
    const isDragging = ref(false)
    const uploading = ref(false)
    const progress = ref(0)
    const error = ref('')
    const previewUrls = ref([])
    const files = ref([])

    const acceptText = computed(() => {
      const size = props.maxSize / (1024 * 1024)
      return `Maksimum dosya boyutu: ${size}MB`
    })

    const validateFile = (file) => {
      if (!file.type.startsWith('image/')) {
        error.value = 'Lütfen sadece resim dosyası yükleyin'
        return false
      }

      if (file.size > props.maxSize) {
        error.value = `Dosya boyutu ${props.maxSize / (1024 * 1024)}MB'dan küçük olmalıdır`
        return false
      }

      return true
    }

    const handleFileSelect = (event) => {
      const selectedFiles = Array.from(event.target.files)
      processFiles(selectedFiles)
    }

    const handleDragOver = (event) => {
      isDragging.value = true
    }

    const handleDragLeave = (event) => {
      isDragging.value = false
    }

    const handleDrop = (event) => {
      isDragging.value = false
      const droppedFiles = Array.from(event.dataTransfer.files)
      processFiles(droppedFiles)
    }

    const processFiles = async (selectedFiles) => {
      error.value = ''

      for (const file of selectedFiles) {
        if (!validateFile(file)) {
          emit('error', error.value)
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          if (!props.multiple) {
            previewUrls.value = [e.target.result]
            files.value = [file]
          } else {
            previewUrls.value.push(e.target.result)
            files.value.push(file)
          }
        }
        reader.readAsDataURL(file)
      }

      emit('upload', props.multiple ? files.value : files.value[0])
    }

    const removeImage = (index) => {
      previewUrls.value.splice(index, 1)
      files.value.splice(index, 1)
      emit('remove', index)
    }

    return {
      isDragging,
      uploading,
      progress,
      error,
      previewUrls,
      acceptText,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeImage
    }
  }
}
</script> 