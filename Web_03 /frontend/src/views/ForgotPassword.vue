<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-gray-900">
        Şifremi Unuttum
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Başarılı Mesajı -->
        <div 
          v-if="success"
          class="rounded-md bg-green-50 p-4 mb-6"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-check-circle text-green-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-green-800">
                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.
                Lütfen e-postanızı kontrol edin.
              </p>
            </div>
          </div>
        </div>

        <form 
          v-else
          @submit.prevent="handleSubmit" 
          class="space-y-6"
        >
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
                v-model="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <p v-if="error" class="mt-2 text-sm text-red-600">
              {{ error }}
            </p>
          </div>

          <!-- Gönder Butonu -->
          <div>
            <button 
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder' }}
            </button>
          </div>

          <!-- Geri Dön -->
          <div class="text-sm text-center">
            <router-link 
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Giriş sayfasına dön
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ForgotPasswordPage',
  setup() {
    const store = useStore()
    
    const email = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)

    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''
        
        await store.dispatch('forgotPassword', email.value)
        success.value = true
      } catch (err) {
        error.value = err.response?.data?.message || 
          'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      error,
      success,
      handleSubmit
    }
  }
}
</script> 