<template>
  <nav class="bg-white shadow">
    <!-- Üst Bar -->
    <div class="bg-blue-600 text-white py-2">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <!-- Sol Kısım -->
          <div class="text-sm">
            <a href="tel:+902121234567" class="hover:text-blue-200">
              <i class="fas fa-phone mr-2"></i>0212 123 45 67
            </a>
            <span class="mx-3">|</span>
            <a href="mailto:info@aridolu.com" class="hover:text-blue-200">
              <i class="fas fa-envelope mr-2"></i>info@aridolu.com
            </a>
          </div>
          
          <!-- Sağ Kısım -->
          <div class="text-sm">
            <router-link to="/kampanyalar" class="hover:text-blue-200 mr-4">
              <i class="fas fa-tag mr-1"></i>Kampanyalar
            </router-link>
            <router-link to="/blog" class="hover:text-blue-200">
              <i class="fas fa-blog mr-1"></i>Blog
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Ana Menü -->
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <img src="@/assets/logo.svg" alt="Logo" class="h-8 w-8" />
          <span class="text-xl font-bold">E-Ticaret</span>
        </router-link>

        <!-- Kategoriler -->
        <div class="hidden lg:flex lg:space-x-8">
          <div 
            v-for="category in categories"
            :key="category.id"
            class="group relative"
            @mouseenter="activeCategory = category.id"
            @mouseleave="activeCategory = null"
          >
            <!-- Kategori Başlığı -->
            <button class="flex items-center space-x-1 py-2">
              <span>{{ category.name }}</span>
              <i class="fas fa-chevron-down text-xs text-gray-500"></i>
            </button>

            <!-- Alt Kategoriler -->
            <div 
              v-if="category.subcategories"
              v-show="activeCategory === category.id"
              class="absolute left-0 top-full z-50 w-64 rounded-lg bg-white p-4 shadow-lg"
            >
              <router-link
                v-for="sub in category.subcategories"
                :key="sub.id"
                :to="`/kategori/${sub.slug}`"
                class="block rounded px-4 py-2 hover:bg-gray-100"
              >
                {{ sub.name }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Arama -->
        <div class="flex-1 max-w-xl mx-8">
          <SearchBar />
        </div>

        <!-- Sağ Menü -->
        <div class="flex items-center space-x-6">
          <!-- Hesap -->
          <div class="relative" v-click-outside="closeUserMenu">
            <button 
              @click="toggleUserMenu"
              class="flex items-center text-gray-700 hover:text-blue-600"
            >
              <i class="fas fa-user text-xl"></i>
              <span class="ml-2 hidden md:inline">Hesabım</span>
            </button>

            <!-- Kullanıcı Menüsü -->
            <div 
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <template v-if="isLoggedIn">
                <router-link 
                  to="/hesabim"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-user-circle mr-2"></i>Profilim
                </router-link>
                <router-link 
                  to="/siparislerim"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-box mr-2"></i>Siparişlerim
                </router-link>
                <router-link 
                  to="/favorilerim"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-heart mr-2"></i>Favorilerim
                </router-link>
                <button 
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>Çıkış Yap
                </button>
              </template>
              <template v-else>
                <router-link 
                  to="/giris"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-sign-in-alt mr-2"></i>Giriş Yap
                </router-link>
                <router-link 
                  to="/kayit"
                  class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  <i class="fas fa-user-plus mr-2"></i>Üye Ol
                </router-link>
              </template>
            </div>
          </div>

          <!-- Favoriler -->
          <router-link 
            to="/favorilerim"
            class="relative text-gray-700 hover:text-blue-600"
          >
            <i class="fas fa-heart text-xl"></i>
            <span 
              v-if="favoriteCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ favoriteCount }}
            </span>
          </router-link>

          <!-- Sepet -->
          <router-link 
            to="/sepet"
            class="relative text-gray-700 hover:text-blue-600"
          >
            <i class="fas fa-shopping-cart text-xl"></i>
            <span 
              v-if="cartItemCount > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Kategori Menüsü -->
      <div class="border-t">
        <ul class="flex space-x-8 py-4">
          <li v-for="category in categories" :key="category.id">
            <router-link 
              :to="`/kategori/${category.slug}`"
              class="text-gray-700 hover:text-blue-600"
            >
              {{ category.name }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import SearchBar from './SearchBar.vue'

export default {
  name: 'Navigation',
  components: {
    SearchBar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const showUserMenu = ref(false)
    const categories = ref([])

    const isLoggedIn = computed(() => store.getters['auth/isLoggedIn'])
    const cartItemCount = computed(() => store.getters['cart/itemCount'])
    const favoriteCount = computed(() => store.getters['favorites/count'])

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
    }

    const closeUserMenu = () => {
      showUserMenu.value = false
    }

    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/giris')
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Başarıyla çıkış yapıldı'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Çıkış yapılırken bir hata oluştu'
        })
      }
    }

    onMounted(async () => {
      try {
        const response = await store.dispatch('categories/getCategories')
        categories.value = response
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
      }
    })

    return {
      showUserMenu,
      categories,
      isLoggedIn,
      cartItemCount,
      favoriteCount,
      toggleUserMenu,
      closeUserMenu,
      logout
    }
  }
}
</script> 