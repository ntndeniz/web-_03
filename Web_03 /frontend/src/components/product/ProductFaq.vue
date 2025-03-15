<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Sıkça Sorulan Sorular</h2>

    <!-- SSS Listesi -->
    <div class="space-y-4">
      <div 
        v-for="(faq, index) in faqs" 
        :key="index"
        class="rounded-lg border"
      >
        <button
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          :class="{ 'border-b': faq.isOpen }"
          @click="toggleFaq(index)"
        >
          <span class="font-medium">{{ faq.question }}</span>
          <i 
            class="fas transition-transform"
            :class="faq.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"
          ></i>
        </button>
        
        <div 
          v-show="faq.isOpen"
          class="px-4 py-3 text-gray-600"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>

    <!-- Soru Sor -->
    <div class="rounded-lg bg-gray-50 p-6">
      <h3 class="mb-4 text-lg font-medium">Başka Sorunuz Var Mı?</h3>
      <form @submit.prevent="submitQuestion" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Sorunuz</label>
          <textarea
            v-model="newQuestion"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Sorunuzu buraya yazın..."
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="loading || !newQuestion"
          class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span v-if="!loading">Soru Sor</span>
          <LoadingSpinner v-else size="sm" color="white" />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'ProductFaq',
  components: {
    LoadingSpinner
  },
  props: {
    productId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const loading = ref(false)
    const newQuestion = ref('')
    const faqs = ref([
      {
        question: 'Kargo süresi ne kadar?',
        answer: 'Siparişiniz 1-3 iş günü içinde kargoya verilir.',
        isOpen: false
      },
      {
        question: 'İade koşulları nelerdir?',
        answer: '14 gün içinde ücretsiz iade hakkınız bulunmaktadır.',
        isOpen: false
      },
      {
        question: 'Garanti süresi ne kadar?',
        answer: 'Ürün 2 yıl garantilidir.',
        isOpen: false
      }
    ])

    const toggleFaq = (index) => {
      faqs.value[index].isOpen = !faqs.value[index].isOpen
    }

    const submitQuestion = async () => {
      loading.value = true
      try {
        await store.dispatch('products/submitQuestion', {
          productId: props.productId,
          question: newQuestion.value
        })
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Sorunuz başarıyla gönderildi'
        })
        
        newQuestion.value = ''
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Sorunuz gönderilirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      faqs,
      newQuestion,
      toggleFaq,
      submitQuestion
    }
  }
}
</script> 