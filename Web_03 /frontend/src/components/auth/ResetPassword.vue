<template>
  <div class="reset-password">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-extrabold text-gray-900">
        Şifre Sıfırlama
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Yeni şifrenizi belirleyin
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Yeni Şifre -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Yeni Şifre
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

      <!-- Şifre Sıfırla Butonu -->
      <div>
        <button
          type="submit"
          class="btn-primary w-full"
          :disabled="loading"
        >
          <spinner v-if="loading" class="h-5 w-5" />
          <span v-else>Şifreyi Sıfırla</span>
        </button>
      </div>

      <!-- Giriş Yap Linki -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Giriş sayfasına dön
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { validatePassword } from '@/utils/validators'
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'ResetPassword',

  components: {
    EyeIcon,
    EyeOffIcon,
    Spinner
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()

    const loading = ref(false)
    const showPassword = ref(false)
    const errors = reactive({})

    const form = reactive({
      password: '',
      passwordConfirm: '',
      token: route.query.token
    })

    const validateForm = () => {
      errors.password = validatePassword(form.password)
      errors.passwordConfirm = form.password !== form.passwordConfirm ? 'Şifreler eşleşmiyor' : ''
      return !errors.password && !errors.passwordConfirm
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await store.dispatch('auth/resetPassword', form)
        toast.success('Şifreniz başarıyla sıfırlandı')
        router.push('/auth/login')
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

.btn-primary {
  @apply flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
         font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
         disabled:cursor-not-allowed;
}
</style> 