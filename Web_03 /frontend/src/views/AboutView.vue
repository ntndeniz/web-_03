<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-primary-500 text-white py-20">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center">
          Hakkımızda
        </h1>
        <p class="text-xl text-center max-w-3xl mx-auto text-primary-100">
          Teknoloji dünyasında 10 yılı aşkın deneyimimizle müşterilerimize en iyi hizmeti sunuyoruz.
        </p>
      </div>
    </div>

    <!-- Timeline Section -->
    <div class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Yolculuğumuz</h2>
        
        <div class="relative">
          <!-- Timeline Line -->
          <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>
          
          <div class="space-y-12">
            <div 
              v-for="(milestone, index) in milestones" 
              :key="milestone.year"
              class="relative"
            >
              <!-- Timeline Item -->
              <div 
                class="flex items-center"
                :class="index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
              >
                <!-- Content -->
                <div class="w-5/12">
                  <div 
                    class="bg-white p-6 rounded-xl shadow-lg"
                    :class="index % 2 === 0 ? 'mr-8' : 'ml-8'"
                  >
                    <div class="flex items-center gap-4 mb-3">
                      <div class="bg-primary-100 p-3 rounded-full">
                        <i :class="milestone.icon" class="text-primary-500 text-xl"></i>
                      </div>
                      <span class="text-primary-500 font-bold text-lg">{{ milestone.year }}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3">{{ milestone.title }}</h3>
                    <p class="text-gray-600">{{ milestone.description }}</p>
                  </div>
                </div>

                <!-- Timeline Dot -->
                <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full"></div>

                <!-- Empty space for the other side -->
                <div class="w-5/12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission & Vision Section -->
    <div class="py-16 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Mission -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8 transform hover:scale-105 transition-transform duration-300">
            <div class="flex items-center space-x-6">
              <div class="bg-primary-500 rounded-full p-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold mb-2">Misyonumuz</h2>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Müşterilerimize en yenilikçi teknoloji ürünlerini, en uygun fiyatlarla sunarak dijital dönüşüm yolculuklarında güvenilir bir partner olmak.
                </p>
              </div>
            </div>
          </div>

          <!-- Vision -->
          <div class="bg-white rounded-2xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <div class="flex items-center space-x-6">
              <div class="bg-primary-500 rounded-full p-4 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold mb-2">Vizyonumuz</h2>
                <p class="text-gray-600 text-lg leading-relaxed">
                  Türkiye'nin lider teknoloji perakendecisi olarak, müşterilerimizin hayatını kolaylaştıran yenilikçi çözümler sunmak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Company Stats -->
    <div class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-primary-500 mb-2">10+</div>
            <div class="text-gray-600">Yıllık Deneyim</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-500 mb-2">50K+</div>
            <div class="text-gray-600">Mutlu Müşteri</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-500 mb-2">1000+</div>
            <div class="text-gray-600">Ürün Çeşidi</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-500 mb-2">24/7</div>
            <div class="text-gray-600">Müşteri Desteği</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Ekibimiz</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            v-for="member in teamMembers" 
            :key="member.id"
            class="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <img 
              :src="member.image" 
              :alt="member.name"
              class="w-full h-64 object-cover"
            >
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">{{ member.name }}</h3>
              <p class="text-primary-500 mb-4">{{ member.position }}</p>
              <p class="text-gray-600">{{ member.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Values Section -->
    <div class="bg-gray-100 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Değerlerimiz</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl p-6">
            <div class="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Müşteri Odaklılık</h3>
            <p class="text-gray-600">
              Müşterilerimizin ihtiyaçlarını anlar ve en iyi çözümleri sunarız.
            </p>
          </div>
          
          <div class="bg-white rounded-xl p-6">
            <div class="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Güvenilirlik</h3>
            <p class="text-gray-600">
              Dürüstlük ve şeffaflık ilkelerimizle güven inşa ederiz.
            </p>
          </div>
          
          <div class="bg-white rounded-xl p-6">
            <div class="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Yenilikçilik</h3>
            <p class="text-gray-600">
              Teknolojideki son gelişmeleri takip eder ve müşterilerimize sunarız.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  
  setup() {
    const milestones = [
      {
        year: '2014',
        title: 'Yolculuğun Başlangıcı',
        description: 'İlk mağazamızı İstanbul\'da açtık ve teknoloji tutkunlarına hizmet vermeye başladık.',
        icon: 'fas fa-store'
      },
      {
        year: '2016',
        title: 'Online Mağaza Lansmanı',
        description: 'E-ticaret platformumuz ile Türkiye\'nin her yerine hizmet vermeye başladık.',
        icon: 'fas fa-globe'
      },
      {
        year: '2018',
        title: 'Büyüme ve Genişleme',
        description: '10 ilde 25 mağazaya ulaştık ve ürün yelpazemizi genişlettik.',
        icon: 'fas fa-chart-line'
      },
      {
        year: '2020',
        title: 'Dijital Dönüşüm',
        description: 'Mobil uygulamamızı lansmanladık ve omnichannel stratejimizi hayata geçirdik.',
        icon: 'fas fa-mobile-alt'
      },
      {
        year: '2022',
        title: 'Teknoloji Merkezi',
        description: 'Türkiye\'nin en büyük teknoloji deneyim merkezini açtık.',
        icon: 'fas fa-desktop'
      },
      {
        year: '2024',
        title: 'Sürdürülebilir Gelecek',
        description: 'Yeşil teknoloji inisiyatifimizi başlattık ve karbon ayak izimizi azaltmaya odaklandık.',
        icon: 'fas fa-leaf'
      }
    ]

    const teamMembers = [
      {
        id: 1,
        name: 'Ahmet Yılmaz',
        position: 'CEO',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
        description: '15 yıllık teknoloji ve yönetim deneyimi'
      },
      {
        id: 2,
        name: 'Ayşe Demir',
        position: 'Teknoloji Direktörü',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        description: 'Yazılım ve sistem mimarisi uzmanı'
      },
      {
        id: 3,
        name: 'Mehmet Kaya',
        position: 'Satış Müdürü',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        description: '10 yıllık satış ve pazarlama deneyimi'
      }
    ]

    return {
      teamMembers,
      milestones
    }
  }
}
</script>

<style scoped>
/* Timeline dot pulse animation */
.timeline-dot::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: inherit;
  border-radius: inherit;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style> 