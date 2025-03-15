<template>
  <footer class="bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Kurumsal -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Kurumsal</h3>
          <ul class="space-y-2">
            <li><router-link to="/about" class="hover:text-gray-300">Hakkımızda</router-link></li>
            <li><router-link to="/contact" class="hover:text-gray-300">İletişim</router-link></li>
            <li><router-link to="/careers" class="hover:text-gray-300">Kariyer</router-link></li>
          </ul>
        </div>

        <!-- Müşteri Hizmetleri -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Müşteri Hizmetleri</h3>
          <ul class="space-y-2">
            <li><router-link to="/faq" class="hover:text-gray-300">Sıkça Sorulan Sorular</router-link></li>
            <li><router-link to="/shipping" class="hover:text-gray-300">Kargo ve Teslimat</router-link></li>
            <li><router-link to="/returns" class="hover:text-gray-300">İade ve Değişim</router-link></li>
          </ul>
        </div>

        <!-- Yasal -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Yasal</h3>
          <ul class="space-y-2">
            <li><router-link to="/privacy" class="hover:text-gray-300">Gizlilik Politikası</router-link></li>
            <li><router-link to="/terms" class="hover:text-gray-300">Kullanım Koşulları</router-link></li>
            <li><router-link to="/cookies" class="hover:text-gray-300">Çerez Politikası</router-link></li>
          </ul>
        </div>

        <!-- İletişim -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Bizi Takip Edin</h3>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-gray-300"><i class="fab fa-facebook"></i></a>
            <a href="#" class="hover:text-gray-300"><i class="fab fa-twitter"></i></a>
            <a href="#" class="hover:text-gray-300"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-700 text-center">
        <p>&copy; 2024 Aridolu. Tüm hakları saklıdır.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script> 