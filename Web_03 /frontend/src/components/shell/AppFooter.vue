<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-grid">
        <div class="footer-section">
          <h3>Hakkımızda</h3>
          <p class="company-desc">{{ companyDescription }}</p>
          <div class="social-links">
            <a v-for="link in socialLinks" 
               :key="link.name"
               :href="link.url"
               :title="link.name"
               target="_blank"
               rel="noopener noreferrer"
               class="social-link"
            >
              <i :class="link.icon"></i>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3>Hızlı Bağlantılar</h3>
          <ul class="footer-links">
            <li v-for="link in quickLinks" :key="link.path">
              <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Müşteri Hizmetleri</h3>
          <ul class="footer-links">
            <li v-for="link in customerServiceLinks" :key="link.path">
              <router-link :to="link.path">{{ link.name }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Bülten</h3>
          <p class="newsletter-desc">Yeni ürün ve kampanyalardan haberdar olun</p>
          <form @submit.prevent="handleNewsletterSubmit" class="newsletter-form">
            <input
              v-model="email"
              type="email"
              placeholder="E-posta adresiniz"
              required
            />
            <button type="submit">Abone Ol</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="payment-methods">
          <img 
            v-for="method in paymentMethods"
            :key="method.name"
            :src="method.icon"
            :alt="method.name"
            class="payment-icon"
          />
        </div>

        <div class="copyright">
          <p>&copy; {{ currentYear }} {{ companyName }}. Tüm hakları saklıdır.</p>
        </div>

        <div class="legal-links">
          <router-link 
            v-for="link in legalLinks"
            :key="link.path"
            :to="link.path"
          >
            {{ link.name }}
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { notify } from '@/utils/notification'

export default {
  name: 'AppFooter',

  setup() {
    const store = useStore()
    const email = ref('')

    const companyName = computed(() => store.state.config.companyName)
    const companyDescription = computed(() => store.state.config.companyDescription)
    const currentYear = computed(() => new Date().getFullYear())

    const socialLinks = [
      { name: 'Facebook', url: '#', icon: 'fab fa-facebook' },
      { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
      { name: 'Instagram', url: '#', icon: 'fab fa-instagram' },
      { name: 'LinkedIn', url: '#', icon: 'fab fa-linkedin' }
    ]

    const quickLinks = [
      { name: 'Ana Sayfa', path: '/' },
      { name: 'Ürünler', path: '/products' },
      { name: 'Kampanyalar', path: '/campaigns' },
      { name: 'Blog', path: '/blog' }
    ]

    const customerServiceLinks = [
      { name: 'İletişim', path: '/contact' },
      { name: 'Sıkça Sorulan Sorular', path: '/faq' },
      { name: 'Kargo Takip', path: '/shipping-tracking' },
      { name: 'İade Koşulları', path: '/return-policy' }
    ]

    const legalLinks = [
      { name: 'Gizlilik Politikası', path: '/privacy' },
      { name: 'Kullanım Koşulları', path: '/terms' },
      { name: 'KVKK', path: '/gdpr' }
    ]

    const paymentMethods = [
      { name: 'Visa', icon: '/icons/visa.svg' },
      { name: 'Mastercard', icon: '/icons/mastercard.svg' },
      { name: 'PayPal', icon: '/icons/paypal.svg' }
    ]

    const handleNewsletterSubmit = async () => {
      try {
        await store.dispatch('newsletter/subscribe', email.value)
        notify.success('Bülten aboneliğiniz başarıyla gerçekleşti')
        email.value = ''
      } catch (error) {
        notify.error('Bülten aboneliği sırasında bir hata oluştu')
      }
    }

    return {
      email,
      companyName,
      companyDescription,
      currentYear,
      socialLinks,
      quickLinks,
      customerServiceLinks,
      legalLinks,
      paymentMethods,
      handleNewsletterSubmit
    }
  }
}
</script>

<style scoped>
.app-footer {
  @apply bg-gray-900 text-gray-300 pt-12 pb-6;
}

.footer-container {
  @apply max-w-7xl mx-auto px-4;
}

.footer-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12;
}

.footer-section h3 {
  @apply text-white text-lg font-semibold mb-4;
}

.company-desc {
  @apply text-sm mb-4;
}

.social-links {
  @apply flex gap-4;
}

.social-link {
  @apply text-gray-400 hover:text-white transition-colors;
}

.footer-links {
  @apply space-y-2;
}

.footer-links a {
  @apply text-gray-400 hover:text-white transition-colors;
}

.newsletter-desc {
  @apply text-sm mb-4;
}

.newsletter-form {
  @apply flex gap-2;
}

.newsletter-form input {
  @apply flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.newsletter-form button {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.footer-bottom {
  @apply pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4;
}

.payment-methods {
  @apply flex gap-4;
}

.payment-icon {
  @apply h-8 w-auto opacity-75;
}

.copyright {
  @apply text-sm text-gray-500;
}

.legal-links {
  @apply flex gap-4 text-sm;
}

.legal-links a {
  @apply text-gray-500 hover:text-gray-300 transition-colors;
}
</style> 