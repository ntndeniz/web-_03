<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0">
            <img class="h-8 w-auto" src="@/assets/images/logo.png" alt="Logo" />
          </router-link>

          <!-- Adımlar -->
          <nav class="hidden md:flex">
            <ol class="flex items-center space-x-4">
              <li v-for="(step, index) in checkoutSteps" :key="step.id">
                <!-- Adım -->
                <div class="flex items-center">
                  <div
                    class="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                    :class="[
                      getCurrentStepIndex() >= index
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    ]"
                  >
                    {{ index + 1 }}
                  </div>
                  <span
                    class="ml-4 text-sm font-medium"
                    :class="[
                      getCurrentStepIndex() >= index
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    ]"
                  >
                    {{ step.title }}
                  </span>
                </div>

                <!-- Ayraç -->
                <div
                  v-if="index < checkoutSteps.length - 1"
                  class="hidden md:block w-8 h-px mx-4 bg-gray-300"
                ></div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </header>

    <!-- Ana İçerik -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <router-view />
    </main>

    <!-- Global Bileşenler -->
    <Toast />
    <LoadingSpinner v-if="isLoading" overlay />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'CheckoutLayout',

  components: {
    Toast,
    LoadingSpinner
  },

  setup() {
    const route = useRoute()
    const store = useStore()

    const checkoutSteps = [
      { id: 'cart', title: 'Sepet', route: '/sepet' },
      { id: 'shipping', title: 'Teslimat', route: '/odeme/teslimat' },
      { id: 'payment', title: 'Ödeme', route: '/odeme/odeme' },
      { id: 'confirmation', title: 'Onay', route: '/odeme/onay' }
    ]

    const isLoading = computed(() => store.getters['ui/isLoading'])

    const getCurrentStepIndex = () => {
      const currentRoute = route.path
      return checkoutSteps.findIndex(step => step.route === currentRoute)
    }

    return {
      checkoutSteps,
      isLoading,
      getCurrentStepIndex
    }
  }
}
</script> 