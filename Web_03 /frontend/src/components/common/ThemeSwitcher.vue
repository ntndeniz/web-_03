<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <!-- Tema İkonu -->
      <i
        :class="{
          'fas fa-sun': currentTheme === 'light',
          'fas fa-moon': currentTheme === 'dark',
          'fas fa-desktop': currentTheme === 'system'
        }"
        class="text-gray-600"
      ></i>
      <span class="text-sm text-gray-700">{{ themeText }}</span>
    </button>

    <!-- Tema Seçenekleri -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
    >
      <div
        class="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="theme-menu"
      >
        <button
          v-for="theme in themes"
          :key="theme.value"
          @click="changeTheme(theme.value)"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          role="menuitem"
        >
          <i :class="theme.icon" class="w-5"></i>
          <span>{{ theme.label }}</span>
          <i
            v-if="currentTheme === theme.value"
            class="fas fa-check ml-auto text-blue-600"
          ></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ThemeSwitcher',

  setup() {
    const store = useStore()
    const isOpen = ref(false)

    const themes = [
      {
        value: 'light',
        label: 'Açık Tema',
        icon: 'fas fa-sun'
      },
      {
        value: 'dark',
        label: 'Koyu Tema',
        icon: 'fas fa-moon'
      },
      {
        value: 'system',
        label: 'Sistem Teması',
        icon: 'fas fa-desktop'
      }
    ]

    const currentTheme = computed(() => store.state.ui.theme)

    const themeText = computed(() => {
      const theme = themes.find(t => t.value === currentTheme.value)
      return theme ? theme.label : 'Tema'
    })

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    const changeTheme = (theme) => {
      store.dispatch('ui/setTheme', theme)
      isOpen.value = false
    }

    const handleClickOutside = (event) => {
      if (isOpen.value && !event.target.closest('.theme-switcher')) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isOpen,
      themes,
      currentTheme,
      themeText,
      toggleDropdown,
      changeTheme
    }
  }
}
</script> 