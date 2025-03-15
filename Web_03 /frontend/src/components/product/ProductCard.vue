<template>
  <div 
    :class="[
      'bg-white rounded-lg shadow overflow-hidden',
      viewMode === 'list' ? 'flex' : ''
    ]"
  >
    <!-- Ürün Görseli -->
    <div 
      :class="[
        'relative',
        viewMode === 'list' ? 'w-48' : 'w-full'
      ]"
    >
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-48 object-cover"
      >
      
      <!-- İndirim Etiketi -->
      <div 
        v-if="product.discount"
        class="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm"
      >
        %{{ product.discount }}
      </div>

      <!-- Favori Butonu -->
      <button
        @click="toggleFavorite"
        class="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-50"
      >
        <i 
          class="fas fa-heart text-xl"
          :class="{ 'text-red-500': product.isFavorite }"
        ></i>
      </button>
    </div>

    <!-- Ürün Bilgileri -->
    <div 
      :class="[
        'p-4',
        viewMode === 'list' ? 'flex-1' : ''
      ]"
    >
      <h3 class="font-medium mb-2">{{ product.name }}</h3>
      
      <!-- Fiyat -->
      <div class="flex items-baseline space-x-2 mb-4">
        <span class="text-lg font-bold">₺{{ product.price }}</span>
        <span 
          v-if="product.oldPrice" 
          class="text-sm text-gray-500 line-through"
        >
          ₺{{ product.oldPrice }}
        </span>
      </div>

      <!-- Stok Durumu -->
      <p 
        class="text-sm mb-4"
        :class="product.inStock ? 'text-green-600' : 'text-red-600'"
      >
        {{ product.inStock ? 'Stokta Var' : 'Stokta Yok' }}
      </p>

      <!-- Butonlar -->
      <div class="space-x-2">
        <button
          @click="addToCart"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          :disabled="!product.inStock"
        >
          Sepete Ekle
        </button>
        <router-link
          :to="`/product/${product.id}`"
          class="px-4 py-2 border rounded hover:bg-gray-50 inline-block"
        >
          Detaylar
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'ProductCard',

  props: {
    product: {
      type: Object,
      required: true
    },
    viewMode: {
      type: String,
      default: 'grid'
    }
  },

  setup(props) {
    const store = useStore()

    const addToCart = async () => {
      try {
        await store.dispatch('cart/addItem', {
          productId: props.product.id,
          quantity: 1
        })
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Ürün sepete eklendi'
        })
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Ürün sepete eklenirken hata oluştu'
        })
      }
    }

    const toggleFavorite = async () => {
      try {
        if (props.product.isFavorite) {
          await store.dispatch('favorites/removeFromFavorites', props.product.id)
        } else {
          await store.dispatch('favorites/addToFavorites', props.product.id)
        }
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    return {
      addToCart,
      toggleFavorite
    }
  }
}
</script> 