<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Logo -->
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <router-link to="/" class="flex justify-center">
        <img class="h-12 w-auto" src="@/assets/images/logo.png" alt="Logo" />
      </router-link>
    </div>

    <!-- Hata İçeriği -->
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <router-view />
      </div>
    </div>

    <!-- Alt Linkler -->
    <div class="mt-8 text-center">
      <router-link 
        to="/" 
        class="text-base font-medium text-blue-600 hover:text-blue-500"
      >
        Ana Sayfaya Dön
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorLayout'
}
</script> 