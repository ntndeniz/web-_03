<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Ödeme Bilgileri</h2>

    <!-- Kayıtlı Kartlar -->
    <div v-if="savedCards.length" class="space-y-4">
      <div 
        v-for="card in savedCards"
        :key="card.id"
        class="relative flex items-center space-x-4 rounded-lg border p-4"
        :class="{ 'border-blue-500 bg-blue-50': selectedCard === card.id }"
      >
        <input
          type="radio"
          name="payment-method"
          :value="card.id"
          v-model="selectedCard"
          class="h-4 w-4 text-blue-600"
        />
        
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <i :class="getCardIcon(card.brand)" class="text-xl"></i>
            <span class="font-medium">**** **** **** {{ card.last4 }}</span>
          </div>
          <div class="mt-1 text-sm text-gray-600">
            Son Kullanma: {{ card.expMonth }}/{{ card.expYear }}
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Kart Formu -->
    <form v-show="!selectedCard" @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Kart Üzerindeki İsim</label>
        <input 
          v-model="form.cardName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Kart Numarası</label>
        <input 
          v-model="form.cardNumber"
          type="text"
          required
          maxlength="19"
          @input="formatCardNumber"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Son Kullanma Tarihi</label>
          <input 
            v-model="form.cardExpiry"
            type="text"
            required
            placeholder="AA/YY"
            maxlength="5"
            @input="formatExpiry"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">CVV</label>
          <input 
            v-model="form.cardCvv"
            type="text"
            required
            maxlength="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex items-center">
        <input 
          v-model="form.saveCard"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label class="ml-2 block text-sm text-gray-900">
          Bu kartı kaydet
        </label>
      </div>
    </form>

    <!-- Ödeme Butonu -->
    <button 
      @click="processPayment"
      :disabled="loading"
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span v-if="!loading">{{ total }} TL Öde</span>
      <LoadingSpinner v-else size="sm" color="white" />
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'PaymentForm',
  components: {
    LoadingSpinner
  },
  props: {
    total: {
      type: Number,
      required: true
    }
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const selectedCard = ref('')
    const form = ref({
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      saveCard: false
    })

    const savedCards = computed(() => store.state.payment.savedCards)

    const formatCardNumber = () => {
      let value = form.value.cardNumber.replace(/\D/g, '')
      value = value.replace(/(\d{4})/g, '$1 ').trim()
      form.value.cardNumber = value
    }

    const formatExpiry = () => {
      let value = form.value.cardExpiry.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
      form.value.cardExpiry = value
    }

    const getCardIcon = (brand) => {
      const icons = {
        visa: 'fab fa-cc-visa',
        mastercard: 'fab fa-cc-mastercard',
        amex: 'fab fa-cc-amex',
        default: 'fas fa-credit-card'
      }
      return icons[brand] || icons.default
    }

    const processPayment = async () => {
      loading.value = true
      try {
        const paymentData = selectedCard.value ? 
          { savedCardId: selectedCard.value } : 
          form.value

        await store.dispatch('payment/processPayment', paymentData)
        router.push('/order-confirmation')
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Ödeme işlemi başarısız oldu'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      selectedCard,
      form,
      savedCards,
      formatCardNumber,
      formatExpiry,
      getCardIcon,
      processPayment
    }
  }
}
</script> 