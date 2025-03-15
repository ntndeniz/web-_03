<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-left">
        <button 
          v-if="showMenuButton"
          @click="toggleSidebar" 
          class="menu-button"
        >
          <i class="fas fa-bars"></i>
        </button>

        <router-link to="/" class="logo-link">
          <img :src="logo" alt="Logo" class="logo" />
        </router-link>

        <nav class="main-nav" v-if="!isMobile">
          <router-link
            v-for="item in mainNavItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: isActive(item.path) }"
          >
            {{ item.name }}
          </router-link>
        </nav>
      </div>

      <div class="header-right">
        <div class="search-bar" v-if="!isMobile">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Ara..."
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-button">
            <i class="fas fa-search"></i>
          </button>
        </div>

        <div class="header-actions">
          <button 
            v-if="isMobile"
            @click="toggleSearch"
            class="action-button"
          >
            <i class="fas fa-search"></i>
          </button>

          <button 
            @click="toggleNotifications"
            class="action-button"
            :class="{ 'has-notifications': hasUnreadNotifications }"
          >
            <i class="fas fa-bell"></i>
            <span v-if="notificationCount" class="notification-badge">
              {{ notificationCount }}
            </span>
          </button>

          <div class="user-menu" v-if="isAuthenticated">
            <button 
              @click="toggleUserMenu"
              class="user-button"
              ref="userMenuButton"
            >
              <img :src="userAvatar" :alt="userName" class="user-avatar" />
              <span v-if="!isMobile" class="user-name">{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>

            <div 
              v-show="showUserMenu"
              class="user-dropdown"
              ref="userDropdown"
            >
              <router-link 
                v-for="item in userMenuItems"
                :key="item.path"
                :to="item.path"
                class="dropdown-item"
              >
                <i :class="item.icon"></i>
                {{ item.name }}
              </router-link>

              <button @click="handleLogout" class="dropdown-item text-red-600">
                <i class="fas fa-sign-out-alt"></i>
                Çıkış Yap
              </button>
            </div>
          </div>
          
          <router-link 
            v-else 
            to="/login"
            class="login-button"
          >
            Giriş Yap
          </router-link>
        </div>
      </div>
    </div>

    <div 
      v-show="showMobileSearch"
      class="mobile-search"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Ara..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useBreakpoints } from '@/composables/useBreakpoints'

export default {
  name: 'AppHeader',

  props: {
    showMenuButton: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const store = useStore()
    const route = useRoute()
    const { isMobile } = useBreakpoints()

    const searchQuery = ref('')
    const showMobileSearch = ref(false)
    const showUserMenu = ref(false)
    const userMenuButton = ref(null)
    const userDropdown = ref(null)

    // Ana navigasyon öğeleri
    const mainNavItems = [
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Ürünler', path: '/products' },
      { name: 'Kategoriler', path: '/categories' },
      { name: 'Kampanyalar', path: '/campaigns' }
    ]

    // Kullanıcı menü öğeleri
    const userMenuItems = [
      { name: 'Profilim', path: '/profile', icon: 'fas fa-user' },
      { name: 'Siparişlerim', path: '/orders', icon: 'fas fa-shopping-bag' },
      { name: 'Favorilerim', path: '/wishlist', icon: 'fas fa-heart' },
      { name: 'Ayarlar', path: '/settings', icon: 'fas fa-cog' }
    ]

    // Computed properties
    const isAuthenticated = computed(() => store.state.auth.isAuthenticated)
    const userName = computed(() => store.state.auth.user?.name)
    const userAvatar = computed(() => store.state.auth.user?.avatar)
    const hasUnreadNotifications = computed(() => store.state.notifications.unreadCount > 0)
    const notificationCount = computed(() => store.state.notifications.unreadCount)

    // Methods
    const isActive = (path) => route.path === path

    const toggleSidebar = () => {
      store.commit('ui/toggleSidebar')
    }

    const toggleSearch = () => {
      showMobileSearch.value = !showMobileSearch.value
    }

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        store.dispatch('search/performSearch', searchQuery.value)
        showMobileSearch.value = false
      }
    }

    const toggleNotifications = () => {
      store.commit('ui/toggleNotifications')
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const handleLogout = () => {
      store.dispatch('auth/logout')
    }

    // Click outside handler for user menu
    const handleClickOutside = (event) => {
      if (
        userMenuButton.value &&
        userDropdown.value &&
        !userMenuButton.value.contains(event.target) &&
        !userDropdown.value.contains(event.target)
      ) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      searchQuery,
      showMobileSearch,
      showUserMenu,
      userMenuButton,
      userDropdown,
      mainNavItems,
      userMenuItems,
      isAuthenticated,
      userName,
      userAvatar,
      hasUnreadNotifications,
      notificationCount,
      isMobile,
      isActive,
      toggleSidebar,
      toggleSearch,
      handleSearch,
      toggleNotifications,
      toggleUserMenu,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-header {
  @apply bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50;
}

.header-container {
  @apply max-w-7xl mx-auto px-4 h-16 flex items-center justify-between;
}

.header-left {
  @apply flex items-center gap-4;
}

.menu-button {
  @apply p-2 text-gray-600 hover:text-gray-800 lg:hidden;
}

.logo-link {
  @apply flex items-center;
}

.logo {
  @apply h-8 w-auto;
}

.main-nav {
  @apply hidden lg:flex items-center gap-6 ml-8;
}

.nav-item {
  @apply text-gray-600 hover:text-gray-800 transition-colors;
}

.nav-item.active {
  @apply text-blue-600 font-medium;
}

.header-right {
  @apply flex items-center gap-4;
}

.search-bar {
  @apply relative w-64;
}

.search-bar input {
  @apply w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.search-button {
  @apply absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600;
}

.header-actions {
  @apply flex items-center gap-4;
}

.action-button {
  @apply relative p-2 text-gray-600 hover:text-gray-800;
}

.notification-badge {
  @apply absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center;
}

.user-menu {
  @apply relative;
}

.user-button {
  @apply flex items-center gap-2 p-2 rounded-md hover:bg-gray-100;
}

.user-avatar {
  @apply w-8 h-8 rounded-full;
}

.user-name {
  @apply text-sm font-medium text-gray-700;
}

.user-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200;
}

.dropdown-item {
  @apply flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left;
}

.login-button {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.mobile-search {
  @apply fixed top-16 left-0 right-0 p-4 bg-white border-b border-gray-200 lg:hidden;
}

.mobile-search input {
  @apply w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

@screen lg {
  .header-container {
    @apply h-20;
  }
}
</style> 