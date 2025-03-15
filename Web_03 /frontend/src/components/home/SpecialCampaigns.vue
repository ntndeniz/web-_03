<template>
  <section class="bg-primary-50 py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12 text-primary-800">Özel Kampanyalar</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div v-for="campaign in campaigns" :key="campaign.id" class="relative overflow-hidden rounded-2xl group">
          <img :src="campaign.image" :alt="campaign.title" class="w-full h-80 object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
          <div class="absolute bottom-0 left-0 p-6 w-full">
            <span class="inline-block px-4 py-1 rounded-full bg-gold-400 text-white text-sm mb-3">
              {{ campaign.tag }}
            </span>
            <h3 class="text-2xl font-bold text-white mb-2">{{ campaign.title }}</h3>
            <p class="text-primary-100 mb-4">{{ campaign.description }}</p>
            <button class="bg-white text-primary-500 px-6 py-2 rounded-full hover:bg-primary-50 transition-colors duration-300">
              Detayları Gör
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'SpecialCampaigns',
  
  setup() {
    const router = useRouter()

    const campaigns = [
      {
        id: 1,
        title: 'Bahar İndirimi',
        description: 'Seçili ürünlerde net %50 indirim fırsatını kaçırmayın!',
        image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a',
        discount: '%50',
        code: 'BAHAR50',
        daysLeft: 5
      },
      {
        id: 2,
        title: 'Yeni Üye Özel',
        description: 'İlk alışverişinizde geçerli %20 hoş geldin indirimi',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
        discount: '%20',
        code: 'WELCOME20',
        daysLeft: 30
      }
    ]

    const navigateToCampaigns = () => {
      router.push('/campaigns')
    }

    return {
      campaigns,
      navigateToCampaigns
    }
  }
}
</script> 