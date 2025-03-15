<template>
  <Modal v-model="isOpen" maxWidth="4xl">
    <div class="product-quick-view">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Sol Kısım: Ürün Görseli -->
        <div class="product-image">
          <img :src="selectedImage" :alt="product.name" class="w-full h-auto object-cover rounded-lg">
          <div class="thumbnail-list mt-4 flex space-x-2">
            <button 
              v-for="(image, index) in product.images" 
              :key="index"
              class="thumbnail-item"
              :class="{ 'ring-2 ring-primary-500': selectedImage === image }"
              @click="selectedImage = image"
            >
              <img :src="image" :alt="`${product.name} - ${index + 1}`" class="w-16 h-16 object-cover rounded">
            </button>
          </div>
        </div>

        <!-- Sağ Kısım: Ürün Bilgileri -->
        <div class="product-info">
          <h2 class="text-2xl font-bold text-gray-900">{{ product.name }}</h2>
          <div class="mt-4 flex items-center">
            <div class="flex items-center">
              <StarRating :rating="product.rating" readonly />
              <span class="ml-2 text-sm text-gray-500">({{ product.reviewCount }} değerlendirme)</span>
            </div>
          </div>

          <div class="mt-4">
            <p class="text-3xl text-gray-900">{{ formatCurrency(product.price) }}</p>
            <p v-if="product.oldPrice" class="mt-1">
              <span class="text-sm text-gray-500 line-through">{{ formatCurrency(product.oldPrice) }}</span>
              <span class="ml-2 text-sm text-red-500">{{ calculateDiscount(product.price, product.oldPrice) }}% indirim</span>
            </p>
          </div>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-900">Açıklama</h3>
            <p class="mt-2 text-sm text-gray-500">{{ product.description }}</p>
          </div>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-900">Özellikler</h3>
            <ul class="mt-2 space-y-2">
              <li v-for="(feature, index) in product.features" :key="index" class="text-sm text-gray-500">
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="mt-8">
            <div class="flex items-center">
              <label for="quantity" class="mr-4 text-sm font-medium text-gray-700">Adet</label>
              <div class="quantity-selector">
                <button @click="decrementQuantity" :disabled="quantity <= 1">-</button>
                <input type="number" v-model.number="quantity" min="1" :max="product.stockQuantity">
                <button @click="incrementQuantity" :disabled="quantity >= product.stockQuantity">+</button>
              </div>
            </div>

            <div class="mt-4 flex space-x-4">
              <button 
                @click="addToCart"
                class="add-to-cart-button"
                :disabled="!product.inStock"
              >
                <i class="fas fa-shopping-cart mr-2"></i>
                Sepete Ekle
              </button>
              <button 
                @click="toggleFavorite"
                class="favorite-button"
              >
                <i :class="['mr-2', isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart']"></i>
                Favorilere Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import Modal from '@/components/common/Modal.vue'
import StarRating from '@/components/common/StarRating.vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'ProductQuickView',

  components: {
    Modal,
    StarRating
  },

  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object,
      required: true
    }
  },

  emits: ['update:isOpen', 'add-to-cart'],

  setup(props, { emit }) {
    const store = useStore()
    const quantity = ref(1)
    const selectedImage = ref(props.product.images[0])

    const isFavorite = computed(() => {
      return store.getters['user/isFavorite'](props.product.id)
    })

    const incrementQuantity = () => {
      if (quantity.value < props.product.stockQuantity) {
        quantity.value++
      }
    }

    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = () => {
      emit('add-to-cart', {
        productId: props.product.id,
        quantity: quantity.value
      })
    }

    const toggleFavorite = () => {
      store.dispatch('user/toggleFavorite', props.product.id)
    }

    const calculateDiscount = (currentPrice, oldPrice) => {
      return Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    }

    return {
      quantity,
      selectedImage,
      isFavorite,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      toggleFavorite,
      calculateDiscount,
      formatCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
.product-quick-view {
  @apply p-6;

  .quantity-selector {
    @apply flex items-center border border-gray-300 rounded-md;

    button {
      @apply px-3 py-1 text-gray-600 hover:bg-gray-100;
    }

    input {
      @apply w-16 text-center border-x border-gray-300;
    }
  }

  .add-to-cart-button {
    @apply flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent
           rounded-md shadow-sm text-base font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .favorite-button {
    @apply flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300
           rounded-md shadow-sm text-base font-medium text-gray-700 bg-white
           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500;
  }
}
</style> 