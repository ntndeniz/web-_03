<template>
  <section class="py-12 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Başlık -->
      <div class="mb-8 text-center">
        <h2 class="text-3xl font-bold">Kategoriler</h2>
        <p class="mt-2 text-gray-600">İhtiyacınız olan her şey kategorilerde</p>
      </div>

      <!-- Yükleniyor -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Kategori Grid -->
      <div 
        v-else
        class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/kategori/${category.slug}`"
          class="group relative overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-lg"
        >
          <!-- Kategori Görseli -->
          <div class="relative aspect-[4/3] overflow-hidden">
            <img 
              :src="category.image" 
              :alt="category.name"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          <!-- Kategori Bilgileri -->
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 class="text-xl font-semibold">{{ category.name }}</h3>
            <p class="mt-1 text-sm opacity-90">{{ category.productCount }} Ürün</p>
          </div>

          <!-- Hover Efekti -->
          <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <span class="rounded-full bg-white px-6 py-2 text-sm font-medium text-gray-900">
              Kategoriyi Gör
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'CategoryGrid',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const categories = ref([])
    const loading = ref(true)

    onMounted(async () => {
      try {
        const response = await store.dispatch('categories/getCategories')
        categories.value = response.map(category => ({
          ...category,
          productCount: category.products?.length || 0
        }))
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
      } finally {
        loading.value = false
      }
    })

    return {
      categories,
      loading
    }
  }
}
</script> 