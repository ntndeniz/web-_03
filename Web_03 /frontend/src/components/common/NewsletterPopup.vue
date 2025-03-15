<template>
  <Modal v-model="isOpen" maxWidth="md">
    <div class="p-6 text-center">
      <!-- Başlık -->
      <h3 class="text-2xl font-bold text-gray-900 mb-4">
        Fırsatları Kaçırmayın!
      </h3>
      
      <!-- Açıklama -->
      <p class="text-gray-600 mb-6">
        En yeni ürünler, özel indirimler ve kampanyalardan ilk siz haberdar olun.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            required
            placeholder="E-posta adresiniz"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            :class="{ 'border-red-500': error }"
          />
          <p v-if="error" class="mt-1 text-sm text-red-600 text-left">
            {{ error }}
          </p>
        </div>

        <!-- Gizlilik Politikası -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              v-model="privacyAccepted"
              type="checkbox"
              required
              class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div class="ml-3">
            <label class="text-sm text-gray-600 text-left block">
              <a href="/gizlilik-politikasi" class="text-blue-600 hover:text-blue-500">
                Gizlilik Politikası
              </a>'nı okudum ve kabul ediyorum
            </label>
          </div>
        </div>

        <!-- Abone Ol Butonu -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="!loading">Abone Ol</span>
          <i v-else class="fas fa-circle-notch fa-spin"></i>
        </button>
      </form>

      <!-- Başarılı Mesajı -->
      <div v-if="success" class="mt-6 rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-check-circle text-green-400"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Bültenimize başarıyla abone oldunuz
            </p>
          </div>
        </div>
      </div>

      <!-- Popup'ı Bir Daha Gösterme -->
      <div class="mt-6">
        <button
          @click="neverShowAgain"
          class="text-sm text-gray-500 hover:text-gray-700"
        >
          Bir daha gösterme
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Modal from './Modal.vue'

export default {
  name: 'NewsletterPopup',

  components: {
    Modal
  },

  setup() {
    const store = useStore()
    const isOpen = ref(false)
    const email = ref('')
    const privacyAccepted = ref(false)
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)

    const handleSubmit = async () => {
      if (!email.value || !privacyAccepted.value || loading.value) return

      loading.value = true
      error.value = ''

      try {
        await store.dispatch('newsletter/subscribe', email.value)
        success.value = true
        setTimeout(() => {
          isOpen.value = false
        }, 2000)
        
        // Local storage'a kaydet
        localStorage.setItem('newsletter_subscribed', 'true')
      } catch (err) {
        if (err.code === 'already-subscribed') {
          error.value = 'Bu e-posta adresi zaten kayıtlı'
        } else {
          error.value = 'Abonelik işlemi sırasında bir hata oluştu'
        }
      } finally {
        loading.value = false
      }
    }

    const neverShowAgain = () => {
      localStorage.setItem('newsletter_popup_disabled', 'true')
      isOpen.value = false
    }

    onMounted(() => {
      // Popup'ı daha önce kapatmış mı kontrol et
      const isDisabled = localStorage.getItem('newsletter_popup_disabled')
      const isSubscribed = localStorage.getItem('newsletter_subscribed')

      if (!isDisabled && !isSubscribed) {
        // 5 saniye sonra göster
        setTimeout(() => {
          isOpen.value = true
        }, 5000)
      }
    })

    return {
      isOpen,
      email,
      privacyAccepted,
      loading,
      error,
      success,
      handleSubmit,
      neverShowAgain
    }
  }
}
</script> 