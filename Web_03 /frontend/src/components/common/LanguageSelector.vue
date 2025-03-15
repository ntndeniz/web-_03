<template>
  <div class="relative">
    <!-- Dil Seçici Buton -->
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
    >
      <img 
        :src="currentLanguage.flag" 
        :alt="currentLanguage.name"
        class="h-4 w-4 rounded-sm"
      />
      <span>{{ currentLanguage.code.toUpperCase() }}</span>
      <i 
        class="fas fa-chevron-down text-xs transition-transform"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- Dil Listesi -->
    <div 
      v-if="isOpen"
      class="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <button
        v-for="language in availableLanguages"
        :key="language.code"
        @click="changeLanguage(language.code)"
        class="flex w-full items-center space-x-3 px-4 py-2 text-left text-sm hover:bg-gray-100"
        :class="{ 'bg-gray-50': language.code === currentLocale }"
      >
        <img 
          :src="language.flag" 
          :alt="language.name"
          class="h-4 w-4 rounded-sm"
        />
        <span>{{ language.name }}</span>
        <i 
          v-if="language.code === currentLocale"
          class="fas fa-check ml-auto text-blue-600"
        ></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'LanguageSelector',
  setup() {
    const store = useStore()
    const { locale: currentLocale } = useI18n()
    const isOpen = ref(false)

    const availableLanguages = [
      {
        code: 'tr',
        name: 'Türkçe',
        flag: '/images/flags/tr.svg'
      },
      {
        code: 'en',
        name: 'English',
        flag: '/images/flags/en.svg'
      },
      {
        code: 'de',
        name: 'Deutsch',
        flag: '/images/flags/de.svg'
      }
    ]

    const currentLanguage = computed(() => 
      availableLanguages.find(lang => lang.code === currentLocale.value) || availableLanguages[0]
    )

    const changeLanguage = async (code) => {
      try {
        await store.dispatch('app/changeLanguage', code)
        currentLocale.value = code
        isOpen.value = false
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Dil değiştirilemedi'
        })
      }
    }

    const closeDropdown = (event) => {
      if (!event.target.closest('.relative')) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })

    return {
      isOpen,
      currentLocale,
      availableLanguages,
      currentLanguage,
      changeLanguage
    }
  }
}
</script> 