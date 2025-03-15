<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="flex">
      <!-- Sol Taraf - Ürün Görseli -->
      <div class="relative w-48 h-48">
        <router-link :to="`/products/${product.id}`">
          <img 
            :src="product.image" 
            :alt="product.name"
            class="w-full h-full object-cover"
          >
          
          <!-- İndirim Etiketi -->
          <div 
            v-if="product.discount"
            class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium"
          >
            %{{ product.discount }}
          </div>
        </router-link>

        <!-- Favori Butonu -->
        <button 
          @click="toggleFavorite"
          class="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
        >
          <i class="fas" :class="isFavorite ? 'fa-heart text-red-500' : 'fa-heart text-gray-400'"></i>
        </button>
      </div>

      <!-- Sağ Taraf - Ürün Bilgileri -->
      <div class="flex-1 p-6">
        <div class="flex justify-between">
          <div>
            <!-- Marka -->
            <p class="text-gray-600 text-sm mb-1">{{ product.brand }}</p>
            
            <!-- Ürün Adı -->
            <router-link :to="`/products/${product.id}`">
              <h3 class="text-xl font-medium hover:text-blue-600 transition-colors">
                {{ product.name }}
              </h3>
            </router-link>

            <!-- Değerlendirme -->
            <div class="flex items-center mt-2">
              <StarRating :rating="product.rating" :showRating="false" />
              <span class="ml-2 text-sm text-gray-600">({{ product.reviewCount }})</span>
            </div>

            <!-- Ürün Açıklaması -->
            <p class="text-gray-600 mt-2 line-clamp-2">{{ product.description }}</p>

            <!-- Özellikler -->
            <div class="flex items-center space-x-4 mt-3">
              <span 
                v-if="product.fastDelivery"
                class="flex items-center text-sm text-green-600"
              >
                <i class="fas fa-truck mr-1"></i>
                Bugün Kargoda
              </span>

              <span 
                v-if="product.freeShipping"
                class="flex items-center text-sm text-blue-600"
              >
                <i class="fas fa-box mr-1"></i>
                Ücretsiz Kargo
              </span>
            </div>
          </div>

          <!-- Fiyat ve Sepete Ekle -->
          <div class="text-right">
            <div class="flex flex-col items-end">
              <span 
                v-if="product.originalPrice"
                class="text-gray-400 text-sm line-through"
              >
                {{ product.originalPrice }}₺
              </span>
              <span class="text-2xl font-bold">{{ product.price }}₺</span>
            </div>

            <button 
              v-if="product.stock > 0"
              @click="addToCart"
              class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sepete Ekle
            </button>
            <button 
              v-else
              disabled
              class="mt-4 px-6 py-2 bg-gray-400 text-white rounded-lg font-medium cursor-not-allowed"
            >
              Tükendi
            </button>

            <!-- Stok Durumu -->
            <p 
              v-if="product.stock > 0 && product.stock <= 5"
              class="mt-2 text-sm text-red-600"
            >
              Son {{ product.stock }} ürün
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import StarRating from '@/components/common/StarRating.vue'

export default {
  name: 'ProductListItem',
  components: {
    StarRating
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const isFavorite = ref(false)

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value
      
      if (isFavorite.value) {
        store.dispatch('addToFavorites', props.product.id)
      } else {
        store.dispatch('removeFromFavorites', props.product.id)
      }
    }

    const addToCart = async () => {
      try {
        await store.dispatch('addToCart', {
          productId: props.product.id,
          quantity: 1
        })
        // Başarılı mesajı göster
      } catch (error) {
        console.error('Error adding to cart:', error)
        // Hata mesajı göster
      }
    }

    return {
      isFavorite,
      toggleFavorite,
      addToCart
    }
  }
}
</script> 