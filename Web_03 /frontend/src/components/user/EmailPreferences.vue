<template>
  <div class="email-preferences">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">E-posta Tercihleri</h1>
      <p class="text-gray-600">
        Hangi e-postaları almak istediğinizi yönetin
      </p>
    </div>

    <form @submit.prevent="savePreferences">
      <!-- Genel E-posta Ayarları -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold mb-4">Genel Ayarlar</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Tüm E-postalar</h3>
              <p class="text-sm text-gray-600">
                Tüm e-posta bildirimlerini aç/kapat
              </p>
            </div>
            <toggle-switch v-model="allEmails" 
                         @change="toggleAllEmails" />
          </div>
          <div class="border-t pt-4">
            <p class="text-sm text-gray-600">
              E-posta formatı:
            </p>
            <div class="mt-2 space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" 
                       v-model="emailFormat" 
                       value="html"
                       class="form-radio" />
                <span class="ml-2">HTML</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" 
                       v-model="emailFormat" 
                       value="text"
                       class="form-radio" />
                <span class="ml-2">Düz Metin</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Bildirim Kategorileri -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold mb-4">Bildirim Kategorileri</h2>
        <div class="space-y-6">
          <div v-for="category in categories" 
               :key="category.id" 
               class="border-b last:border-0 pb-4 last:pb-0">
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-medium">{{ category.title }}</h3>
                <p class="text-sm text-gray-600">
                  {{ category.description }}
                </p>
              </div>
              <toggle-switch v-model="category.enabled" 
                           :disabled="!allEmails" />
            </div>
            <div v-if="category.enabled" class="ml-6 space-y-3">
              <div v-for="option in category.options" 
                   :key="option.id" 
                   class="flex items-center justify-between">
                <label class="text-sm text-gray-700">
                  {{ option.label }}
                </label>
                <toggle-switch v-model="option.enabled" 
                             size="small" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gönderim Zamanlaması -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h2 class="text-xl font-semibold mb-4">Gönderim Zamanlaması</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tercih Edilen Sıklık
            </label>
            <select v-model="selectedFrequency" 
                    class="w-full rounded-md border-gray-300">
              <option v-for="freq in frequencies" 
                      :key="freq.value" 
                      :value="freq.value">
                {{ freq.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tercih Edilen Saat
            </label>
            <select v-model="timeWindow" 
                    class="w-full rounded-md border-gray-300">
              <option v-for="time in timeSlots" 
                      :key="time.value" 
                      :value="time.value">
                {{ time.label }}
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
          {{ saving ? 'Kaydediliyor...' : 'Tercihleri Kaydet' }}
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
  name: 'EmailPreferences',
  
  components: {
    ToggleSwitch
  },

  setup() {
    const store = useStore();
    const saving = ref(false);
    const allEmails = ref(true);
    const emailFormat = ref('html');
    const selectedFrequency = ref('daily');
    const timeWindow = ref('09:00');
    const categories = ref([]);

    const frequencies = [
      { value: 'realtime', label: 'Anında' },
      { value: 'daily', label: 'Günlük Özet' },
      { value: 'weekly', label: 'Haftalık Özet' }
    ];

    const timeSlots = [
      { value: '09:00', label: '09:00' },
      { value: '10:00', label: '10:00' },
      { value: '11:00', label: '11:00' },
      { value: '12:00', label: '12:00' },
      { value: '13:00', label: '13:00' },
      { value: '14:00', label: '14:00' },
      { value: '15:00', label: '15:00' },
      { value: '16:00', label: '16:00' },
      { value: '17:00', label: '17:00' }
    ];

    const toggleAllEmails = (value) => {
      categories.value.forEach(category => {
        category.enabled = value;
        if (!value) {
          category.options.forEach(option => {
            option.enabled = false;
          });
        }
      });
    };

    const loadPreferences = async () => {
      try {
        const prefs = await store.dispatch('user/fetchEmailPreferences');
        allEmails.value = prefs.allEmails;
        emailFormat.value = prefs.format;
        selectedFrequency.value = prefs.frequency;
        timeWindow.value = prefs.timeWindow;
        categories.value = prefs.categories;
      } catch (error) {
        console.error('Tercihler yüklenirken hata:', error);
      }
    };

    const savePreferences = async () => {
      saving.value = true;
      try {
        await store.dispatch('user/updateEmailPreferences', {
          allEmails: allEmails.value,
          format: emailFormat.value,
          frequency: selectedFrequency.value,
          timeWindow: timeWindow.value,
          categories: categories.value
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
      allEmails,
      emailFormat,
      categories,
      selectedFrequency,
      frequencies,
      timeWindow,
      timeSlots,
      toggleAllEmails,
      savePreferences
    };
  }
};
</script>

<style scoped>
.email-preferences {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-md 
         hover:bg-blue-700 transition-colors disabled:opacity-50;
}
</style> 