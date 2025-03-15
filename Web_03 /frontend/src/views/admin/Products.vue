<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold">Ürünler</h1>

        <!-- Filtreler ve Arama -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Kategori Filtresi -->
          <select 
            v-model="filters.category"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="">Tüm Kategoriler</option>
            <option 
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>

          <!-- Stok Durumu -->
          <select 
            v-model="filters.stock"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="">Tüm Stok Durumları</option>
            <option value="in_stock">Stokta Var</option>
            <option value="low_stock">Stok Az</option>
            <option value="out_of_stock">Stokta Yok</option>
          </select>

          <!-- Arama -->
          <div class="relative">
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Ürün Ara..."
              class="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>

          <!-- Yeni Ürün Ekle -->
          <button 
            @click="showNewProductForm = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <span class="material-icons">add</span>
            Yeni Ürün
          </button>
        </div>
      </div>
    </div>

    <!-- Ürün Listesi -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="p-4 font-medium">Ürün</th>
            <th class="p-4 font-medium">Kategori</th>
            <th class="p-4 font-medium">Fiyat</th>
            <th class="p-4 font-medium">Stok</th>
            <th class="p-4 font-medium">Durum</th>
            <th class="p-4 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr 
            v-for="product in filteredProducts" 
            :key="product.id"
            class="hover:bg-gray-50"
          >
            <td class="p-4">
              <div class="flex items-center gap-3">
                <img 
                  :src="product.image" 
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-sm text-gray-600">SKU: {{ product.sku }}</div>
                </div>
              </div>
            </td>
            <td class="p-4">
              {{ getCategoryName(product.categoryId) }}
            </td>
            <td class="p-4">
              <div class="font-medium">{{ formatPrice(product.price) }}</div>
              <div v-if="product.discount" class="text-sm text-green-600">
                {{ product.discount }}% indirim
              </div>
            </td>
            <td class="p-4">
              <div 
                class="font-medium"
                :class="getStockClass(product.stock)"
              >
                {{ product.stock }} adet
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="product.active ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                {{ product.active ? 'Aktif' : 'Pasif' }}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="editProduct(product)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <span class="material-icons">edit</span>
                </button>
                <button 
                  @click="toggleProductStatus(product)"
                  class="p-1.5 hover:bg-gray-100 rounded"
                  :class="product.active ? 'text-red-600' : 'text-green-600'"
                >
                  <span class="material-icons">
                    {{ product.active ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
                <button 
                  @click="deleteProduct(product)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sayfalama -->
    <div class="p-4 border-t">
      <div class="flex items-center justify-between">
        <div class="text-gray-600">
          Toplam {{ totalProducts }} ürün
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <span>Sayfa {{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Ürün Formu Modal -->
    <Modal 
      v-if="showNewProductForm || editingProduct"
      @close="cancelProductForm"
    >
      <template #title>
        {{ editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}
      </template>
      <template #content>
        <ProductForm 
          :initial-product="editingProduct"
          @save="saveProduct"
          @cancel="cancelProductForm"
        />
      </template>
    </Modal>

    <!-- Silme Onay Modal -->
    <Modal v-if="productToDelete" @close="productToDelete = null">
      <template #title>
        Ürün Silinecek
      </template>
      <template #content>
        <div class="p-4">
          <p class="mb-4">
            "{{ productToDelete.name }}" ürününü silmek istediğinize emin misiniz?
          </p>
          <div class="flex justify-end gap-4">
            <button 
              @click="productToDelete = null"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'
import ProductForm from '@/components/admin/ProductForm.vue'

export default {
  name: 'AdminProducts',
  components: {
    Modal,
    ProductForm
  },
  data() {
    return {
      filters: {
        search: '',
        category: '',
        stock: ''
      },
      currentPage: 1,
      showNewProductForm: false,
      editingProduct: null,
      productToDelete: null
    }
  },
  computed: {
    products() {
      return this.$store.state.admin.products
    },
    categories() {
      return this.$store.state.categories.items
    },
    totalProducts() {
      return this.$store.state.admin.totalProducts
    },
    totalPages() {
      return Math.ceil(this.totalProducts / 20)
    },
    filteredProducts() {
      let filtered = [...this.products]

      // Arama filtresi
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(search) ||
          product.sku.toLowerCase().includes(search)
        )
      }

      // Kategori filtresi
      if (this.filters.category) {
        filtered = filtered.filter(product => 
          product.categoryId === this.filters.category
        )
      }

      // Stok filtresi
      if (this.filters.stock) {
        filtered = filtered.filter(product => {
          switch (this.filters.stock) {
            case 'in_stock':
              return product.stock > 10
            case 'low_stock':
              return product.stock > 0 && product.stock <= 10
            case 'out_of_stock':
              return product.stock === 0
            default:
              return true
          }
        })
      }

      return filtered
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : ''
    },
    getStockClass(stock) {
      if (stock === 0) return 'text-red-600'
      if (stock <= 10) return 'text-yellow-600'
      return 'text-green-600'
    },
    editProduct(product) {
      this.editingProduct = { ...product }
    },
    async toggleProductStatus(product) {
      try {
        await this.$store.dispatch('admin/toggleProductStatus', product.id)
        this.$toast.success(
          product.active ? 'Ürün pasife alındı' : 'Ürün aktife alındı'
        )
      } catch (error) {
        this.$toast.error('Ürün durumu güncellenirken bir hata oluştu')
      }
    },
    deleteProduct(product) {
      this.productToDelete = product
    },
    async confirmDelete() {
      try {
        await this.$store.dispatch('admin/deleteProduct', this.productToDelete.id)
        this.$toast.success('Ürün başarıyla silindi')
        this.productToDelete = null
      } catch (error) {
        this.$toast.error('Ürün silinirken bir hata oluştu')
      }
    },
    async saveProduct(productData) {
      try {
        if (this.editingProduct) {
          await this.$store.dispatch('admin/updateProduct', {
            id: this.editingProduct.id,
            ...productData
          })
          this.$toast.success('Ürün başarıyla güncellendi')
        } else {
          await this.$store.dispatch('admin/createProduct', productData)
          this.$toast.success('Ürün başarıyla eklendi')
        }
        this.cancelProductForm()
      } catch (error) {
        this.$toast.error('Ürün kaydedilirken bir hata oluştu')
      }
    },
    cancelProductForm() {
      this.showNewProductForm = false
      this.editingProduct = null
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchProducts()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchProducts()
      }
    },
    async fetchProducts() {
      try {
        await this.$store.dispatch('admin/fetchProducts', {
          page: this.currentPage,
          ...this.filters
        })
      } catch (error) {
        this.$toast.error('Ürünler yüklenirken bir hata oluştu')
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.fetchProducts()
      }
    }
  },
  created() {
    this.fetchProducts()
    this.$store.dispatch('categories/fetchCategories')
  }
}
</script> 