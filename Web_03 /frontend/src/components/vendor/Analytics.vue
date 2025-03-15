<template>
    <div class="vendor-analytics">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Satıcı Analitiği</h3>
  
      <!-- İstatistik Kartları -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="stat in statistics" :key="stat.id" class="stat-card">
          <div class="p-6 bg-white rounded-lg shadow-sm">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <component :is="stat.icon" class="h-6 w-6 text-primary-600" />
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-500">{{ stat.label }}</h4>
                <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
                <p class="text-sm text-gray-600">
                  <span :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                  </span>
                  <span class="text-gray-500 ml-1">vs geçen ay</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Grafik Bölümü -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h4 class="text-base font-medium text-gray-900 mb-4">Satış Trendi</h4>
          <LineChart :data="salesData" :options="chartOptions" />
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h4 class="text-base font-medium text-gray-900 mb-4">Ürün Kategorileri</h4>
          <PieChart :data="categoryData" :options="chartOptions" />
        </div>
      </div>
  
      <!-- Performans Metrikleri -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h4 class="text-base font-medium text-gray-900 mb-4">Performans Metrikleri</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="metric in metrics" :key="metric.id" class="metric-card">
            <h5 class="text-sm font-medium text-gray-500">{{ metric.label }}</h5>
            <p class="text-xl font-semibold text-gray-900 mt-2">{{ metric.value }}</p>
            <ProgressBar :value="metric.progress" class="mt-2" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { LineChart, PieChart } from '@/components/charts'
  import { ProgressBar } from '@/components/feedback'
  
  export default {
    name: 'VendorAnalytics',
    
    components: {
      LineChart,
      PieChart,
      ProgressBar
    },
  
    setup() {
      const statistics = ref([])
      const salesData = ref({})
      const categoryData = ref({})
      const metrics = ref([])
      const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false
      })
  
      const fetchAnalytics = async () => {
        try {
          // API'den verileri al
          const response = await fetch('/api/vendor/analytics')
          const data = await response.json()
          
          statistics.value = data.statistics
          salesData.value = data.salesData
          categoryData.value = data.categoryData
          metrics.value = data.metrics
        } catch (error) {
          console.error('Analytics verisi alınamadı:', error)
        }
      }
  
      onMounted(() => {
        fetchAnalytics()
      })
  
      return {
        statistics,
        salesData,
        categoryData,
        metrics,
        chartOptions
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .vendor-analytics {
    @apply space-y-8;
  
    .stat-card {
      @apply transition-transform duration-200 hover:transform hover:scale-105;
    }
  
    .metric-card {
      @apply p-4 border border-gray-200 rounded-lg;
    }
  }
  </style>