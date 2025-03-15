<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Email Alanı -->
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

      <!-- Şifre Alanı -->
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

      <!-- Beni Hatırla -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember"
            v-model="form.remember"
            type="checkbox"
            class="checkbox"
          />
          <label for="remember" class="ml-2 text-sm text-gray-600">
            Beni hatırla
          </label>
        </div>
        <router-link
          to="/auth/forgot-password"
          class="text-sm text-primary-600 hover:text-primary-500"
        >
          Şifremi unuttum
        </router-link>
      </div>

      <!-- Giriş Butonu -->
      <div>
        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <spinner v-if="loading" class="h-5 w-5" />
          <span v-else>Giriş Yap</span>
        </button>
      </div>

      <!-- Sosyal Medya Girişi -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">
              Veya şununla devam et
            </span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="loginWithGoogle"
            class="btn-social"
          >
            <google-icon class="h-5 w-5" />
            <span class="ml-2">Google</span>
          </button>
          <button
            type="button"
            @click="loginWithFacebook"
            class="btn-social"
          >
            <facebook-icon class="h-5 w-5" />
            <span class="ml-2">Facebook</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { validateEmail } from '@/utils/validators'
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import FacebookIcon from '@/components/icons/FacebookIcon.vue'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'LoginForm',

  components: {
    EyeIcon,
    EyeOffIcon,
    GoogleIcon,
    FacebookIcon,
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
      email: '',
      password: '',
      remember: false
    })

    const validateForm = () => {
      errors.email = validateEmail(form.email)
      errors.password = form.password.length < 6 ? 'Şifre en az 6 karakter olmalıdır' : ''
      return !errors.email && !errors.password
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await store.dispatch('auth/login', form)
        toast.success('Başarıyla giriş yapıldı')
        router.push('/dashboard')
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    const loginWithGoogle = async () => {
      try {
        await store.dispatch('auth/loginWithGoogle')
        router.push('/dashboard')
      } catch (error) {
        toast.error(error.message)
      }
    }

    const loginWithFacebook = async () => {
      try {
        await store.dispatch('auth/loginWithFacebook')
        router.push('/dashboard')
      } catch (error) {
        toast.error(error.message)
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
      loginWithGoogle,
      loginWithFacebook,
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
}

.btn-primary {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
         font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
         disabled:cursor-not-allowed;
}

.btn-social {
  @apply w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md 
         shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50;
}
</style> 