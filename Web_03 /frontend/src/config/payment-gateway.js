import { loadStripe } from '@stripe/stripe-js'
import { loadIyzico } from '@iyzico/iyzipay-js'

const stripePromise = loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY)
const iyzicoPromise = loadIyzico(process.env.VUE_APP_IYZICO_PUBLIC_KEY)

export const paymentGateways = {
  stripe: {
    name: 'Stripe',
    icon: 'stripe-icon.svg',
    async initialize() {
      const stripe = await stripePromise
      return {
        createPaymentIntent: async (amount, currency = 'TRY') => {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, currency })
          })
          const { clientSecret } = await response.json()
          return { stripe, clientSecret }
        },
        processPayment: async (clientSecret, paymentMethod) => {
          return stripe.confirmCardPayment(clientSecret, {
            payment_method: paymentMethod
          })
        }
      }
    }
  },
  iyzico: {
    name: 'iyzico',
    icon: 'iyzico-icon.svg',
    async initialize() {
      const iyzico = await iyzicoPromise
      return {
        createCheckoutForm: async (options) => {
          const response = await fetch('/api/create-iyzico-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(options)
          })
          const { token } = await response.json()
          return iyzico.createCheckoutForm(token)
        }
      }
    }
  }
}

export const getAvailableGateways = async () => {
  try {
    const response = await fetch('/api/payment-methods')
    const availableMethods = await response.json()
    return availableMethods.filter(method => 
      paymentGateways[method.provider] !== undefined
    )
  } catch (error) {
    console.error('Ödeme yöntemleri yüklenemedi:', error)
    return []
  }
}

export const initializeGateway = async (provider) => {
  const gateway = paymentGateways[provider]
  if (!gateway) {
    throw new Error(`Ödeme sağlayıcısı bulunamadı: ${provider}`)
  }
  return gateway.initialize()
} 