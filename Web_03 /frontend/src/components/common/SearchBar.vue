<template>
  <div class="relative">
    <!-- Arama Formu -->
    <form @submit.prevent="handleSearch" class="relative">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Ürün, kategori veya marka ara..."
        class="w-full rounded-lg border bg-white px-4 py-2 pl-10 focus:border-blue-500 focus:outline-none"
        @focus="showResults = true"
        @blur="handleBlur"
      />
      <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      
      <!-- Temizle Butonu -->
      <button
        v-if="searchQuery"
        type="button"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <i class="fas fa-times"></i>
      </button>
    </form>

    <!-- Arama Sonuçları -->
    <div 
      v-if="showResults && (loading || results.length || searchQuery)"
      class="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border bg-white shadow-lg"
    >
      <!-- Yükleniyor -->
      <div v-if="loading" class="flex justify-center p-4">
        <LoadingSpinner size="sm" />
      </div>

      <!-- Sonuçlar -->
      <template v-else>
        <!-- Öneriler -->
        <div v-if="!searchQuery && suggestions.length" class="p-2">
          <div class="mb-2 px-2 text-sm font-medium text-gray-600">
            Popüler Aramalar
          </div>
          <button
            v-for="suggestion in suggestions"
            :key="suggestion"
            @click="selectSuggestion(suggestion)"
            class="block w-full rounded px-2 py-1.5 text-left hover:bg-gray-100"
          >
            {{ suggestion }}
          </button>
        </div>

        <!-- Arama Sonuçları -->
        <div v-else-if="searchQuery && results.length" class="divide-y">
          <router-link
            v-for="result in results"
            :key="result.id"
            :to="result.url"
            class="flex items-center space-x-4 p-3 hover:bg-gray-50"
            @click="showResults = false"
          >
            <!-- Ürün Görseli -->
            <img 
              :src="result.image" 
              :alt="result.name"
              class="h-12 w-12 rounded-md object-cover"
            />
            
            <div class="flex-1 overflow-hidden">
              <!-- Ürün Adı -->
              <div class="truncate font-medium">{{ result.name }}</div>
              
              <!-- Kategori -->
              <div class="text-sm text-gray-600">
                {{ result.category }}
              </div>
            </div>

            <!-- Fiyat -->
            <div class="text-right">
              <div class="font-medium text-blue-600">
                {{ formatPrice(result.price) }}
              </div>
              <div v-if="result.oldPrice" class="text-sm text-gray-500 line-through">
                {{ formatPrice(result.oldPrice) }}
              </div>
            </div>
          </router-link>
        </div>

        <!-- Sonuç Yok -->
        <div 
          v-else-if="searchQuery && !results.length" 
          class="p-4 text-center text-gray-600"
        >
          Aramanızla eşleşen sonuç bulunamadı.
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'
import LoadingSpinner from './LoadingSpinner.vue'

export default {
  name: 'SearchBar',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const searchQuery = ref('')
    const showResults = ref(false)
    const loading = ref(false)
    const results = ref([])
    const suggestions = ref([
      'Akıllı Telefon',
      'Laptop',
      'Tablet',
      'Kulaklık',
      'Akıllı Saat'
    ])

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const search = debounce(async () => {
      if (!searchQuery.value) {
        results.value = []
        loading.value = false
        return
      }

      loading.value = true
      try {
        results.value = await store.dispatch('search/searchProducts', searchQuery.value)
      } catch (error) {
        console.error('Arama hatası:', error)
      } finally {
        loading.value = false
      }
    }, 300)

    watch(searchQuery, search)

    const handleSearch = () => {
      if (searchQuery.value) {
        router.push(`/arama?q=${encodeURIComponent(searchQuery.value)}`)
        showResults.value = false
      }
    }

    const selectSuggestion = (suggestion) => {
      searchQuery.value = suggestion
      handleSearch()
    }

    const clearSearch = () => {
      searchQuery.value = ''
      results.value = []
    }

    const handleBlur = () => {
      setTimeout(() => {
        showResults.value = false
      }, 200)
    }

    return {
      searchQuery,
      showResults,
      loading,
      results,
      suggestions,
      formatPrice,
      handleSearch,
      selectSuggestion,
      clearSearch,
      handleBlur
    }
  }
}
</script> 