<template>
  <div class="two-factor-auth">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">İki Faktörlü Kimlik Doğrulama</h1>
      <p class="text-gray-600">
        Hesabınızı daha güvenli hale getirin
      </p>
    </div>

    <!-- Durum -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold">
            {{ isEnabled ? '2FA Aktif' : '2FA Pasif' }}
          </h2>
          <p class="text-gray-600 mt-1">
            {{ isEnabled ? 'Hesabınız iki faktörlü kimlik doğrulama ile korunuyor' : 'Hesabınızı daha güvenli hale getirmek için 2FA\'yı etkinleştirin' }}
          </p>
        </div>
        <button
          @click="toggleTwoFactor"
          class="px-4 py-2 rounded-md font-medium"
          :class="isEnabled ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white'"
        >
          {{ isEnabled ? 'Devre Dışı Bırak' : 'Etkinleştir' }}
        </button>
      </div>
    </div>

    <!-- Kurulum Adımları -->
    <div v-if="showSetup" class="space-y-6">
      <!-- QR Kod -->
      <div class="bg-white p-6 rounded-lg shadow-sm text-center">
        <h3 class="text-lg font-medium mb-4">1. QR Kodu Tarayın</h3>
        <div class="mb-4">
          <img 
            :src="qrCode" 
            alt="2FA QR Code"
            class="mx-auto"
          />
        </div>
        <p class="text-sm text-gray-600">
          Google Authenticator veya benzer bir uygulama kullanarak QR kodu tarayın
        </p>
      </div>

      <!-- Doğrulama -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium mb-4">2. Kodu Doğrulayın</h3>
        <div class="max-w-xs mx-auto">
          <input
            v-model="verificationCode"
            type="text"
            placeholder="6 haneli kodu girin"
            class="w-full px-4 py-2 border rounded-md text-center text-2xl tracking-wide"
            maxlength="6"
          />
          <button
            @click="verifyCode"
            :disabled="!isValidCode"
            class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md font-medium disabled:opacity-50"
          >
            Doğrula ve Etkinleştir
          </button>
        </div>
      </div>

      <!-- Yedek Kodlar -->
      <div v-if="backupCodes.length" class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-lg font-medium mb-4">3. Yedek Kodlarınızı Saklayın</h3>
        <p class="text-sm text-gray-600 mb-4">
          Bu kodları güvenli bir yerde saklayın. Telefonunuza erişemediğiniz durumlarda bu kodları kullanabilirsiniz.
        </p>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div 
            v-for="code in backupCodes" 
            :key="code"
            class="bg-gray-50 p-2 text-center font-mono"
          >
            {{ code }}
          </div>
        </div>
        <button
          @click="downloadBackupCodes"
          class="w-full px-4 py-2 border border-gray-300 rounded-md font-medium"
        >
          Yedek Kodları İndir
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'TwoFactorAuth',
  
  setup() {
    const store = useStore();
    const isEnabled = ref(false);
    const showSetup = ref(false);
    const qrCode = ref('');
    const verificationCode = ref('');
    const backupCodes = ref([]);

    const isValidCode = computed(() => {
      return verificationCode.value.length === 6 && /^\d+$/.test(verificationCode.value);
    });

    const toggleTwoFactor = async () => {
      if (isEnabled.value) {
        try {
          await store.dispatch('auth/disable2FA');
          isEnabled.value = false;
          showSetup.value = false;
        } catch (error) {
          store.dispatch('ui/showToast', {
            type: 'error',
            message: '2FA devre dışı bırakılırken bir hata oluştu'
          });
        }
      } else {
        try {
          const response = await store.dispatch('auth/setup2FA');
          qrCode.value = response.qrCode;
          showSetup.value = true;
        } catch (error) {
          store.dispatch('ui/showToast', {
            type: 'error',
            message: '2FA kurulumu başlatılırken bir hata oluştu'
          });
        }
      }
    };

    const verifyCode = async () => {
      try {
        const response = await store.dispatch('auth/verify2FA', verificationCode.value);
        backupCodes.value = response.backupCodes;
        isEnabled.value = true;
        store.dispatch('ui/showToast', {
          type: 'success',
          message: '2FA başarıyla etkinleştirildi'
        });
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Doğrulama kodu hatalı'
        });
      }
    };

    const downloadBackupCodes = () => {
      const text = backupCodes.value.join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = '2fa-yedek-kodlar.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    };

    return {
      isEnabled,
      showSetup,
      qrCode,
      verificationCode,
      backupCodes,
      isValidCode,
      toggleTwoFactor,
      verifyCode,
      downloadBackupCodes
    };
  }
};
</script>

<style scoped>
.two-factor-auth {
  @apply max-w-2xl mx-auto py-8 px-4;
}
</style>