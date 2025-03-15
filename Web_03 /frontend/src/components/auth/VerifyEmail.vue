<template>
  <div class="verify-email">
    <div class="text-center">
      <mail-icon class="mx-auto h-12 w-12 text-primary-600" />
      <h2 class="mt-4 text-3xl font-extrabold text-gray-900">
        E-posta Doğrulama
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        {{ email }} adresine doğrulama bağlantısı gönderildi.
        Lütfen e-postanızı kontrol edin.
      </p>
    </div>

    <div class="mt-8 space-y-4">
      <!-- Yeniden Gönder -->
      <div v-if="!resendDisabled" class="text-center">
        <p class="text-sm text-gray-600">
          E-posta almadınız mı?
          <button
            type="button"
            @click="handleResend"
            class="font-medium text-primary-600 hover:text-primary-500"
            :disabled="loading"
          >
            Tekrar gönder
          </button>
        </p>
      </div>

      <!-- Zamanlayıcı -->
      <div v-else class="text-center">
        <p class="text-sm text-gray-600">
          {{ countdown }} saniye sonra tekrar deneyebilirsiniz
        </p>
      </div>

      <!-- E-posta Değiştir -->
      <div class="text-center">
        <button
          type="button"
          @click="showEmailChangeForm = true"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          E-posta adresini değiştir
        </button>
      </div>

      <!-- E-posta Değiştirme Formu -->
      <form
        v-if="showEmailChangeForm"
        @submit.prevent="handleEmailChange"
        class="mt-4 space-y-4"
      >
        <div>
          <label for="newEmail" class="sr-only">Yeni E-posta</label>
          <input
            id="newEmail"
            v-model="newEmail"
            type="email"
            required
            class="input-field"
            placeholder="Yeni e-posta adresi"
            :class="{ 'error': emailError }"
          />
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <spinner v-if="loading" class="h-5 w-5" />
          <span v-else>E-posta Adresini Güncelle</span>
        </button>
      </form>

      <!-- Giriş Yap Linki -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Giriş sayfasına dön
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { validateEmail } from '@/utils/validators'
import { MailIcon } from '@heroicons/vue/outline'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'VerifyEmail',

  components: {
    MailIcon,
    Spinner
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const loading = ref(false)
    const countdown = ref(0)
    const showEmailChangeForm = ref(false)
    const newEmail = ref('')
    const emailError = ref('')

    const email = computed(() => store.state.auth.user?.email)
    const resendDisabled = computed(() => countdown.value > 0)

    const startCountdown = () => {
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
          clearInterval(timer)
        }
      }, 1000)
    }

    const handleResend = async () => {
      if (resendDisabled.value) return

      loading.value = true
      try {
        await store.dispatch('auth/resendVerificationEmail')
        toast.success('Doğrulama e-postası yeniden gönderildi')
        startCountdown()
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleEmailChange = async () => {
      emailError.value = validateEmail(newEmail.value)
      if (emailError.value) return

      loading.value = true
      try {
        await store.dispatch('auth/updateEmail', newEmail.value)
        await store.dispatch('auth/resendVerificationEmail')
        toast.success('E-posta adresi güncellendi ve yeni doğrulama e-postası gönderildi')
        showEmailChangeForm.value = false
        newEmail.value = ''
        startCountdown()
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      countdown,
      resendDisabled,
      showEmailChangeForm,
      newEmail,
      emailError,
      handleResend,
      handleEmailChange
    }
  }
}
</script>

<style lang="scss" scoped>
.input-field {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
         placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  
  &.error {
    @apply border-red-500;
  }
}

.error-message {
  @apply mt-2 text-sm text-red-600;
}

.btn-primary {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
         font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
         disabled:cursor-not-allowed;
}
</style> 