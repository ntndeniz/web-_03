<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <h2 class="text-xl font-semibold">Favorilerim</h2>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in favorites" 
          :key="product.id"
          class="border rounded-lg overflow-hidden group"
        >
          <div class="relative pb-[100%]">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="absolute top-0 left-0 w-full h-full object-cover"
            />
            <button 
              @click="removeFromFavorites(product.id)"
              class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50"
            >
              <span class="material-icons">favorite</span>
            </button>
          </div>

          <div class="p-4">
            <router-link 
              :to="`/urun/${product.id}`"
              class="block font-semibold mb-2 hover:text-blue-600 line-clamp-2"
            >
              {{ product.name }}
            </router-link>

            <div class="flex items-center gap-2 mb-3">
              <span v-if="product.discount" class="text-gray-400 line-through text-sm">
                {{ formatPrice(product.originalPrice) }}
              </span>
              <span class="text-lg font-bold text-blue-600">
                {{ formatPrice(product.price) }}
              </span>
            </div>

            <button 
              @click="addToCart(product)"
              class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              :disabled="!product.stock"
            >
              {{ product.stock ? 'Sepete Ekle' : 'Stokta Yok' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div v-if="favorites.length === 0" class="text-center py-8">
        <span class="material-icons text-6xl text-gray-400 mb-4">favorite_border</span>
        <p class="text-gray-600">Henüz favori ürününüz bulunmuyor.</p>
        <router-link 
          to="/urunler"
          class="inline-block mt-4 text-blue-600 hover:text-blue-800"
        >
          Ürünleri Keşfet
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Favorites',
  computed: {
    favorites() {
      return this.$store.state.user.favorites
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    async removeFromFavorites(productId) {
      try {
        await this.$store.dispatch('user/removeFromFavorites', productId)
        this.$toast.success('Ürün favorilerden kaldırıldı')
      } catch (error) {
        this.$toast.error('Bir hata oluştu')
      }
    },
    async addToCart(product) {
      try {
        await this.$store.dispatch('cart/addToCart', product)
        this.$toast.success('Ürün sepete eklendi')
      } catch (error) {
        this.$toast.error('Ürün sepete eklenirken bir hata oluştu')
      }
    }
  },
  created() {
    this.$store.dispatch('user/fetchFavorites')
  }
}
</script> 