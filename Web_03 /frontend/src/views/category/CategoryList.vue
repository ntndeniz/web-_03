<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="bg-gray-900 rounded-xl mb-8 relative overflow-hidden">
      <div class="relative py-16 px-8">
        <h1 class="text-4xl font-bold text-white mb-4">Kategoriler</h1>
        <p class="text-gray-300 text-lg max-w-2xl">
          Tüm ürün kategorilerimizi keşfedin ve aradığınız ürünlere kolayca ulaşın.
        </p>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
      >
        <router-link :to="`/category/${category.id}`">
          <div class="relative">
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 class="text-2xl font-bold text-white">{{ category.name }}</h3>
            </div>
          </div>
          <div class="p-4">
            <p class="text-gray-600">{{ category.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ category.productCount }} Ürün</span>
              <span class="text-blue-600 font-medium">Ürünleri Gör →</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'CategoryList',
  setup() {
    const store = useStore()

    const categories = computed(() => 
      store.getters['categories/getAllCategories']
    )

    onMounted(() => {
      store.dispatch('categories/fetchCategories')
    })

    return {
      categories
    }
  }
}
</script> 