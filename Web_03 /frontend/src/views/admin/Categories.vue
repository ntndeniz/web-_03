<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold">Kategoriler</h1>

        <!-- Yeni Kategori Ekle -->
        <button 
          @click="showNewCategoryForm = true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <span class="material-icons">add</span>
          Yeni Kategori
        </button>
      </div>
    </div>

    <!-- Kategori Listesi -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="p-4 font-medium">Kategori</th>
            <th class="p-4 font-medium">Ürün Sayısı</th>
            <th class="p-4 font-medium">Durum</th>
            <th class="p-4 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr 
            v-for="category in categories" 
            :key="category.id"
            class="hover:bg-gray-50"
          >
            <td class="p-4">
              <div class="flex items-center gap-3">
                <img 
                  :src="category.image" 
                  :alt="category.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div class="font-medium">{{ category.name }}</div>
                  <div class="text-sm text-gray-600">{{ category.description }}</div>
                </div>
              </div>
            </td>
            <td class="p-4">
              {{ category.productCount }} ürün
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="category.active ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                {{ category.active ? 'Aktif' : 'Pasif' }}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="editCategory(category)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <span class="material-icons">edit</span>
                </button>
                <button 
                  @click="toggleCategoryStatus(category)"
                  class="p-1.5 hover:bg-gray-100 rounded"
                  :class="category.active ? 'text-red-600' : 'text-green-600'"
                >
                  <span class="material-icons">
                    {{ category.active ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
                <button 
                  @click="deleteCategory(category)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Kategori Formu Modal -->
    <Modal 
      v-if="showNewCategoryForm || editingCategory"
      @close="cancelCategoryForm"
    >
      <template #title>
        {{ editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle' }}
      </template>
      <template #content>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block mb-1">Kategori Adı</label>
            <input 
              v-model="categoryForm.name"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label class="block mb-1">Açıklama</label>
            <textarea 
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <!-- Görsel Yükleme -->
          <div>
            <label class="block mb-1">Kategori Görseli</label>
            <div 
              class="border-2 border-dashed rounded-lg p-4 text-center"
              :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <div v-if="imagePreview || categoryForm.image" class="relative inline-block">
                <img 
                  :src="imagePreview || categoryForm.image"
                  class="max-w-xs rounded-lg"
                  alt="Kategori görseli"
                />
                <button 
                  type="button"
                  @click="removeImage"
                  class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full"
                >
                  <span class="material-icons text-sm">close</span>
                </button>
              </div>
              <div v-else>
                <span class="material-icons text-4xl text-gray-400">cloud_upload</span>
                <p class="mt-2 text-gray-600">
                  Görsel yüklemek için sürükleyin veya
                  <label class="text-blue-600 cursor-pointer">
                    seçin
                    <input 
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleFileSelect"
                    />
                  </label>
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  PNG, JPG veya WebP • Maks. 2MB
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input 
              v-model="categoryForm.active"
              type="checkbox"
              class="w-4 h-4 rounded text-blue-600"
              id="categoryActive"
            />
            <label for="categoryActive">Kategori aktif olarak listelensin</label>
          </div>

          <div class="flex justify-end gap-4 pt-4 border-t">
            <button 
              type="button"
              @click="cancelCategoryForm"
              class="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
            </button>
          </div>
        </form>
      </template>
    </Modal>

    <!-- Silme Onay Modal -->
    <Modal v-if="categoryToDelete" @close="categoryToDelete = null">
      <template #title>
        Kategori Silinecek
      </template>
      <template #content>
        <div class="p-4">
          <p class="mb-4">
            "{{ categoryToDelete.name }}" kategorisini silmek istediğinize emin misiniz?
            <br>
            <span class="text-red-600">
              Bu kategoriye ait {{ categoryToDelete.productCount }} ürün bulunmaktadır.
            </span>
          </p>
          <div class="flex justify-end gap-4">
            <button 
              @click="categoryToDelete = null"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'AdminCategories',
  components: {
    Modal
  },
  data() {
    return {
      showNewCategoryForm: false,
      editingCategory: null,
      categoryToDelete: null,
      categoryForm: {
        name: '',
        description: '',
        image: '',
        active: true
      },
      imagePreview: null,
      isDragging: false,
      isSaving: false
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories.items
    }
  },
  methods: {
    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = { ...category }
      this.showNewCategoryForm = true
    },
    async toggleCategoryStatus(category) {
      try {
        await this.$store.dispatch('categories/toggleStatus', category.id)
        this.$toast.success(
          category.active ? 'Kategori pasife alındı' : 'Kategori aktife alındı'
        )
      } catch (error) {
        this.$toast.error('Kategori durumu güncellenirken bir hata oluştu')
      }
    },
    deleteCategory(category) {
      this.categoryToDelete = category
    },
    async confirmDelete() {
      try {
        await this.$store.dispatch('categories/deleteCategory', this.categoryToDelete.id)
        this.$toast.success('Kategori başarıyla silindi')
        this.categoryToDelete = null
      } catch (error) {
        this.$toast.error('Kategori silinirken bir hata oluştu')
      }
    },
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) this.processImage(file)
    },
    handleDrop(event) {
      this.isDragging = false
      const file = event.dataTransfer.files[0]
      if (file) this.processImage(file)
    },
    processImage(file) {
      if (!file.type.startsWith('image/')) {
        this.$toast.error('Lütfen geçerli bir görsel dosyası seçin')
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        this.$toast.error('Görsel boyutu 2MB\'dan küçük olmalıdır')
        return
      }

      const reader = new FileReader()
      reader.onload = e => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage() {
      this.imagePreview = null
      this.categoryForm.image = ''
    },
    async saveCategory() {
      this.isSaving = true
      
      try {
        if (this.imagePreview) {
          const imageUrl = await this.uploadImage(this.imagePreview)
          this.categoryForm.image = imageUrl
        }

        if (this.editingCategory) {
          await this.$store.dispatch('categories/updateCategory', {
            id: this.editingCategory.id,
            ...this.categoryForm
          })
          this.$toast.success('Kategori başarıyla güncellendi')
        } else {
          await this.$store.dispatch('categories/createCategory', this.categoryForm)
          this.$toast.success('Kategori başarıyla eklendi')
        }
        this.cancelCategoryForm()
      } catch (error) {
        this.$toast.error('Kategori kaydedilirken bir hata oluştu')
      } finally {
        this.isSaving = false
      }
    },
    cancelCategoryForm() {
      this.showNewCategoryForm = false
      this.editingCategory = null
      this.categoryForm = {
        name: '',
        description: '',
        image: '',
        active: true
      }
      this.imagePreview = null
    },
    async uploadImage(base64Image) {
      // Firebase Storage'a görsel yükleme işlemi
      // Bu kısım backend entegrasyonunda implement edilecek
      return base64Image
    }
  },
  created() {
    this.$store.dispatch('categories/fetchCategories')
  }
}
</script> 