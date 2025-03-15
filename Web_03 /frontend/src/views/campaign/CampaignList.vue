<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl mb-8 relative overflow-hidden">
      <div class="relative py-16 px-8">
        <h1 class="text-4xl font-bold text-white mb-4">Kampanyalar</h1>
        <p class="text-gray-100 text-lg max-w-2xl">
          En güncel kampanyalar ve özel fırsatları kaçırmayın!
        </p>
      </div>
    </div>

    <!-- Campaign Categories -->
    <div class="flex flex-wrap gap-4 mb-8">
      <button 
        v-for="category in categories" 
        :key="category.id"
        @click="selectedCategory = category.id"
        :class="[
          'px-4 py-2 rounded-full transition-colors',
          selectedCategory === category.id 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ category.name }}
      </button>
    </div>

    <!-- Campaigns Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div 
        v-for="campaign in filteredCampaigns" 
        :key="campaign.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
      >
        <!-- Campaign Image -->
        <div class="relative">
          <img 
            :src="campaign.image" 
            :alt="campaign.title"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          >
          <div class="absolute top-4 right-4">
            <span class="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              {{ campaign.discount }}
            </span>
          </div>
          <div v-if="campaign.endDate" class="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
            Son {{ campaign.endDate }} gün
          </div>
        </div>

        <!-- Campaign Content -->
        <div class="p-6">
          <div class="flex items-center mb-3">
            <span :class="[
              'text-xs font-semibold px-2 py-1 rounded',
              campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ campaign.status === 'active' ? 'Aktif' : 'Sona Erdi' }}
            </span>
          </div>
          
          <h3 class="text-xl font-bold mb-2">{{ campaign.title }}</h3>
          <p class="text-gray-600 mb-4 line-clamp-2">{{ campaign.description }}</p>
          
          <div class="flex justify-between items-center">
            <div class="text-purple-600 font-semibold">
              {{ campaign.code }}
            </div>
            <button 
              @click="copyCampaignCode(campaign.code)"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Kodu Kopyala
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'

export default {
  name: 'CampaignList',
  setup() {
    const toast = useToast()
    const selectedCategory = ref(null)

    const categories = [
      { id: null, name: 'Tümü' },
      { id: 1, name: 'İndirimler' },
      { id: 2, name: 'Özel Fırsatlar' },
      { id: 3, name: 'Sezonsal' },
      { id: 4, name: 'Yeni Üye' }
    ]

    const campaigns = [
      {
        id: 1,
        title: 'Hoş Geldin İndirimi',
        description: 'Yeni üyelere özel ilk alışverişlerinde %20 indirim fırsatı!',
        image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a',
        discount: '%20',
        code: 'WELCOME20',
        status: 'active',
        endDate: 30,
        categoryId: 4
      },
      {
        id: 2,
        title: 'Sezon Sonu Fırsatı',
        description: 'Seçili ürünlerde net %50 indirim kampanyası',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da',
        discount: '%50',
        code: 'SEASON50',
        status: 'active',
        endDate: 15,
        categoryId: 3
      },
      {
        id: 3,
        title: 'Kış Kampanyası',
        description: 'Kış ürünlerinde 2 al 1 öde fırsatı',
        image: 'https://images.unsplash.com/photo-1608755728617-0c5cc717b119',
        discount: '2AL1ÖDE',
        code: 'WINTER241',
        status: 'active',
        endDate: 7,
        categoryId: 2
      }
    ]

    const filteredCampaigns = computed(() => {
      if (!selectedCategory.value) return campaigns
      return campaigns.filter(campaign => campaign.categoryId === selectedCategory.value)
    })

    const copyCampaignCode = (code) => {
      navigator.clipboard.writeText(code)
      toast.success('Kampanya kodu kopyalandı!')
    }

    return {
      categories,
      selectedCategory,
      filteredCampaigns,
      copyCampaignCode
    }
  }
}
</script> 