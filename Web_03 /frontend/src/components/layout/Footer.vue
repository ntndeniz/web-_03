<template>
  <footer class="bg-white border-t mt-12">
    <div class="container mx-auto px-4 py-12">
      <!-- Üst Kısım -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Kurumsal -->
        <div>
          <h3 class="text-lg font-bold mb-4">Kurumsal</h3>
          <ul class="space-y-2">
            <li>
              <router-link 
                to="/about"
                class="text-gray-600 hover:text-blue-600"
              >
                Hakkımızda
              </router-link>
            </li>
            <li>
              <router-link 
                to="/careers"
                class="text-gray-600 hover:text-blue-600"
              >
                Kariyer
              </router-link>
            </li>
            <li>
              <router-link 
                to="/contact"
                class="text-gray-600 hover:text-blue-600"
              >
                İletişim
              </router-link>
            </li>
            <li>
              <router-link 
                to="/blog"
                class="text-gray-600 hover:text-blue-600"
              >
                Blog
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Müşteri Hizmetleri -->
        <div>
          <h3 class="text-lg font-bold mb-4">Müşteri Hizmetleri</h3>
          <ul class="space-y-2">
            <li>
              <router-link 
                to="/faq"
                class="text-gray-600 hover:text-blue-600"
              >
                Sıkça Sorulan Sorular
              </router-link>
            </li>
            <li>
              <router-link 
                to="/shipping"
                class="text-gray-600 hover:text-blue-600"
              >
                Kargo ve Teslimat
              </router-link>
            </li>
            <li>
              <router-link 
                to="/returns"
                class="text-gray-600 hover:text-blue-600"
              >
                İade ve Değişim
              </router-link>
            </li>
            <li>
              <router-link 
                to="/size-guide"
                class="text-gray-600 hover:text-blue-600"
              >
                Beden Rehberi
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Yasal -->
        <div>
          <h3 class="text-lg font-bold mb-4">Yasal</h3>
          <ul class="space-y-2">
            <li>
              <router-link 
                to="/privacy"
                class="text-gray-600 hover:text-blue-600"
              >
                Gizlilik Politikası
              </router-link>
            </li>
            <li>
              <router-link 
                to="/terms"
                class="text-gray-600 hover:text-blue-600"
              >
                Kullanım Koşulları
              </router-link>
            </li>
            <li>
              <router-link 
                to="/cookies"
                class="text-gray-600 hover:text-blue-600"
              >
                Çerez Politikası
              </router-link>
            </li>
            <li>
              <router-link 
                to="/gdpr"
                class="text-gray-600 hover:text-blue-600"
              >
                KVKK
              </router-link>
            </li>
          </ul>
        </div>

        <!-- İletişim -->
        <div>
          <h3 class="text-lg font-bold mb-4">Bize Ulaşın</h3>
          <ul class="space-y-2">
            <li class="flex items-start">
              <i class="fas fa-map-marker-alt mt-1 mr-2 text-blue-600"></i>
              <span class="text-gray-600">
                Atatürk Mah. İstiklal Cad. No:123<br>
                Şişli / İstanbul
              </span>
            </li>
            <li class="flex items-center">
              <i class="fas fa-phone mr-2 text-blue-600"></i>
              <a href="tel:+902121234567" class="text-gray-600 hover:text-blue-600">
                +90 (212) 123 45 67
              </a>
            </li>
            <li class="flex items-center">
              <i class="fas fa-envelope mr-2 text-blue-600"></i>
              <a href="mailto:info@example.com" class="text-gray-600 hover:text-blue-600">
                info@example.com
              </a>
            </li>
          </ul>

          <!-- Sosyal Medya -->
          <div class="mt-6">
            <h4 class="font-medium mb-2">Bizi Takip Edin</h4>
            <div class="flex space-x-4">
              <a 
                href="#" 
                target="_blank"
                class="text-gray-400 hover:text-blue-600"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                target="_blank"
                class="text-gray-400 hover:text-blue-600"
              >
                <i class="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                target="_blank"
                class="text-gray-400 hover:text-blue-600"
              >
                <i class="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                target="_blank"
                class="text-gray-400 hover:text-blue-600"
              >
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Alt Kısım -->
      <div class="border-t pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <!-- Copyright -->
          <div class="text-gray-600 text-sm mb-4 md:mb-0">
            © {{ new Date().getFullYear() }} E-Ticaret. Tüm hakları saklıdır.
          </div>

          <!-- Ödeme Yöntemleri -->
          <div class="flex space-x-4">
            <i class="fab fa-cc-visa text-2xl text-gray-400"></i>
            <i class="fab fa-cc-mastercard text-2xl text-gray-400"></i>
            <i class="fab fa-cc-amex text-2xl text-gray-400"></i>
            <i class="fab fa-cc-paypal text-2xl text-gray-400"></i>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script> 