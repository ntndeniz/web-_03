<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-9xl font-bold text-gray-900">404</h1>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Sayfa Bulunamadı
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>
      <div>
        <router-link 
          to="/" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Ana Sayfaya Dön
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script> 