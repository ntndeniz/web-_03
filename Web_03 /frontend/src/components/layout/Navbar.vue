<template>
  <nav class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/logo.png" alt="Logo" class="h-8 w-auto">
          <span class="ml-2 text-xl font-bold text-gray-900">E-Ticaret</span>
        </router-link>

        <!-- Arama Çubuğu -->
        <div class="hidden md:block flex-1 max-w-2xl mx-8">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Ürün, kategori veya marka ara..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @keyup.enter="handleSearch"
            >
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
              <i class="fas fa-search text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Sağ Menü -->
        <div class="flex items-center space-x-4">
          <!-- Mobil Arama -->
          <button 
            @click="showMobileSearch = !showMobileSearch"
            class="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <i class="fas fa-search"></i>
          </button>

          <!-- Favoriler -->
          <router-link 
            to="/favorites"
            class="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <i class="fas fa-heart"></i>
            <span 
              v-if="favoritesCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {{ favoritesCount }}
            </span>
          </router-link>

          <!-- Sepet -->
          <router-link 
            to="/cart"
            class="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <i class="fas fa-shopping-cart"></i>
            <span 
              v-if="cartItemsCount > 0"
              class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {{ cartItemsCount }}
            </span>
          </router-link>

          <!-- Kullanıcı Menüsü -->
          <div class="relative" v-if="isLoggedIn">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {{ userInitials }}
              </div>
              <i class="fas fa-chevron-down text-sm"></i>
            </button>

            <!-- Dropdown Menü -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link 
                to="/profile"
                class="block px-4 py-2 hover:bg-gray-100"
              >
                <i class="fas fa-user mr-2"></i>
                Profilim
              </router-link>
              <router-link 
                to="/orders"
                class="block px-4 py-2 hover:bg-gray-100"
              >
                <i class="fas fa-shopping-bag mr-2"></i>
                Siparişlerim
              </router-link>
              <router-link 
                to="/settings"
                class="block px-4 py-2 hover:bg-gray-100"
              >
                <i class="fas fa-cog mr-2"></i>
                Ayarlar
              </router-link>
              <button 
                @click="logout"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                <i class="fas fa-sign-out-alt mr-2"></i>
                Çıkış Yap
              </button>
            </div>
          </div>

          <!-- Giriş/Kayıt -->
          <div v-else class="flex items-center space-x-2">
            <router-link 
              to="/login"
              class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Giriş Yap
            </router-link>
            <router-link 
              to="/register"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Üye Ol
            </router-link>
          </div>
        </div>
      </div>

      <!-- Mobil Arama -->
      <div 
        v-if="showMobileSearch"
        class="md:hidden py-4"
      >
        <div class="relative">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter="handleSearch"
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
            <i class="fas fa-search text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- Kategori Menüsü -->
      <div class="border-t">
        <ul class="flex space-x-8 py-4 overflow-x-auto">
          <li v-for="category in categories" :key="category.id">
            <router-link 
              :to="`/products?category=${category.slug}`"
              class="text-gray-600 hover:text-blue-600 whitespace-nowrap"
            >
              <i :class="category.icon" class="mr-2"></i>
              {{ category.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const searchQuery = ref('')
    const showMobileSearch = ref(false)
    const showUserMenu = ref(false)

    const isLoggedIn = computed(() => store.state.auth.isLoggedIn)
    const user = computed(() => store.state.auth.user)
    const cartItemsCount = computed(() => store.state.cart.items.length)
    const favoritesCount = computed(() => store.state.favorites.items.length)

    const userInitials = computed(() => {
      if (!user.value?.name) return ''
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    const categories = [
      { id: 1, name: 'Kadın', slug: 'kadin', icon: 'fas fa-female' },
      { id: 2, name: 'Erkek', slug: 'erkek', icon: 'fas fa-male' },
      { id: 3, name: 'Çocuk', slug: 'cocuk', icon: 'fas fa-child' },
      { id: 4, name: 'Ayakkabı', slug: 'ayakkabi', icon: 'fas fa-shoe-prints' },
      { id: 5, name: 'Çanta', slug: 'canta', icon: 'fas fa-shopping-bag' },
      { id: 6, name: 'Aksesuar', slug: 'aksesuar', icon: 'fas fa-glasses' },
      { id: 7, name: 'Spor', slug: 'spor', icon: 'fas fa-running' },
      { id: 8, name: 'Kozmetik', slug: 'kozmetik', icon: 'fas fa-spa' }
    ]

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery.value)}`)
        searchQuery.value = ''
        showMobileSearch.value = false
      }
    }

    const logout = async () => {
      try {
        await store.dispatch('logout')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    // Sayfa dışına tıklandığında menüyü kapat
    const closeUserMenu = (e) => {
      if (!e.target.closest('.user-menu')) {
        showUserMenu.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', closeUserMenu)
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeUserMenu)
    })

    return {
      searchQuery,
      showMobileSearch,
      showUserMenu,
      isLoggedIn,
      userInitials,
      cartItemsCount,
      favoritesCount,
      categories,
      handleSearch,
      logout
    }
  }
}
</script> 