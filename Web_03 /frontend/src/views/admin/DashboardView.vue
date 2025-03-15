<template>
  <div class="bg-white shadow rounded-lg">
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Dashboard</h2>
      
      <!-- İstatistikler -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-blue-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">Blog Yazıları</h3>
          <p class="text-3xl font-bold text-blue-600">{{ stats.posts }}</p>
        </div>
        
        <div class="bg-green-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Kategoriler</h3>
          <p class="text-3xl font-bold text-green-600">{{ stats.categories }}</p>
        </div>
        
        <div class="bg-purple-50 p-6 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-800 mb-2">Yorumlar</h3>
          <p class="text-3xl font-bold text-purple-600">{{ stats.comments }}</p>
        </div>
      </div>

      <!-- Son Aktiviteler -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Son Aktiviteler</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div class="mr-4">
              <div :class="activity.iconClass" class="w-10 h-10 rounded-full flex items-center justify-center">
                <i :class="activity.icon" class="text-white"></i>
              </div>
            </div>
            <div>
              <p class="font-medium">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'DashboardView',
  setup() {
    const stats = ref({
      posts: 0,
      categories: 0,
      comments: 0
    })

    const recentActivities = ref([
      {
        id: 1,
        title: 'Yeni blog yazısı eklendi',
        time: '5 dakika önce',
        icon: 'fas fa-file-alt',
        iconClass: 'bg-blue-500'
      },
      {
        id: 2,
        title: 'Yeni yorum yapıldı',
        time: '1 saat önce',
        icon: 'fas fa-comment',
        iconClass: 'bg-green-500'
      }
    ])

    const fetchStats = async () => {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/admin/stats`)
        stats.value = response.data
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
      }
    }

    onMounted(() => {
      fetchStats()
    })

    return {
      stats,
      recentActivities
    }
  }
}
</script> 