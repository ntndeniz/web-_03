<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Favorilerim</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="sortBy"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="newest">En Son Eklenen</option>
          <option value="price_high">Fiyat (Yüksek-Düşük)</option>
          <option value="price_low">Fiyat (Düşük-Yüksek)</option>
          <option value="name">İsme Göre</option>
        </select>
      </div>
    </div>

    <!-- Favori Ürünler -->
    <div v-if="sortedFavorites.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="product in sortedFavorites"
        :key="product.id"
        class="group relative rounded-lg border p-4"
      >
        <!-- Favori Butonu -->
        <button 
          @click="removeFromFavorites(product.id)"
          class="absolute right-2 top-2 rounded-full bg-white p-1.5 text-red-500 shadow-sm hover:bg-red-50"
        >
          <i class="fas fa-heart"></i>
        </button>

        <!-- Ürün Görseli -->
        <router-link :to="`/product/${product.id}`">
          <img 
            :src="product.image"
            :alt="product.name"
            class="mx-auto h-48 w-full object-contain"
          />
        </router-link>

        <!-- Ürün Bilgileri -->
        <div class="mt-4 space-y-2">
          <router-link 
            :to="`/product/${product.id}`"
            class="block font-medium hover:text-blue-600"
          >
            {{ product.name }}
          </router-link>
          
          <div class="flex items-center space-x-2">
            <div class="flex">
              <i 
                v-for="star in 5"
                :key="star"
                class="fas fa-star text-sm"
                :class="star <= product.rating ? 'text-yellow-400' : 'text-gray-300'"
              ></i>
            </div>
            <span class="text-sm text-gray-600">
              ({{ product.reviewCount }})
            </span>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p 
                v-if="product.discountPrice"
                class="text-lg font-bold text-red-600"
              >
                {{ formatPrice(product.discountPrice) }}
                <span class="ml-2 text-sm line-through text-gray-500">
                  {{ formatPrice(product.price) }}
                </span>
              </p>
              <p v-else class="text-lg font-bold text-gray-900">
                {{ formatPrice(product.price) }}
              </p>
            </div>

            <button 
              @click="addToCart(product)"
              class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sepete Ekle
            </button>
          </div>
        </div>

        <!-- Stok Durumu -->
        <div 
          v-if="!product.inStock"
          class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50"
        >
          <p class="text-lg font-medium text-white">
            Stokta Yok
          </p>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-heart text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz favori ürününüz bulunmuyor.</p>
      <router-link 
        to="/products"
        class="mt-4 text-blue-600 hover:text-blue-500"
      >
        Alışverişe Başla
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'Favorites',
  setup() {
    const store = useStore()
    const sortBy = ref('newest')
    const favorites = ref([])

    const sortedFavorites = computed(() => {
      const sorted = [...favorites.value]
      
      if (sortBy.value === 'price_high') {
        return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
      } else if (sortBy.value === 'price_low') {
        return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
      } else if (sortBy.value === 'name') {
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      }
      
      // En son eklenen
      return sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const removeFromFavorites = async (productId) => {
      try {
        await store.dispatch('favorites/removeFromFavorites', productId)
        await loadFavorites()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Ürün favorilerden kaldırıldı'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const addToCart = async (product) => {
      if (!product.inStock) return

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
          message: 'Ürün sepete eklenirken bir hata oluştu'
        })
      }
    }

    const loadFavorites = async () => {
      try {
        const response = await store.dispatch('favorites/getFavorites')
        favorites.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Favoriler yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadFavorites()
    })

    return {
      sortBy,
      sortedFavorites,
      formatPrice,
      removeFromFavorites,
      addToCart
    }
  }
}
</script> 