<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-8">Öne Çıkan Ürünler</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ product.name }}</h3>
            <p class="text-gray-600 mt-1">{{ product.description }}</p>
            <div class="flex justify-between items-center mt-4">
              <span class="text-primary-500 font-bold">{{ formatPrice(product.price) }} TL</span>
              <button class="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600">
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
  name: 'FeaturedProducts',
  
  setup() {
    const products = [
      {
        id: 1,
        name: 'iPhone 14 Pro',
        description: 'Apple iPhone 14 Pro 256GB',
        price: 49999,
        image: 'https://images.unsplash.com/photo-1678652197831-2c776e1fef5c'
      },
      {
        id: 2,
        name: 'MacBook Air M2',
        description: 'Apple MacBook Air M2 8GB 256GB',
        price: 39999,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4'
      },
      {
        id: 3,
        name: 'AirPods Pro',
        description: 'Apple AirPods Pro 2. Nesil',
        price: 5999,
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434'
      },
      {
        id: 4,
        name: 'iPad Air',
        description: 'Apple iPad Air 5. Nesil 64GB',
        price: 19999,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'
      }
    ]

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR').format(price)
    }

    return {
      products,
      formatPrice
    }
  }
}
</script>

<style scoped>
/* Hover efekti için ek stil */
.cursor-pointer:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style> 