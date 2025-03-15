// Tüm plugin'leri buradan export edin
export * from './vue-toast'
export * from './vue-i18n'
// ... diğer plugin'ler 

// Şimdilik boş bırakıyoruz, gerektiğinde plugin'leri buraya ekleyeceğiz
export {} 

/* eslint-disable no-unused-vars */
import { defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'

export function registerPlugins(app) {
  // VeeValidate kurallarını tanımla
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)

  // VeeValidate konfigürasyonu
  configure({
    generateMessage: (context) => {
      const messages = {
        required: 'Bu alan zorunludur',
        email: 'Geçerli bir e-posta adresi giriniz',
        min: 'Bu alan en az {length} karakter olmalıdır'
      }
      return messages[context.rule.name]
    }
  })

  // ... diğer plugin kayıtları ...
} 