<template>
  <div class="product-management">
    <div class="header-section mb-6">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">Ürün Yönetimi</h3>
        <button 
          class="add-product-button"
          @click="openAddProductModal"
        >
          <i class="fas fa-plus mr-2"></i>
          Yeni Ürün Ekle
        </button>
      </div>
    </div>

    <!-- Filtreler -->
    <div class="filters-section mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="filter-group">
          <label class="form-label">Kategori</label>
          <select 
            v-model="filters.category"
            class="form-select"
          >
            <option value="">Tümü</option>
            <option 
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="form-label">Stok Durumu</label>
          <select 
            v-model="filters.stock"
            class="form-select"
          >
            <option value="">Tümü</option>
            <option value="in-stock">Stokta</option>
            <option value="low-stock">Az Stok</option>
            <option value="out-of-stock">Tükendi</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="form-label">Durum</label>
          <select 
            v-model="filters.status"
            class="form-select"
          >
            <option value="">Tümü</option>
            <option value="active">Aktif</option>
            <option value="draft">Taslak</option>
            <option value="archived">Arşivlenmiş</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="form-label">Arama</label>
          <div class="relative">
            <input
              type="text"
              v-model="filters.search"
              class="form-input pl-10"
              placeholder="Ürün adı veya SKU..."
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Ürün Listesi -->
    <div class="products-list mb-6">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ürün
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiyat
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">İşlemler</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img 
                      :src="product.image" 
                      :alt="product.name"
                      class="h-10 w-10 rounded-lg object-cover"
                    >
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ product.category }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.sku }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStockClass(product.stock)" class="stock-badge">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(product.status)" class="status-badge">
                  {{ product.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  class="action-button text-primary-600 hover:text-primary-900"
                  @click="editProduct(product)"
                >
                  Düzenle
                </button>
                <button 
                  class="action-button text-red-600 hover:text-red-900 ml-4"
                  @click="deleteProduct(product.id)"
                >
                  Sil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sayfalama -->
    <div class="pagination flex items-center justify-between">
      <div class="flex items-center">
        <span class="text-sm text-gray-700">
          Sayfa <span class="font-medium">{{ pagination.currentPage }}</span> / {{ totalPages }}
        </span>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          class="pagination-button"
          :disabled="pagination.currentPage === 1"
          @click="prevPage"
        >
          Önceki
        </button>
        <button 
          class="pagination-button"
          :disabled="pagination.currentPage === totalPages"
          @click="nextPage"
        >
          Sonraki
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ProductManagement',
  
  setup() {
    const filters = ref({
      category: '',
      stock: '',
      status: '',
      search: ''
    })

    const pagination = ref({
      currentPage: 1,
      perPage: 10
    })

    // Diğer veri ve fonksiyonlar...

    return {
      filters,
      pagination,
      categories,
      filteredProducts,
      totalPages,
      formatCurrency,
      getStockClass,
      getStatusClass,
      editProduct,
      deleteProduct,
      openAddProductModal,
      prevPage,
      nextPage
    }
  }
}
</script>

<style lang="scss" scoped>
.product-management {
  @apply bg-white rounded-lg p-6;

  .add-product-button {
    @apply inline-flex items-center px-4 py-2 border border-transparent
           rounded-md shadow-sm text-sm font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500;
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-input,
  .form-select {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .stock-badge,
  .status-badge {
    @apply px-2 py-1 text-xs font-medium rounded-full;
  }

  .action-button {
    @apply text-sm font-medium focus:outline-none;
  }

  .pagination-button {
    @apply inline-flex items-center px-3 py-2 border border-gray-300
           rounded-md text-sm font-medium text-gray-700 bg-white
           hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
</style>