<template>
  <div class="account-dashboard">
    <h1 class="text-2xl font-bold mb-6">Hesap Özeti</h1>
    
    <!-- Kullanıcı Bilgileri -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div class="flex items-center mb-4">
        <img :src="user.avatar" alt="Profil" class="w-16 h-16 rounded-full mr-4">
        <div>
          <h2 class="text-xl font-semibold">{{ user.fullName }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="stat-card p-4 bg-gray-50 rounded">
          <h3 class="text-gray-600">Son Giriş</h3>
          <p class="font-medium">{{ formatDate(user.lastLogin) }}</p>
        </div>
        <div class="stat-card p-4 bg-gray-50 rounded">
          <h3 class="text-gray-600">Üyelik Durumu</h3>
          <p class="font-medium">{{ user.membershipStatus }}</p>
        </div>
      </div>
    </div>

    <!-- Son Aktiviteler -->
    <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 class="text-xl font-semibold mb-4">Son Aktiviteler</h2>
      <div v-if="activities.length" class="space-y-4">
        <div v-for="activity in activities" :key="activity.id" 
             class="flex items-center justify-between py-2 border-b">
          <div>
            <p class="font-medium">{{ activity.description }}</p>
            <p class="text-sm text-gray-600">{{ formatDate(activity.date) }}</p>
          </div>
          <span :class="getActivityStatusClass(activity.type)">
            {{ activity.type }}
          </span>
        </div>
      </div>
      <p v-else class="text-gray-600">Henüz aktivite bulunmuyor.</p>
    </div>

    <!-- Hızlı İşlemler -->
    <div class="grid grid-cols-3 gap-4">
      <button v-for="action in quickActions" 
              :key="action.id"
              @click="handleQuickAction(action)"
              class="quick-action-btn p-4 bg-white rounded-lg shadow-sm 
                     hover:shadow-md transition-shadow">
        <i :class="action.icon" class="text-2xl mb-2"></i>
        <span class="block text-sm">{{ action.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/date';

export default {
  name: 'AccountDashboard',
  
  setup() {
    const store = useStore();
    const activities = ref([]);
    const user = ref({});

    const quickActions = [
      { id: 1, label: 'Profili Düzenle', icon: 'fas fa-user-edit' },
      { id: 2, label: 'Siparişlerim', icon: 'fas fa-shopping-bag' },
      { id: 3, label: 'Adreslerim', icon: 'fas fa-map-marker-alt' }
    ];

    onMounted(async () => {
      try {
        const userData = await store.dispatch('user/fetchUserData');
        const userActivities = await store.dispatch('user/fetchActivities');
        
        user.value = userData;
        activities.value = userActivities;
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      }
    });

    const handleQuickAction = (action) => {
      switch (action.id) {
        case 1:
          router.push('/account/profile');
          break;
        case 2:
          router.push('/account/orders');
          break;
        case 3:
          router.push('/account/addresses');
          break;
      }
    };

    const getActivityStatusClass = (type) => {
      const classes = {
        success: 'text-green-600 bg-green-100',
        warning: 'text-yellow-600 bg-yellow-100',
        error: 'text-red-600 bg-red-100'
      };
      return `px-3 py-1 rounded-full text-sm ${classes[type] || ''}`;
    };

    return {
      user,
      activities,
      quickActions,
      formatDate,
      handleQuickAction,
      getActivityStatusClass
    };
  }
};
</script>

<style scoped>
.account-dashboard {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.quick-action-btn {
  @apply flex flex-col items-center justify-center text-center;
}

.stat-card {
  @apply transition-all hover:shadow-sm;
}
</style> 