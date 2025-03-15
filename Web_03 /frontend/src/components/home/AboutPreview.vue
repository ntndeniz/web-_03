<template>
  <section class="bg-primary-50 py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Sol Taraf - Görsel -->
          <div class="relative">
            <div class="aspect-w-4 aspect-h-3">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                alt="Teknoloji Mağazası"
                class="object-cover rounded-2xl shadow-xl"
              >
            </div>
            <!-- Floating Stats Card -->
            <div class="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div class="grid grid-cols-2 gap-6">
                <div class="text-center">
                  <div class="text-3xl font-bold text-primary-500 mb-1">10+</div>
                  <div class="text-sm text-gray-600">Yıllık Deneyim</div>
                </div>
                <div class="text-center">
                  <div class="text-3xl font-bold text-gold-400 mb-1">50K+</div>
                  <div class="text-sm text-gray-600">Mutlu Müşteri</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sağ Taraf - İçerik -->
          <div class="space-y-6">
            <h2 class="text-3xl font-bold text-primary-800">
              Teknoloji Tutkunlarının Güvenilir Adresi
            </h2>
            
            <p class="text-gray-600 leading-relaxed">
              10 yılı aşkın deneyimimizle, müşterilerimize en son teknoloji ürünlerini ve kesintisiz hizmeti sunuyoruz. Türkiye'nin önde gelen teknoloji perakendecisi olarak, geniş ürün yelpazemiz ve uzman kadromuzla yanınızdayız.
            </p>

            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <div class="bg-primary-100 p-2 rounded-full">
                  <i class="fas fa-check text-primary-500"></i>
                </div>
                <span class="text-gray-700">25+ Şehirde Mağaza</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="bg-primary-100 p-2 rounded-full">
                  <i class="fas fa-check text-primary-500"></i>
                </div>
                <span class="text-gray-700">7/24 Teknik Destek</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="bg-primary-100 p-2 rounded-full">
                  <i class="fas fa-check text-primary-500"></i>
                </div>
                <span class="text-gray-700">Aynı Gün Teslimat</span>
              </div>
            </div>

            <div class="pt-4">
              <router-link 
                to="/about"
                class="inline-flex items-center gap-2 text-primary-500 font-semibold hover:text-primary-600 transition-colors"
              >
                Daha Fazla Bilgi
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutPreview'
}
</script> 