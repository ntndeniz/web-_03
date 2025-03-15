<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b flex justify-between items-center">
      <h2 class="text-xl font-semibold">Bildirimlerim</h2>
      <button 
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="text-blue-600 hover:text-blue-800"
      >
        Tümünü Okundu İşaretle
      </button>
    </div>

    <div class="divide-y">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="p-6 hover:bg-gray-50"
        :class="{ 'bg-blue-50': !notification.read }"
        @click="markAsRead(notification.id)"
      >
        <div class="flex gap-4">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="getNotificationTypeClass(notification.type)"
          >
            <span class="material-icons text-white">
              {{ getNotificationIcon(notification.type) }}
            </span>
          </div>

          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-semibold">{{ notification.title }}</h3>
              <span class="text-sm text-gray-500">
                {{ formatDate(notification.createdAt) }}
              </span>
            </div>
            <p class="text-gray-600">{{ notification.message }}</p>

            <div v-if="notification.action" class="mt-2">
              <router-link 
                :to="notification.action.link"
                class="text-blue-600 hover:text-blue-800 text-sm"
              >
                {{ notification.action.text }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div v-if="notifications.length === 0" class="text-center py-8">
      <span class="material-icons text-6xl text-gray-400 mb-4">notifications_none</span>
      <p class="text-gray-600">Henüz bildiriminiz bulunmuyor.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
  computed: {
    notifications() {
      return this.$store.state.notifications.items
    },
    unreadCount() {
      return this.notifications.filter(n => !n.read).length
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    getNotificationIcon(type) {
      const icons = {
        order: 'shopping_bag',
        payment: 'payment',
        shipping: 'local_shipping',
        product: 'inventory_2',
        system: 'info'
      }
      return icons[type] || 'notifications'
    },
    getNotificationTypeClass(type) {
      const classes = {
        order: 'bg-blue-500',
        payment: 'bg-green-500',
        shipping: 'bg-purple-500',
        product: 'bg-yellow-500',
        system: 'bg-gray-500'
      }
      return classes[type] || 'bg-blue-500'
    },
    async markAsRead(notificationId) {
      try {
        await this.$store.dispatch('notifications/markAsRead', notificationId)
      } catch (error) {
        this.$toast.error('Bir hata oluştu')
      }
    },
    async markAllAsRead() {
      try {
        await this.$store.dispatch('notifications/markAllAsRead')
        this.$toast.success('Tüm bildirimler okundu olarak işaretlendi')
      } catch (error) {
        this.$toast.error('Bir hata oluştu')
      }
    }
  },
  created() {
    this.$store.dispatch('notifications/fetchNotifications')
  }
}
</script> 