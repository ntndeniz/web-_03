<template>
  <div class="shipping-container">
    <div class="shipping-methods">
      <h3 class="section-title">Kargo Seçenekleri</h3>
      
      <div class="methods-grid">
        <div
          v-for="method in availableMethods"
          :key="method.id"
          class="method-card"
          :class="{ active: selectedMethod === method.id }"
          @click="selectMethod(method)"
        >
          <img :src="method.logo" :alt="method.name" class="method-logo" />
          
          <div class="method-info">
            <span class="method-name">{{ method.name }}</span>
            <span class="delivery-time">{{ method.deliveryTime }}</span>
            <span class="method-price">{{ formatCurrency(method.price) }}</span>
          </div>

          <div class="method-features">
            <span 
              v-for="feature in method.features"
              :key="feature"
              class="feature-tag"
            >
              {{ feature }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedMethod" class="delivery-details">
      <div class="delivery-address">
        <h4>Teslimat Adresi</h4>
        <address>
          {{ deliveryAddress.fullName }}<br>
          {{ deliveryAddress.street }}<br>
          {{ deliveryAddress.city }}, {{ deliveryAddress.postalCode }}
        </address>
      </div>

      <div class="delivery-time">
        <h4>Tahmini Teslimat</h4>
        <div class="time-range">
          <i class="fas fa-truck"></i>
          <span>{{ formatDeliveryRange(selectedMethodDetails.deliveryRange) }}</span>
        </div>
      </div>
    </div>

    <div class="tracking-section" v-if="hasActiveShipments">
      <h3 class="section-title">Aktif Gönderileriniz</h3>
      
      <div class="shipments-list">
        <div
          v-for="shipment in activeShipments"
          :key="shipment.id"
          class="shipment-card"
        >
          <div class="shipment-header">
            <span class="tracking-number">{{ shipment.trackingNumber }}</span>
            <span 
              class="shipment-status"
              :class="getStatusClass(shipment.status)"
            >
              {{ getStatusText(shipment.status) }}
            </span>
          </div>

          <div class="tracking-timeline">
            <div
              v-for="(event, index) in shipment.events"
              :key="index"
              class="timeline-event"
              :class="{ active: event.isActive }"
            >
              <div class="event-indicator"></div>
              <div class="event-details">
                <span class="event-name">{{ event.name }}</span>
                <span class="event-time">{{ formatDate(event.timestamp) }}</span>
              </div>
            </div>
          </div>

          <div class="shipment-actions">
            <button 
              @click="openTrackingDetails(shipment)"
              class="action-button"
            >
              Detaylı İzle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/helpers/number'
import { formatDate } from '@/helpers/date'
import { notify } from '@/utils/notification'

export default {
  name: 'Shipping',

  props: {
    deliveryAddress: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const selectedMethod = ref(null)

    // Kargo seçenekleri
    const availableMethods = [
      {
        id: 'yurtici',
        name: 'Yurtiçi Kargo',
        logo: '/logos/yurtici.svg',
        deliveryTime: '1-3 İş Günü',
        price: 29.90,
        features: ['Kapıda Ödeme', 'Cumartesi Teslimat'],
        deliveryRange: { min: 1, max: 3 }
      },
      {
        id: 'aras',
        name: 'Aras Kargo',
        logo: '/logos/aras.svg',
        deliveryTime: '2-4 İş Günü',
        price: 24.90,
        features: ['Ücretsiz İade', 'Mobil Takip'],
        deliveryRange: { min: 2, max: 4 }
      },
      {
        id: 'mng',
        name: 'MNG Kargo',
        logo: '/logos/mng.svg',
        deliveryTime: '1-4 İş Günü',
        price: 27.90,
        features: ['7/24 Teslimat', 'Şubeye Teslimat'],
        deliveryRange: { min: 1, max: 4 }
      }
    ]

    // Seçili kargo detayları
    const selectedMethodDetails = computed(() => {
      return availableMethods.find(m => m.id === selectedMethod.value) || null
    })

    // Aktif gönderiler
    const activeShipments = computed(() => {
      return store.state.shipping.activeShipments
    })

    const hasActiveShipments = computed(() => {
      return activeShipments.value.length > 0
    })

    // Kargo seçimi
    const selectMethod = (method) => {
      selectedMethod.value = method.id
      store.dispatch('shipping/setShippingMethod', method)
    }

    // Teslimat aralığı formatı
    const formatDeliveryRange = (range) => {
      return `${range.min}-${range.max} İş Günü`
    }

    // Durum sınıfı ve metni
    const getStatusClass = (status) => {
      const classes = {
        pending: 'status-pending',
        transit: 'status-transit',
        delivered: 'status-delivered'
      }
      return classes[status] || ''
    }

    const getStatusText = (status) => {
      const texts = {
        pending: 'Hazırlanıyor',
        transit: 'Yolda',
        delivered: 'Teslim Edildi'
      }
      return texts[status] || status
    }

    // Takip detayları
    const openTrackingDetails = (shipment) => {
      store.commit('ui/setTrackingModalVisible', true)
      store.commit('ui/setSelectedShipment', shipment)
    }

    return {
      selectedMethod,
      selectedMethodDetails,
      availableMethods,
      activeShipments,
      hasActiveShipments,
      selectMethod,
      formatDeliveryRange,
      getStatusClass,
      getStatusText,
      openTrackingDetails,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.shipping-container {
  @apply space-y-8;
}

.section-title {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

.methods-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.method-card {
  @apply flex flex-col p-4 bg-white rounded-lg border-2 border-transparent cursor-pointer transition-all;
}

.method-card:hover {
  @apply border-blue-200 shadow-md;
}

.method-card.active {
  @apply border-blue-500 shadow-lg;
}

.method-logo {
  @apply h-12 object-contain mb-4;
}

.method-info {
  @apply space-y-2 text-center;
}

.method-name {
  @apply font-medium text-gray-800;
}

.delivery-time {
  @apply text-sm text-gray-600;
}

.method-price {
  @apply text-lg font-semibold text-blue-600;
}

.method-features {
  @apply flex flex-wrap gap-2 mt-4;
}

.feature-tag {
  @apply px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full;
}

.delivery-details {
  @apply bg-white rounded-lg shadow-md p-6;
}

.delivery-address {
  @apply mb-6;
}

.delivery-address h4 {
  @apply text-lg font-medium text-gray-800 mb-2;
}

.delivery-address address {
  @apply text-gray-600 not-italic;
}

.time-range {
  @apply flex items-center gap-2 text-gray-600;
}

.shipment-card {
  @apply bg-white rounded-lg shadow-md p-4 space-y-4;
}

.shipment-header {
  @apply flex justify-between items-center;
}

.tracking-number {
  @apply font-mono text-gray-600;
}

.shipment-status {
  @apply px-3 py-1 rounded-full text-sm font-medium;
}

.status-pending {
  @apply bg-yellow-100 text-yellow-800;
}

.status-transit {
  @apply bg-blue-100 text-blue-800;
}

.status-delivered {
  @apply bg-green-100 text-green-800;
}

.tracking-timeline {
  @apply space-y-4;
}

.timeline-event {
  @apply flex items-start gap-4;
}

.event-indicator {
  @apply w-3 h-3 rounded-full bg-gray-300 mt-1.5;
}

.timeline-event.active .event-indicator {
  @apply bg-blue-500;
}

.event-details {
  @apply flex flex-col;
}

.event-name {
  @apply font-medium text-gray-800;
}

.event-time {
  @apply text-sm text-gray-500;
}

.action-button {
  @apply w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}
</style> 