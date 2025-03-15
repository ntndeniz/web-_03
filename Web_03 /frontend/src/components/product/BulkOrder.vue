<template>
  <div class="bulk-order">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Toplu Sipariş</h3>

    <!-- Ürün Listesi -->
    <div class="product-list space-y-4">
      <div v-for="(item, index) in orderItems" :key="index" class="product-item">
        <div class="grid grid-cols-12 gap-4 items-center">
          <!-- Ürün Seçimi -->
          <div class="col-span-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ürün</label>
            <select
              v-model="item.productId"
              class="product-select"
              @change="updateProduct(index)"
            >
              <option value="">Ürün Seçin</option>
              <option 
                v-for="product in availableProducts"
                :key="product.id"
                :value="product.id"
              >
                {{ product.name }}
              </option>
            </select>
          </div>

          <!-- Varyant Seçimi -->
          <div class="col-span-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Varyant</label>
            <select
              v-model="item.variantId"
              class="variant-select"
              :disabled="!item.productId"
            >
              <option value="">Varyant Seçin</option>
              <option 
                v-for="variant in getProductVariants(item.productId)"
                :key="variant.id"
                :value="variant.id"
              >
                {{ variant.name }}
              </option>
            </select>
          </div>

          <!-- Miktar -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Miktar</label>
            <input
              type="number"
              v-model.number="item.quantity"
              min="1"
              :max="getMaxQuantity(item.productId)"
              class="quantity-input"
              :disabled="!item.productId"
            >
          </div>

          <!-- Birim Fiyat -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Birim Fiyat</label>
            <p class="text-sm text-gray-900">
              {{ item.productId ? formatCurrency(getUnitPrice(item)) : '-' }}
            </p>
          </div>

          <!-- Silme Butonu -->
          <div class="col-span-1">
            <button 
              @click="removeItem(index)"
              class="delete-button"
              title="Ürünü Kaldır"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ürün Ekleme Butonu -->
    <button 
      @click="addItem"
      class="add-item-button mt-4"
    >
      <i class="fas fa-plus mr-2"></i>
      Yeni Ürün Ekle
    </button>

    <!-- Toplam ve Sipariş Butonu -->
    <div class="order-summary mt-8">
      <div class="flex justify-between items-center py-4 border-t border-gray-200">
        <span class="text-base font-medium text-gray-900">Toplam Tutar</span>
        <span class="text-2xl font-bold text-gray-900">{{ formatCurrency(totalAmount) }}</span>
      </div>

      <button 
        @click="submitOrder"
        class="submit-button mt-4"
        :disabled="!isValidOrder"
      >
        <i class="fas fa-shopping-cart mr-2"></i>
        Toplu Sipariş Ver
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'BulkOrder',

  props: {
    availableProducts: {
      type: Array,
      required: true
    },
    minOrderAmount: {
      type: Number,
      default: 1000
    }
  },

  emits: ['submit-order'],

  setup(props, { emit }) {
    const store = useStore()
    const orderItems = ref([{ productId: '', variantId: '', quantity: 1 }])

    const addItem = () => {
      orderItems.value.push({ productId: '', variantId: '', quantity: 1 })
    }

    const removeItem = (index) => {
      orderItems.value.splice(index, 1)
    }

    const updateProduct = (index) => {
      const item = orderItems.value[index]
      item.variantId = ''
      item.quantity = 1
    }

    const getProductVariants = (productId) => {
      const product = props.availableProducts.find(p => p.id === productId)
      return product ? product.variants : []
    }

    const getMaxQuantity = (productId) => {
      const product = props.availableProducts.find(p => p.id === productId)
      return product ? product.stockQuantity : 0
    }

    const getUnitPrice = (item) => {
      const product = props.availableProducts.find(p => p.id === item.productId)
      if (!product) return 0

      const variant = product.variants.find(v => v.id === item.variantId)
      return variant ? variant.price : product.price
    }

    const totalAmount = computed(() => {
      return orderItems.value.reduce((total, item) => {
        return total + (getUnitPrice(item) * item.quantity)
      }, 0)
    })

    const isValidOrder = computed(() => {
      return orderItems.value.length > 0 &&
             orderItems.value.every(item => item.productId && item.quantity > 0) &&
             totalAmount.value >= props.minOrderAmount
    })

    const submitOrder = () => {
      if (isValidOrder.value) {
        emit('submit-order', {
          items: orderItems.value,
          total: totalAmount.value
        })
      }
    }

    return {
      orderItems,
      addItem,
      removeItem,
      updateProduct,
      getProductVariants,
      getMaxQuantity,
      getUnitPrice,
      totalAmount,
      isValidOrder,
      submitOrder,
      formatCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
.bulk-order {
  @apply bg-white rounded-lg p-6;

  .product-item {
    @apply p-4 border border-gray-200 rounded-lg;
  }

  .product-select,
  .variant-select,
  .quantity-input {
    @apply mt-1 block w-full border-gray-300 rounded-md shadow-sm
           focus:ring-primary-500 focus:border-primary-500 sm:text-sm;
  }

  .delete-button {
    @apply p-2 text-gray-400 hover:text-red-500 focus:outline-none;
  }

  .add-item-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300
           rounded-md shadow-sm text-sm font-medium text-gray-700
           bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500;
  }

  .submit-button {
    @apply w-full flex items-center justify-center px-6 py-3 border border-transparent
           rounded-md shadow-sm text-base font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
</style> 