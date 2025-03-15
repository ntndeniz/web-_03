<template>
  <div class="form-preview">
    <!-- Önizleme Başlığı -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">Form Önizleme</h2>
        <p class="text-sm text-gray-600">Oluşturulan formun önizlemesi</p>
      </div>
      <div class="flex space-x-4">
        <button
          @click="togglePreviewMode"
          class="btn-secondary"
        >
          {{ isDesktopView ? 'Mobil Görünüm' : 'Masaüstü Görünüm' }}
        </button>
        <button
          @click="refreshPreview"
          class="btn-secondary"
          :disabled="loading"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          Yenile
        </button>
      </div>
    </div>

    <!-- Önizleme Çerçevesi -->
    <div
      class="preview-frame bg-white rounded-lg shadow-lg overflow-hidden"
      :class="{
        'max-w-screen-md mx-auto': isDesktopView,
        'max-w-sm mx-auto': !isDesktopView
      }"
    >
      <!-- Önizleme Başlığı -->
      <div class="preview-header bg-gray-50 px-6 py-4 border-b">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div class="text-sm text-gray-500">
            {{ isDesktopView ? 'Masaüstü' : 'Mobil' }} Önizleme
          </div>
        </div>
      </div>

      <!-- Önizleme İçeriği -->
      <div
        class="preview-content p-6"
        :class="{ 'overflow-y-auto': hasScroll }"
        ref="previewContent"
      >
        <component
          :is="previewComponent"
          v-if="!loading"
          v-bind="formConfig"
          @submit="handlePreviewSubmit"
        />
        <div
          v-else
          class="flex justify-center items-center h-64"
        >
          <LoadingSpinner />
        </div>
      </div>
    </div>

    <!-- Önizleme Sonucu -->
    <div
      v-if="previewResult"
      class="mt-4 p-4 rounded-lg"
      :class="[
        previewResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      ]"
    >
      <div class="font-medium">
        {{ previewResult.message }}
      </div>
      <pre v-if="previewResult.data" class="mt-2 text-sm">
        {{ JSON.stringify(previewResult.data, null, 2) }}
      </pre>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'FormPreview',

  components: {
    LoadingSpinner
  },

  props: {
    formConfig: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const isDesktopView = ref(true)
    const loading = ref(false)
    const previewContent = ref(null)
    const hasScroll = ref(false)
    const previewResult = ref(null)

    const previewComponent = computed(() => {
      return {
        template: `<div>${props.formConfig.template}</div>`,
        data() {
          return props.formConfig.data
        }
      }
    })

    const togglePreviewMode = () => {
      isDesktopView.value = !isDesktopView.value
      checkScroll()
    }

    const refreshPreview = async () => {
      loading.value = true
      previewResult.value = null
      
      try {
        await nextTick()
        checkScroll()
      } finally {
        loading.value = false
      }
    }

    const handlePreviewSubmit = (formData) => {
      previewResult.value = {
        success: true,
        message: 'Form başarıyla gönderildi',
        data: formData
      }
    }

    const checkScroll = () => {
      if (previewContent.value) {
        hasScroll.value = previewContent.value.scrollHeight > previewContent.value.clientHeight
      }
    }

    onMounted(() => {
      checkScroll()
      window.addEventListener('resize', checkScroll)
    })

    return {
      isDesktopView,
      loading,
      previewContent,
      hasScroll,
      previewResult,
      previewComponent,
      togglePreviewMode,
      refreshPreview,
      handlePreviewSubmit
    }
  }
}
</script>

<style scoped>
.preview-frame {
  @apply border border-gray-200;
  height: 600px;
}

.preview-content {
  height: calc(100% - 56px);
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md
         hover:bg-gray-200 flex items-center;
}
</style> 