<template>
  <div class="product-management">
    <div class="header flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Ürün Yönetimi</h1>
      
      <button @click="openCreateModal" 
              class="btn-primary flex items-center">
        <i class="fas fa-plus mr-2"></i>
        Yeni Ürün
      </button>
    </div>

    <!-- Filtreler -->
    <div class="filters bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="form-group">
          <label>Arama</label>
          <input v-model="filters.search" 
                 type="text"
                 placeholder="Ürün adı veya SKU ara..."
                 class="form-input" />
        </div>
        
        <div class="form-group">
          <label>Kategori</label>
          <select v-model="filters.category" class="form-select">
            <option value="">Tümü</option>
            <option v-for="category in categories" 
                    :key="category.id" 
                    :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Stok Durumu</label>
          <select v-model="filters.stock" class="form-select">
            <option value="">Tümü</option>
            <option value="in_stock">Stokta</option>
            <option value="low_stock">Az Stok</option>
            <option value="out_of_stock">Stok Yok</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Sıralama</label>
          <select v-model="filters.sort" class="form-select">
            <option value="created_desc">Yeniden Eskiye</option>
            <option value="created_asc">Eskiden Yeniye</option>
            <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
            <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
            <option value="name_asc">İsim (A-Z)</option>
            <option value="name_desc">İsim (Z-A)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Ürün Tablosu -->
    <div class="products-table bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
              <input type="checkbox" 
                     v-model="selectAll"
                     @change="toggleSelectAll"
                     class="form-checkbox" />
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Ürün</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">SKU</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Fiyat</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Stok</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-4 py-3">
              <input type="checkbox"
                     v-model="selectedProducts"
                     :value="product.id"
                     class="form-checkbox" />
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center">
                <img :src="product.image" 
                     :alt="product.name"
                     class="w-10 h-10 rounded-lg mr-3" />
                <div>
                  <p class="text-sm font-medium">{{ product.name }}</p>
                  <p class="text-xs text-gray-500">{{ product.description }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">{{ product.sku }}</td>
            <td class="px-4 py-3 text-sm">{{ product.category }}</td>
            <td class="px-4 py-3 text-sm">{{ formatPrice(product.price) }}</td>
            <td class="px-4 py-3 text-sm">{{ product.stock }}</td>
            <td class="px-4 py-3">
              <span :class="['status-badge', product.status]">
                {{ product.statusText }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center space-x-2">
                <button @click="editProduct(product)"
                        class="btn-icon text-blue-600">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(product)"
                        class="btn-icon text-red-600">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500">
        Toplam {{ pagination.total }} üründen {{ startIndex }}-{{ endIndex }} arası gösteriliyor
      </div>
      
      <div class="flex items-center space-x-2">
        <button @click="prevPage"
                :disabled="pagination.currentPage === 1"
                class="btn-secondary">
          Önceki
        </button>
        
        <span class="text-sm">
          Sayfa {{ pagination.currentPage }} / {{ totalPages }}
        </span>
        
        <button @click="nextPage"
                :disabled="pagination.currentPage === totalPages"
                class="btn-secondary">
          Sonraki
        </button>
      </div>
    </div>

    <!-- Ürün Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEditing ? 'Ürün Düzenle' : 'Yeni Ürün' }}
      </template>
      
      <template #content>
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="form-group">
            <label>Ürün Adı</label>
            <input v-model="productForm.name" 
                   type="text"
                   required
                   class="form-input" />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>SKU</label>
              <input v-model="productForm.sku"
                     type="text"
                     required
                     class="form-input" />
            </div>
            
            <div class="form-group">
              <label>Barkod</label>
              <input v-model="productForm.barcode"
                     type="text"
                     class="form-input" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Açıklama</label>
            <textarea v-model="productForm.description"
                      rows="3"
                      class="form-textarea"></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>Kategori</label>
              <select v-model="productForm.category"
                      required
                      class="form-select">
                <option v-for="category in categories"
                        :key="category.id"
                        :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Marka</label>
              <select v-model="productForm.brand"
                      class="form-select">
                <option v-for="brand in brands"
                        :key="brand.id"
                        :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>Fiyat</label>
              <input v-model="productForm.price"
                     type="number"
                     step="0.01"
                     required
                     class="form-input" />
            </div>
            
            <div class="form-group">
              <label>Stok</label>
              <input v-model="productForm.stock"
                     type="number"
                     required
                     class="form-input" />
            </div>
          </div>
          
          <div class="form-group">
            <label>Durum</label>
            <select v-model="productForm.status"
                    required
                    class="form-select">
              <option value="active">Aktif</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşivlenmiş</option>
            </select>
          </div>
        </form>
      </template>
      
      <template #footer>
        <button @click="closeModal" 
                class="btn-secondary mr-2">
          İptal
        </button>
        <button @click="saveProduct" 
                class="btn-primary">
          {{ isEditing ? 'Güncelle' : 'Kaydet' }}
        </button>
      </template>
    </Modal>

    <!-- Silme Onay Modal -->
    <ConfirmModal v-if="showDeleteModal"
                 @confirm="deleteProduct"
                 @cancel="showDeleteModal = false">
      <template #title>Ürün Sil</template>
      <template #content>
        <p>{{ productToDelete.name }} ürününü silmek istediğinizden emin misiniz?</p>
        <p class="text-sm text-gray-500 mt-2">Bu işlem geri alınamaz.</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate, formatPrice } from '@/utils/formatters'
import Modal from '@/components/common/Modal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

export default {
  name: 'ProductManagement',

  components: {
    Modal,
    ConfirmModal
  },

  setup() {
    const store = useStore()
    const products = ref([])
    const categories = ref([])
    const brands = ref([])
    const selectedProducts = ref([])
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const productToDelete = ref(null)
    const isEditing = ref(false)
    
    const productForm = ref({
      name: '',
      sku: '',
      barcode: '',
      description: '',
      category: '',
      brand: '',
      price: 0,
      stock: 0,
      status: 'active'
    })

    const filters = ref({
      search: '',
      category: '',
      stock: '',
      sort: 'created_desc'
    })

    const pagination = ref({
      currentPage: 1,
      perPage: 10,
      total: 0
    })

    const loadProducts = async () => {
      try {
        const response = await store.dispatch('product/fetchProducts', {
          ...filters.value,
          page: pagination.value.currentPage,
          perPage: pagination.value.perPage
        })
        
        products.value = response.data
        pagination.value.total = response.total
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error)
      }
    }

    const loadCategories = async () => {
      try {
        categories.value = await store.dispatch('product/fetchCategories')
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
      }
    }

    const loadBrands = async () => {
      try {
        brands.value = await store.dispatch('product/fetchBrands')
      } catch (error) {
        console.error('Markalar yüklenirken hata:', error)
      }
    }

    const openCreateModal = () => {
      isEditing.value = false
      productForm.value = {
        name: '',
        sku: '',
        barcode: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        stock: 0,
        status: 'active'
      }
      showModal.value = true
    }

    const editProduct = (product) => {
      isEditing.value = true
      productForm.value = { ...product }
      showModal.value = true
    }

    const confirmDelete = (product) => {
      productToDelete.value = product
      showDeleteModal.value = true
    }

    const deleteProduct = async () => {
      try {
        await store.dispatch('product/deleteProduct', productToDelete.value.id)
        showDeleteModal.value = false
        loadProducts()
      } catch (error) {
        console.error('Ürün silinirken hata:', error)
      }
    }

    const saveProduct = async () => {
      try {
        if (isEditing.value) {
          await store.dispatch('product/updateProduct', productForm.value)
        } else {
          await store.dispatch('product/createProduct', productForm.value)
        }
        showModal.value = false
        loadProducts()
      } catch (error) {
        console.error('Ürün kaydedilirken hata:', error)
      }
    }

    const closeModal = () => {
      showModal.value = false
      productForm.value = {
        name: '',
        sku: '',
        barcode: '',
        description: '',
        category: '',
        brand: '',
        price: 0,
        stock: 0,
        status: 'active'
      }
    }

    const prevPage = () => {
      if (pagination.value.currentPage > 1) {
        pagination.value.currentPage--
      }
    }

    const nextPage = () => {
      if (pagination.value.currentPage < totalPages.value) {
        pagination.value.currentPage++
      }
    }

    const toggleSelectAll = (event) => {
      if (event.target.checked) {
        selectedProducts.value = products.value.map(product => product.id)
      } else {
        selectedProducts.value = []
      }
    }

    // Computed
    const totalPages = computed(() => {
      return Math.ceil(pagination.value.total / pagination.value.perPage)
    })

    const startIndex = computed(() => {
      return (pagination.value.currentPage - 1) * pagination.value.perPage + 1
    })

    const endIndex = computed(() => {
      return Math.min(
        startIndex.value + pagination.value.perPage - 1,
        pagination.value.total
      )
    })

    const selectAll = computed({
      get: () => {
        return products.value.length > 0 && 
               selectedProducts.value.length === products.value.length
      },
      set: () => {}
    })

    // Watchers
    watch(filters, () => {
      pagination.value.currentPage = 1
      loadProducts()
    })

    watch(() => pagination.value.currentPage, () => {
      loadProducts()
    })

    // Lifecycle
    onMounted(() => {
      loadProducts()
      loadCategories()
      loadBrands()
    })

    return {
      products,
      categories,
      brands,
      filters,
      pagination,
      selectedProducts,
      showModal,
      showDeleteModal,
      productToDelete,
      productForm,
      isEditing,
      totalPages,
      startIndex,
      endIndex,
      selectAll,
      formatDate,
      formatPrice,
      openCreateModal,
      editProduct,
      confirmDelete,
      deleteProduct,
      saveProduct,
      closeModal,
      prevPage,
      nextPage,
      toggleSelectAll
    }
  }
}
</script>

<style lang="scss" scoped>
.product-management {
  @apply p-6;

  .status-badge {
    @apply px-2 py-1 text-xs rounded-full;

    &.active { @apply bg-green-100 text-green-800; }
    &.draft { @apply bg-gray-100 text-gray-800; }
    &.archived { @apply bg-red-100 text-red-800; }
  }

  .btn-icon {
    @apply p-2 rounded-full hover:bg-gray-100 transition-colors;
  }
}
</style> 