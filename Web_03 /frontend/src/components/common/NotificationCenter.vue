<template>
  <div class="relative">
    <button 
      class="relative p-2 text-gray-600 hover:text-gray-900"
      @click="toggleNotifications"
    >
      <span class="sr-only">Bildirimler</span>
      <i class="fas fa-bell"></i>
      <span 
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
      >
        {{ unreadCount }}
      </span>
    </button>
    
    <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
      <div class="p-4 border-b">
        <h3 class="text-lg font-semibold">Bildirimler</h3>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div v-for="notification in notifications" :key="notification.id" 
             class="p-4 border-b hover:bg-gray-50 cursor-pointer"
             :class="{ 'bg-blue-50': !notification.read }">
          <p class="text-sm">{{ notification.message }}</p>
          <span class="text-xs text-gray-500">{{ formatDate(notification.date) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationCenter',
  data() {
    return {
      showNotifications: false,
      unreadCount: 0
    }
  },
  computed: {
    notifications() {
      return this.$store.state.notifications.items
    }
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    }
  }
}
</script> 