import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PUBLIC_KEY } from '@/config/constants'

let stripePromise

/**
 * Stripe'ı başlat
 */
export const initStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

/**
 * Ödeme oturumu oluştur
 */
export const createPaymentSession = async (options) => {
  const stripe = await stripePromise
  return stripe.redirectToCheckout(options)
}

/**
 * Kart elementi oluştur
 */
export const createCardElement = async (options) => {
  const stripe = await stripePromise
  const elements = stripe.elements()
  return elements.create('card', options)
}

export default {
  initStripe,
  createPaymentSession,
  createCardElement
}