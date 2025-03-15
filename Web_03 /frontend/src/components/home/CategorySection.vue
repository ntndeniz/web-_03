<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Kategoriler</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="relative group cursor-pointer"
        >
          <div class="relative h-96 rounded-lg overflow-hidden">
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <h3 class="text-2xl font-bold text-white mb-2">{{ category.name }}</h3>
                <router-link 
                  :to="category.link"
                  class="inline-block bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Keşfet
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CategorySection',
  data() {
    return {
      categories: [
        {
          id: 1,
          name: 'Elektronik',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          link: '/products?category=electronics'
        },
        {
          id: 2,
          name: 'Giyim',
          image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04',
          link: '/products?category=clothing'
        },
        {
          id: 3,
          name: 'Aksesuarlar',
          image: 'https://images.unsplash.com/photo-1484704849700-f032a6c91816',
          link: '/products?category=accessories'
        }
      ]
    }
  }
}
</script> 