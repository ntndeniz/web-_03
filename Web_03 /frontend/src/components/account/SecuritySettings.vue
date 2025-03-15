<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold">Güvenlik Ayarları</h2>

    <!-- Şifre Değiştirme -->
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium">Şifre Değiştir</h3>
      <form @submit.prevent="changePassword" class="mt-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Mevcut Şifre
          </label>
          <input 
            v-model="passwordForm.currentPassword"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Yeni Şifre
          </label>
          <input 
            v-model="passwordForm.newPassword"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p class="mt-1 text-sm text-gray-500">
            En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Yeni Şifre (Tekrar)
          </label>
          <input 
            v-model="passwordForm.confirmPassword"
            type="password"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isPasswordLoading || !isPasswordFormValid"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="!isPasswordLoading">Şifreyi Güncelle</span>
            <LoadingSpinner v-else size="sm" color="white" />
          </button>
        </div>
      </form>
    </div>

    <!-- İki Faktörlü Doğrulama -->
    <div class="rounded-lg border p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium">İki Faktörlü Doğrulama</h3>
          <p class="mt-1 text-sm text-gray-600">
            Hesabınızı daha güvenli hale getirmek için iki faktörlü doğrulamayı etkinleştirin.
          </p>
        </div>
        <div class="relative inline-flex h-6 w-11 items-center rounded-full"
          :class="twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'"
        >
          <input
            type="checkbox"
            v-model="twoFactorEnabled"
            @change="toggleTwoFactor"
            class="sr-only"
          />
          <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition"
            :class="twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'"
          ></span>
        </div>
      </div>

      <!-- QR Kod ve Kurulum -->
      <div v-if="showTwoFactorSetup" class="mt-6 space-y-6">
        <div class="flex justify-center">
          <img 
            :src="twoFactorQrCode"
            alt="2FA QR Code"
            class="h-48 w-48"
          />
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            Google Authenticator veya benzer bir uygulama ile QR kodu tarayın.
          </p>
          <p class="mt-2 text-sm font-medium">
            Yedek Kod: {{ backupCode }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Bu kodu güvenli bir yerde saklayın. İki faktörlü doğrulamaya erişiminizi kaybetmeniz durumunda gerekecektir.
          </p>
        </div>

        <form @submit.prevent="verifyTwoFactor" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Doğrulama Kodu
            </label>
            <input 
              v-model="verificationCode"
              type="text"
              required
              maxlength="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="cancelTwoFactor"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              :disabled="isTwoFactorLoading || !verificationCode"
              class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <span v-if="!isTwoFactorLoading">Doğrula ve Etkinleştir</span>
              <LoadingSpinner v-else size="sm" color="white" />
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Oturum Geçmişi -->
    <div class="rounded-lg border p-6">
      <h3 class="text-lg font-medium">Oturum Geçmişi</h3>
      <div class="mt-4 space-y-4">
        <div 
          v-for="session in sessions"
          :key="session.id"
          class="flex items-center justify-between rounded-lg border p-4"
        >
          <div class="flex items-center space-x-4">
            <i 
              class="fas text-2xl text-gray-400"
              :class="getDeviceIcon(session.device)"
            ></i>
            <div>
              <p class="font-medium">{{ session.device }}</p>
              <p class="text-sm text-gray-600">
                {{ session.location }} • {{ formatDate(session.lastActive) }}
              </p>
            </div>
          </div>

          <button 
            v-if="!session.current"
            @click="terminateSession(session.id)"
            class="text-sm text-red-600 hover:text-red-500"
          >
            Oturumu Sonlandır
          </button>
          <span 
            v-else
            class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600"
          >
            Mevcut Oturum
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'SecuritySettings',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const isPasswordLoading = ref(false)
    const isTwoFactorLoading = ref(false)
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const twoFactorEnabled = ref(false)
    const showTwoFactorSetup = ref(false)
    const twoFactorQrCode = ref('')
    const backupCode = ref('')
    const verificationCode = ref('')
    const sessions = ref([])

    const isPasswordFormValid = computed(() => {
      const { currentPassword, newPassword, confirmPassword } = passwordForm.value
      return (
        currentPassword && 
        newPassword && 
        confirmPassword && 
        newPassword === confirmPassword &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(newPassword)
      )
    })

    const changePassword = async () => {
      if (!isPasswordFormValid.value) return

      isPasswordLoading.value = true
      try {
        await store.dispatch('auth/changePassword', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        })
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Şifreniz başarıyla güncellendi'
        })
        
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Şifre güncellenirken bir hata oluştu'
        })
      } finally {
        isPasswordLoading.value = false
      }
    }

    const toggleTwoFactor = async () => {
      if (twoFactorEnabled.value) {
        showTwoFactorSetup.value = true
        try {
          const response = await store.dispatch('auth/generateTwoFactorSecret')
          twoFactorQrCode.value = response.qrCode
          backupCode.value = response.backupCode
        } catch (error) {
          twoFactorEnabled.value = false
          store.dispatch('ui/showToast', {
            type: 'error',
            message: 'İki faktörlü doğrulama ayarlanırken bir hata oluştu'
          })
        }
      } else {
        try {
          await store.dispatch('auth/disableTwoFactor')
          showTwoFactorSetup.value = false
        } catch (error) {
          twoFactorEnabled.value = true
          store.dispatch('ui/showToast', {
            type: 'error',
            message: 'İki faktörlü doğrulama devre dışı bırakılırken bir hata oluştu'
          })
        }
      }
    }

    const verifyTwoFactor = async () => {
      isTwoFactorLoading.value = true
      try {
        await store.dispatch('auth/verifyAndEnableTwoFactor', verificationCode.value)
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'İki faktörlü doğrulama başarıyla etkinleştirildi'
        })
        
        showTwoFactorSetup.value = false
        verificationCode.value = ''
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Doğrulama başarısız oldu'
        })
      } finally {
        isTwoFactorLoading.value = false
      }
    }

    const cancelTwoFactor = () => {
      twoFactorEnabled.value = false
      showTwoFactorSetup.value = false
      verificationCode.value = ''
    }

    const getDeviceIcon = (device) => {
      const icons = {
        desktop: 'fa-desktop',
        mobile: 'fa-mobile-alt',
        tablet: 'fa-tablet-alt'
      }
      return icons[device.toLowerCase()] || 'fa-question-circle'
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: tr })
    }

    const terminateSession = async (sessionId) => {
      try {
        await store.dispatch('auth/terminateSession', sessionId)
        sessions.value = sessions.value.filter(s => s.id !== sessionId)
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Oturum başarıyla sonlandırıldı'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Oturum sonlandırılırken bir hata oluştu'
        })
      }
    }

    // Oturum geçmişini yükle
    const loadSessions = async () => {
      try {
        const response = await store.dispatch('auth/getSessions')
        sessions.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Oturum geçmişi yüklenirken bir hata oluştu'
        })
      }
    }

    loadSessions()

    return {
      isPasswordLoading,
      isTwoFactorLoading,
      passwordForm,
      isPasswordFormValid,
      twoFactorEnabled,
      showTwoFactorSetup,
      twoFactorQrCode,
      backupCode,
      verificationCode,
      sessions,
      changePassword,
      toggleTwoFactor,
      verifyTwoFactor,
      cancelTwoFactor,
      getDeviceIcon,
      formatDate,
      terminateSession
    }
  }
}
</script> 