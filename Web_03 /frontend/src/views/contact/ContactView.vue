<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl mb-8">
      <div class="py-16 px-8 text-center">
        <h1 class="text-4xl font-bold text-white mb-4">İletişim</h1>
        <p class="text-gray-100 text-lg max-w-2xl mx-auto">
          Sorularınız için bize ulaşın. En kısa sürede size dönüş yapacağız.
        </p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Contact Form -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h2 class="text-2xl font-bold mb-6">Bize Ulaşın</h2>
          
          <form @submit.prevent="submitForm">
            <div class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Adınız Soyadınız
                </label>
                <input 
                  v-model="form.name"
                  type="text" 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.name }"
                  placeholder="Adınızı ve soyadınızı giriniz"
                >
                <p v-if="errors.name" class="mt-1 text-sm text-red-500">
                  {{ errors.name }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  E-posta Adresiniz
                </label>
                <input 
                  v-model="form.email"
                  type="email" 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.email }"
                  placeholder="E-posta adresinizi giriniz"
                >
                <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Subject -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Konu
                </label>
                <select 
                  v-model="form.subject"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.subject }"
                >
                  <option value="">Konu seçiniz</option>
                  <option value="general">Genel Bilgi</option>
                  <option value="support">Teknik Destek</option>
                  <option value="sales">Satış</option>
                  <option value="complaint">Şikayet</option>
                  <option value="suggestion">Öneri</option>
                </select>
                <p v-if="errors.subject" class="mt-1 text-sm text-red-500">
                  {{ errors.subject }}
                </p>
              </div>

              <!-- Message -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Mesajınız
                </label>
                <textarea 
                  v-model="form.message"
                  rows="4"
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  :class="{ 'border-red-500': errors.message }"
                  placeholder="Mesajınızı yazınız"
                ></textarea>
                <p v-if="errors.message" class="mt-1 text-sm text-red-500">
                  {{ errors.message }}
                </p>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit"
                class="w-full bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Gönderiliyor...</span>
                <span v-else>Gönder</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="space-y-8">
          <!-- Address Card -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Adres</h3>
                <p class="mt-1 text-gray-600">
                  Atatürk Caddesi No: 123<br>
                  Merkez / İstanbul<br>
                  34100
                </p>
              </div>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Telefon</h3>
                <p class="mt-1 text-gray-600">
                  +90 850 123 45 67
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Pazartesi - Cuma: 09:00 - 18:00
                </p>
              </div>
            </div>
          </div>

          <!-- Email Card -->
          <div class="bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">E-posta</h3>
                <p class="mt-1 text-gray-600">
                  info@example.com
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  24 saat içinde dönüş yapılır
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map -->
      <div class="mt-12">
        <div class="bg-gray-200 rounded-xl h-96">
          <!-- Harita entegrasyonu burada yapılacak -->
          <div class="w-full h-full rounded-xl overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1375487186366!2d28.977549315415467!3d41.03749497929861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7650656bd63%3A0x8ca058b28c20b6c3!2zVGFrc2ltIE1leWRhbsSxLCBHw7xtw7zFn3N1eXUsIDM0NDM1IEJleW_En2x1L8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1647887774171!5m2!1str!2str"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'ContactView',
  setup() {
    const toast = useToast()
    const isSubmitting = ref(false)
    
    const form = reactive({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    const errors = reactive({
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    const validateForm = () => {
      let isValid = true
      
      // Reset errors
      Object.keys(errors).forEach(key => errors[key] = '')

      if (!form.name.trim()) {
        errors.name = 'Ad soyad zorunludur'
        isValid = false
      }

      if (!form.email.trim()) {
        errors.email = 'E-posta zorunludur'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Geçerli bir e-posta adresi giriniz'
        isValid = false
      }

      if (!form.subject) {
        errors.subject = 'Konu seçimi zorunludur'
        isValid = false
      }

      if (!form.message.trim()) {
        errors.message = 'Mesaj zorunludur'
        isValid = false
      }

      return isValid
    }

    const submitForm = async () => {
      if (!validateForm()) return

      isSubmitting.value = true

      try {
        // API çağrısı burada yapılacak
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simüle edilmiş API çağrısı
        
        toast.success('Mesajınız başarıyla gönderildi')
        
        // Form temizleme
        Object.keys(form).forEach(key => form[key] = '')
        
      } catch (error) {
        toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      errors,
      isSubmitting,
      submitForm
    }
  }
}
</script> 