<template>
  <div class="newsletter-container">
    <div class="newsletter-content">
      <h3 class="newsletter-title">{{ title }}</h3>
      <p class="newsletter-description">{{ description }}</p>
      
      <form @submit.prevent="handleSubmit" class="newsletter-form">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            class="form-input"
            placeholder="E-posta adresiniz"
            required
          />
          <div v-if="error" class="error-message">{{ error }}</div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input
              v-model="consent"
              type="checkbox"
              required
            />
            <span>Gizlilik politikasını okudum ve kabul ediyorum</span>
          </label>
        </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="loading"
        >
          {{ loading ? 'Kaydediliyor...' : 'Abone Ol' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { notify } from '@/utils/notification'
import analyticsService from '@/services/analytics'

export default {
  name: 'Newsletter',
  
  props: {
    title: {
      type: String,
      default: 'Bültenimize Abone Olun'
    },
    description: {
      type: String,
      default: 'En güncel kampanya ve indirimlerden haberdar olun'
    }
  },

  setup() {
    const store = useStore()
    const email = ref('')
    const consent = ref(false)
    const error = ref('')
    const loading = ref(false)

    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''

        await store.dispatch('marketing/subscribeNewsletter', {
          email: email.value
        })

        // Analitiğe kaydet
        analyticsService.trackNewsletterSubscription(email.value)

        notify.success('Bültene başarıyla abone oldunuz')
        email.value = ''
        consent.value = false

      } catch (err) {
        error.value = err.message
        notify.error('Abonelik işlemi başarısız oldu')
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      consent,
      error,
      loading,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.newsletter-container {
  @apply bg-white rounded-lg shadow-md p-6 max-w-md mx-auto;
}

.newsletter-content {
  @apply space-y-4;
}

.newsletter-title {
  @apply text-2xl font-bold text-gray-800;
}

.newsletter-description {
  @apply text-gray-600;
}

.newsletter-form {
  @apply mt-4 space-y-4;
}

.form-group {
  @apply space-y-2;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.checkbox-label {
  @apply flex items-center space-x-2 text-sm text-gray-600;
}

.error-message {
  @apply text-sm text-red-600;
}

.submit-button {
  @apply w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50;
}
</style> 