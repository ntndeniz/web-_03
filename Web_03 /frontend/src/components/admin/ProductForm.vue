<template>
  <form @submit.prevent="saveProduct" class="space-y-6">
    <!-- Temel Bilgiler -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Temel Bilgiler</h3>
      <div class="space-y-4">
        <div>
          <label class="block mb-1">Ürün Adı</label>
          <input 
            v-model="product.name"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">SKU</label>
          <input 
            v-model="product.sku"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Kategori</label>
          <select 
            v-model="product.categoryId"
            class="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="">Kategori Seçin</option>
            <option 
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Açıklama</label>
          <textarea 
            v-model="product.description"
            rows="4"
            class="w-full px-4 py-2 border rounded-lg"
            required
          ></textarea>
        </div>
      </div>
    </section>

    <!-- Fiyat ve Stok -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Fiyat ve Stok</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Fiyat</label>
          <div class="relative">
            <input 
              v-model.number="product.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full pl-8 pr-4 py-2 border rounded-lg"
              required
            />
            <span class="absolute left-3 top-2.5">₺</span>
          </div>
        </div>

        <div>
          <label class="block mb-1">İndirim Oranı (%)</label>
          <input 
            v-model.number="product.discount"
            type="number"
            min="0"
            max="100"
            class="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label class="block mb-1">Stok Miktarı</label>
          <input 
            v-model.number="product.stock"
            type="number"
            min="0"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Minimum Stok Uyarısı</label>
          <input 
            v-model.number="product.minStock"
            type="number"
            min="0"
            class="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>
    </section>

    <!-- Görsel -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Ürün Görseli</h3>
      <div class="space-y-4">
        <div 
          class="border-2 border-dashed rounded-lg p-4 text-center"
          :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <div v-if="imagePreview || product.image" class="relative inline-block">
            <img 
              :src="imagePreview || product.image"
              class="max-w-xs rounded-lg"
              alt="Ürün görseli"
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
    </section>

    <!-- Diğer Özellikler -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Diğer Özellikler</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <input 
            v-model="product.active"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-600"
            id="active"
          />
          <label for="active">Ürün aktif olarak listelensin</label>
        </div>

        <div class="flex items-center gap-2">
          <input 
            v-model="product.featured"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-600"
            id="featured"
          />
          <label for="featured">Öne çıkan ürün olarak gösterilsin</label>
        </div>
      </div>
    </section>

    <!-- Form Butonları -->
    <div class="flex justify-end gap-4 pt-4 border-t">
      <button 
        type="button"
        @click="$emit('cancel')"
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

<script>
export default {
  name: 'ProductForm',
  props: {
    initialProduct: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      product: {
        name: '',
        sku: '',
        categoryId: '',
        description: '',
        price: 0,
        discount: 0,
        stock: 0,
        minStock: 5,
        image: '',
        active: true,
        featured: false
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
      this.product.image = ''
    },
    async saveProduct() {
      this.isSaving = true
      
      try {
        // Eğer yeni görsel yüklendiyse önce storage'a yükle
        if (this.imagePreview) {
          const imageUrl = await this.uploadImage(this.imagePreview)
          this.product.image = imageUrl
        }

        this.$emit('save', this.product)
      } catch (error) {
        this.$toast.error('Görsel yüklenirken bir hata oluştu')
      } finally {
        this.isSaving = false
      }
    },
    async uploadImage(base64Image) {
      // Firebase Storage'a görsel yükleme işlemi
      // Bu kısım backend entegrasyonunda implement edilecek
      return base64Image
    }
  },
  created() {
    if (this.initialProduct) {
      this.product = { ...this.initialProduct }
    }
  }
}
</script> 