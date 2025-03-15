<template>
  <button 
    class="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
    @click="$router.push('/cart')"
  >
    <span class="sr-only">Sepet</span>
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
    <span 
      v-if="cartItemCount > 0" 
      class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full"
    >
      {{ cartItemCount }}
    </span>
  </button>
</template>

<script>
export default {
  name: 'CartButton',
  computed: {
    cartItemCount() {
      return this.$store.state.cart.items.length
    }
  }
}
</script> 