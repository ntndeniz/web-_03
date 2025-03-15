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
          Dosya yüklemek için tıklayın veya sürükleyip bırakın
        </p>
        <p class="text-xs text-gray-500 mt-1">
          {{ acceptText }}
        </p>
      </div>
    </div>

    <!-- Yüklenen Dosyalar -->
    <div v-if="files.length > 0" class="space-y-2">
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
      >
        <!-- Dosya Bilgisi -->
        <div class="flex items-center space-x-2">
          <i :class="getFileIcon(file.type)" class="text-gray-400"></i>
          <div>
            <p class="text-sm font-medium text-gray-700">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>

        <!-- İşlem Butonları -->
        <div class="flex items-center space-x-2">
          <button
            v-if="file.status === 'error'"
            @click="retryUpload(index)"
            class="text-blue-600 hover:text-blue-700"
            :disabled="disabled"
          >
            <i class="fas fa-redo"></i>
          </button>
          <button
            @click="removeFile(index)"
            class="text-red-600 hover:text-red-700"
            :disabled="disabled"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
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
  name: 'FileUploader',

  props: {
    accept: {
      type: String,
      default: '*/*'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    },
    maxFiles: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  emits: ['upload', 'remove', 'error'],

  setup(props, { emit }) {
    const isDragging = ref(false)
    const files = ref([])
    const uploading = ref(false)
    const progress = ref(0)
    const error = ref('')

    const acceptText = computed(() => {
      const types = props.accept.split(',').map(type => type.trim())
      if (types.includes('*/*')) return 'Tüm dosya türleri'
      return `İzin verilen türler: ${types.join(', ')}`
    })

    const getFileIcon = (type) => {
      const icons = {
        'image': 'fas fa-image',
        'video': 'fas fa-video',
        'audio': 'fas fa-music',
        'application/pdf': 'fas fa-file-pdf',
        'application/msword': 'fas fa-file-word',
        'application/vnd.ms-excel': 'fas fa-file-excel',
        'text': 'fas fa-file-alt'
      }

      for (const [key, value] of Object.entries(icons)) {
        if (type.startsWith(key)) return value
      }
      return 'fas fa-file'
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }

    const validateFile = (file) => {
      if (!props.accept.includes('*/*') && !props.accept.includes(file.type)) {
        error.value = 'Desteklenmeyen dosya türü'
        return false
      }

      if (file.size > props.maxSize) {
        error.value = `Dosya boyutu ${formatFileSize(props.maxSize)}'dan küçük olmalıdır`
        return false
      }

      if (files.value.length >= props.maxFiles) {
        error.value = `En fazla ${props.maxFiles} dosya yükleyebilirsiniz`
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

        const fileObj = {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending'
        }

        if (!props.multiple) {
          files.value = [fileObj]
        } else {
          files.value.push(fileObj)
        }
      }

      emit('upload', props.multiple ? files.value : files.value[0])
    }

    const removeFile = (index) => {
      files.value.splice(index, 1)
      emit('remove', index)
    }

    const retryUpload = (index) => {
      const file = files.value[index]
      file.status = 'pending'
      emit('upload', file)
    }

    return {
      isDragging,
      files,
      uploading,
      progress,
      error,
      acceptText,
      getFileIcon,
      formatFileSize,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeFile,
      retryUpload
    }
  }
}
</script> 