<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
      <div class="p-4">
        <router-link to="/" class="flex items-center">
          <img src="@/assets/images/logo-white.png" alt="Logo" class="h-8 w-auto" />
        </router-link>
      </div>

      <nav class="mt-8 space-y-1 px-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          :class="[
            isActive(item.path)
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          ]"
        >
          <i :class="[item.icon, 'mr-3 text-lg']"></i>
          {{ item.title }}
        </router-link>
      </nav>
    </aside>

    <!-- Ana İçerik -->
    <div class="pl-64">
      <!-- Üst Bar -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between px-4 py-4">
          <h1 class="text-2xl font-semibold text-gray-900">
            {{ currentPageTitle }}
          </h1>
          
          <div class="flex items-center space-x-4">
            <NotificationCenter />
            <UserMenu />
          </div>
        </div>
      </header>

      <!-- Sayfa İçeriği -->
      <main class="p-8">
        <router-view />
      </main>
    </div>

    <!-- Global Bileşenler -->
    <Toast />
    <Modal />
    <LoadingSpinner v-if="isLoading" overlay />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import NotificationCenter from '@/components/common/NotificationCenter.vue'
import UserMenu from '@/components/admin/UserMenu.vue'
import Toast from '@/components/common/Toast.vue'
import Modal from '@/components/common/Modal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'AdminLayout',

  components: {
    NotificationCenter,
    UserMenu,
    Toast,
    Modal,
    LoadingSpinner
  },

  setup() {
    const route = useRoute()
    const store = useStore()

    const menuItems = [
      { path: '/admin', title: 'Dashboard', icon: 'fas fa-home' },
      { path: '/admin/orders', title: 'Siparişler', icon: 'fas fa-shopping-cart' },
      { path: '/admin/products', title: 'Ürünler', icon: 'fas fa-box' },
      { path: '/admin/categories', title: 'Kategoriler', icon: 'fas fa-tags' },
      { path: '/admin/customers', title: 'Müşteriler', icon: 'fas fa-users' },
      { path: '/admin/coupons', title: 'Kuponlar', icon: 'fas fa-ticket-alt' },
      { path: '/admin/campaigns', title: 'Kampanyalar', icon: 'fas fa-bullhorn' },
      { path: '/admin/settings', title: 'Ayarlar', icon: 'fas fa-cog' }
    ]

    const currentPageTitle = computed(() => {
      const currentItem = menuItems.find(item => isActive(item.path))
      return currentItem ? currentItem.title : ''
    })

    const isActive = (path) => {
      return route.path.startsWith(path)
    }

    const isLoading = computed(() => store.getters['ui/isLoading'])

    return {
      menuItems,
      currentPageTitle,
      isActive,
      isLoading
    }
  }
}
</script> 