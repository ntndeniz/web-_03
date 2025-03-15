<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold text-gray-900">
        Şifre Sıfırlama
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Lütfen yeni şifrenizi belirleyin.
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
                Şifreniz başarıyla güncellendi.
                <router-link 
                  to="/login"
                  class="font-medium text-green-700 underline"
                >
                  Giriş yapmak için tıklayın
                </router-link>
              </p>
            </div>
          </div>
        </div>

        <form 
          v-else
          @submit.prevent="handleSubmit" 
          class="space-y-6"
        >
          <!-- Yeni Şifre -->
          <div>
            <label 
              for="password" 
              class="block text-sm font-medium text-gray-700"
            >
              Yeni Şifre
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

          <!-- Şifre Tekrar -->
          <div>
            <label 
              for="password_confirmation" 
              class="block text-sm font-medium text-gray-700"
            >
              Şifre Tekrar
            </label>
            <div class="mt-1 relative">
              <input 
                id="password_confirmation"
                v-model="form.password_confirmation"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
              <button 
                type="button"
                @click="showPasswordConfirmation = !showPasswordConfirmation"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i 
                  class="fas" 
                  :class="showPasswordConfirmation ? 'fa-eye-slash' : 'fa-eye'"
                ></i>
              </button>
            </div>
            <p v-if="errors.password_confirmation" class="mt-2 text-sm text-red-600">
              {{ errors.password_confirmation }}
            </p>
          </div>

          <!-- Şifre Güncelle Butonu -->
          <div>
            <button 
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ResetPasswordPage',
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
    const form = ref({
      password: '',
      password_confirmation: '',
      token: route.params.token
    })

    const loading = ref(false)
    const errors = ref({})
    const success = ref(false)
    const showPassword = ref(false)
    const showPasswordConfirmation = ref(false)

    const handleSubmit = async () => {
      try {
        loading.value = true
        errors.value = {}

        if (form.value.password !== form.value.password_confirmation) {
          errors.value.password_confirmation = 'Şifreler eşleşmiyor'
          return
        }

        await store.dispatch('resetPassword', form.value)
        success.value = true
        
        // 3 saniye sonra login sayfasına yönlendir
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (err) {
        errors.value = err.response?.data?.errors || {
          password: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      errors,
      success,
      showPassword,
      showPasswordConfirmation,
      handleSubmit
    }
  }
}
</script> 