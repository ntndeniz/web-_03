<template>
  <div class="promotions-container">
    <div class="promotions-header">
      <h2 class="promotions-title">{{ title }}</h2>
      <p class="promotions-description">{{ description }}</p>
    </div>

    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-state">
      <ErrorMessage :message="error" />
    </div>

    <div v-else class="promotions-grid">
      <div
        v-for="promotion in activePromotions"
        :key="promotion.id"
        class="promotion-card"
        @click="handlePromotionClick(promotion)"
      >
        <div class="promotion-image">
          <img :src="promotion.image" :alt="promotion.title" />
          <div v-if="promotion.badge" class="promotion-badge">
            {{ promotion.badge }}
          </div>
        </div>

        <div class="promotion-content">
          <h3 class="promotion-name">{{ promotion.title }}</h3>
          <p class="promotion-description">{{ promotion.description }}</p>
          
          <div class="promotion-details">
            <div class="promotion-discount">
              {{ formatDiscount(promotion.discount) }}
            </div>
            <div class="promotion-validity">
              {{ formatValidity(promotion.validUntil) }}
            </div>
          </div>

          <button 
            class="promotion-button"
            @click.stop="applyPromotion(promotion)"
          >
            {{ promotion.buttonText || 'Kampanyayı Kullan' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showPagination" class="promotions-pagination">
      <Pagination
        :total="totalPromotions"
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
  name: 'Promotions',

  components: {
    LoadingSpinner,
    ErrorMessage,
    Pagination
  },

  props: {
    title: {
      type: String,
      default: 'Güncel Kampanyalar'
    },
    description: {
      type: String,
      default: 'Size özel kampanya ve fırsatları kaçırmayın'
    }
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const currentPage = ref(1)

    const activePromotions = computed(() => 
      store.getters['marketing/activePromotions']
    )

    const totalPromotions = computed(() => 
      store.getters['marketing/totalPromotions']
    )

    const showPagination = computed(() => 
      totalPromotions.value > 10
    )

    const loadPromotions = async (page = 1) => {
      try {
        loading.value = true
        await store.dispatch('marketing/fetchPromotions', { page })
      } catch (err) {
        error.value = 'Kampanyalar yüklenirken bir hata oluştu'
      } finally {
        loading.value = false
      }
    }

    const handlePromotionClick = (promotion) => {
      analyticsService.trackPromotionClick(promotion)
    }

    const applyPromotion = async (promotion) => {
      try {
        await store.dispatch('marketing/applyPromotion', promotion)
        analyticsService.trackPromotionApply(promotion)
      } catch (err) {
        error.value = 'Kampanya uygulanırken bir hata oluştu'
      }
    }

    const handlePageChange = (page) => {
      currentPage.value = page
      loadPromotions(page)
    }

    const formatDiscount = (discount) => {
      return `%${discount} İndirim`
    }

    const formatValidity = (date) => {
      return `Son geçerlilik: ${formatDate(date)}`
    }

    onMounted(() => {
      loadPromotions()
    })

    return {
      loading,
      error,
      activePromotions,
      totalPromotions,
      currentPage,
      showPagination,
      handlePromotionClick,
      applyPromotion,
      handlePageChange,
      formatDiscount,
      formatValidity
    }
  }
}
</script>

<style scoped>
.promotions-container {
  @apply space-y-6;
}

.promotions-header {
  @apply text-center space-y-2;
}

.promotions-title {
  @apply text-3xl font-bold text-gray-800;
}

.promotions-description {
  @apply text-gray-600;
}

.promotions-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.promotion-card {
  @apply bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105;
}

.promotion-image {
  @apply relative;
}

.promotion-badge {
  @apply absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold;
}

.promotion-content {
  @apply p-4 space-y-4;
}

.promotion-name {
  @apply text-xl font-semibold text-gray-800;
}

.promotion-description {
  @apply text-gray-600 text-sm;
}

.promotion-details {
  @apply flex justify-between items-center;
}

.promotion-discount {
  @apply text-lg font-bold text-green-600;
}

.promotion-validity {
  @apply text-sm text-gray-500;
}

.promotion-button {
  @apply w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.loading-state,
.error-state {
  @apply flex justify-center items-center min-h-[200px];
}
</style> 