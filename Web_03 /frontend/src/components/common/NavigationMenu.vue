<template>
  <nav class="flex space-x-4">
    <router-link 
      v-for="item in menuItems" 
      :key="item.path"
      :to="item.path"
      class="text-gray-600 hover:text-gray-900"
    >
      {{ item.name }}
    </router-link>
  </nav>
</template>

<script>
export default {
  name: 'NavigationMenu',
  data() {
    return {
      menuItems: [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Ürünler', path: '/products' },
        { name: 'Sepetim', path: '/cart' },
        { name: 'Hesabım', path: '/profile' }
      ]
    }
  }
}
</script> 