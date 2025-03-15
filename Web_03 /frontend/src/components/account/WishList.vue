<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Favorilerim</h2>

    <!-- Ürün Listesi -->
    <div v-if="items.length" class="space-y-4">
      <div 
        v-for="item in items"
        :key="item.id"
        class="flex items-center space-x-4 rounded-lg border p-4"
      >
        <!-- Ürün Görseli -->
        <router-link :to="`/product/${item.id}`" class="flex-shrink-0">
          <img 
            :src="item.image" 
            :alt="item.name"
            class="h-24 w-24 rounded-md object-cover"
          />
        </router-link>

        <!-- Ürün Bilgileri -->
        <div class="flex-1 min-w-0">
          <router-link 
            :to="`/product/${item.id}`"
            class="text-lg font-medium hover:text-blue-600"
          >
            {{ item.name }}
          </router-link>
          <p class="mt-1 text-sm text-gray-600">{{ item.category }}</p>
          <div class="mt-2 flex items-center space-x-2">
            <span 
              v-if="item.originalPrice"
              class="text-sm text-gray-500 line-through"
            >
              {{ formatPrice(item.originalPrice) }}
            </span>
            <span class="text-lg font-bold text-blue-600">
              {{ formatPrice(item.price) }}
            </span>
            <span 
              v-if="item.stockStatus === 'out_of_stock'"
              class="ml-2 text-sm text-red-600"
            >
              Stokta Yok
            </span>
          </div>
        </div>

        <!-- Aksiyonlar -->
        <div class="flex flex-col space-y-2">
          <button 
            @click="addToCart(item)"
            :disabled="item.stockStatus === 'out_of_stock'"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Sepete Ekle
          </button>
          <button 
            @click="removeFromWishlist(item.id)"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Kaldır
          </button>
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
        Ürünleri Keşfedin
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'WishList',
  setup() {
    const store = useStore()

    const items = computed(() => store.state.wishlist.items)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const addToCart = async (item) => {
      try {
        await store.dispatch('cart/addItem', {
          productId: item.id,
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

    const removeFromWishlist = async (productId) => {
      try {
        await store.dispatch('wishlist/removeItem', productId)
        
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

    return {
      items,
      formatPrice,
      addToCart,
      removeFromWishlist
    }
  }
}
</script> 