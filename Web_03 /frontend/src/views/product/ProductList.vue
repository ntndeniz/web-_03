<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <ProductHeroSection 
      title="Ürünlerimiz"
      description="En yeni ve en kaliteli ürünlerimizi keşfedin"
    />

    <!-- Filters -->
    <ProductFilter
      v-model:search="searchQuery"
      v-model:category="selectedCategory"
      v-model:sort="sortBy"
      :categories="categories"
    />

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <!-- Empty State -->
    <ProductEmptyState 
      v-if="!filteredProducts.length"
      message="Ürün bulunamadı"
      description="Arama kriterlerinize uygun ürün bulunamadı."
    />

    <!-- Pagination -->
    <BasePagination
      v-if="filteredProducts.length"
      :total="totalPages"
      v-model:current="currentPage"
      class="mt-8"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import ProductHeroSection from '@/components/product/ProductHeroSection.vue'
import ProductFilter from '@/components/product/ProductFilter.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductEmptyState from '@/components/common/ProductEmptyState.vue'
import BasePagination from '@/components/common/BasePagination.vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ProductList',
  components: {
    ProductHeroSection,
    ProductFilter,
    ProductCard,
    ProductEmptyState,
    BasePagination
  },
  setup() {
    const store = useStore()
    const toast = useToast()

    // State
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const sortBy = ref('newest')
    const currentPage = ref(1)
    const itemsPerPage = 12

    // Computed
    const filteredProducts = computed(() => {
      return store.getters['products/getFilteredProducts']({
        search: searchQuery.value,
        category: selectedCategory.value,
        sort: sortBy.value,
        page: currentPage.value,
        limit: itemsPerPage
      })
    })

    const totalPages = computed(() => 
      Math.ceil(store.getters['products/getTotalCount'] / itemsPerPage)
    )

    const categories = computed(() => 
      store.getters['categories/getAllCategories']
    )

    // Methods
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

    // Fetch initial data
    store.dispatch('products/fetchProducts')
    store.dispatch('categories/fetchCategories')

    return {
      searchQuery,
      selectedCategory,
      sortBy,
      currentPage,
      filteredProducts,
      totalPages,
      categories,
      addToCart,
      toggleFavorite
    }
  }
}
</script> 