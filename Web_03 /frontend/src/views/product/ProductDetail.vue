<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="relative">
        <img 
          :src="product.image" 
          :alt="product.name"
          class="w-full rounded-lg shadow-lg"
        >
      </div>
      
      <div class="space-y-6">
        <h1 class="text-3xl font-bold">{{ product.name }}</h1>
        <p class="text-primary-500">{{ product.description }}</p>
        
        <div class="text-2xl font-bold">{{ product.price }} TL</div>
        
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <label class="text-gray-700">Adet:</label>
            <input 
              type="number" 
              v-model="quantity" 
              min="1" 
              class="w-20 px-3 py-2 border rounded"
            >
          </div>
          
          <button 
            @click="addToCart"
            class="w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600"
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-gray-600">Yükleniyor...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      product: null,
      quantity: 1
    }
  },
  async created() {
    try {
      const id = this.$route.params.id
      this.product = await this.$api.getProduct(id)
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error)
    }
  },
  methods: {
    addToCart() {
      this.$store.dispatch('cart/addItem', {
        product: this.product,
        quantity: this.quantity
      })
      this.$toast.success('Ürün sepete eklendi')
    }
  }
}
</script> 