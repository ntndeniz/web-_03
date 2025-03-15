<template>
  <div class="campaigns-container">
    <div class="campaigns-header">
      <h2 class="campaigns-title">{{ title }}</h2>
      <p class="campaigns-description">{{ description }}</p>
    </div>

    <div class="campaigns-filters">
      <div class="filter-group">
        <label>Kategori</label>
        <select v-model="selectedCategory">
          <option value="">Tümü</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Sıralama</label>
        <select v-model="sortBy">
          <option value="startDate">Başlangıç Tarihi</option>
          <option value="endDate">Bitiş Tarihi</option>
          <option value="discount">İndirim Oranı</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-state">
      <ErrorMessage :message="error" />
    </div>

    <div v-else class="campaigns-list">
      <div
        v-for="campaign in filteredCampaigns"
        :key="campaign.id"
        class="campaign-card"
      >
        <div class="campaign-image">
          <img :src="campaign.image" :alt="campaign.title" />
          <div 
            v-if="isActiveCampaign(campaign)"
            class="campaign-status active"
          >
            Aktif
          </div>
          <div 
            v-else
            class="campaign-status inactive"
          >
            Sona Erdi
          </div>
        </div>

        <div class="campaign-content">
          <h3 class="campaign-title">{{ campaign.title }}</h3>
          <p class="campaign-description">{{ campaign.description }}</p>

          <div class="campaign-details">
            <div class="campaign-dates">
              <div class="date-group">
                <span>Başlangıç:</span>
                <span>{{ formatDate(campaign.startDate) }}</span>
              </div>
              <div class="date-group">
                <span>Bitiş:</span>
                <span>{{ formatDate(campaign.endDate) }}</span>
              </div>
            </div>

            <div class="campaign-stats">
              <div class="stat-item">
                <span>Katılım:</span>
                <span>{{ campaign.participantCount }}</span>
              </div>
              <div class="stat-item">
                <span>İndirim:</span>
                <span>%{{ campaign.discountRate }}</span>
              </div>
            </div>
          </div>

          <button
            class="campaign-button"
            :disabled="!isActiveCampaign(campaign)"
            @click="participateCampaign(campaign)"
          >
            {{ isActiveCampaign(campaign) ? 'Kampanyaya Katıl' : 'Kampanya Sona Erdi' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPagination" class="campaigns-pagination">
      <Pagination
        :total="totalCampaigns"
        :current="currentPage"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/helpers/date'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import Pagination from '@/components/shared/Pagination.vue'
import analyticsService from '@/services/analytics'

export default {
  name: 'Campaigns',

  components: {
    LoadingSpinner,
    ErrorMessage,
    Pagination
  },

  props: {
    title: {
      type: String,
      default: 'Aktif Kampanyalar'
    },
    description: {
      type: String,
      default: 'Tüm kampanyalarımızı keşfedin'
    }
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const selectedCategory = ref('')
    const sortBy = ref('startDate')
    const currentPage = ref(1)

    const campaigns = computed(() => 
      store.getters['marketing/campaigns']
    )

    const categories = computed(() => 
      store.getters['marketing/campaignCategories']
    )

    const totalCampaigns = computed(() => 
      store.getters['marketing/totalCampaigns']
    )

    const filteredCampaigns = computed(() => {
      let result = [...campaigns.value]

      if (selectedCategory.value) {
        result = result.filter(c => c.categoryId === selectedCategory.value)
      }

      result.sort((a, b) => {
        if (sortBy.value === 'startDate') {
          return new Date(b.startDate) - new Date(a.startDate)
        }
        if (sortBy.value === 'endDate') {
          return new Date(b.endDate) - new Date(a.endDate)
        }
        return b.discountRate - a.discountRate
      })

      return result
    })

    const showPagination = computed(() => 
      totalCampaigns.value > 10
    )

    const loadCampaigns = async (page = 1) => {
      try {
        loading.value = true
        await store.dispatch('marketing/fetchCampaigns', { page })
      } catch (err) {
        error.value = 'Kampanyalar yüklenirken bir hata oluştu'
      } finally {
        loading.value = false
      }
    }

    const isActiveCampaign = (campaign) => {
      const now = new Date()
      return new Date(campaign.startDate) <= now && new Date(campaign.endDate) >= now
    }

    const participateCampaign = async (campaign) => {
      try {
        await store.dispatch('marketing/participateCampaign', campaign.id)
        analyticsService.trackCampaignParticipation(campaign)
      } catch (err) {
        error.value = 'Kampanyaya katılırken bir hata oluştu'
      }
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      loadCampaigns(page)
    }

    onMounted(() => {
      loadCampaigns()
    })

    return {
      loading,
      error,
      selectedCategory,
      sortBy,
      campaigns,
      categories,
      filteredCampaigns,
      totalCampaigns,
      currentPage,
      showPagination,
      formatDate,
      isActiveCampaign,
      participateCampaign,
      handlePageChange
    }
  }
}
</script>

<style scoped>
.campaigns-container {
  @apply space-y-6;
}

.campaigns-header {
  @apply text-center space-y-2;
}

.campaigns-title {
  @apply text-3xl font-bold text-gray-800;
}

.campaigns-description {
  @apply text-gray-600;
}

.campaigns-filters {
  @apply flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg;
}

.filter-group {
  @apply flex flex-col space-y-1;
}

.filter-group label {
  @apply text-sm text-gray-600;
}

.filter-group select {
  @apply px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500;
}

.campaigns-list {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.campaign-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.campaign-image {
  @apply relative;
}

.campaign-status {
  @apply absolute top-2 right-2 px-2 py-1 rounded text-sm font-semibold;
}

.campaign-status.active {
  @apply bg-green-600 text-white;
}

.campaign-status.inactive {
  @apply bg-gray-600 text-white;
}

.campaign-content {
  @apply p-4 space-y-4;
}

.campaign-title {
  @apply text-xl font-semibold text-gray-800;
}

.campaign-description {
  @apply text-gray-600 text-sm;
}

.campaign-details {
  @apply space-y-4;
}

.campaign-dates {
  @apply grid grid-cols-2 gap-4;
}

.date-group {
  @apply flex flex-col text-sm;
}

.date-group span:first-child {
  @apply text-gray-500;
}

.campaign-stats {
  @apply flex justify-between;
}

.stat-item {
  @apply flex flex-col text-sm;
}

.stat-item span:first-child {
  @apply text-gray-500;
}

.stat-item span:last-child {
  @apply font-semibold;
}

.campaign-button {
  @apply w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors;
}

.loading-state,
.error-state {
  @apply flex justify-center items-center min-h-[200px];
}
</style> 