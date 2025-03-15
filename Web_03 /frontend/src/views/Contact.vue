<template>
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">İletişim</h1>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-2">
          <!-- Sol Taraf - İletişim Bilgileri -->
          <div class="bg-blue-600 text-white p-8">
            <h2 class="text-2xl font-bold mb-6">Bize Ulaşın</h2>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="mt-1">
                  <i class="fas fa-map-marker-alt text-xl"></i>
                </div>
                <div>
                  <h3 class="font-medium mb-1">Adres</h3>
                  <p class="text-blue-100">
                    Atatürk Mah. İstiklal Cad. No:123<br>
                    Şişli / İstanbul
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="mt-1">
                  <i class="fas fa-phone text-xl"></i>
                </div>
                <div>
                  <h3 class="font-medium mb-1">Telefon</h3>
                  <p class="text-blue-100">
                    <a href="tel:+902121234567" class="hover:text-white">
                      +90 (212) 123 45 67
                    </a>
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="mt-1">
                  <i class="fas fa-envelope text-xl"></i>
                </div>
                <div>
                  <h3 class="font-medium mb-1">E-posta</h3>
                  <p class="text-blue-100">
                    <a href="mailto:info@example.com" class="hover:text-white">
                      info@example.com
                    </a>
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="mt-1">
                  <i class="fas fa-clock text-xl"></i>
                </div>
                <div>
                  <h3 class="font-medium mb-1">Çalışma Saatleri</h3>
                  <p class="text-blue-100">
                    Pazartesi - Cumartesi: 09:00 - 18:00<br>
                    Pazar: Kapalı
                  </p>
                </div>
              </div>
            </div>

            <!-- Sosyal Medya -->
            <div class="mt-8">
              <h3 class="font-medium mb-4">Bizi Takip Edin</h3>
              <div class="flex space-x-4">
                <a href="#" class="hover:text-blue-200">
                  <i class="fab fa-facebook-f text-xl"></i>
                </a>
                <a href="#" class="hover:text-blue-200">
                  <i class="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" class="hover:text-blue-200">
                  <i class="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" class="hover:text-blue-200">
                  <i class="fab fa-linkedin-in text-xl"></i>
                </a>
              </div>
            </div>
          </div>

          <!-- Sağ Taraf - İletişim Formu -->
          <div class="p-8">
            <h2 class="text-2xl font-bold mb-6">Mesaj Gönderin</h2>

            <form @submit.prevent="submitForm" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <input 
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input 
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Konu
                </label>
                <select 
                  v-model="form.subject"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="general">Genel Bilgi</option>
                  <option value="support">Destek</option>
                  <option value="sales">Satış</option>
                  <option value="partnership">İş Ortaklığı</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Mesajınız
                </label>
                <textarea 
                  v-model="form.message"
                  required
                  rows="4"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    v-model="form.consent"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label class="text-gray-600">
                    Kişisel verilerimin işlenmesine izin veriyorum.
                  </label>
                </div>
              </div>

              <div>
                <button 
                  type="submit"
                  :disabled="loading"
                  class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <span v-if="loading">Gönderiliyor...</span>
                  <span v-else>Gönder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Harita -->
      <div class="mt-12">
        <div class="bg-white rounded-lg shadow-md p-4">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.443658373096!2d28.977549315415816!3d41.03697297929828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zVGFrc2ltIE1leWRhbsSxLCBHw7xtw7zFn3N1eXUsIDM0NDM1IEJleW_En2x1L8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1647095831353!5m2!1str!2str"
            width="100%"
            height="400"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ContactPage',
  setup() {
    const store = useStore()
    const loading = ref(false)

    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: '',
      consent: false
    })

    const submitForm = async () => {
      try {
        loading.value = true
        await store.dispatch('sendContactForm', form.value)
        
        // Formu sıfırla
        form.value = {
          name: '',
          email: '',
          subject: '',
          message: '',
          consent: false
        }

        alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.')
      } catch (error) {
        console.error('Error sending contact form:', error)
        alert('Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      submitForm
    }
  }
}
</script> 