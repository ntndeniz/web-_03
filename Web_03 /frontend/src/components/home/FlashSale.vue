<template>
  <section class="py-8 bg-red-50">
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-red-600">Flaş İndirimler</h2>
        <div class="flex space-x-4">
          <div class="text-center">
            <span class="block text-2xl font-bold">{{ countdown.hours }}</span>
            <span class="text-sm">Saat</span>
          </div>
          <div class="text-center">
            <span class="block text-2xl font-bold">{{ countdown.minutes }}</span>
            <span class="text-sm">Dakika</span>
          </div>
          <div class="text-center">
            <span class="block text-2xl font-bold">{{ countdown.seconds }}</span>
            <span class="text-sm">Saniye</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="product in flashSaleProducts" :key="product.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden relative">
          <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
            -{{ product.discount }}%
          </div>
          <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
            <div class="flex justify-between items-center">
              <div>
                <span class="text-lg font-bold text-red-600">{{ product.discountedPrice }} ₺</span>
                <span class="text-sm text-gray-400 line-through ml-2">{{ product.originalPrice }} ₺</span>
              </div>
              <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Sepete Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FlashSale',
  data() {
    return {
      countdown: {
        hours: 4,
        minutes: 59,
        seconds: 59
      },
      flashSaleProducts: [
        {
          id: 1,
          name: 'İndirimli Ürün 1',
          originalPrice: 299.99,
          discountedPrice: 149.99,
          discount: 50,
          image: '/images/products/flash1.jpg'
        },
        {
          id: 2,
          name: 'İndirimli Ürün 2',
          originalPrice: 399.99,
          discountedPrice: 199.99,
          discount: 50,
          image: '/images/products/flash2.jpg'
        },
        {
          id: 3,
          name: 'İndirimli Ürün 3',
          originalPrice: 499.99,
          discountedPrice: 249.99,
          discount: 50,
          image: '/images/products/flash3.jpg'
        },
        {
          id: 4,
          name: 'İndirimli Ürün 4',
          originalPrice: 599.99,
          discountedPrice: 299.99,
          discount: 50,
          image: '/images/products/flash4.jpg'
        }
      ]
    }
  },
  mounted() {
    this.startCountdown()
  },
  methods: {
    startCountdown() {
      setInterval(() => {
        if (this.countdown.seconds > 0) {
          this.countdown.seconds--
        } else {
          this.countdown.seconds = 59
          if (this.countdown.minutes > 0) {
            this.countdown.minutes--
          } else {
            this.countdown.minutes = 59
            if (this.countdown.hours > 0) {
              this.countdown.hours--
            }
          }
        }
      }, 1000)
    }
  }
}
</script> 