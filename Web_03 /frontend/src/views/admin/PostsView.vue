<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Blog Yazıları</h2>
        <router-link 
          to="/admin/posts/new" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Yeni Yazı Ekle
        </router-link>
      </div>

      <!-- Arama ve Filtreleme -->
      <div class="mb-6 flex gap-4">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Yazı ara..."
          class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
        <select 
          v-model="selectedCategory"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tüm Kategoriler</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Blog Yazıları Tablosu -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="post in filteredPosts" :key="post._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ getCategoryName(post.category) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link 
                  :to="`/admin/posts/${post._id}/edit`"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Düzenle
                </router-link>
                <button 
                  @click="deletePost(post._id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Sil
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'PostsView',
  setup() {
    const posts = ref([])
    const categories = ref([])
    const searchQuery = ref('')
    const selectedCategory = ref('')

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/admin/posts`)
        posts.value = response.data
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/admin/categories`)
        categories.value = response.data
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
      }
    }

    const filteredPosts = computed(() => {
      return posts.value.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = !selectedCategory.value || post.category === selectedCategory.value
        return matchesSearch && matchesCategory
      })
    })

    const deletePost = async (postId) => {
      if (confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
        try {
          await axios.delete(`${process.env.VUE_APP_API_URL}/api/admin/posts/${postId}`)
          await fetchPosts()
        } catch (error) {
          console.error('Yazı silinirken hata:', error)
        }
      }
    }

    const getCategoryName = (categoryId) => {
      const category = categories.value.find(c => c._id === categoryId)
      return category ? category.name : 'Bilinmeyen Kategori'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR')
    }

    onMounted(() => {
      fetchPosts()
      fetchCategories()
    })

    return {
      posts,
      categories,
      searchQuery,
      selectedCategory,
      filteredPosts,
      deletePost,
      getCategoryName,
      formatDate
    }
  }
}
</script> 