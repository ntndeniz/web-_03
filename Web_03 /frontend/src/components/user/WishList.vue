<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">İstek Listem</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="sortBy"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="date">Eklenme Tarihi</option>
          <option value="price_high">Fiyat (Yüksek-Düşük)</option>
          <option value="price_low">Fiyat (Düşük-Yüksek)</option>
          <option value="name">İsme Göre</option>
        </select>
      </div>
    </div>

    <!-- İstek Listesi -->
    <div v-if="sortedWishList.length" class="space-y-4">
      <div 
        v-for="item in sortedWishList"
        :key="item.id"
        class="flex items-center space-x-4 rounded-lg border p-4"
      >
        <!-- Ürün Görseli -->
        <router-link 
          :to="`/product/${item.product.id}`"
          class="flex-shrink-0"
        >
          <img 
            :src="item.product.image"
            :alt="item.product.name"
            class="h-24 w-24 rounded-md object-cover"
          />
        </router-link>

        <!-- Ürün Bilgileri -->
        <div class="flex flex-1 items-start justify-between">
          <div class="space-y-1">
            <router-link 
              :to="`/product/${item.product.id}`"
              class="font-medium hover:text-blue-600"
            >
              {{ item.product.name }}
            </router-link>
            
            <div class="flex items-center space-x-2">
              <div class="flex">
                <i 
                  v-for="star in 5"
                  :key="star"
                  class="fas fa-star text-sm"
                  :class="star <= item.product.rating ? 'text-yellow-400' : 'text-gray-300'"
                ></i>
              </div>
              <span class="text-sm text-gray-600">
                ({{ item.product.reviewCount }})
              </span>
            </div>

            <p class="text-sm text-gray-600">
              {{ item.note }}
            </p>

            <p class="text-sm text-gray-600">
              Eklenme: {{ formatDate(item.addedDate) }}
            </p>
          </div>

          <div class="ml-4 flex flex-col items-end space-y-2">
            <div class="text-right">
              <p 
                v-if="item.product.discountPrice"
                class="text-lg font-bold text-red-600"
              >
                {{ formatPrice(item.product.discountPrice) }}
                <span class="ml-2 text-sm line-through text-gray-500">
                  {{ formatPrice(item.product.price) }}
                </span>
              </p>
              <p v-else class="text-lg font-bold text-gray-900">
                {{ formatPrice(item.product.price) }}
              </p>
            </div>

            <div class="flex items-center space-x-2">
              <button 
                @click="addToCart(item.product)"
                class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                :disabled="!item.product.inStock"
              >
                {{ item.product.inStock ? 'Sepete Ekle' : 'Stokta Yok' }}
              </button>
              <button 
                @click="removeFromWishList(item.id)"
                class="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-heart text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">İstek listeniz boş.</p>
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
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
  name: 'WishList',
  setup() {
    const store = useStore()
    const sortBy = ref('date')
    const wishList = ref([])

    const sortedWishList = computed(() => {
      const sorted = [...wishList.value]
      
      if (sortBy.value === 'price_high') {
        return sorted.sort((a, b) => (b.product.discountPrice || b.product.price) - (a.product.discountPrice || a.product.price))
      } else if (sortBy.value === 'price_low') {
        return sorted.sort((a, b) => (a.product.discountPrice || a.product.price) - (b.product.discountPrice || b.product.price))
      } else if (sortBy.value === 'name') {
        return sorted.sort((a, b) => a.product.name.localeCompare(b.product.name))
      }
      
      // Eklenme tarihi
      return sorted.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
    })

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: tr })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
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

    const removeFromWishList = async (id) => {
      try {
        await store.dispatch('wishlist/removeFromWishList', id)
        await loadWishList()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Ürün istek listenizden kaldırıldı'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const loadWishList = async () => {
      try {
        const response = await store.dispatch('wishlist/getWishList')
        wishList.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İstek listesi yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadWishList()
    })

    return {
      sortBy,
      sortedWishList,
      formatDate,
      formatPrice,
      addToCart,
      removeFromWishList
    }
  }
}
</script> 