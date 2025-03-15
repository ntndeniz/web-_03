<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <!-- Başlık -->
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold">Önerilen Ürünler</h2>
        <p class="mt-2 text-gray-600">Bu ürünler ilginizi çekebilir</p>
      </div>

      <!-- Yükleniyor -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Ürün Listesi -->
      <div 
        v-else-if="products.length"
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div 
          v-for="product in products" 
          :key="product.id"
          class="group relative rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <!-- Ürün Görseli -->
          <div class="relative mb-4 aspect-square overflow-hidden rounded-lg">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="h-full w-full object-cover transition group-hover:scale-105"
            />
            
            <!-- İndirim Etiketi -->
            <div 
              v-if="product.discount"
              class="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-sm text-white"
            >
              %{{ product.discount }}
            </div>
          </div>

          <!-- Ürün Bilgileri -->
          <div class="space-y-2">
            <h3 class="font-medium">{{ product.name }}</h3>
            
            <div class="flex items-baseline space-x-2">
              <span class="text-lg font-bold text-blue-600">
                {{ formatPrice(product.price) }}
              </span>
              <span 
                v-if="product.oldPrice"
                class="text-sm text-gray-500 line-through"
              >
                {{ formatPrice(product.oldPrice) }}
              </span>
            </div>

            <!-- Değerlendirme -->
            <div class="flex items-center space-x-1">
              <div class="flex text-yellow-400">
                <i 
                  v-for="i in 5" 
                  :key="i"
                  class="fas fa-star"
                  :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"
                ></i>
              </div>
              <span class="text-sm text-gray-600">
                ({{ product.reviewCount }})
              </span>
            </div>
          </div>

          <!-- Sepete Ekle Butonu -->
          <button 
            @click="addToCart(product)"
            class="mt-4 w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            <i class="fas fa-shopping-cart mr-2"></i>
            Sepete Ekle
          </button>
        </div>
      </div>

      <!-- Ürün Yok -->
      <div 
        v-else
        class="rounded-lg border-2 border-dashed p-12 text-center"
      >
        <p class="text-gray-600">Henüz öneri bulunmuyor.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'ProductRecommendations',
  components: {
    LoadingSpinner
  },
  props: {
    currentProductId: {
      type: String,
      required: true
    },
    limit: {
      type: Number,
      default: 4
    }
  },
  setup(props) {
    const store = useStore()
    const loading = ref(true)
    const products = ref([])

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const addToCart = async (product) => {
      try {
        await store.dispatch('cart/addToCart', {
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

    const loadRecommendations = async () => {
      try {
        products.value = await store.dispatch('products/getRecommendations', {
          productId: props.currentProductId,
          limit: props.limit
        })
      } catch (error) {
        console.error('Öneriler yüklenirken hata:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(loadRecommendations)

    return {
      loading,
      products,
      formatPrice,
      addToCart
    }
  }
}
</script> 