<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Kategoriler</h2>
        <button 
          @click="openNewCategoryModal"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Yeni Kategori Ekle
        </button>
      </div>

      <!-- Kategoriler Tablosu -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori Adı
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yazı Sayısı
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="category in categories" :key="category._id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ category.slug }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ category.postCount || 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editCategory(category)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Düzenle
                </button>
                <button 
                  @click="deleteCategory(category._id)"
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

    <!-- Kategori Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">
          {{ editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle' }}
        </h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Kategori Adı
          </label>
          <input 
            type="text" 
            v-model="categoryForm.name"
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <div class="flex justify-end gap-4">
          <button 
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-700"
          >
            İptal
          </button>
          <button 
            @click="saveCategory"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'CategoriesView',
  setup() {
    const categories = ref([])
    const showModal = ref(false)
    const editingCategory = ref(null)
    const categoryForm = ref({
      name: '',
      slug: ''
    })

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/admin/categories`)
        categories.value = response.data
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error)
      }
    }

    const openNewCategoryModal = () => {
      editingCategory.value = null
      categoryForm.value = { name: '', slug: '' }
      showModal.value = true
    }

    const editCategory = (category) => {
      editingCategory.value = category
      categoryForm.value = { ...category }
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      editingCategory.value = null
      categoryForm.value = { name: '', slug: '' }
    }

    const saveCategory = async () => {
      try {
        if (editingCategory.value) {
          await axios.put(
            `${process.env.VUE_APP_API_URL}/api/admin/categories/${editingCategory.value._id}`,
            categoryForm.value
          )
        } else {
          await axios.post(
            `${process.env.VUE_APP_API_URL}/api/admin/categories`,
            categoryForm.value
          )
        }
        await fetchCategories()
        closeModal()
      } catch (error) {
        console.error('Kategori kaydedilirken hata:', error)
      }
    }

    const deleteCategory = async (categoryId) => {
      if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
        try {
          await axios.delete(`${process.env.VUE_APP_API_URL}/api/admin/categories/${categoryId}`)
          await fetchCategories()
        } catch (error) {
          console.error('Kategori silinirken hata:', error)
        }
      }
    }

    onMounted(() => {
      fetchCategories()
    })

    return {
      categories,
      showModal,
      editingCategory,
      categoryForm,
      openNewCategoryModal,
      editCategory,
      closeModal,
      saveCategory,
      deleteCategory
    }
  }
}
</script> 