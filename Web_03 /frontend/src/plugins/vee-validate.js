import { configure, defineRule } from 'vee-validate'
import { required, email, min, max, confirmed, numeric } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import tr from '@vee-validate/i18n/dist/locale/tr.json'

// Temel kuralları tanımla
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)
defineRule('confirmed', confirmed)
defineRule('numeric', numeric)

// Özel kurallar
defineRule('phone', value => {
  if (!value) return true
  const phoneRegex = /^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/
  return phoneRegex.test(value) || 'Geçerli bir telefon numarası giriniz'
})

defineRule('password', value => {
  if (!value) return true
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return passwordRegex.test(value) || 'Şifre en az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermelidir'
})

defineRule('tc', value => {
  if (!value) return true
  const tcRegex = /^[1-9]{1}[0-9]{9}[02468]{1}$/
  return tcRegex.test(value) || 'Geçerli bir T.C. Kimlik numarası giriniz'
})

// Türkçe mesajları ayarla
configure({
  generateMessage: localize('tr', {
    messages: {
      ...tr.messages,
      required: 'Bu alan zorunludur',
      email: 'Geçerli bir e-posta adresi giriniz',
      min: 'En az {length} karakter giriniz',
      max: 'En fazla {length} karakter giriniz',
      confirmed: 'Şifreler eşleşmiyor',
      numeric: 'Sadece rakam giriniz'
    }
  })
}) 