<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Bildirimler</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="filter"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tümü</option>
          <option value="unread">Okunmamış</option>
          <option value="order">Sipariş</option>
          <option value="product">Ürün</option>
          <option value="system">Sistem</option>
        </select>

        <button 
          @click="markAllAsRead"
          v-if="unreadCount > 0"
          class="text-sm text-blue-600 hover:text-blue-500"
        >
          Tümünü Okundu İşaretle
        </button>
      </div>
    </div>

    <!-- Bildirim Listesi -->
    <div v-if="filteredNotifications.length" class="space-y-4">
      <div 
        v-for="notification in filteredNotifications"
        :key="notification.id"
        class="flex items-start space-x-4 rounded-lg border p-4"
        :class="{ 'bg-blue-50': !notification.read }"
      >
        <!-- İkon -->
        <div 
          class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
          :class="getTypeClass(notification.type)"
        >
          <i 
            class="fas"
            :class="getTypeIcon(notification.type)"
          ></i>
        </div>

        <!-- İçerik -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="font-medium" :class="{ 'text-blue-600': !notification.read }">
              {{ notification.title }}
            </p>
            <span class="text-sm text-gray-500">
              {{ formatDate(notification.date) }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-600">
            {{ notification.message }}
          </p>
          
          <!-- Aksiyonlar -->
          <div v-if="notification.action" class="mt-3">
            <router-link 
              :to="notification.action.link"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              {{ notification.action.text }}
            </router-link>
          </div>
        </div>

        <!-- Menü -->
        <div class="relative">
          <button 
            @click="toggleMenu(notification.id)"
            class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <i class="fas fa-ellipsis-v"></i>
          </button>

          <div 
            v-if="activeMenu === notification.id"
            class="absolute right-0 top-full z-10 mt-1 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
          >
            <button
              v-if="!notification.read"
              @click="markAsRead(notification.id)"
              class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-check mr-3"></i>
              Okundu İşaretle
            </button>
            <button
              @click="deleteNotification(notification.id)"
              class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <i class="fas fa-trash-alt mr-3"></i>
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-bell text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz bildiriminiz bulunmuyor.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
  name: 'NotificationCenter',
  setup() {
    const store = useStore()
    const filter = ref('all')
    const activeMenu = ref(null)

    const notifications = computed(() => store.state.notifications.items)
    const unreadCount = computed(() => 
      notifications.value.filter(n => !n.read).length
    )

    const filteredNotifications = computed(() => {
      let filtered = [...notifications.value]
      
      if (filter.value === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else if (filter.value !== 'all') {
        filtered = filtered.filter(n => n.type === filter.value)
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const getTypeClass = (type) => {
      const classes = {
        order: 'bg-purple-100 text-purple-600',
        product: 'bg-green-100 text-green-600',
        system: 'bg-yellow-100 text-yellow-600'
      }
      return classes[type] || 'bg-gray-100 text-gray-600'
    }

    const getTypeIcon = (type) => {
      const icons = {
        order: 'fa-shopping-bag',
        product: 'fa-box',
        system: 'fa-cog'
      }
      return icons[type] || 'fa-bell'
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy HH:mm', { locale: tr })
    }

    const toggleMenu = (id) => {
      activeMenu.value = activeMenu.value === id ? null : id
    }

    const markAsRead = async (id) => {
      try {
        await store.dispatch('notifications/markAsRead', id)
        activeMenu.value = null
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const markAllAsRead = async () => {
      try {
        await store.dispatch('notifications/markAllAsRead')
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const deleteNotification = async (id) => {
      try {
        await store.dispatch('notifications/deleteNotification', id)
        activeMenu.value = null
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Bildirim silinirken bir hata oluştu'
        })
      }
    }

    return {
      filter,
      activeMenu,
      notifications,
      unreadCount,
      filteredNotifications,
      getTypeClass,
      getTypeIcon,
      formatDate,
      toggleMenu,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }
  }
}
</script> 