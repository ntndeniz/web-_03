<template>
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Şifremi Unuttum</h2>
      <p class="mt-2 text-sm text-gray-600">
        E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- E-posta -->
      <div>
        <label class="block text-sm font-medium text-gray-700">E-posta</label>
        <input
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          :class="{ 'border-red-500': error }"
        />
        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Gönder Butonu -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <span v-if="!loading">Şifre Sıfırlama Bağlantısı Gönder</span>
        <i v-else class="fas fa-circle-notch fa-spin"></i>
      </button>

      <!-- Başarılı Mesajı -->
      <div v-if="success" class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Şifre sıfırlama bağlantısı e-posta adresinize gönderildi
            </p>
          </div>
        </div>
      </div>

      <!-- Giriş Yap Linki -->
      <p class="text-center text-sm text-gray-600">
        Giriş yapmak için
        <router-link to="/giris" class="font-medium text-blue-600 hover:text-blue-500">
          tıklayın
        </router-link>
      </p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ForgotPassword',

  setup() {
    const store = useStore()
    const email = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)

    const handleSubmit = async () => {
      if (!email.value) {
        error.value = 'E-posta adresi gereklidir'
        return
      }

      loading.value = true
      error.value = ''
      success.value = false

      try {
        await store.dispatch('auth/sendPasswordResetEmail', email.value)
        success.value = true
        email.value = ''
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          error.value = 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı'
        } else {
          error.value = 'Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu'
        }
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