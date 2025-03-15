<template>
    <div class="plan-list">
      <!-- Plan Başlığı -->
      <div class="text-center mb-10">
        <h2 class="text-3xl font-bold text-gray-900">Abonelik Planları</h2>
        <p class="mt-4 text-lg text-gray-600">İhtiyacınıza en uygun planı seçin</p>
      </div>
  
      <!-- Plan Kartları -->
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="plan in plans" :key="plan.id" class="plan-card">
          <div class="p-6">
            <h3 class="text-xl font-semibold">{{ plan.name }}</h3>
            <div class="mt-4">
              <span class="text-4xl font-bold">{{ formatPrice(plan.price) }}</span>
              <span class="text-gray-500">/ay</span>
            </div>
            <ul class="mt-6 space-y-4">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center">
                <CheckIcon class="h-5 w-5 text-green-500" />
                <span class="ml-3">{{ feature }}</span>
              </li>
            </ul>
            <button 
              @click="selectPlan(plan)"
              class="mt-8 w-full select-plan-button"
            >
              Planı Seç
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { CheckIcon } from '@heroicons/vue/solid'
  import { formatPrice } from '@/utils/formatters'
  
  export default {
    name: 'PlanList',
    
    components: {
      CheckIcon
    },
  
    props: {
      plans: {
        type: Array,
        required: true
      }
    },
  
    setup(props, { emit }) {
      const selectPlan = (plan) => {
        emit('select-plan', plan)
      }
  
      return {
        selectPlan,
        formatPrice
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .plan-card {
    @apply bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl 
           transition-shadow duration-300;
  }
  
  .select-plan-button {
    @apply py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
           text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 
           focus:ring-offset-2 focus:ring-primary-500;
  }
  </style>