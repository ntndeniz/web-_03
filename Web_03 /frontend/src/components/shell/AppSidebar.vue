<template>
  <aside 
    class="app-sidebar"
    :class="{ open: isOpen }"
  >
    <div class="sidebar-overlay" @click="closeSidebar"></div>
    
    <div class="sidebar-content">
      <div class="sidebar-header">
        <button @click="closeSidebar" class="close-button">
          <i class="fas fa-times"></i>
        </button>
        
        <div v-if="isAuthenticated" class="user-info">
          <img :src="userAvatar" :alt="userName" class="user-avatar" />
          <div class="user-details">
            <h3>{{ userName }}</h3>
            <p>{{ userEmail }}</p>
          </div>
        </div>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section">
          <h4>Ana Menü</h4>
          <nav>
            <router-link
              v-for="item in mainMenuItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ active: isActive(item.path) }"
              @click="closeSidebar"
            >
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </router-link>
          </nav>
        </div>

        <div class="nav-section">
          <h4>Kategoriler</h4>
          <nav>
            <router-link
              v-for="category in categories"
              :key="category.id"
              :to="{ name: 'category', params: { slug: category.slug }}"
              class="nav-item"
              @click="closeSidebar"
            >
              <i :class="category.icon"></i>
              <span>{{ category.name }}</span>
            </router-link>
          </nav>
        </div>

        <div v-if="isAuthenticated" class="nav-section">
          <h4>Hesabım</h4>
          <nav>
            <router-link
              v-for="item in accountMenuItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              @click="closeSidebar"
            >
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </router-link>

            <button 
              @click="handleLogout"
              class="nav-item text-red-600"
            >
              <i class="fas fa-sign-out-alt"></i>
              <span>Çıkış Yap</span>
            </button>
          </nav>
        </div>
        
        <div v-else class="auth-buttons">
          <router-link 
            to="/login"
            class="login-button"
            @click="closeSidebar"
          >
            Giriş Yap
          </router-link>
          <router-link 
            to="/register"
            class="register-button"
            @click="closeSidebar"
          >
            Kayıt Ol
          </router-link>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="contact-info">
          <p>
            <i class="fas fa-phone"></i>
            <a :href="'tel:' + phoneNumber">{{ phoneNumber }}</a>
          </p>
          <p>
            <i class="fas fa-envelope"></i>
            <a :href="'mailto:' + supportEmail">{{ supportEmail }}</a>
          </p>
        </div>

        <div class="social-links">
          <a 
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            :title="link.name"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
          >
            <i :class="link.icon"></i>
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'AppSidebar',

  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },

  emits: ['close'],

  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    const userName = computed(() => store.state.auth.user?.name)
    const userEmail = computed(() => store.state.auth.user?.email)
    const userAvatar = computed(() => store.state.auth.user?.avatar)
    const categories = computed(() => store.state.categories.items)

    const mainMenuItems = [
      { name: 'Ana Sayfa', path: '/', icon: 'fas fa-home' },
      { name: 'Ürünler', path: '/products', icon: 'fas fa-box' },
      { name: 'Kampanyalar', path: '/campaigns', icon: 'fas fa-percentage' },
      { name: 'İletişim', path: '/contact', icon: 'fas fa-envelope' }
    ]

    const accountMenuItems = [
      { name: 'Profilim', path: '/profile', icon: 'fas fa-user' },
      { name: 'Siparişlerim', path: '/orders', icon: 'fas fa-shopping-bag' },
      { name: 'Favorilerim', path: '/wishlist', icon: 'fas fa-heart' },
      { name: 'Adreslerim', path: '/addresses', icon: 'fas fa-map-marker-alt' }
    ]

    const socialLinks = [
      { name: 'Facebook', url: '#', icon: 'fab fa-facebook' },
      { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
      { name: 'Instagram', url: '#', icon: 'fab fa-instagram' }
    ]

    const phoneNumber = '0850 123 45 67'
    const supportEmail = 'destek@example.com'

    const isActive = (path) => {
      return route.path === path
    }

    const closeSidebar = () => {
      emit('close')
    }

    const handleLogout = () => {
      store.dispatch('auth/logout')
      closeSidebar()
    }

    return {
      isAuthenticated,
      userName,
      userEmail,
      userAvatar,
      categories,
      mainMenuItems,
      accountMenuItems,
      socialLinks,
      phoneNumber,
      supportEmail,
      isActive,
      closeSidebar,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-sidebar {
  @apply fixed inset-0 z-50 invisible;
}

.app-sidebar.open {
  @apply visible;
}

.sidebar-overlay {
  @apply absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300;
}

.sidebar-content {
  @apply absolute top-0 left-0 bottom-0 w-80 bg-white transform -translate-x-full transition-transform duration-300;
}

.app-sidebar.open .sidebar-content {
  @apply translate-x-0;
}

.sidebar-header {
  @apply p-4 border-b border-gray-200;
}

.close-button {
  @apply absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700;
}

.user-info {
  @apply flex items-center gap-4;
}

.user-avatar {
  @apply w-12 h-12 rounded-full;
}

.user-details h3 {
  @apply font-medium;
}

.user-details p {
  @apply text-sm text-gray-600;
}

.sidebar-nav {
  @apply p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)];
}

.nav-section h4 {
  @apply text-sm font-medium text-gray-500 uppercase mb-2;
}

.nav-item {
  @apply flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors;
}

.nav-item.active {
  @apply bg-blue-50 text-blue-600;
}

.nav-item i {
  @apply w-5;
}

.auth-buttons {
  @apply grid grid-cols-2 gap-4;
}

.login-button {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center;
}

.register-button {
  @apply px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center;
}

.sidebar-footer {
  @apply absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200;
}

.contact-info {
  @apply space-y-2 mb-4;
}

.contact-info p {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.social-links {
  @apply flex justify-center gap-4;
}

.social-link {
  @apply text-gray-500 hover:text-gray-700 transition-colors;
}
</style>