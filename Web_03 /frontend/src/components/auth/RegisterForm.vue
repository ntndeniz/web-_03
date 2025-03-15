<template>
  <div class="register-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Ad Soyad -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">
            Ad
          </label>
          <div class="mt-1">
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="input-field"
              :class="{ 'error': errors.firstName }"
            />
            <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
          </div>
        </div>

        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">
            Soyad
          </label>
          <div class="mt-1">
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="input-field"
              :class="{ 'error': errors.lastName }"
            />
            <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
          </div>
        </div>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          E-posta
        </label>
        <div class="mt-1">
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="input-field"
            :class="{ 'error': errors.email }"
          />
          <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        </div>
      </div>

      <!-- Şifre -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Şifre
        </label>
        <div class="mt-1 relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="input-field"
            :class="{ 'error': errors.password }"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <eye-icon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
            <eye-off-icon v-else class="h-5 w-5 text-gray-400" />
          </button>
          <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        </div>
      </div>

      <!-- Şifre Tekrar -->
      <div>
        <label for="passwordConfirm" class="block text-sm font-medium text-gray-700">
          Şifre Tekrar
        </label>
        <div class="mt-1">
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            type="password"
            required
            class="input-field"
            :class="{ 'error': errors.passwordConfirm }"
          />
          <p v-if="errors.passwordConfirm" class="error-message">{{ errors.passwordConfirm }}</p>
        </div>
      </div>

      <!-- Kullanım Şartları -->
      <div class="flex items-center">
        <input
          id="terms"
          v-model="form.terms"
          type="checkbox"
          required
          class="checkbox"
          :class="{ 'error': errors.terms }"
        />
        <label for="terms" class="ml-2 text-sm text-gray-600">
          <span>Kullanım şartlarını ve </span>
          <a href="#" class="text-primary-600 hover:text-primary-500">gizlilik politikasını</a>
          <span> kabul ediyorum</span>
        </label>
      </div>

      <!-- Kayıt Ol Butonu -->
      <div>
        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <spinner v-if="loading" class="h-5 w-5" />
          <span v-else>Kayıt Ol</span>
        </button>
      </div>

      <!-- Giriş Yap Linki -->
      <div class="text-center">
        <p class="text-sm text-gray-600">
          Zaten hesabınız var mı?
          <router-link
            to="/auth/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Giriş yapın
          </router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { validateEmail, validatePassword } from '@/utils/validators'
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'RegisterForm',

  components: {
    EyeIcon,
    EyeOffIcon,
    Spinner
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const loading = ref(false)
    const showPassword = ref(false)
    const errors = reactive({})

    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      terms: false
    })

    const validateForm = () => {
      errors.firstName = !form.firstName ? 'Ad alanı zorunludur' : ''
      errors.lastName = !form.lastName ? 'Soyad alanı zorunludur' : ''
      errors.email = validateEmail(form.email)
      errors.password = validatePassword(form.password)
      errors.passwordConfirm = form.password !== form.passwordConfirm ? 'Şifreler eşleşmiyor' : ''
      errors.terms = !form.terms ? 'Kullanım şartlarını kabul etmelisiniz' : ''

      return !Object.values(errors).some(error => error)
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await store.dispatch('auth/register', form)
        toast.success('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.')
        router.push('/auth/verify-email')
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    return {
      form,
      loading,
      errors,
      showPassword,
      handleSubmit,
      togglePassword
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

.checkbox {
  @apply h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded;
  
  &.error {
    @apply border-red-500;
  }
}

.btn-primary {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
         font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
         disabled:cursor-not-allowed;
}
</style> 