<template>
  <footer class="bg-primary-900 text-white">
    <div class="container mx-auto px-4 py-12">
      <!-- Main Footer -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div>
          <h3 class="text-xl font-bold mb-4">Logo</h3>
          <p class="text-primary-200 mb-4">
            Teknoloji tutkunlarının güvenilir adresi. 10 yılı aşkın deneyimimizle yanınızdayız.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-primary-200 hover:text-gold-400">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" class="text-primary-200 hover:text-gold-400">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="text-primary-200 hover:text-gold-400">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="text-primary-200 hover:text-gold-400">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
          <ul class="space-y-2">
            <li>
              <router-link to="/about" class="text-primary-200 hover:text-gold-400">
                Hakkımızda
              </router-link>
            </li>
            <li>
              <router-link to="/products" class="text-primary-200 hover:text-gold-400">
                Ürünler
              </router-link>
            </li>
            <li>
              <router-link to="/blog" class="text-primary-200 hover:text-gold-400">
                Blog
              </router-link>
            </li>
            <li>
              <router-link to="/contact" class="text-primary-200 hover:text-gold-400">
                İletişim
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-4">İletişim</h3>
          <ul class="space-y-2">
            <li class="flex items-center text-primary-200">
              <i class="fas fa-map-marker-alt mr-2 text-gold-400"></i>
              İstanbul, Türkiye
            </li>
            <li class="flex items-center text-primary-200">
              <i class="fas fa-phone mr-2 text-gold-400"></i>
              +90 (212) 123 45 67
            </li>
            <li class="flex items-center text-primary-200">
              <i class="fas fa-envelope mr-2 text-gold-400"></i>
              info@example.com
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Bülten</h3>
          <p class="text-primary-200 mb-4">
            Kampanyalardan haberdar olmak için bültenimize abone olun.
          </p>
          <form @submit.prevent="subscribeNewsletter" class="space-y-2">
            <input 
              type="email" 
              placeholder="E-posta adresiniz"
              class="w-full px-4 py-2 rounded bg-primary-800 text-white placeholder-primary-400 border border-primary-700 focus:outline-none focus:border-gold-400"
            >
            <button 
              type="submit"
              class="w-full px-4 py-2 bg-gold-400 text-white rounded hover:bg-gold-500 transition-colors"
            >
              Abone Ol
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="border-t border-primary-800 mt-12 pt-8 text-center text-primary-200">
        <p>&copy; 2024 Tüm hakları saklıdır.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
  
  setup() {
    const subscribeNewsletter = () => {
      // Newsletter subscription logic
    }

    return {
      subscribeNewsletter
    }
  }
}
</script> 