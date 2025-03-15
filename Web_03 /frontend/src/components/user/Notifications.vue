<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Bildirimlerim</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="filter"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tüm Bildirimler</option>
          <option value="unread">Okunmamış</option>
          <option value="order">Sipariş</option>
          <option value="product">Ürün</option>
          <option value="system">Sistem</option>
        </select>

        <button
          @click="markAllAsRead"
          class="text-sm text-blue-600 hover:text-blue-500"
          :disabled="!hasUnreadNotifications"
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
        :class="[
          'rounded-lg border p-4 transition-colors',
          notification.read ? 'bg-white' : 'bg-blue-50'
        ]"
      >
        <!-- Bildirim Başlığı -->
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <div 
              class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              :class="getTypeClass(notification.type)"
            >
              <i 
                class="fas text-sm"
                :class="getTypeIcon(notification.type)"
              ></i>
            </div>
            <div>
              <p class="font-medium">{{ notification.title }}</p>
              <p class="mt-1 text-sm text-gray-600">
                {{ notification.message }}
              </p>
              <div class="mt-2 flex items-center space-x-4">
                <span class="text-xs text-gray-500">
                  {{ formatDate(notification.date) }}
                </span>
                <button 
                  v-if="notification.actionUrl"
                  @click="handleAction(notification)"
                  class="text-xs text-blue-600 hover:text-blue-500"
                >
                  {{ notification.actionText }}
                </button>
              </div>
            </div>
          </div>

          <!-- Aksiyonlar -->
          <div class="flex items-center space-x-2">
            <button 
              v-if="!notification.read"
              @click="markAsRead(notification.id)"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <i class="fas fa-check"></i>
            </button>
            <button 
              @click="deleteNotification(notification.id)"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
            >
              <i class="fas fa-trash-alt"></i>
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

    <!-- Yükleniyor -->
    <div 
      v-if="loading"
      class="flex items-center justify-center py-8"
    >
      <LoadingSpinner size="lg" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'Notifications',
  components: {
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const filter = ref('all')
    const notifications = ref([])

    const filteredNotifications = computed(() => {
      if (filter.value === 'all') return notifications.value
      if (filter.value === 'unread') return notifications.value.filter(n => !n.read)
      return notifications.value.filter(n => n.type === filter.value)
    })

    const hasUnreadNotifications = computed(() => {
      return notifications.value.some(n => !n.read)
    })

    const getTypeClass = (type) => {
      const classes = {
        order: 'bg-purple-100 text-purple-600',
        product: 'bg-green-100 text-green-600',
        system: 'bg-blue-100 text-blue-600'
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

    const handleAction = (notification) => {
      if (notification.actionUrl) {
        router.push(notification.actionUrl)
      }
    }

    const markAsRead = async (id) => {
      try {
        await store.dispatch('notifications/markAsRead', id)
        await loadNotifications()
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
        await loadNotifications()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Tüm bildirimler okundu olarak işaretlendi'
        })
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
        await loadNotifications()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Bildirim silindi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Bildirim silinirken bir hata oluştu'
        })
      }
    }

    const loadNotifications = async () => {
      loading.value = true
      try {
        const response = await store.dispatch('notifications/getNotifications')
        notifications.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Bildirimler yüklenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadNotifications()
    })

    return {
      loading,
      filter,
      filteredNotifications,
      hasUnreadNotifications,
      getTypeClass,
      getTypeIcon,
      formatDate,
      handleAction,
      markAsRead,
      markAllAsRead,
      deleteNotification
    }
  }
}
</script> 