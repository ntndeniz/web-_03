<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <h1 class="text-2xl font-semibold">Site Ayarları</h1>
    </div>

    <div class="p-6 space-y-8">
      <!-- Genel Ayarlar -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Genel Ayarlar</h2>
        <div class="space-y-4">
          <div>
            <label class="block mb-1">Site Başlığı</label>
            <input 
              v-model="settings.siteTitle"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block mb-1">Site Açıklaması</label>
            <textarea 
              v-model="settings.siteDescription"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div>
            <label class="block mb-1">İletişim E-posta</label>
            <input 
              v-model="settings.contactEmail"
              type="email"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block mb-1">İletişim Telefon</label>
            <input 
              v-model="settings.contactPhone"
              type="tel"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </section>

      <!-- Sosyal Medya -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Sosyal Medya</h2>
        <div class="space-y-4">
          <div>
            <label class="block mb-1">Facebook</label>
            <input 
              v-model="settings.socialMedia.facebook"
              type="url"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="https://facebook.com/..."
            />
          </div>

          <div>
            <label class="block mb-1">Instagram</label>
            <input 
              v-model="settings.socialMedia.instagram"
              type="url"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label class="block mb-1">Twitter</label>
            <input 
              v-model="settings.socialMedia.twitter"
              type="url"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="https://twitter.com/..."
            />
          </div>
        </div>
      </section>

      <!-- SEO Ayarları -->
      <section>
        <h2 class="text-xl font-semibold mb-4">SEO Ayarları</h2>
        <div class="space-y-4">
          <div>
            <label class="block mb-1">Meta Başlık</label>
            <input 
              v-model="settings.seo.metaTitle"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block mb-1">Meta Açıklama</label>
            <textarea 
              v-model="settings.seo.metaDescription"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div>
            <label class="block mb-1">Meta Anahtar Kelimeler</label>
            <input 
              v-model="settings.seo.metaKeywords"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
              placeholder="kelime1, kelime2, kelime3"
            />
          </div>
        </div>
      </section>

      <!-- Bildirim Ayarları -->
      <section>
        <h2 class="text-xl font-semibold mb-4">Bildirim Ayarları</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <input 
              v-model="settings.notifications.orderEmail"
              type="checkbox"
              class="w-4 h-4 rounded text-blue-600"
              id="orderEmail"
            />
            <label for="orderEmail">Yeni sipariş e-posta bildirimi</label>
          </div>

          <div class="flex items-center gap-2">
            <input 
              v-model="settings.notifications.stockAlert"
              type="checkbox"
              class="w-4 h-4 rounded text-blue-600"
              id="stockAlert"
            />
            <label for="stockAlert">Düşük stok uyarısı</label>
          </div>

          <div>
            <label class="block mb-1">Düşük Stok Eşiği</label>
            <input 
              v-model.number="settings.notifications.stockThreshold"
              type="number"
              min="1"
              class="w-32 px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
      </section>

      <!-- Kaydet Butonu -->
      <div class="flex justify-end pt-4 border-t">
        <button 
          @click="saveSettings"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminSettings',
  data() {
    return {
      settings: {
        siteTitle: '',
        siteDescription: '',
        contactEmail: '',
        contactPhone: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: ''
        },
        seo: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: ''
        },
        notifications: {
          orderEmail: true,
          stockAlert: true,
          stockThreshold: 5
        }
      },
      isSaving: false
    }
  },
  methods: {
    async saveSettings() {
      this.isSaving = true
      
      try {
        await this.$store.dispatch('admin/updateSettings', this.settings)
        this.$toast.success('Ayarlar başarıyla kaydedildi')
      } catch (error) {
        this.$toast.error('Ayarlar kaydedilirken bir hata oluştu')
      } finally {
        this.isSaving = false
      }
    }
  },
  async created() {
    try {
      const settings = await this.$store.dispatch('admin/fetchSettings')
      this.settings = { ...this.settings, ...settings }
    } catch (error) {
      this.$toast.error('Ayarlar yüklenirken bir hata oluştu')
    }
  }
}
</script> 