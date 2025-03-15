<template>
  <div class="contact-form-container">
    <div class="form-header">
      <h2 class="form-title">{{ title }}</h2>
      <p class="form-description">{{ description }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="contact-form">
      <div class="form-group">
        <label>İsim Soyisim</label>
        <input
          v-model="form.name"
          type="text"
          required
          :class="{ 'error': errors.name }"
        />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label>E-posta</label>
        <input
          v-model="form.email"
          type="email"
          required
          :class="{ 'error': errors.email }"
        />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label>Konu</label>
        <select 
          v-model="form.subject"
          required
          :class="{ 'error': errors.subject }"
        >
          <option value="">Seçiniz</option>
          <option 
            v-for="subject in subjects"
            :key="subject.id"
            :value="subject.id"
          >
            {{ subject.name }}
          </option>
        </select>
        <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
      </div>

      <div class="form-group">
        <label>Mesaj</label>
        <textarea
          v-model="form.message"
          rows="5"
          required
          :class="{ 'error': errors.message }"
        ></textarea>
        <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="form.consent"
            type="checkbox"
            required
          />
          <span>Kişisel verilerimin işlenmesini kabul ediyorum</span>
        </label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="submit-button"
          :disabled="loading"
        >
          {{ loading ? 'Gönderiliyor...' : 'Gönder' }}
        </button>
      </div>
    </form>

    <div v-if="success" class="success-message">
      <i class="fas fa-check-circle"></i>
      <p>Mesajınız başarıyla iletildi. En kısa sürede size dönüş yapacağız.</p>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { validateEmail } from '@/utils/validation'
import { notify } from '@/utils/notification'

export default {
  name: 'ContactForm',

  props: {
    title: {
      type: String,
      default: 'İletişim Formu'
    },
    description: {
      type: String,
      default: 'Size nasıl yardımcı olabiliriz?'
    }
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const success = ref(false)
    const errors = reactive({})

    const form = reactive({
      name: '',
      email: '',
      subject: '',
      message: '',
      consent: false
    })

    const subjects = [
      { id: 'general', name: 'Genel Bilgi' },
      { id: 'technical', name: 'Teknik Destek' },
      { id: 'billing', name: 'Ödeme ve Faturalama' },
      { id: 'complaint', name: 'Şikayet' }
    ]

    const validateForm = () => {
      errors.name = !form.name ? 'İsim alanı zorunludur' : ''
      errors.email = !validateEmail(form.email) ? 'Geçerli bir e-posta adresi giriniz' : ''
      errors.subject = !form.subject ? 'Konu seçimi zorunludur' : ''
      errors.message = !form.message ? 'Mesaj alanı zorunludur' : ''

      return !Object.values(errors).some(error => error)
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      try {
        loading.value = true
        await store.dispatch('support/submitContactForm', form)
        success.value = true
        notify.success('Mesajınız başarıyla gönderildi')
      } catch (err) {
        notify.error('Mesajınız gönderilemedi')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      success,
      errors,
      subjects,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.contact-form-container {
  @apply max-w-2xl mx-auto py-8 px-4;
}

.form-header {
  @apply text-center mb-8;
}

.form-title {
  @apply text-3xl font-bold text-gray-800 mb-2;
}

.form-description {
  @apply text-gray-600;
}

.contact-form {
  @apply space-y-6;
}

.form-group {
  @apply space-y-1;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700;
}

.form-group input,
.form-group select,
.form-group textarea {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  @apply border-red-500;
}

.error-message {
  @apply text-sm text-red-600;
}

.checkbox-label {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.form-actions {
  @apply flex justify-end;
}

.submit-button {
  @apply px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50;
}

.success-message {
  @apply flex flex-col items-center gap-4 text-center text-green-600 mt-8;
}

.success-message i {
  @apply text-4xl;
}
</style> 