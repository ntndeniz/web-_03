<template>
  <div class="faq-container">
    <div class="faq-header">
      <h2 class="faq-title">{{ title }}</h2>
      <p class="faq-description">{{ description }}</p>
    </div>

    <div class="faq-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Soru ara..."
        class="search-input"
      />
    </div>

    <div class="faq-categories">
      <button
        v-for="category in categories"
        :key="category.id"
        class="category-button"
        :class="{ active: selectedCategory === category.id }"
        @click="selectedCategory = category.id"
      >
        {{ category.name }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="error-state">
      <ErrorMessage :message="error" />
    </div>

    <div v-else class="faq-list">
      <div
        v-for="(faq, index) in filteredFaqs"
        :key="faq.id"
        class="faq-item"
      >
        <button
          class="faq-question"
          @click="toggleFaq(index)"
          :aria-expanded="openFaqs[index]"
        >
          <span>{{ faq.question }}</span>
          <i 
            class="fas"
            :class="openFaqs[index] ? 'fa-chevron-up' : 'fa-chevron-down'"
          ></i>
        </button>

        <div
          v-show="openFaqs[index]"
          class="faq-answer"
        >
          <div v-html="faq.answer"></div>
          
          <div class="answer-footer">
            <div class="answer-meta">
              <span>Son güncelleme: {{ formatDate(faq.updatedAt) }}</span>
            </div>
            <div class="answer-actions">
              <button 
                class="helpful-button"
                @click="markHelpful(faq)"
              >
                <i class="fas fa-thumbs-up"></i>
                Faydalı ({{ faq.helpfulCount }})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!hasResults" class="no-results">
      <p>Aramanızla eşleşen soru bulunamadı.</p>
      <button 
        class="contact-button"
        @click="openContactForm"
      >
        Destek Ekibine Ulaşın
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/helpers/date'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'

export default {
  name: 'FAQ',

  components: {
    LoadingSpinner,
    ErrorMessage
  },

  props: {
    title: {
      type: String,
      default: 'Sıkça Sorulan Sorular'
    },
    description: {
      type: String,
      default: 'En çok sorulan sorular ve yanıtları'
    }
  },

  setup() {
    const store = useStore()
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const openFaqs = ref([])
    const loading = ref(false)
    const error = ref(null)

    // FAQ verilerini getir
    const fetchFaqs = async () => {
      try {
        loading.value = true
        await store.dispatch('support/fetchFaqs')
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    // FAQ kategorilerini getir
    const categories = computed(() => store.state.support.faqCategories)
    
    // Filtrelenmiş FAQ listesi
    const filteredFaqs = computed(() => {
      let faqs = store.state.support.faqs

      if (selectedCategory.value) {
        faqs = faqs.filter(faq => faq.categoryId === selectedCategory.value)
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        faqs = faqs.filter(faq => 
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
        )
      }

      return faqs
    })

    // Sonuç kontrolü
    const hasResults = computed(() => filteredFaqs.value.length > 0)

    // FAQ açma/kapama
    const toggleFaq = (index) => {
      openFaqs.value[index] = !openFaqs.value[index]
    }

    // Faydalı işaretleme
    const markHelpful = async (faq) => {
      await store.dispatch('support/markFaqHelpful', faq.id)
    }

    // İletişim formunu aç
    const openContactForm = () => {
      store.commit('ui/setContactFormVisible', true)
    }

    // Verileri yükle
    fetchFaqs()

    return {
      searchQuery,
      selectedCategory,
      categories,
      filteredFaqs,
      openFaqs,
      loading,
      error,
      hasResults,
      toggleFaq,
      markHelpful,
      openContactForm,
      formatDate
    }
  }
}
</script>

<style scoped>
.faq-container {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.faq-header {
  @apply text-center mb-8;
}

.faq-title {
  @apply text-3xl font-bold text-gray-800 mb-2;
}

.faq-description {
  @apply text-gray-600;
}

.faq-search {
  @apply mb-6;
}

.search-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.faq-categories {
  @apply flex flex-wrap gap-2 mb-6;
}

.category-button {
  @apply px-4 py-2 rounded-full text-sm font-medium transition-colors;
}

.category-button:not(.active) {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.category-button.active {
  @apply bg-blue-600 text-white;
}

.faq-list {
  @apply space-y-4;
}

.faq-item {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.faq-question {
  @apply w-full flex justify-between items-center p-4 text-left font-medium text-gray-800 hover:bg-gray-50;
}

.faq-answer {
  @apply p-4 bg-gray-50 border-t border-gray-100;
}

.answer-footer {
  @apply flex justify-between items-center mt-4 pt-4 border-t border-gray-200;
}

.answer-meta {
  @apply text-sm text-gray-500;
}

.helpful-button {
  @apply flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-blue-600;
}

.no-results {
  @apply text-center py-8;
}

.contact-button {
  @apply mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.loading-state,
.error-state {
  @apply flex justify-center items-center min-h-[200px];
}
</style> 