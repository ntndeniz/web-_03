<template>
    <div class="plan-details">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <!-- Plan Başlığı -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ plan.name }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ plan.description }}
              </p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-gray-900">
                {{ formatPrice(plan.price) }}/ay
              </div>
              <div class="mt-1 text-sm text-gray-500">
                {{ plan.billingPeriod }}
              </div>
            </div>
          </div>
  
          <!-- Plan Özellikleri -->
          <div class="mt-8">
            <h4 class="text-sm font-medium text-gray-900">Plan Özellikleri</h4>
            <ul class="mt-4 space-y-4">
              <li v-for="feature in plan.features" :key="feature.name" 
                  class="flex items-start">
                <CheckCircleIcon class="h-5 w-5 text-green-500 mt-0.5" />
                <span class="ml-3 text-sm text-gray-700">{{ feature.name }}</span>
              </li>
            </ul>
          </div>
  
          <!-- Aksiyon Butonları -->
          <div class="mt-8 flex justify-end space-x-4">
            <button 
              v-if="!isSubscribed" 
              @click="subscribe"
              class="subscribe-button"
            >
              Planı Seç
            </button>
            <button 
              v-else 
              @click="unsubscribe"
              class="unsubscribe-button"
            >
              İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { CheckCircleIcon } from '@heroicons/vue/solid'
  import { formatPrice } from '@/utils/formatters'
  
  export default {
    name: 'PlanDetails',
    
    components: {
      CheckCircleIcon
    },
  
    props: {
      plan: {
        type: Object,
        required: true
      },
      isSubscribed: {
        type: Boolean,
        default: false
      }
    },
  
    setup(props, { emit }) {
      const subscribe = () => {
        emit('subscribe', props.plan)
      }
  
      const unsubscribe = () => {
        emit('unsubscribe', props.plan)
      }
  
      return {
        subscribe,
        unsubscribe,
        formatPrice
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .subscribe-button {
    @apply inline-flex justify-center py-2 px-4 border border-transparent rounded-md 
           shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }
  
  .unsubscribe-button {
    @apply inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md 
           shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }
  </style>