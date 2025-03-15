<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <img class="h-12 w-auto" src="@/assets/images/logo.png" alt="Logo" />
      </router-link>
    </div>

    <!-- Ana İçerik -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <router-view />
      </div>
    </div>

    <!-- Alt Linkler -->
    <div class="mt-8 text-center text-sm text-gray-600">
      <router-link 
        to="/" 
        class="font-medium text-blue-600 hover:text-blue-500"
      >
        Ana Sayfaya Dön
      </router-link>
    </div>

    <!-- Global Bileşenler -->
    <Toast />
    <LoadingSpinner v-if="isLoading" overlay />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'AuthLayout',
  
  components: {
    Toast,
    LoadingSpinner
  },

  computed: {
    ...mapGetters({
      isLoading: 'ui/isLoading'
    })
  }
}
</script> 