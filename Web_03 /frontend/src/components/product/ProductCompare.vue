<template>
  <div class="product-compare">
    <!-- Karşılaştırma Tablosu -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Özellikler
            </th>
            <th v-for="product in products" :key="product.id" scope="col" class="px-6 py-3 text-left">
              <div class="relative">
                <img :src="product.image" :alt="product.name" class="w-24 h-24 object-cover mx-auto mb-2">
                <h3 class="text-sm font-medium text-gray-900">{{ product.name }}</h3>
                <p class="text-sm text-gray-500">{{ formatCurrency(product.price) }}</p>
                <button 
                  @click="removeProduct(product.id)"
                  class="absolute -top-2 -right-2 text-gray-400 hover:text-red-500"
                >
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="feature in features" :key="feature.name">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">
              {{ feature.name }}
            </td>
            <td v-for="product in products" :key="product.id" class="px-6 py-4 text-sm text-gray-500">
              {{ getFeatureValue(product, feature.key) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Karşılaştırma Kontrolleri -->
    <div class="mt-6 flex justify-between items-center">
      <button 
        v-if="products.length < maxProducts"
        @click="$emit('add-product')"
        class="add-button"
      >
        <i class="fas fa-plus mr-2"></i>
        Ürün Ekle
      </button>
      <button 
        v-if="products.length > 0"
        @click="clearAll"
        class="clear-button"
      >
        <i class="fas fa-trash-alt mr-2"></i>
        Tümünü Temizle
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'ProductCompare',

  props: {
    products: {
      type: Array,
      required: true
    },
    maxProducts: {
      type: Number,
      default: 4
    }
  },

  emits: ['remove-product', 'add-product', 'clear-all'],

  setup(props, { emit }) {
    const store = useStore()
    const features = ref([
      { name: 'Marka', key: 'brand' },
      { name: 'Model', key: 'model' },
      { name: 'Stok Durumu', key: 'stockStatus' },
      { name: 'Değerlendirme', key: 'rating' },
      { name: 'Garanti', key: 'warranty' }
    ])

    const getFeatureValue = (product, key) => {
      return product[key] || '-'
    }

    const removeProduct = (productId) => {
      emit('remove-product', productId)
    }

    const clearAll = () => {
      emit('clear-all')
    }

    return {
      features,
      getFeatureValue,
      removeProduct,
      clearAll,
      formatCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
.product-compare {
  @apply bg-white rounded-lg shadow p-6;

  table {
    @apply border-collapse table-fixed;
  }

  th, td {
    @apply border border-gray-200;
  }

  .add-button {
    @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md
           shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }

  .clear-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md
           shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }
}
</style> 