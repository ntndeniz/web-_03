<template>
  <transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-full opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-full opacity-0"
  >
    <div 
      v-if="show"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg"
    >
      <div class="container mx-auto flex items-center justify-between px-4 py-6">
        <div class="pr-8">
          <h3 class="text-lg font-medium">🍪 Çerez Politikası</h3>
          <p class="mt-1 text-sm text-gray-600">
            Size daha iyi bir deneyim sunmak için çerezleri kullanıyoruz. 
            <router-link 
              to="/privacy"
              class="text-blue-600 hover:text-blue-500"
            >
              Gizlilik Politikamızı
            </router-link> 
            inceleyebilirsiniz.
          </p>
        </div>
        
        <div class="flex flex-shrink-0 space-x-4">
          <button
            @click="customizeSettings"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Ayarları Özelleştir
          </button>
          <button
            @click="acceptAll"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  </transition>

  <!-- Ayarlar Modal -->
  <Modal v-model="showSettings">
    <template #title>Çerez Ayarları</template>
    <div class="space-y-4">
      <div 
        v-for="(category, key) in cookieCategories"
        :key="key"
        class="flex items-start space-x-4 rounded-lg border p-4"
      >
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h4 class="font-medium">{{ category.name }}</h4>
            <div class="relative inline-flex h-6 w-11 items-center rounded-full"
              :class="category.required ? 'bg-gray-400 cursor-not-allowed' : category.enabled ? 'bg-blue-600' : 'bg-gray-200'"
            >
              <input
                type="checkbox"
                :checked="category.enabled"
                :disabled="category.required"
                @change="toggleCategory(key)"
                class="sr-only"
              />
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition"
                :class="category.enabled ? 'translate-x-6' : 'translate-x-1'"
              ></span>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-600">
            {{ category.description }}
          </p>
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-4">
        <button
          @click="saveSettings"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ayarları Kaydet
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Modal from './Modal.vue'

export default {
  name: 'CookieConsent',
  components: {
    Modal
  },
  setup() {
    const store = useStore()
    const show = ref(false)
    const showSettings = ref(false)
    const cookieCategories = ref({
      necessary: {
        name: 'Gerekli Çerezler',
        description: 'Bu çerezler web sitesinin çalışması için gereklidir ve devre dışı bırakılamaz.',
        enabled: true,
        required: true
      },
      analytics: {
        name: 'Analitik Çerezler',
        description: 'Bu çerezler, web sitesinin nasıl kullanıldığını anlamamıza yardımcı olur.',
        enabled: false,
        required: false
      },
      marketing: {
        name: 'Pazarlama Çerezleri',
        description: 'Bu çerezler, size özel reklamlar göstermek için kullanılır.',
        enabled: false,
        required: false
      }
    })

    const customizeSettings = () => {
      showSettings.value = true
    }

    const toggleCategory = (category) => {
      if (!cookieCategories.value[category].required) {
        cookieCategories.value[category].enabled = !cookieCategories.value[category].enabled
      }
    }

    const acceptAll = () => {
      Object.keys(cookieCategories.value).forEach(category => {
        cookieCategories.value[category].enabled = true
      })
      saveSettings()
    }

    const saveSettings = () => {
      const settings = Object.entries(cookieCategories.value).reduce((acc, [key, value]) => {
        acc[key] = value.enabled
        return acc
      }, {})

      localStorage.setItem('cookieConsent', JSON.stringify(settings))
      store.dispatch('app/setCookieConsent', settings)
      show.value = false
      showSettings.value = false
    }

    onMounted(() => {
      const savedConsent = localStorage.getItem('cookieConsent')
      if (!savedConsent) {
        show.value = true
      } else {
        const settings = JSON.parse(savedConsent)
        Object.keys(settings).forEach(category => {
          if (cookieCategories.value[category]) {
            cookieCategories.value[category].enabled = settings[category]
          }
        })
      }
    })

    return {
      show,
      showSettings,
      cookieCategories,
      customizeSettings,
      toggleCategory,
      acceptAll,
      saveSettings
    }
  }
}
</script> 