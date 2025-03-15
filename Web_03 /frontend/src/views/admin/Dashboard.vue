<template>
  <div>
    <!-- İstatistik Kartları -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-600">Toplam Satış</h3>
          <span class="material-icons text-blue-500">payments</span>
        </div>
        <div class="text-2xl font-bold">{{ formatPrice(stats.totalSales) }}</div>
        <div class="flex items-center mt-2 text-sm">
          <span :class="stats.salesTrend >= 0 ? 'text-green-500' : 'text-red-500'">
            <span class="material-icons text-sm">
              {{ stats.salesTrend >= 0 ? 'trending_up' : 'trending_down' }}
            </span>
            {{ Math.abs(stats.salesTrend) }}%
          </span>
          <span class="text-gray-500 ml-2">geçen aya göre</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-600">Toplam Sipariş</h3>
          <span class="material-icons text-purple-500">shopping_bag</span>
        </div>
        <div class="text-2xl font-bold">{{ stats.totalOrders }}</div>
        <div class="flex items-center mt-2 text-sm">
          <span :class="stats.ordersTrend >= 0 ? 'text-green-500' : 'text-red-500'">
            <span class="material-icons text-sm">
              {{ stats.ordersTrend >= 0 ? 'trending_up' : 'trending_down' }}
            </span>
            {{ Math.abs(stats.ordersTrend) }}%
          </span>
          <span class="text-gray-500 ml-2">geçen aya göre</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-600">Yeni Müşteriler</h3>
          <span class="material-icons text-green-500">person_add</span>
        </div>
        <div class="text-2xl font-bold">{{ stats.newCustomers }}</div>
        <div class="flex items-center mt-2 text-sm">
          <span :class="stats.customersTrend >= 0 ? 'text-green-500' : 'text-red-500'">
            <span class="material-icons text-sm">
              {{ stats.customersTrend >= 0 ? 'trending_up' : 'trending_down' }}
            </span>
            {{ Math.abs(stats.customersTrend) }}%
          </span>
          <span class="text-gray-500 ml-2">geçen aya göre</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-gray-600">Ortalama Sepet</h3>
          <span class="material-icons text-yellow-500">shopping_cart</span>
        </div>
        <div class="text-2xl font-bold">{{ formatPrice(stats.averageCart) }}</div>
        <div class="flex items-center mt-2 text-sm">
          <span :class="stats.cartTrend >= 0 ? 'text-green-500' : 'text-red-500'">
            <span class="material-icons text-sm">
              {{ stats.cartTrend >= 0 ? 'trending_up' : 'trending_down' }}
            </span>
            {{ Math.abs(stats.cartTrend) }}%
          </span>
          <span class="text-gray-500 ml-2">geçen aya göre</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Son Siparişler -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Son Siparişler</h2>
            <router-link 
              to="/admin/siparisler"
              class="text-blue-600 hover:text-blue-800"
            >
              Tümünü Gör
            </router-link>
          </div>
        </div>

        <div class="divide-y">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            class="p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium">{{ order.customer.name }}</div>
                <div class="text-sm text-gray-600">
                  Sipariş No: {{ order.number }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-medium">{{ formatPrice(order.total) }}</div>
                <div class="text-sm" :class="getStatusColor(order.status)">
                  {{ getStatusText(order.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stok Durumu -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Stok Durumu</h2>
            <router-link 
              to="/admin/urunler"
              class="text-blue-600 hover:text-blue-800"
            >
              Tümünü Gör
            </router-link>
          </div>
        </div>

        <div class="divide-y">
          <div 
            v-for="product in lowStockProducts" 
            :key="product.id"
            class="p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img 
                  :src="product.image" 
                  :alt="product.name"
                  class="w-12 h-12 object-cover rounded"
                />
                <div>
                  <div class="font-medium">{{ product.name }}</div>
                  <div class="text-sm text-gray-600">
                    SKU: {{ product.sku }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div 
                  class="font-medium"
                  :class="product.stock < 5 ? 'text-red-600' : 'text-yellow-600'"
                >
                  {{ product.stock }} adet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        totalSales: 0,
        salesTrend: 0,
        totalOrders: 0,
        ordersTrend: 0,
        newCustomers: 0,
        customersTrend: 0,
        averageCart: 0,
        cartTrend: 0
      },
      recentOrders: [],
      lowStockProducts: []
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getStatusText(status) {
      const statuses = {
        pending: 'Onay Bekliyor',
        processing: 'Hazırlanıyor',
        shipped: 'Kargoya Verildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      }
      return statuses[status] || status
    },
    getStatusColor(status) {
      const colors = {
        pending: 'text-yellow-600',
        processing: 'text-blue-600',
        shipped: 'text-purple-600',
        delivered: 'text-green-600',
        cancelled: 'text-red-600'
      }
      return colors[status] || ''
    },
    async fetchDashboardData() {
      try {
        const [stats, orders, products] = await Promise.all([
          this.$store.dispatch('admin/fetchStats'),
          this.$store.dispatch('admin/fetchRecentOrders'),
          this.$store.dispatch('admin/fetchLowStockProducts')
        ])
        
        this.stats = stats
        this.recentOrders = orders
        this.lowStockProducts = products
      } catch (error) {
        this.$toast.error('Veriler yüklenirken bir hata oluştu')
      }
    }
  },
  created() {
    this.fetchDashboardData()
  }
}
</script> 