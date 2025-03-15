<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-gray-900">
        Hesabınıza Giriş Yapın
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Hesabınız yok mu?
        <router-link 
          to="/register" 
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          Hemen üye olun
        </router-link>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- E-posta -->
          <div>
            <label 
              for="email" 
              class="block text-sm font-medium text-gray-700"
            >
              E-posta
            </label>
            <div class="mt-1">
              <input 
                id="email"
                v-model="form.email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Şifre -->
          <div>
            <label 
              for="password" 
              class="block text-sm font-medium text-gray-700"
            >
              Şifre
            </label>
            <div class="mt-1 relative">
              <input 
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i 
                  class="fas" 
                  :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>

          <!-- Beni Hatırla & Şifremi Unuttum -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember_me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label 
                for="remember_me" 
                class="ml-2 block text-sm text-gray-900"
              >
                Beni hatırla
              </label>
            </div>

            <div class="text-sm">
              <router-link 
                to="/forgot-password"
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Şifremi unuttum
              </router-link>
            </div>
          </div>

          <!-- Giriş Butonu -->
          <div>
            <button 
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
            </button>
          </div>
        </form>

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
              @click="socialLogin('google')"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i class="fab fa-google text-red-600 mr-2"></i>
              Google
            </button>

            <button 
              type="button"
              @click="socialLogin('facebook')"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <i class="fab fa-facebook text-blue-600 mr-2"></i>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginPage',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const form = ref({
      email: '',
      password: '',
      rememberMe: false
    })

    const loading = ref(false)
    const showPassword = ref(false)
    const errors = ref({})

    const handleSubmit = async () => {
      try {
        loading.value = true
        errors.value = {}

        await store.dispatch('login', {
          email: form.value.email,
          password: form.value.password,
          rememberMe: form.value.rememberMe
        })

        router.push('/')
      } catch (error) {
        if (error.response?.data?.errors) {
          errors.value = error.response.data.errors
        } else {
          errors.value = {
            email: 'Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.'
          }
        }
      } finally {
        loading.value = false
      }
    }

    const socialLogin = async (provider) => {
      try {
        await store.dispatch('socialLogin', provider)
        router.push('/')
      } catch (error) {
        console.error(`${provider} ile giriş yapılırken hata oluştu:`, error)
      }
    }

    return {
      form,
      loading,
      showPassword,
      errors,
      handleSubmit,
      socialLogin
    }
  }
}
</script> 