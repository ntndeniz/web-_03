<template>
  <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
    <h3 class="text-2xl font-bold mb-2">{{ offer.title }}</h3>
    <p class="mb-4">{{ offer.description }}</p>
    
    <div class="flex justify-between items-center">
      <div class="text-3xl font-bold">
        %{{ offer.discountRate }}
      </div>
      
      <router-link 
        :to="offer.link"
        class="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
      >
        Fırsatı Yakala
      </router-link>
    </div>

    <div v-if="offer.endDate" class="mt-4">
      <p class="text-sm">Kampanya Bitiş Tarihi:</p>
      <countdown-timer :end-date="offer.endDate" />
    </div>
  </div>
</template>

<script>
import CountdownTimer from './CountdownTimer.vue'

export default {
  name: 'DiscountCard',
  components: {
    CountdownTimer
  },
  props: {
    offer: {
      type: Object,
      required: true
    }
  }
}
</script> 