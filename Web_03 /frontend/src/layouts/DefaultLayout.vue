<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Ana İçerik -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Global Bileşenler -->
    <Toast />
    <Modal />
    <LoadingSpinner v-if="isLoading" overlay />
    <CookieConsent />
    <NewsletterPopup />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import Toast from '@/components/common/Toast.vue'
import Modal from '@/components/common/Modal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import CookieConsent from '@/components/common/CookieConsent.vue'
import NewsletterPopup from '@/components/common/NewsletterPopup.vue'

export default {
  name: 'DefaultLayout',
  
  components: {
    Header,
    Footer,
    Toast,
    Modal,
    LoadingSpinner,
    CookieConsent,
    NewsletterPopup
  },

  computed: {
    ...mapGetters({
      isLoading: 'ui/isLoading'
    })
  }
}
</script> 