<template>
  <section class="bg-gray-100 py-16">
    <div class="container mx-auto px-4">
      <div class="mx-auto max-w-2xl text-center">
        <!-- Başlık -->
        <h2 class="mb-3 text-3xl font-bold">E-Bülten Aboneliği</h2>
        <p class="mb-8 text-gray-600">
          En yeni ürünler, kampanyalar ve fırsatlardan ilk siz haberdar olun!
        </p>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- E-posta Input -->
          <div class="flex">
            <input
              v-model="email"
              type="email"
              placeholder="E-posta adresiniz"
              class="w-full rounded-l-lg border border-r-0 px-4 py-3 focus:border-blue-500 focus:outline-none"
              :class="{ 'border-red-500': error }"
              required
            />
            <button
              type="submit"
              class="rounded-r-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              :disabled="loading"
            >
              <span v-if="!loading">Abone Ol</span>
              <LoadingSpinner v-else size="sm" color="white" />
            </button>
          </div>

          <!-- Hata Mesajı -->
          <p v-if="error" class="text-left text-sm text-red-500">
            {{ error }}
          </p>

          <!-- KVKK Onayı -->
          <div class="flex items-start space-x-2">
            <input
              v-model="privacyAccepted"
              type="checkbox"
              id="privacy"
              class="mt-1"
              required
            />
            <label for="privacy" class="text-sm text-gray-600">
              <router-link 
                to="/gizlilik-politikasi"
                class="text-blue-600 hover:underline"
              >
                Gizlilik Politikası
              </router-link>'nı okudum ve kabul ediyorum.
            </label>
          </div>
        </form>

        <!-- Başarılı Mesaj -->
        <div 
          v-if="showSuccess"
          class="mt-4 rounded-lg bg-green-100 p-4 text-green-700"
        >
          <i class="fas fa-check-circle mr-2"></i>
          E-bülten aboneliğiniz başarıyla tamamlandı!
        </div>

        <!-- Özellikler -->
        <div class="mt-12 grid gap-6 text-left sm:grid-cols-3">
          <div class="flex items-start space-x-3">
            <i class="fas fa-gift mt-1 text-blue-600"></i>
            <div>
              <h3 class="font-medium">Özel İndirimler</h3>
              <p class="text-sm text-gray-600">
                Abonelere özel kampanya ve indirimler
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <i class="fas fa-bell mt-1 text-blue-600"></i>
            <div>
              <h3 class="font-medium">Anlık Bildirimler</h3>
              <p class="text-sm text-gray-600">
                Yeni ürün ve fırsatlardan anında haberdar olun
              </p>
            </div>
          </div>
          <div class="flex items-start space-x-3">
            <i class="fas fa-shield-alt mt-1 text-blue-600"></i>
            <div>
              <h3 class="font-medium">Güvenli Abonelik</h3>
              <p class="text-sm text-gray-600">
                Bilgileriniz güvenle saklanır ve korunur
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'NewsletterSignup',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const email = ref('')
    const privacyAccepted = ref(false)
    const loading = ref(false)
    const error = ref('')
    const showSuccess = ref(false)

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const handleSubmit = async () => {
      error.value = ''
      showSuccess.value = false

      if (!validateEmail(email.value)) {
        error.value = 'Geçerli bir e-posta adresi giriniz'
        return
      }

      if (!privacyAccepted.value) {
        error.value = 'Gizlilik Politikasını kabul etmelisiniz'
        return
      }

      loading.value = true
      try {
        await store.dispatch('newsletter/subscribe', email.value)
        showSuccess.value = true
        email.value = ''
        privacyAccepted.value = false
      } catch (err) {
        error.value = 'Bir hata oluştu, lütfen tekrar deneyiniz'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      privacyAccepted,
      loading,
      error,
      showSuccess,
      handleSubmit
    }
  }
}
</script> 