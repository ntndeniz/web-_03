<template>
  <nav 
    class="fixed w-full z-50 transition-all duration-300"
    :class="[
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/80 backdrop-blur-lg',
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    ]"
  >
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center" :class="isScrolled ? 'h-14' : 'h-16'">
        <router-link 
          to="/" 
          class="text-xl font-bold transition-all duration-300 text-primary-500"
          :class="isScrolled ? 'scale-90' : ''"
        >
          Logo
        </router-link>
        
        <div class="hidden md:flex space-x-8">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="text-gray-700 hover:text-primary-500 transition-colors"
          >
            {{ item.name }}
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <button 
            @click="toggleSearch"
            class="p-2 hover:bg-primary-50 rounded-full text-primary-500 transition-transform duration-300"
            :class="isScrolled ? 'scale-90' : ''"
          >
            <i class="fas fa-search"></i>
          </button>
          
          <button 
            @click="toggleCart"
            class="relative p-2 hover:bg-primary-50 rounded-full transition-transform duration-300"
            :class="isScrolled ? 'scale-90' : ''"
          >
            <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <div 
              v-if="cartItemCount > 0"
              class="absolute -top-1 -right-1 bg-gold-400 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-1"
            >
              {{ cartItemCount }}
            </div>
          </button>
          
          <router-link 
            to="/login"
            class="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-all duration-300"
            :class="isScrolled ? 'scale-90' : ''"
          >
            <i class="fas fa-user"></i>
            <span>Giriş Yap</span>
          </router-link>
        </div>
      </div>
    </div>

    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div 
        v-if="isSearchOpen"
        class="absolute inset-x-0 top-full bg-white shadow-lg border-t border-gray-100 p-4 z-50"
      >
        <div class="container mx-auto">
          <div class="relative max-w-2xl mx-auto">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ürün, kategori veya marka ara..."
              class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              @focus="showSearchResults = true"
              ref="searchInput"
            >
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i class="fas fa-search"></i>
            </div>
            <button 
              @click="closeSearch"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-times"></i>
            </button>

            <div 
              v-if="showSearchResults && (filteredResults.length > 0 || recentSearches.length > 0)"
              class="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100"
            >
              <div class="p-2">
                <div v-if="recentSearches.length > 0" class="mb-4">
                  <div class="px-3 py-2 text-sm font-semibold text-gray-500">Son Aramalar</div>
                  <div 
                    v-for="search in recentSearches.slice(0, 3)" 
                    :key="search"
                    class="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    @click="handleRecentSearch(search)"
                  >
                    <i class="fas fa-history text-gray-400 mr-3"></i>
                    <span>{{ search }}</span>
                  </div>
                </div>

                <div v-if="filteredResults.length > 0">
                  <div class="px-3 py-2 text-sm font-semibold text-gray-500">Önerilen Ürünler</div>
                  <div 
                    v-for="result in filteredResults" 
                    :key="result.id"
                    class="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    @click="handleProductClick(result)"
                  >
                    <img 
                      :src="result.image" 
                      :alt="result.name"
                      class="w-10 h-10 object-cover rounded-lg mr-3"
                    >
                    <div>
                      <div class="font-medium">{{ result.name }}</div>
                      <div class="text-sm text-gray-500">{{ formatPrice(result.price) }} TL</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSearchOpen"
        class="fixed inset-0 bg-black bg-opacity-25 z-40"
        @click="closeSearch"
      ></div>
    </transition>

    <transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div 
        v-if="isCartOpen"
        class="fixed inset-0 z-50 overflow-hidden"
        @click.self="closeCart"
      >
        <div class="absolute inset-0 bg-black bg-opacity-50"></div>
        
        <div class="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl">
          <div class="flex flex-col h-full">
            <div class="p-4 border-b flex justify-between items-center">
              <h2 class="text-lg font-semibold">Sepetim ({{ cartItemCount }})</h2>
              <button 
                @click="closeCart"
                class="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4">
              <div v-if="cartItems.length === 0" class="text-center py-8">
                <p class="text-gray-500">Sepetiniz boş</p>
              </div>
              
              <div 
                v-else
                class="space-y-4"
              >
                <div 
                  v-for="item in cartItems" 
                  :key="item.id"
                  class="flex items-center space-x-4 bg-white rounded-lg p-2"
                >
                  <img 
                    :src="item.image" 
                    :alt="item.name"
                    class="w-20 h-20 object-cover rounded"
                  >
                  <div class="flex-1">
                    <h3 class="font-medium">{{ item.name }}</h3>
                    <p class="text-sm text-gray-500">{{ formatPrice(item.price) }} TL</p>
                    <div class="flex items-center mt-2">
                      <button 
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        class="p-1 hover:bg-gray-100 rounded"
                        :disabled="item.quantity <= 1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                      </button>
                      <span class="mx-2">{{ item.quantity }}</span>
                      <button 
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button 
                    @click="removeFromCart(item.id)"
                    class="p-2 hover:bg-gray-100 rounded-full text-red-500"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="border-t p-4 space-y-4">
              <div class="flex justify-between items-center">
                <span class="font-medium">Toplam:</span>
                <span class="font-bold text-lg">{{ formatPrice(cartTotal) }} TL</span>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <router-link 
                  to="/cart"
                  @click="closeCart"
                  class="bg-gray-100 text-gray-800 py-2 px-4 rounded-lg text-center hover:bg-gray-200 transition-colors"
                >
                  Sepete Git
                </router-link>
                <router-link 
                  to="/checkout"
                  @click="closeCart"
                  class="bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Ödeme Yap
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>

  <!-- Navbar Spacer -->
  <div :class="isScrolled ? 'h-14' : 'h-16'"></div>
</template>


<script>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'TheNavbar',  // Bileşen adını değiştirdik
  
  setup() {
    const store = useStore()
    const router = useRouter()
    const isCartOpen = ref(false)
    const isSearchOpen = ref(false)
    const searchQuery = ref('')
    const showSearchResults = ref(false)
    const searchInput = ref(null)
    const recentSearches = ref(['iPhone 14 Pro', 'MacBook Air', 'AirPods Pro'])
    const isScrolled = ref(false)
    const showNavbar = ref(true)
    const lastScrollPosition = ref(0)
    const scrollThreshold = 50

    const navItems = [
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Ürünler', path: '/products' },
      { name: 'Hakkımızda', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Kampanyalar', path: '/campaigns' },
      { name: 'İletişim', path: '/contact' }
    ]

    const cartItems = computed(() => store.getters['cart/cartItems'])
    const cartItemCount = computed(() => store.getters['cart/cartCount'])
    const cartTotal = computed(() => store.getters['cart/cartTotal'])

    const sampleProducts = [
      {
        id: 1,
        name: 'iPhone 14 Pro',
        price: 49999.99,
        image: 'https://images.unsplash.com/photo-1678652197831-2c776e1fef5c'
      },
      {
        id: 2,
        name: 'MacBook Air M2',
        price: 39999.99,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4'
      },
      {
        id: 3,
        name: 'AirPods Pro',
        price: 5999.99,
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434'
      }
    ]

    const filteredResults = computed(() => {
      if (!searchQuery.value) return []
      return sampleProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const handleSearchBlur = () => {
      setTimeout(() => {
        showSearchResults.value = false
      }, 200)
    }

    const handleRecentSearch = (search) => {
      searchQuery.value = search
      router.push({ 
        path: '/products',
        query: { search: search }
      })
    }

    const handleProductClick = (product) => {
      router.push(`/products/${product.id}`)
      showSearchResults.value = false
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR').format(price)
    }

    const toggleCart = () => {
      isCartOpen.value = !isCartOpen.value
    }

    const closeCart = () => {
      isCartOpen.value = false
    }

    const updateQuantity = (productId, quantity) => {
      if (quantity < 1) return
      store.dispatch('cart/updateQuantity', { productId, quantity })
    }

    const removeFromCart = (productId) => {
      store.dispatch('cart/removeFromCart', productId)
    }

    const toggleSearch = async () => {
      isSearchOpen.value = !isSearchOpen.value
      if (isSearchOpen.value) {
        await nextTick()
        searchInput.value?.focus()
      }
    }

    const closeSearch = () => {
      isSearchOpen.value = false
      showSearchResults.value = false
      searchQuery.value = ''
    }

    // Scroll olayını dinle
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY
      
      // Scroll pozisyonuna göre navbar'ın görünümünü güncelle
      isScrolled.value = currentScrollPosition > scrollThreshold

      // Scroll yönünü belirle ve navbar'ı göster/gizle
      if (currentScrollPosition < scrollThreshold) {
        // En üstte her zaman göster
        showNavbar.value = true
      } else if (currentScrollPosition > lastScrollPosition.value) {
        // Aşağı scroll yapılıyorsa göster
        showNavbar.value = true
      } else {
        // Yukarı scroll yapılıyorsa gizle
        showNavbar.value = false
      }

      lastScrollPosition.value = currentScrollPosition
    }

    // Component mount edildiğinde scroll listener'ı ekle
    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    // Component unmount edildiğinde scroll listener'ı kaldır
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      navItems,
      cartItems,
      cartItemCount,
      cartTotal,
      isCartOpen,
      isSearchOpen,
      searchQuery,
      showSearchResults,
      searchInput,
      recentSearches,
      filteredResults,
      formatPrice,
      handleSearchBlur,
      handleRecentSearch,
      handleProductClick,
      toggleCart,
      closeCart,
      updateQuantity,
      removeFromCart,
      toggleSearch,
      closeSearch,
      isScrolled,
      showNavbar
    }
  }
}
</script>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.router-link-active {
  color: #8a56f1; /* primary-500 */
}
</style>