<template>
  <div class="phone-verification">
    <div class="text-center">
      <phone-icon class="mx-auto h-12 w-12 text-primary-600" />
      <h2 class="mt-4 text-3xl font-extrabold text-gray-900">
        Telefon Doğrulama
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        {{ phone }} numarasına doğrulama kodu gönderildi.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <!-- Doğrulama Kodu -->
      <div>
        <label for="code" class="sr-only">Doğrulama Kodu</label>
        <div class="flex justify-center space-x-2">
          <input
            v-for="(digit, index) in codeDigits"
            :key="index"
            :id="`code-${index}`"
            v-model="codeDigits[index]"
            type="text"
            maxlength="1"
            class="verification-input"
            :class="{ 'error': error }"
            @input="handleDigitInput($event, index)"
            @keydown.delete="handleDelete($event, index)"
            @paste="handlePaste"
          />
        </div>
        <p v-if="error" class="error-message text-center">{{ error }}</p>
      </div>

      <!-- Doğrula Butonu -->
      <div>
        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading || !isCodeComplete"
        >
          <spinner v-if="loading" class="h-5 w-5" />
          <span v-else>Doğrula</span>
        </button>
      </div>

      <!-- Yeniden Gönder -->
      <div class="text-center">
        <p v-if="!resendDisabled" class="text-sm text-gray-600">
          Kod gelmedi mi?
          <button
            type="button"
            @click="handleResend"
            class="font-medium text-primary-600 hover:text-primary-500"
            :disabled="loading"
          >
            Tekrar gönder
          </button>
        </p>
        <p v-else class="text-sm text-gray-600">
          {{ countdown }} saniye sonra tekrar deneyebilirsiniz
        </p>
      </div>

      <!-- Numara Değiştir -->
      <div class="text-center">
        <button
          type="button"
          @click="showPhoneChangeForm = true"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Telefon numarasını değiştir
        </button>
      </div>

      <!-- Numara Değiştirme Formu -->
      <form
        v-if="showPhoneChangeForm"
        @submit.prevent="handlePhoneChange"
        class="mt-4 space-y-4"
      >
        <div>
          <label for="newPhone" class="sr-only">Yeni Telefon</label>
          <input
            id="newPhone"
            v-model="newPhone"
            type="tel"
            required
            class="input-field"
            placeholder="Yeni telefon numarası"
            :class="{ 'error': phoneError }"
          />
          <p v-if="phoneError" class="error-message">{{ phoneError }}</p>
        </div>

        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <spinner v-if="loading" class="h-5 w-5" />
          <span v-else>Numarayı Güncelle</span>
        </button>
      </form>
    </form>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { validatePhone } from '@/utils/validators'
import { PhoneIcon } from '@heroicons/vue/outline'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'PhoneVerification',

  components: {
    PhoneIcon,
    Spinner
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const loading = ref(false)
    const countdown = ref(0)
    const showPhoneChangeForm = ref(false)
    const newPhone = ref('')
    const phoneError = ref('')
    const error = ref('')
    const codeDigits = ref(['', '', '', '', '', ''])

    const phone = computed(() => store.state.auth.user?.phone)
    const resendDisabled = computed(() => countdown.value > 0)
    const isCodeComplete = computed(() => codeDigits.value.every(digit => digit !== ''))

    const startCountdown = () => {
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value === 0) {
          clearInterval(timer)
        }
      }, 1000)
    }

    const handleDigitInput = (event, index) => {
      const value = event.target.value
      if (!/^\d*$/.test(value)) {
        codeDigits.value[index] = ''
        return
      }
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus()
      }
      error.value = ''
    }

    const handleDelete = (event, index) => {
      if (!codeDigits.value[index] && index > 0) {
        codeDigits.value[index - 1] = ''
        document.getElementById(`code-${index - 1}`).focus()
      }
    }

    const handlePaste = (event) => {
      event.preventDefault()
      const pastedText = event.clipboardData.getData('text')
      const digits = pastedText.match(/\d/g)
      if (digits) {
        codeDigits.value = [...digits.slice(0, 6), ...Array(6).fill('')].slice(0, 6)
      }
    }

    const handleSubmit = async () => {
      const code = codeDigits.value.join('')
      if (code.length !== 6) {
        error.value = 'Lütfen 6 haneli kodu giriniz'
        return
      }

      loading.value = true
      try {
        await store.dispatch('auth/verifyPhone', code)
        toast.success('Telefon numarası başarıyla doğrulandı')
        router.push('/dashboard')
      } catch (err) {
        error.value = 'Geçersiz doğrulama kodu'
        codeDigits.value = ['', '', '', '', '', '']
      } finally {
        loading.value = false
      }
    }

    const handleResend = async () => {
      if (resendDisabled.value) return

      loading.value = true
      try {
        await store.dispatch('auth/resendPhoneVerification')
        toast.success('Doğrulama kodu yeniden gönderildi')
        startCountdown()
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    const handlePhoneChange = async () => {
      phoneError.value = validatePhone(newPhone.value)
      if (phoneError.value) return

      loading.value = true
      try {
        await store.dispatch('auth/updatePhone', newPhone.value)
        await store.dispatch('auth/resendPhoneVerification')
        toast.success('Telefon numarası güncellendi ve yeni doğrulama kodu gönderildi')
        showPhoneChangeForm.value = false
        newPhone.value = ''
        startCountdown()
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      phone,
      loading,
      countdown,
      resendDisabled,
      showPhoneChangeForm,
      newPhone,
      phoneError,
      error,
      codeDigits,
      isCodeComplete,
      handleDigitInput,
      handleDelete,
      handlePaste,
      handleSubmit,
      handleResend,
      handlePhoneChange
    }
  }
}
</script>

<style lang="scss" scoped>
.verification-input {
  @apply w-12 h-12 text-center text-2xl border border-gray-300 rounded-md shadow-sm 
         focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  
  &.error {
    @apply border-red-500;
  }
}

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