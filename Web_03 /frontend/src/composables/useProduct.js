import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export function useProduct() {
  const store = useStore()
  const router = useRouter()

  const products = computed(() => store.getters['product/products'])
  const product = computed(() => store.getters['product/currentProduct'])
  const loading = computed(() => store.getters['product/loading'])
  const totalPages = computed(() => store.getters['product/totalPages'])
  const currentPage = computed(() => store.getters['product/currentPage'])

  const filters = ref({
    category: '',
    minPrice: null,
    maxPrice: null,
    sort: 'newest',
    search: '',
    page: 1,
    perPage: 12
  })

  const fetchProducts = async () => {
    try {
      await store.dispatch('product/fetchProducts', filters.value)
    } catch (error) {
      throw error
    }
  }

  const fetchProduct = async (productId) => {
    try {
      await store.dispatch('product/fetchProduct', productId)
    } catch (error) {
      router.push('/404')
      throw error
    }
  }

  const searchProducts = async (query) => {
    filters.value.search = query
    filters.value.page = 1
    await fetchProducts()
  }

  const filterProducts = async (newFilters) => {
    filters.value = { ...filters.value, ...newFilters, page: 1 }
    await fetchProducts()
  }

  const changePage = async (page) => {
    filters.value.page = page
    await fetchProducts()
  }

  const addReview = async (productId, review) => {
    try {
      await store.dispatch('product/addReview', { productId, review })
      store.dispatch('ui/showToast', {
        message: 'Değerlendirmeniz eklendi',
        type: 'success'
      })
    } catch (error) {
      store.dispatch('ui/showToast', {
        message: 'Değerlendirme eklenirken bir hata oluştu',
        type: 'error'
      })
      throw error
    }
  }

  return {
    products,
    product,
    loading,
    totalPages,
    currentPage,
    filters,
    fetchProducts,
    fetchProduct,
    searchProducts,
    filterProducts,
    changePage,
    addReview
  }
} 