<template>
  <div class="address-verification">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Adres Doğrulama</h3>

    <!-- Girilen Adres -->
    <div class="entered-address mb-6 p-4 bg-gray-50 rounded-lg">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Girilen Adres</h4>
      <p class="text-sm text-gray-600">
        {{ address.street }}<br>
        {{ address.district }}, {{ address.city }}<br>
        {{ address.postalCode }}
      </p>
    </div>

    <!-- Önerilen Adresler -->
    <div v-if="suggestions.length > 0" class="suggestions">
      <h4 class="text-sm font-medium text-gray-700 mb-2">Önerilen Adresler</h4>
      <div class="space-y-3">
        <div 
          v-for="suggestion in suggestions" 
          :key="suggestion.id"
          class="suggestion-item"
          :class="{ 'ring-2 ring-primary-500': selectedAddress === suggestion.id }"
          @click="selectAddress(suggestion.id)"
        >
          <div class="flex items-start">
            <input
              type="radio"
              :checked="selectedAddress === suggestion.id"
              class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
            >
            <div class="ml-3">
              <p class="text-sm text-gray-900">{{ suggestion.formattedAddress }}</p>
              <p class="text-xs text-gray-500">{{ suggestion.accuracy }}% eşleşme</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Doğrulama Durumu -->
    <div class="verification-status mt-6">
      <div v-if="isVerified" class="success-status">
        <i class="fas fa-check-circle text-green-500 mr-2"></i>
        <span class="text-sm text-green-700">Adres doğrulandı</span>
      </div>
      <div v-else-if="isVerifying" class="verifying-status">
        <i class="fas fa-spinner fa-spin text-primary-500 mr-2"></i>
        <span class="text-sm text-gray-700">Adres doğrulanıyor...</span>
      </div>
      <div v-else class="error-status">
        <i class="fas fa-exclamation-circle text-red-500 mr-2"></i>
        <span class="text-sm text-red-700">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Aksiyonlar -->
    <div class="actions mt-6 flex justify-end space-x-4">
      <button 
        @click="useOriginalAddress"
        class="secondary-button"
      >
        Girdiğim Adresi Kullan
      </button>
      <button 
        @click="confirmAddress"
        class="primary-button"
        :disabled="!selectedAddress && !isVerified"
      >
        Adresi Onayla
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AddressVerification',

  props: {
    address: {
      type: Object,
      required: true
    }
  },

  emits: ['address-verified', 'use-original'],

  setup(props, { emit }) {
    const store = useStore()
    const selectedAddress = ref(null)
    const isVerifying = ref(false)
    const errorMessage = ref('')
    const suggestions = ref([])

    const isVerified = computed(() => {
      return selectedAddress.value || suggestions.value.length === 0
    })

    const verifyAddress = async () => {
      try {
        isVerifying.value = true
        errorMessage.value = ''
        
        // Adres doğrulama servisi çağrısı
        const response = await store.dispatch('checkout/verifyAddress', props.address)
        suggestions.value = response.suggestions
        
        if (suggestions.value.length === 0) {
          errorMessage.value = 'Adres doğrulanamadı'
        }
      } catch (error) {
        errorMessage.value = error.message
      } finally {
        isVerifying.value = false
      }
    }

    const selectAddress = (id) => {
      selectedAddress.value = id
    }

    const confirmAddress = () => {
      const verifiedAddress = selectedAddress.value
        ? suggestions.value.find(s => s.id === selectedAddress.value)
        : props.address

      emit('address-verified', verifiedAddress)
    }

    const useOriginalAddress = () => {
      emit('use-original', props.address)
    }

    // Component mounted olduğunda adres doğrulamayı başlat
    verifyAddress()

    return {
      selectedAddress,
      isVerifying,
      isVerified,
      errorMessage,
      suggestions,
      selectAddress,
      confirmAddress,
      useOriginalAddress
    }
  }
}
</script>

<style lang="scss" scoped>
.address-verification {
  @apply bg-white rounded-lg p-6;

  .suggestion-item {
    @apply p-4 border border-gray-200 rounded-lg cursor-pointer
           hover:bg-gray-50 transition-colors duration-150;
  }

  .primary-button {
    @apply inline-flex items-center px-4 py-2 border border-transparent
           rounded-md shadow-sm text-sm font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .secondary-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300
           rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white
           hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500;
  }
}
</style> 