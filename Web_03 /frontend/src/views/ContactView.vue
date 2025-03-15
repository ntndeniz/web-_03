<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-primary-500 py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-white text-center">İletişim</h1>
        <p class="mt-4 text-primary-100 text-center max-w-2xl mx-auto">
          Bizimle iletişime geçmek için aşağıdaki formu kullanabilirsiniz.
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <!-- İletişim Başlığı -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4">İletişim</h1>
          <p class="text-gray-600">
            Bizimle iletişime geçmek için aşağıdaki formu kullanabilirsiniz.
          </p>
        </div>

        <!-- İletişim Formu -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Ad Soyad -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                Ad Soyad
              </label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
            </div>

            <!-- E-posta -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
            </div>
          </div>

          <!-- Konu -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
              Konu
            </label>
            <input
              type="text"
              id="subject"
              v-model="formData.subject"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
          </div>

          <!-- Mesaj -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
              Mesajınız
            </label>
            <textarea
              id="message"
              v-model="formData.message"
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>

          <!-- Gönder Butonu -->
          <div class="text-center">
            <button
              type="submit"
              class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              :disabled="loading"
            >
              <span v-if="!loading">Gönder</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gönderiliyor...
              </span>
            </button>
          </div>
        </form>

        <!-- İletişim Bilgileri -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-map-marker-alt text-blue-600 text-xl"></i>
              </div>
            </div>
            <h3 class="font-semibold mb-2">Adres</h3>
            <p class="text-gray-600">İstanbul, Türkiye</p>
          </div>

          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-phone text-blue-600 text-xl"></i>
              </div>
            </div>
            <h3 class="font-semibold mb-2">Telefon</h3>
            <p class="text-gray-600">+90 (555) 123 45 67</p>
          </div>

          <div class="text-center">
            <div class="flex justify-center mb-4">
              <div class="p-3 bg-blue-100 rounded-full">
                <i class="fas fa-envelope text-blue-600 text-xl"></i>
              </div>
            </div>
            <h3 class="font-semibold mb-2">E-posta</h3>
            <p class="text-gray-600">info@example.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ContactView',
  
  setup() {
    const store = useStore()
    const loading = ref(false)
    
    const formData = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    const submitForm = async () => {
      loading.value = true
      try {
        // Form gönderme işlemi burada yapılacak
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simüle edilmiş gecikme
        
        // Başarılı bildirim göster
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Mesajınız başarıyla gönderildi!'
        })
        
        // Formu temizle
        formData.value = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }
      } catch (error) {
        // Hata bildirimi göster
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      formData,
      loading,
      submitForm
    }
  }
}
</script> 