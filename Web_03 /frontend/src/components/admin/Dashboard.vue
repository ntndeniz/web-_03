<template>
  <div class="admin-dashboard">
    <h1 class="text-2xl font-bold mb-6">Yönetim Paneli</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- İstatistik Kartları -->
      <div v-for="stat in statistics" :key="stat.id" class="stat-card">
        <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div>
            <h3 class="text-gray-500 text-sm">{{ stat.title }}</h3>
            <p class="text-2xl font-semibold">{{ stat.value }}</p>
            <span :class="['text-sm', stat.trend > 0 ? 'text-green-500' : 'text-red-500']">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <div :class="['stat-icon', stat.color]">
            <i :class="stat.icon"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Grafik Bileşenleri -->
      <div class="chart-card">
        <h2 class="text-lg font-semibold mb-4">Satış Grafiği</h2>
        <LineChart :data="salesData" :options="chartOptions" />
      </div>

      <div class="chart-card">
        <h2 class="text-lg font-semibold mb-4">Ziyaretçi Analizi</h2>
        <BarChart :data="visitorData" :options="chartOptions" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <!-- Son İşlemler -->
      <div class="recent-activities col-span-2">
        <h2 class="text-lg font-semibold mb-4">Son İşlemler</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlem</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Tarih</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="activity in recentActivities" :key="activity.id">
                <td class="px-4 py-3 text-sm">{{ activity.action }}</td>
                <td class="px-4 py-3 text-sm">{{ activity.user }}</td>
                <td class="px-4 py-3 text-sm">{{ formatDate(activity.date) }}</td>
                <td class="px-4 py-3">
                  <span :class="['status-badge', activity.status]">
                    {{ activity.statusText }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bildirimler -->
      <div class="notifications">
        <h2 class="text-lg font-semibold mb-4">Bildirimler</h2>
        <div class="bg-white rounded-lg shadow p-4">
          <div v-for="notification in notifications" 
               :key="notification.id" 
               class="notification-item">
            <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div :class="['notification-icon', notification.type]">
                <i :class="notification.icon"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ notification.title }}</p>
                <p class="text-sm text-gray-500">{{ notification.message }}</p>
                <span class="text-xs text-gray-400">{{ formatDate(notification.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/formatters'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

export default {
  name: 'AdminDashboard',

  components: {
    LineChart,
    BarChart
  },

  setup() {
    const store = useStore()
    const statistics = ref([])
    const salesData = ref(null)
    const visitorData = ref(null)
    const recentActivities = ref([])
    const notifications = ref([])

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }

    const loadDashboardData = async () => {
      try {
        const data = await store.dispatch('admin/fetchDashboardData')
        statistics.value = data.statistics
        salesData.value = data.salesData
        visitorData.value = data.visitorData
        recentActivities.value = data.recentActivities
        notifications.value = data.notifications
      } catch (error) {
        console.error('Dashboard verisi yüklenirken hata:', error)
      }
    }

    onMounted(loadDashboardData)

    return {
      statistics,
      salesData,
      visitorData,
      recentActivities,
      notifications,
      chartOptions,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard {
  @apply p-6;

  .stat-card {
    .stat-icon {
      @apply p-3 rounded-full;

      &.primary { @apply bg-primary-100 text-primary-600; }
      &.success { @apply bg-green-100 text-green-600; }
      &.warning { @apply bg-yellow-100 text-yellow-600; }
      &.danger { @apply bg-red-100 text-red-600; }
    }
  }

  .chart-card {
    @apply bg-white p-4 rounded-lg shadow;
    height: 300px;
  }

  .status-badge {
    @apply px-2 py-1 text-xs rounded-full;

    &.success { @apply bg-green-100 text-green-800; }
    &.pending { @apply bg-yellow-100 text-yellow-800; }
    &.failed { @apply bg-red-100 text-red-800; }
  }

  .notification-item {
    @apply border-b border-gray-100 last:border-0;

    .notification-icon {
      @apply p-2 rounded-full;

      &.info { @apply bg-blue-100 text-blue-600; }
      &.success { @apply bg-green-100 text-green-600; }
      &.warning { @apply bg-yellow-100 text-yellow-600; }
      &.error { @apply bg-red-100 text-red-600; }
    }
  }
}
</style> 