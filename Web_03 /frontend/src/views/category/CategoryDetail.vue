<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Category Header -->
    <div v-if="category" class="bg-gray-900 rounded-xl mb-8 relative overflow-hidden">
      <div class="relative py-16 px-8">
        <h1 class="text-4xl font-bold text-white mb-4">{{ category.name }}</h1>
        <p class="text-gray-300 text-lg max-w-2xl">
          {{ category.description }}
        </p>
        <div class="mt-4 text-gray-400">
          {{ category.productCount }} Ürün
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex-1">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Bu kategoride ara..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>
        <div class="flex gap-4">
          <select 
            v-model="sortBy"
            class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">En Yeni</option>
            <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
            <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <!-- Empty State -->
    <div 
      v-if="!filteredProducts.length" 
      class="text-center py-12"
    >
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900">Ürün Bulunamadı</h3>
      <p class="mt-1 text-gray-500">Bu kategoride ürün bulunmamaktadır.</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredProducts.length" class="mt-8">
      <BasePagination
        :total="totalPages"
        v-model:current="currentPage"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/product/ProductCard.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'CategoryDetail',
  components: {
    ProductCard,
    BasePagination
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const toast = useToast()

    const searchQuery = ref('')
    const sortBy = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 12

    const category = computed(() => 
      store.getters['categories/getCategoryById'](route.params.id)
    )

    const filteredProducts = computed(() => 
      store.getters['products/getFilteredProducts']({
        categoryId: route.params.id,
        search: searchQuery.value,
        sort: sortBy.value,
        page: currentPage.value,
        limit: itemsPerPage
      })
    )

    const totalPages = computed(() => 
      Math.ceil(store.getters['products/getTotalCount'] / itemsPerPage)
    )

    const addToCart = async (product) => {
      try {
        await store.dispatch('cart/addItem', product)
        toast.success('Ürün sepete eklendi')
      } catch (error) {
        toast.error('Ürün eklenirken bir hata oluştu')
      }
    }

    const toggleFavorite = async (product) => {
      try {
        await store.dispatch('favorites/toggle', product)
        toast.success(product.isFavorite ? 'Favorilere eklendi' : 'Favorilerden çıkarıldı')
      } catch (error) {
        toast.error('İşlem sırasında bir hata oluştu')
      }
    }

    onMounted(() => {
      store.dispatch('products/fetchProducts', { categoryId: route.params.id })
    })

    return {
      category,
      searchQuery,
      sortBy,
      currentPage,
      filteredProducts,
      totalPages,
      addToCart,
      toggleFavorite
    }
  }
}
</script> 