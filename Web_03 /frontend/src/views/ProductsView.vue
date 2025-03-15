<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Başlık ve Filtre Seçenekleri -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 class="text-2xl font-bold mb-4 md:mb-0">Ürünlerimiz</h1>
      
      <div class="flex items-center space-x-4">
        <!-- Sıralama -->
        <select 
          v-model="sortBy"
          class="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">En Yeniler</option>
          <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
          <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
          <option value="name_asc">İsim (A-Z)</option>
          <option value="name_desc">İsim (Z-A)</option>
        </select>

        <!-- Grid/Liste Görünümü -->
        <div class="flex items-center space-x-2">
          <button 
            @click="viewMode = 'grid'"
            :class="{ 'text-blue-600': viewMode === 'grid' }"
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <i class="fas fa-grid-2 text-xl"></i>
          </button>
          <button 
            @click="viewMode = 'list'"
            :class="{ 'text-blue-600': viewMode === 'list' }"
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <i class="fas fa-list text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filtreler -->
      <aside class="w-full lg:w-64">
        <div class="bg-white rounded-lg shadow p-6 space-y-6">
          <!-- Kategori Filtresi -->
          <div>
            <h3 class="font-semibold mb-4">Kategoriler</h3>
            <div class="space-y-2">
              <label 
                v-for="category in categories" 
                :key="category.id"
                class="flex items-center"
              >
                <input 
                  type="checkbox"
                  v-model="selectedCategories"
                  :value="category.id"
                  class="rounded text-blue-600"
                >
                <span class="ml-2">{{ category.name }}</span>
              </label>
            </div>
          </div>

          <!-- Fiyat Aralığı -->
          <div>
            <h3 class="font-semibold mb-4">Fiyat Aralığı</h3>
            <div class="space-y-4">
              <input 
                type="range"
                v-model="priceRange"
                :min="0"
                :max="10000"
                class="w-full"
              >
              <div class="flex justify-between">
                <span>₺{{ priceRange[0] }}</span>
                <span>₺{{ priceRange[1] }}</span>
              </div>
            </div>
          </div>

          <!-- Diğer Filtreler -->
          <div>
            <h3 class="font-semibold mb-4">Özellikler</h3>
            <div class="space-y-2">
              <label class="flex items-center">
                <input 
                  type="checkbox"
                  v-model="filters.inStock"
                  class="rounded text-blue-600"
                >
                <span class="ml-2">Stokta Var</span>
              </label>
              <label class="flex items-center">
                <input 
                  type="checkbox"
                  v-model="filters.onSale"
                  class="rounded text-blue-600"
                >
                <span class="ml-2">İndirimli Ürünler</span>
              </label>
            </div>
          </div>

          <!-- Filtreleri Temizle -->
          <button 
            @click="clearFilters"
            class="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Filtreleri Temizle
          </button>
        </div>
      </aside>

      <!-- Ürün Listesi -->
      <main class="flex-1">
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>

        <div v-else-if="products.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
          <i class="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
          <h2 class="text-xl font-medium mb-2">Ürün Bulunamadı</h2>
          <p class="text-gray-500">Filtreleri değiştirerek tekrar deneyin.</p>
        </div>

        <div 
          v-else
          :class="[
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          ]"
        >
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            :view-mode="viewMode"
          />
        </div>

        <!-- Sayfalama -->
        <div v-if="totalPages > 1" class="mt-8">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @page-change="handlePageChange"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'
import Pagination from '@/components/common/Pagination.vue'

export default {
  name: 'ProductsView',

  components: {
    ProductCard,
    Pagination
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const viewMode = ref('grid')
    const sortBy = ref('newest')
    const currentPage = ref(1)
    const products = ref([])
    const totalPages = ref(1)
    const categories = ref([])
    const selectedCategories = ref([])
    const priceRange = ref([0, 10000])
    const filters = ref({
      inStock: false,
      onSale: false
    })

    // Ürünleri getir
    const fetchProducts = async () => {
      loading.value = true
      try {
        const response = await store.dispatch('product/fetchProducts', {
          page: currentPage.value,
          sortBy: sortBy.value,
          categories: selectedCategories.value,
          priceRange: priceRange.value,
          ...filters.value
        })
        products.value = response.products
        totalPages.value = response.totalPages
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Ürünler yüklenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    // Kategorileri getir
    const fetchCategories = async () => {
      try {
        categories.value = await store.dispatch('category/fetchCategories')
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Kategoriler yüklenirken bir hata oluştu'
        })
      }
    }

    // Sayfa değişimi
    const handlePageChange = (page) => {
      currentPage.value = page
      fetchProducts()
    }

    // Filtreleri temizle
    const clearFilters = () => {
      selectedCategories.value = []
      priceRange.value = [0, 10000]
      filters.value = {
        inStock: false,
        onSale: false
      }
      currentPage.value = 1
      fetchProducts()
    }

    // Filtreleri izle
    watch([sortBy, selectedCategories, priceRange, filters], () => {
      currentPage.value = 1
      fetchProducts()
    })

    onMounted(() => {
      fetchCategories()
      fetchProducts()
    })

    return {
      loading,
      viewMode,
      sortBy,
      currentPage,
      totalPages,
      products,
      categories,
      selectedCategories,
      priceRange,
      filters,
      handlePageChange,
      clearFilters
    }
  }
}
</script> 