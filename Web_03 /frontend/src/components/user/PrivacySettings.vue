<template>
  <div class="privacy-settings">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">Gizlilik Ayarları</h1>
      <p class="text-gray-600">Kişisel verilerinizin nasıl kullanıldığını yönetin</p>
    </div>

    <form @submit.prevent="saveSettings" class="space-y-6">
      <!-- Veri Kullanımı -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Veri Kullanımı</h2>
        <div class="space-y-4">
          <div v-for="setting in dataUsageSettings" 
               :key="setting.id" 
               class="flex items-start justify-between">
            <div>
              <h3 class="font-medium">{{ setting.title }}</h3>
              <p class="text-sm text-gray-600">{{ setting.description }}</p>
            </div>
            <toggle-switch v-model="setting.enabled" />
          </div>
        </div>
      </div>

      <!-- Profil Görünürlüğü -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Profil Görünürlüğü</h2>
        <div class="space-y-4">
          <div v-for="setting in visibilitySettings" 
               :key="setting.id" 
               class="flex items-start justify-between">
            <div>
              <h3 class="font-medium">{{ setting.title }}</h3>
              <p class="text-sm text-gray-600">{{ setting.description }}</p>
            </div>
            <select v-model="setting.value" 
                    class="rounded-md border-gray-300">
              <option v-for="option in privacyOptions" 
                      :key="option.value" 
                      :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Çerez Tercihleri -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Çerez Tercihleri</h2>
        <div class="space-y-4">
          <div v-for="setting in cookieSettings" 
               :key="setting.id" 
               class="flex items-start justify-between">
            <div>
              <h3 class="font-medium">{{ setting.title }}</h3>
              <p class="text-sm text-gray-600">{{ setting.description }}</p>
            </div>
            <toggle-switch v-model="setting.enabled" 
                         :disabled="setting.required" />
          </div>
        </div>
      </div>

      <!-- Veri İndirme -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Verilerinizi İndirin</h2>
        <p class="text-gray-600 mb-4">
          Hesabınızla ilgili tüm verilerin bir kopyasını indirin
        </p>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <button type="button" 
                    @click="requestDataDownload"
                    :disabled="downloadRequested"
                    class="btn-secondary">
              {{ downloadRequested ? 'İstek Gönderildi' : 'Veri İndirme İsteği' }}
            </button>
            <p v-if="lastDownloadDate" class="text-sm text-gray-600">
              Son indirme: {{ formatDate(lastDownloadDate) }}
            </p>
          </div>
          <div class="text-sm text-gray-600">
            <p>İndirme içeriği:</p>
            <ul class="list-disc ml-5 mt-2">
              <li>Profil bilgileri</li>
              <li>Sipariş geçmişi</li>
              <li>İletişim tercihleri</li>
              <li>Adres bilgileri</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Kaydet Butonu -->
      <div class="flex justify-end">
        <button type="submit" 
                :disabled="saving"
                class="btn-primary">
          {{ saving ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/date';
import ToggleSwitch from '@/components/common/ToggleSwitch.vue';

export default {
  name: 'PrivacySettings',

  components: {
    ToggleSwitch
  },

  setup() {
    const store = useStore();
    const saving = ref(false);
    const downloadRequested = ref(false);
    const lastDownloadDate = ref(null);

    const dataUsageSettings = ref([
      {
        id: 1,
        title: 'Kişiselleştirilmiş Deneyim',
        description: 'Tercihlerinize göre özelleştirilmiş içerik ve öneriler',
        enabled: true
      },
      {
        id: 2,
        title: 'Analitik Veriler',
        description: 'Hizmet kalitesini artırmak için kullanım verileri',
        enabled: true
      },
      {
        id: 3,
        title: 'Konum Verileri',
        description: 'Konuma dayalı hizmetler için konum bilgisi',
        enabled: false
      }
    ]);

    const visibilitySettings = ref([
      {
        id: 1,
        title: 'Profil Görünürlüğü',
        description: 'Profilinizi kimlerin görebileceğini seçin',
        value: 'public'
      },
      {
        id: 2,
        title: 'Sipariş Geçmişi',
        description: 'Sipariş geçmişinizi kimlerin görebileceğini seçin',
        value: 'private'
      },
      {
        id: 3,
        title: 'İnceleme ve Yorumlar',
        description: 'Yorumlarınızı kimlerin görebileceğini seçin',
        value: 'friends'
      }
    ]);

    const cookieSettings = ref([
      {
        id: 1,
        title: 'Zorunlu Çerezler',
        description: 'Sitenin çalışması için gerekli temel çerezler',
        enabled: true,
        required: true
      },
      {
        id: 2,
        title: 'Performans Çerezleri',
        description: 'Site performansını ölçmek için kullanılan çerezler',
        enabled: true,
        required: false
      },
      {
        id: 3,
        title: 'Pazarlama Çerezleri',
        description: 'Kişiselleştirilmiş reklamlar için kullanılan çerezler',
        enabled: false,
        required: false
      }
    ]);

    const privacyOptions = [
      { value: 'public', label: 'Herkese Açık' },
      { value: 'friends', label: 'Sadece Arkadaşlar' },
      { value: 'private', label: 'Sadece Ben' }
    ];

    const loadSettings = async () => {
      try {
        const settings = await store.dispatch('user/fetchPrivacySettings');
        dataUsageSettings.value = settings.dataUsage;
        visibilitySettings.value = settings.visibility;
        cookieSettings.value = settings.cookies;
        lastDownloadDate.value = settings.lastDownloadDate;
      } catch (error) {
        console.error('Ayarlar yüklenirken hata:', error);
      }
    };

    const saveSettings = async () => {
      saving.value = true;
      try {
        await store.dispatch('user/updatePrivacySettings', {
          dataUsage: dataUsageSettings.value,
          visibility: visibilitySettings.value,
          cookies: cookieSettings.value
        });
        // Başarılı bildirim göster
      } catch (error) {
        console.error('Ayarlar kaydedilirken hata:', error);
        // Hata bildirimi göster
      } finally {
        saving.value = false;
      }
    };

    const requestDataDownload = async () => {
      try {
        await store.dispatch('user/requestDataDownload');
        downloadRequested.value = true;
        // Başarılı bildirim göster
      } catch (error) {
        console.error('Veri indirme isteği gönderilirken hata:', error);
        // Hata bildirimi göster
      }
    };

    onMounted(loadSettings);

    return {
      saving,
      downloadRequested,
      lastDownloadDate,
      dataUsageSettings,
      visibilitySettings,
      cookieSettings,
      privacyOptions,
      formatDate,
      saveSettings,
      requestDataDownload
    };
  }
};
</script>

<style scoped>
.privacy-settings {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-md 
         hover:bg-blue-700 transition-colors disabled:opacity-50;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700 px-6 py-2 rounded-md 
         hover:bg-gray-200 transition-colors disabled:opacity-50;
}
</style> 