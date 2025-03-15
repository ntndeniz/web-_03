export default {
  data() {
    return {
      errors: {},
      isSubmitting: false,
      submitError: null
    }
  },

  methods: {
    /**
     * Form alanını doğrula
     * @param {string} field - Alan adı
     * @param {*} value - Alan değeri
     * @param {Array} rules - Doğrulama kuralları
     * @returns {string|null} - Hata mesajı veya null
     */
    validateField(field, value, rules) {
      for (const rule of rules) {
        const error = this.applyRule(rule, value, field)
        if (error) {
          this.$set(this.errors, field, error)
          return error
        }
      }
      this.$delete(this.errors, field)
      return null
    },

    /**
     * Doğrulama kuralını uygula
     * @param {Object} rule - Kural objesi
     * @param {*} value - Değer
     * @param {string} field - Alan adı
     * @returns {string|null} - Hata mesajı veya null
     */
    applyRule(rule, value, field) {
      const { type, message, min, max, pattern } = rule

      switch (type) {
        case 'required':
          if (!value || (typeof value === 'string' && !value.trim())) {
            return message || `${field} alanı zorunludur`
          }
          break

        case 'email':
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return message || 'Geçerli bir e-posta adresi giriniz'
          }
          break

        case 'minLength':
          if (value && value.length < min) {
            return message || `En az ${min} karakter giriniz`
          }
          break

        case 'maxLength':
          if (value && value.length > max) {
            return message || `En fazla ${max} karakter giriniz`
          }
          break

        case 'pattern':
          if (value && !pattern.test(value)) {
            return message || 'Geçersiz format'
          }
          break
      }

      return null
    },

    /**
     * Tüm form alanlarını doğrula
     * @param {Object} fields - Form alanları
     * @param {Object} rules - Doğrulama kuralları
     * @returns {boolean} - Form geçerli mi?
     */
    validateForm(fields, rules) {
      let isValid = true
      this.errors = {}

      for (const [field, value] of Object.entries(fields)) {
        if (rules[field]) {
          const error = this.validateField(field, value, rules[field])
          if (error) isValid = false
        }
      }

      return isValid
    },

    /**
     * Form gönderimi
     * @param {Function} submitFn - Gönderim fonksiyonu
     * @param {Object} fields - Form alanları
     * @param {Object} rules - Doğrulama kuralları
     */
    async handleSubmit(submitFn, fields, rules) {
      this.isSubmitting = true
      this.submitError = null

      try {
        if (this.validateForm(fields, rules)) {
          await submitFn()
        }
      } catch (error) {
        this.submitError = error.message
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    /**
     * Formu sıfırla
     */
    resetForm() {
      this.errors = {}
      this.submitError = null
      this.isSubmitting = false
    }
  }
} 