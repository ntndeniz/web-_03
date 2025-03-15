<template>
  <section class="py-8">
    <div class="container mx-auto">
      <h2 class="text-2xl font-bold mb-6">Son Görüntülediğiniz Ürünler</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div v-for="product in recentProducts" :key="product.id" 
             class="bg-white rounded-lg shadow-md overflow-hidden">
          <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
            <p class="text-gray-600 mb-2">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-blue-600">{{ product.price }} ₺</span>
              <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
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
  name: 'RecentlyViewed',
  data() {
    return {
      recentProducts: [
        {
          id: 1,
          name: 'Son Görüntülenen 1',
          description: 'Ürün açıklaması',
          price: 199.99,
          image: '/images/products/recent1.jpg'
        },
        {
          id: 2,
          name: 'Son Görüntülenen 2',
          description: 'Ürün açıklaması',
          price: 299.99,
          image: '/images/products/recent2.jpg'
        },
        {
          id: 3,
          name: 'Son Görüntülenen 3',
          description: 'Ürün açıklaması',
          price: 399.99,
          image: '/images/products/recent3.jpg'
        },
        {
          id: 4,
          name: 'Son Görüntülenen 4',
          description: 'Ürün açıklaması',
          price: 499.99,
          image: '/images/products/recent4.jpg'
        }
      ]
    }
  }
}
</script> 