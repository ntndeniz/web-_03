<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h3 class="text-lg font-semibold mb-4">Avantajlı Paket</h3>

    <!-- Ürün Listesi -->
    <div class="space-y-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex items-center space-x-4"
      >
        <!-- Ürün Görseli -->
        <div class="w-16 h-16 flex-shrink-0">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-full object-cover rounded-md"
          />
        </div>

        <!-- Ürün Bilgileri -->
        <div class="flex-1">
          <h4 class="text-sm font-medium">{{ product.name }}</h4>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500 line-through">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span class="text-sm font-medium text-gray-900">
              {{ formatPrice(product.bundlePrice) }}
            </span>
          </div>
        </div>

        <!-- Seçim Checkbox -->
        <div>
          <input
            v-model="selectedProducts"
            :value="product.id"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Toplam ve İndirim -->
    <div class="mt-6 pt-6 border-t border-gray-200">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Normal Fiyat</span>
        <span class="text-gray-900">{{ formatPrice(originalTotal) }}</span>
      </div>
      <div class="flex justify-between text-sm mt-2">
        <span class="text-green-600">Paket İndirimi</span>
        <span class="text-green-600">-{{ formatPrice(discount) }}</span>
      </div>
      <div class="flex justify-between text-base font-medium mt-4">
        <span>Paket Fiyatı</span>
        <span>{{ formatPrice(bundleTotal) }}</span>
      </div>
    </div>

    <!-- Sepete Ekle -->
    <button
      @click="addToCart"
      :disabled="selectedProducts.length === 0 || loading"
      class="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <span v-if="!loading">Paketi Sepete Ekle</span>
      <i v-else class="fas fa-circle-notch fa-spin"></i>
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ProductBundle',

  props: {
    products: {
      type: Array,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const selectedProducts = ref([])
    const loading = ref(false)

    const originalTotal = computed(() => {
      return selectedProducts.value.reduce((total, productId) => {
        const product = props.products.find(p => p.id === productId)
        return total + (product ? product.originalPrice : 0)
      }, 0)
    })

    const bundleTotal = computed(() => {
      return selectedProducts.value.reduce((total, productId) => {
        const product = props.products.find(p => p.id === productId)
        return total + (product ? product.bundlePrice : 0)
      }, 0)
    })

    const discount = computed(() => {
      return originalTotal.value - bundleTotal.value
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const addToCart = async () => {
      if (selectedProducts.value.length === 0 || loading.value) return

      loading.value = true

      try {
        await store.dispatch('cart/addBundle', {
          productIds: selectedProducts.value,
          bundleId: props.bundleId
        })

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Paket sepete eklendi'
        })

        selectedProducts.value = []
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Paket sepete eklenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      selectedProducts,
      loading,
      originalTotal,
      bundleTotal,
      discount,
      formatPrice,
      addToCart
    }
  }
}
</script> 