<template>
  <div class="container py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sol Menü -->
      <aside class="w-full lg:w-64">
        <nav class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <div class="flex items-center space-x-3">
              <img 
                :src="user.avatar || '/images/default-avatar.png'" 
                :alt="user.name"
                class="w-10 h-10 rounded-full"
              >
              <div>
                <h2 class="font-medium">{{ user.name }}</h2>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <div class="p-2">
            <router-link
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-4 py-2 rounded-lg"
              :class="[
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              ]"
            >
              <span class="material-icons text-xl mr-3">
                {{ item.icon }}
              </span>
              {{ item.name }}
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- Ana İçerik -->
      <main class="flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'AccountView',

  setup() {
    const store = useStore();
    const route = useRoute();

    const user = computed(() => store.getters['auth/user']);

    const menuItems = [
      { 
        name: 'Genel Bakış',
        path: '/account/dashboard',
        icon: 'dashboard'
      },
      { 
        name: 'Siparişlerim',
        path: '/account/orders',
        icon: 'shopping_bag'
      },
      { 
        name: 'Favorilerim',
        path: '/account/wishlist',
        icon: 'favorite'
      },
      { 
        name: 'Adreslerim',
        path: '/account/addresses',
        icon: 'location_on'
      },
      { 
        name: 'Ödeme Yöntemlerim',
        path: '/account/payment-methods',
        icon: 'credit_card'
      },
      { 
        name: 'Bildirimlerim',
        path: '/account/notifications',
        icon: 'notifications'
      },
      { 
        name: 'Hesap Ayarları',
        path: '/account/settings',
        icon: 'settings'
      },
      { 
        name: 'Güvenlik',
        path: '/account/security',
        icon: 'security'
      }
    ];

    const isActive = (path) => {
      return route.path.startsWith(path);
    };

    return {
      user,
      menuItems,
      isActive
    };
  },

  metaInfo: {
    title: 'Hesabım',
    meta: [
      {
        name: 'description',
        content: 'Hesap ayarlarınızı yönetin, siparişlerinizi takip edin ve daha fazlası.'
      }
    ]
  }
};
</script> 