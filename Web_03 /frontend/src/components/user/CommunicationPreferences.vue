<template>
  <div class="communication-preferences">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">İletişim Tercihleri</h1>
      <p class="text-gray-600">Size nasıl ulaşmamızı tercih edersiniz?</p>
    </div>

    <form @submit.prevent="savePreferences" class="space-y-6">
      <!-- Email Bildirimleri -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">E-posta Bildirimleri</h2>
        <div class="space-y-4">
          <div v-for="pref in emailPreferences" 
               :key="pref.id" 
               class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">{{ pref.title }}</h3>
              <p class="text-sm text-gray-600">{{ pref.description }}</p>
            </div>
            <toggle-switch v-model="pref.enabled" />
          </div>
        </div>
      </div>

      <!-- SMS Bildirimleri -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">SMS Bildirimleri</h2>
        <div class="space-y-4">
          <div v-for="pref in smsPreferences" 
               :key="pref.id" 
               class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">{{ pref.title }}</h3>
              <p class="text-sm text-gray-600">{{ pref.description }}</p>
            </div>
            <toggle-switch v-model="pref.enabled" />
          </div>
        </div>
      </div>

      <!-- Push Bildirimleri -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Push Bildirimleri</h2>
        <div class="space-y-4">
          <div v-for="pref in pushPreferences" 
               :key="pref.id" 
               class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">{{ pref.title }}</h3>
              <p class="text-sm text-gray-600">{{ pref.description }}</p>
            </div>
            <toggle-switch v-model="pref.enabled" />
          </div>
        </div>
      </div>

      <!-- İletişim Zamanlaması -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">İletişim Zamanlaması</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Tercih Edilen Saat Aralığı
            </label>
            <select v-model="timePreference" 
                    class="mt-1 block w-full rounded-md border-gray-300">
              <option v-for="time in timeSlots" 
                      :key="time.value" 
                      :value="time.value">
                {{ time.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              İletişim Sıklığı
            </label>
            <select v-model="frequencyPreference" 
                    class="mt-1 block w-full rounded-md border-gray-300">
              <option v-for="freq in frequencies" 
                      :key="freq.value" 
                      :value="freq.value">
                {{ freq.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Kaydet Butonu -->
      <div class="flex justify-end">
        <button type="submit" 
                :disabled="saving"
                class="btn-primary">
          {{ saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import ToggleSwitch from '@/components/common/ToggleSwitch.vue';

export default {
  name: 'CommunicationPreferences',

  components: {
    ToggleSwitch
  },

  setup() {
    const store = useStore();
    const saving = ref(false);
    const timePreference = ref('');
    const frequencyPreference = ref('');

    const emailPreferences = ref([
      {
        id: 1,
        title: 'Promosyon E-postaları',
        description: 'İndirimler ve özel teklifler hakkında bilgilendirme',
        enabled: false
      },
      {
        id: 2,
        title: 'Sipariş Güncellemeleri',
        description: 'Siparişinizin durumu hakkında bilgilendirme',
        enabled: true
      },
      {
        id: 3,
        title: 'Ürün Tavsiyeleri',
        description: 'İlginizi çekebilecek ürünler hakkında öneriler',
        enabled: false
      }
    ]);

    const smsPreferences = ref([
      {
        id: 1,
        title: 'Teslimat Bildirimleri',
        description: 'Siparişinizin teslimat durumu hakkında SMS',
        enabled: true
      },
      {
        id: 2,
        title: 'Güvenlik Uyarıları',
        description: 'Hesap güvenliği ile ilgili SMS bildirimleri',
        enabled: true
      }
    ]);

    const pushPreferences = ref([
      {
        id: 1,
        title: 'Anlık Bildirimler',
        description: 'Uygulama bildirimleri',
        enabled: false
      },
      {
        id: 2,
        title: 'Stok Bildirimleri',
        description: 'İstediğiniz ürünler stoka girdiğinde bildirim',
        enabled: false
      }
    ]);

    const timeSlots = [
      { value: 'morning', label: 'Sabah (08:00 - 12:00)' },
      { value: 'afternoon', label: 'Öğleden Sonra (12:00 - 17:00)' },
      { value: 'evening', label: 'Akşam (17:00 - 21:00)' }
    ];

    const frequencies = [
      { value: 'daily', label: 'Günlük' },
      { value: 'weekly', label: 'Haftalık' },
      { value: 'monthly', label: 'Aylık' }
    ];

    const loadPreferences = async () => {
      try {
        const prefs = await store.dispatch('user/fetchCommunicationPreferences');
        emailPreferences.value = prefs.email;
        smsPreferences.value = prefs.sms;
        pushPreferences.value = prefs.push;
        timePreference.value = prefs.timeSlot;
        frequencyPreference.value = prefs.frequency;
      } catch (error) {
        console.error('Tercihler yüklenirken hata:', error);
      }
    };

    const savePreferences = async () => {
      saving.value = true;
      try {
        await store.dispatch('user/updateCommunicationPreferences', {
          email: emailPreferences.value,
          sms: smsPreferences.value,
          push: pushPreferences.value,
          timeSlot: timePreference.value,
          frequency: frequencyPreference.value
        });
        // Başarılı bildirim göster
      } catch (error) {
        console.error('Tercihler kaydedilirken hata:', error);
        // Hata bildirimi göster
      } finally {
        saving.value = false;
      }
    };

    onMounted(loadPreferences);

    return {
      saving,
      emailPreferences,
      smsPreferences,
      pushPreferences,
      timePreference,
      frequencyPreference,
      timeSlots,
      frequencies,
      savePreferences
    };
  }
};
</script>

<style scoped>
.communication-preferences {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-md 
         hover:bg-blue-700 transition-colors disabled:opacity-50;
}
</style> 