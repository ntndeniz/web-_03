<template>
  <div class="delete-account">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold text-red-600">Hesap Silme</h1>
      <p class="text-gray-600">
        Hesabınızı silmek geri alınamaz bir işlemdir. Lütfen dikkatli olun.
      </p>
    </div>

    <!-- Uyarı Kartı -->
    <div class="bg-red-50 border border-red-200 p-6 rounded-lg mb-8">
      <h2 class="text-lg font-semibold text-red-700 mb-4">
        Hesabınızı Silmeden Önce Bilmeniz Gerekenler:
      </h2>
      <ul class="space-y-2 text-red-600">
        <li v-for="(warning, index) in warnings" 
            :key="index" 
            class="flex items-start">
          <span class="mr-2">•</span>
          {{ warning }}
        </li>
      </ul>
    </div>

    <!-- Silme Nedeni -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h3 class="text-lg font-semibold mb-4">
        Hesabınızı Silme Nedeniniz
      </h3>
      <select v-model="deleteReason" 
              class="w-full rounded-md border-gray-300 mb-4">
        <option value="">Lütfen bir neden seçin</option>
        <option v-for="reason in deleteReasons" 
                :key="reason.value" 
                :value="reason.value">
          {{ reason.label }}
        </option>
      </select>
      <textarea v-model="additionalFeedback"
                placeholder="Ek geri bildiriminiz (isteğe bağlı)"
                rows="4"
                class="w-full rounded-md border-gray-300">
      </textarea>
    </div>

    <!-- Doğrulama -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h3 class="text-lg font-semibold mb-4">Hesap Silme Doğrulaması</h3>
      
      <!-- Şifre Doğrulama -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Şifrenizi Girin
        </label>
        <input type="password"
               v-model="password"
               class="w-full rounded-md border-gray-300"
               placeholder="Mevcut şifreniz" />
      </div>

      <!-- Onay Kutusu -->
      <div class="mb-6">
        <label class="flex items-start">
          <input type="checkbox"
                 v-model="confirmDelete"
                 class="mt-1 rounded border-gray-300 text-red-600" />
          <span class="ml-2 text-sm text-gray-600">
            Hesabımı kalıcı olarak silmek istediğimi ve bu işlemin geri alınamayacağını anlıyorum.
          </span>
        </label>
      </div>

      <!-- Silme Butonu -->
      <button @click="initiateAccountDeletion"
              :disabled="!canDelete || deleting"
              class="w-full bg-red-600 text-white py-3 rounded-md
                     hover:bg-red-700 transition-colors disabled:opacity-50">
        {{ deleting ? 'İşlem Yapılıyor...' : 'Hesabımı Kalıcı Olarak Sil' }}
      </button>
    </div>

    <!-- Onay Modalı -->
    <modal v-model="showConfirmModal">
      <div class="p-6">
        <h3 class="text-xl font-bold mb-4">Son Onay</h3>
        <p class="text-gray-600 mb-6">
          Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz. 
          Devam etmek istediğinizden emin misiniz?
        </p>
        <div class="flex justify-end gap-4">
          <button @click="showConfirmModal = false"
                  class="px-4 py-2 border rounded-md">
            İptal
          </button>
          <button @click="confirmAccountDeletion"
                  class="px-4 py-2 bg-red-600 text-white rounded-md">
            Evet, Hesabımı Sil
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Modal from '@/components/common/Modal.vue';

export default {
  name: 'DeleteAccount',

  components: {
    Modal
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    
    const deleteReason = ref('');
    const additionalFeedback = ref('');
    const password = ref('');
    const confirmDelete = ref(false);
    const deleting = ref(false);
    const showConfirmModal = ref(false);

    const warnings = [
      'Tüm verileriniz kalıcı olarak silinecektir',
      'Aktif siparişleriniz iptal edilecektir',
      'Ödeme bilgileriniz silinecektir',
      'Puanlarınız ve indirim kuponlarınız geçersiz olacaktır',
      'Hesap silme işlemi geri alınamaz'
    ];

    const deleteReasons = [
      { value: 'not-useful', label: 'Hizmeti yararlı bulmuyorum' },
      { value: 'too-expensive', label: 'Fiyatlar çok yüksek' },
      { value: 'bad-experience', label: 'Kötü deneyim yaşadım' },
      { value: 'privacy', label: 'Gizlilik endişeleri' },
      { value: 'other', label: 'Diğer' }
    ];

    const canDelete = computed(() => {
      return deleteReason.value && 
             password.value && 
             confirmDelete.value;
    });

    const initiateAccountDeletion = () => {
      if (canDelete.value) {
        showConfirmModal.value = true;
      }
    };

    const confirmAccountDeletion = async () => {
      deleting.value = true;
      try {
        await store.dispatch('user/deleteAccount', {
          password: password.value,
          reason: deleteReason.value,
          feedback: additionalFeedback.value
        });
        
        // Başarılı silme işlemi sonrası
        await store.dispatch('auth/logout');
        router.push('/');
      } catch (error) {
        console.error('Hesap silinirken hata:', error);
        // Hata bildirimi göster
      } finally {
        deleting.value = false;
        showConfirmModal.value = false;
      }
    };

    return {
      deleteReason,
      additionalFeedback,
      password,
      confirmDelete,
      deleting,
      showConfirmModal,
      warnings,
      deleteReasons,
      canDelete,
      initiateAccountDeletion,
      confirmAccountDeletion
    };
  }
};
</script>

<style scoped>
.delete-account {
  @apply max-w-2xl mx-auto py-8 px-4;
}
</style> 