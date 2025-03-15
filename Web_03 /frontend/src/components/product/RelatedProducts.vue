<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Benzer Ürünler</h2>

    <!-- Ürün Slider -->
    <div class="relative">
      <!-- Önceki Buton -->
      <button 
        @click="previousSlide"
        class="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
        :disabled="currentSlide === 0"
      >
        <i class="fas fa-chevron-left text-gray-600"></i>
      </button>

      <!-- Ürün Listesi -->
      <div class="overflow-hidden">
        <div 
          class="flex transition-transform duration-300"
          :style="{ transform: `translateX(-${currentSlide * slideWidth}px)` }"
        >
          <div 
            v-for="product in products"
            :key="product.id"
            class="w-1/4 flex-shrink-0 px-2"
          >
            <div class="group relative rounded-lg border p-4 hover:shadow-lg">
              <!-- Favori Butonu -->
              <button 
                @click.stop="toggleFavorite(product.id)"
                class="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 hover:bg-white"
              >
                <i 
                  class="fas"
                  :class="product.isFavorite ? 'fa-heart text-red-500' : 'fa-heart text-gray-400'"
                ></i>
              </button>

              <!-- Ürün Görseli -->
              <router-link :to="`/product/${product.id}`">
                <img 
                  :src="product.image" 
                  :alt="product.name"
                  class="mx-auto h-48 w-48 object-cover"
                />
              </router-link>

              <!-- Ürün Bilgileri -->
              <div class="mt-4 text-center">
                <h3 class="text-sm font-medium">{{ product.name }}</h3>
                <div class="mt-2 space-x-2">
                  <span 
                    v-if="product.originalPrice"
                    class="text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                  <span class="text-lg font-bold text-blue-600">
                    {{ formatPrice(product.price) }}
                  </span>
                </div>
              </div>

              <!-- Sepete Ekle -->
              <button 
                @click="addToCart(product)"
                class="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm text-white opacity-0 transition-opacity hover:bg-blue-700 group-hover:opacity-100"
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sonraki Buton -->
      <button 
        @click="nextSlide"
        class="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-50"
        :disabled="currentSlide >= maxSlide"
      >
        <i class="fas fa-chevron-right text-gray-600"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'RelatedProducts',
  props: {
    currentProductId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const currentSlide = ref(0)
    const slideWidth = ref(0)

    const products = computed(() => 
      store.state.products.items.filter(product => 
        product.id !== props.currentProductId && 
        product.category === props.category
      ).slice(0, 8)
    )

    const maxSlide = computed(() => 
      Math.max(0, products.value.length - 4)
    )

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const previousSlide = () => {
      if (currentSlide.value > 0) {
        currentSlide.value--
      }
    }

    const nextSlide = () => {
      if (currentSlide.value < maxSlide.value) {
        currentSlide.value++
      }
    }

    const toggleFavorite = async (productId) => {
      try {
        await store.dispatch('products/toggleFavorite', productId)
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const addToCart = async (product) => {
      try {
        await store.dispatch('cart/addItem', {
          productId: product.id,
          quantity: 1
        })
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Ürün sepete eklendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Ürün eklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      slideWidth.value = document.querySelector('.w-1/4')?.offsetWidth || 0
      window.addEventListener('resize', () => {
        slideWidth.value = document.querySelector('.w-1/4')?.offsetWidth || 0
      })
    })

    return {
      currentSlide,
      products,
      maxSlide,
      formatPrice,
      previousSlide,
      nextSlide,
      toggleFavorite,
      addToCart
    }
  }
}
</script> 