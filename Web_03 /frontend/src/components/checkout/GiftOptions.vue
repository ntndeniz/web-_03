<template>
  <div class="gift-options">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Hediye Seçenekleri</h3>

    <!-- Hediye Paketi Seçimi -->
    <div class="gift-wrap-section mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="text-sm font-medium text-gray-900">Hediye Paketi</h4>
          <p class="text-sm text-gray-500">Siparişiniz özel hediye paketiyle gönderilsin</p>
        </div>
        <div class="flex items-center">
          <label class="switch">
            <input 
              type="checkbox"
              v-model="options.giftWrap"
              @change="updatePrice"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Hediye Paketi Seçenekleri -->
      <div v-if="options.giftWrap" class="mt-4 space-y-4">
        <div class="wrap-options grid grid-cols-3 gap-4">
          <div
            v-for="style in giftWrapStyles"
            :key="style.id"
            class="wrap-option"
            :class="{ 'selected': options.wrapStyle === style.id }"
            @click="selectWrapStyle(style)"
          >
            <img :src="style.image" :alt="style.name" class="w-full h-32 object-cover rounded-lg">
            <p class="mt-2 text-sm font-medium text-gray-900">{{ style.name }}</p>
            <p class="text-sm text-gray-500">+{{ formatCurrency(style.price) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hediye Notu -->
    <div class="gift-message-section">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="text-sm font-medium text-gray-900">Hediye Notu</h4>
          <p class="text-sm text-gray-500">Özel mesajınız hediye kartına yazılacak</p>
        </div>
        <div class="flex items-center">
          <label class="switch">
            <input 
              type="checkbox"
              v-model="options.includeMessage"
            >
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Hediye Notu Formu -->
      <div v-if="options.includeMessage" class="message-form space-y-4">
        <div class="form-group">
          <label class="form-label">Gönderen</label>
          <input 
            type="text"
            v-model="options.sender"
            class="form-input"
            placeholder="İsminiz"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Alıcı</label>
          <input 
            type="text"
            v-model="options.recipient"
            class="form-input"
            placeholder="Hediyeyi alacak kişinin adı"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Mesajınız</label>
          <textarea
            v-model="options.message"
            rows="3"
            class="form-input"
            placeholder="Hediye notunuzu yazın..."
            :maxlength="maxMessageLength"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ options.message.length }}/{{ maxMessageLength }} karakter
          </p>
        </div>
      </div>
    </div>

    <!-- Fiyat Özeti -->
    <div v-if="options.giftWrap" class="price-summary mt-6 pt-6 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">Hediye Paketi Ücreti</span>
        <span class="text-sm font-medium text-gray-900">
          {{ formatCurrency(totalGiftPrice) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'GiftOptions',

  props: {
    initialOptions: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update:options'],

  setup(props, { emit }) {
    const maxMessageLength = 200
    
    const options = ref({
      giftWrap: false,
      wrapStyle: null,
      includeMessage: false,
      sender: '',
      recipient: '',
      message: '',
      ...props.initialOptions
    })

    const giftWrapStyles = [
      {
        id: 'classic',
        name: 'Klasik',
        image: '/images/gift-wrap/classic.jpg',
        price: 29.90
      },
      {
        id: 'premium',
        name: 'Premium',
        image: '/images/gift-wrap/premium.jpg',
        price: 49.90
      },
      {
        id: 'luxury',
        name: 'Lüks',
        image: '/images/gift-wrap/luxury.jpg',
        price: 79.90
      }
    ]

    const totalGiftPrice = computed(() => {
      if (!options.value.giftWrap || !options.value.wrapStyle) return 0
      const selectedStyle = giftWrapStyles.find(s => s.id === options.value.wrapStyle)
      return selectedStyle ? selectedStyle.price : 0
    })

    const selectWrapStyle = (style) => {
      options.value.wrapStyle = style.id
      updateOptions()
    }

    const updateOptions = () => {
      emit('update:options', {
        ...options.value,
        totalPrice: totalGiftPrice.value
      })
    }

    // Watch for changes and emit updates
    watch(options, updateOptions, { deep: true })

    return {
      options,
      giftWrapStyles,
      maxMessageLength,
      totalGiftPrice,
      selectWrapStyle,
      formatCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-options {
  @apply bg-white rounded-lg p-6;

  .switch {
    @apply relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
           border-2 border-transparent transition-colors duration-200 ease-in-out
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }

  .wrap-option {
    @apply cursor-pointer rounded-lg border-2 border-gray-200 p-4 transition-all
           hover:border-primary-200;

    &.selected {
      @apply border-primary-500 ring-2 ring-primary-500;
    }
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }

  .form-input {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }
}
</style> 