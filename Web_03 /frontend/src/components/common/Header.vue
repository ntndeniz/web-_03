<template>
  <header class="bg-white shadow-md">
    <nav class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="@/assets/images/logo.svg" alt="Logo" class="h-8" />
        </router-link>

        <!-- Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-600 hover:text-gray-900"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- User Actions -->
        <div class="flex items-center space-x-4">
          <SearchBar />
          <NotificationCenter />
          <CartButton />
          <UserMenu />
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import SearchBar from './SearchBar.vue'
import NotificationCenter from './NotificationCenter.vue'
import CartButton from './CartButton.vue'
import UserMenu from './UserMenu.vue'

export default {
  name: 'AppHeader',
  components: {
    SearchBar,
    NotificationCenter,
    CartButton,
    UserMenu,
  },
  data() {
    return {
      navigationItems: [
        { name: 'Ana Sayfa', path: '/' },
        { name: 'Ürünler', path: '/urunler' },
        { name: 'Kategoriler', path: '/kategoriler' },
        { name: 'Kampanyalar', path: '/kampanyalar' },
        { name: 'İletişim', path: '/iletisim' },
      ],
    }
  },
}
</script> 