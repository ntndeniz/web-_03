<template>
  <form @submit.prevent="saveCampaign" class="space-y-6">
    <!-- Temel Bilgiler -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Temel Bilgiler</h3>
      <div class="space-y-4">
        <div>
          <label class="block mb-1">Kampanya Başlığı</label>
          <input 
            v-model="campaign.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Açıklama</label>
          <textarea 
            v-model="campaign.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg"
            required
          ></textarea>
        </div>
      </div>
    </section>

    <!-- Kampanya Görseli -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Kampanya Görseli</h3>
      <div 
        class="border-2 border-dashed rounded-lg p-4 text-center"
        :class="isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <div v-if="imagePreview || campaign.image" class="relative inline-block">
          <img 
            :src="imagePreview || campaign.image"
            class="max-w-xs rounded-lg"
            alt="Kampanya görseli"
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
    </section>

    <!-- İndirim Detayları -->
    <section>
      <h3 class="text-lg font-semibold mb-4">İndirim Detayları</h3>
      <div class="space-y-4">
        <div>
          <label class="block mb-1">İndirim Tipi</label>
          <select 
            v-model="campaign.discountType"
            class="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="percentage">Yüzde İndirim (%)</option>
            <option value="fixed">Net İndirim (₺)</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">
            {{ campaign.discountType === 'percentage' ? 'İndirim Oranı (%)' : 'İndirim Tutarı (₺)' }}
          </label>
          <input 
            v-model.number="campaign.discountAmount"
            type="number"
            :min="0"
            :max="campaign.discountType === 'percentage' ? 100 : null"
            :step="campaign.discountType === 'percentage' ? 1 : 0.01"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Minimum Sepet Tutarı (₺)</label>
          <input 
            v-model.number="campaign.minAmount"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
      </div>
    </section>

    <!-- Geçerlilik Süresi -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Geçerlilik Süresi</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Başlangıç Tarihi</label>
          <input 
            v-model="campaign.startDate"
            type="date"
            class="w-full px-4 py-2 border rounded-lg"
            :min="today"
            required
          />
        </div>
        <div>
          <label class="block mb-1">Bitiş Tarihi</label>
          <input 
            v-model="campaign.endDate"
            type="date"
            class="w-full px-4 py-2 border rounded-lg"
            :min="campaign.startDate || today"
            required
          />
        </div>
      </div>
    </section>

    <!-- Diğer Ayarlar -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Diğer Ayarlar</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <input 
            v-model="campaign.active"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-600"
            id="active"
          />
          <label for="active">Kampanya aktif olarak yayınlansın</label>
        </div>

        <div class="flex items-center gap-2">
          <input 
            v-model="campaign.featured"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-600"
            id="featured"
          />
          <label for="featured">Öne çıkan kampanya olarak gösterilsin</label>
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
  name: 'CampaignForm',
  props: {
    initialCampaign: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      campaign: {
        title: '',
        description: '',
        image: '',
        discountType: 'percentage',
        discountAmount: 0,
        minAmount: 0,
        startDate: '',
        endDate: '',
        active: true,
        featured: false
      },
      imagePreview: null,
      isDragging: false,
      isSaving: false
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
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
      this.campaign.image = ''
    },
    async saveCampaign() {
      this.isSaving = true
      
      try {
        if (this.imagePreview) {
          const imageUrl = await this.uploadImage(this.imagePreview)
          this.campaign.image = imageUrl
        }

        this.$emit('save', this.campaign)
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
    if (this.initialCampaign) {
      this.campaign = { ...this.initialCampaign }
    }
  }
}
</script> 