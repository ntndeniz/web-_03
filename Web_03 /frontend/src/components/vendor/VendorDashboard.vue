<template>
  <div class="vendor-dashboard">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Satıcı Paneli</h3>

    <!-- İstatistik Kartları -->
    <div class="stats-grid mb-8">
      <div 
        v-for="stat in statistics" 
        :key="stat.id"
        class="stat-card"
      >
        <div class="stat-content">
          <div class="stat-icon" :class="stat.color">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <h4 class="stat-title">{{ stat.title }}</h4>
            <p class="stat-value">{{ stat.value }}</p>
            <p class="stat-change" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
              <i :class="stat.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-1"></i>
              {{ Math.abs(stat.trend) }}% geçen haftaya göre
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Grafik ve Tablolar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Satış Grafiği -->
      <div class="chart-card">
        <h4 class="card-title">Satış Grafiği</h4>
        <div class="chart-container">
          <!-- Burada grafik komponenti kullanılacak -->
          <div class="h-64 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      <!-- Son Siparişler -->
      <div class="orders-card">
        <h4 class="card-title">Son Siparişler</h4>
        <div class="orders-list">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            class="order-item"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="order-id">#{{ order.id }}</p>
                <p class="order-customer">{{ order.customerName }}</p>
              </div>
              <div class="text-right">
                <p class="order-amount">{{ formatCurrency(order.amount) }}</p>
                <p class="order-status" :class="getStatusClass(order.status)">
                  {{ order.status }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button class="view-all-button">
            Tüm Siparişleri Gör
          </button>
        </div>
      </div>
    </div>

    <!-- Stok Durumu -->
    <div class="stock-section mb-8">
      <h4 class="section-title">Stok Durumu</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Azalan Stoklar -->
        <div class="stock-card">
          <h5 class="card-subtitle">Azalan Stoklar</h5>
          <div class="stock-list">
            <div 
              v-for="product in lowStockProducts" 
              :key="product.id"
              class="stock-item"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img 
                    :src="product.image" 
                    :alt="product.name"
                    class="product-image"
                  >
                  <div class="ml-3">
                    <p class="product-name">{{ product.name }}</p>
                    <p class="product-sku">SKU: {{ product.sku }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="stock-count" :class="getStockClass(product.stock)">
                    {{ product.stock }} adet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popüler Ürünler -->
        <div class="stock-card">
          <h5 class="card-subtitle">Popüler Ürünler</h5>
          <div class="stock-list">
            <div 
              v-for="product in popularProducts" 
              :key="product.id"
              class="stock-item"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <img 
                    :src="product.image" 
                    :alt="product.name"
                    class="product-image"
                  >
                  <div class="ml-3">
                    <p class="product-name">{{ product.name }}</p>
                    <p class="product-sales">{{ product.sales }} satış</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="trend-indicator">
                    <i class="fas fa-chart-line text-green-600"></i>
                  </p>
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
import { ref } from 'vue'

export default {
  name: 'VendorDashboard',
  
  setup() {
    const statistics = ref([
      {
        id: 1,
        title: 'Toplam Satış',
        value: '₺24,500',
        trend: 12,
        icon: 'fas fa-shopping-cart',
        color: 'bg-blue-100 text-blue-600'
      },
      {
        id: 2,
        title: 'Yeni Siparişler',
        value: '156',
        trend: 8,
        icon: 'fas fa-box',
        color: 'bg-green-100 text-green-600'
      },
      {
        id: 3,
        title: 'İadeler',
        value: '3',
        trend: -5,
        icon: 'fas fa-undo',
        color: 'bg-red-100 text-red-600'
      },
      {
        id: 4,
        title: 'Ortalama Değerlendirme',
        value: '4.8',
        trend: 2,
        icon: 'fas fa-star',
        color: 'bg-yellow-100 text-yellow-600'
      }
    ])

    // Diğer veri ve fonksiyonlar...

    return {
      statistics,
      recentOrders,
      lowStockProducts,
      popularProducts,
      formatCurrency,
      getStatusClass,
      getStockClass
    }
  }
}
</script>

<style lang="scss" scoped>
.vendor-dashboard {
  @apply bg-white rounded-lg p-6;

  .stats-grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4;
  }

  .stat-card {
    @apply bg-white rounded-lg p-4 border border-gray-200;

    .stat-content {
      @apply flex items-start space-x-4;
    }

    .stat-icon {
      @apply p-3 rounded-lg;
    }

    .stat-info {
      @apply flex-1;
    }

    .stat-title {
      @apply text-sm text-gray-500;
    }

    .stat-value {
      @apply text-2xl font-bold text-gray-900 my-1;
    }

    .stat-change {
      @apply text-sm font-medium;
    }
  }

  .card-title {
    @apply text-lg font-medium text-gray-900 mb-4;
  }

  .section-title {
    @apply text-lg font-medium text-gray-900 mb-4;
  }

  .card-subtitle {
    @apply text-sm font-medium text-gray-700 mb-3;
  }

  .order-item,
  .stock-item {
    @apply p-4 border-b border-gray-200 last:border-b-0;
  }

  .product-image {
    @apply w-12 h-12 rounded-lg object-cover;
  }

  .view-all-button {
    @apply inline-flex items-center px-4 py-2 border border-gray-300
           rounded-md shadow-sm text-sm font-medium text-gray-700
           bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
           focus:ring-offset-2 focus:ring-primary-500;
  }
}
</style> 