<template>
  <div class="order-tracking">
    <!-- Sipariş Başlığı -->
    <div class="bg-white shadow sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              Sipariş #{{ order.orderNumber }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Kargo Takip No: {{ order.trackingNumber }}
            </p>
          </div>
          <button
            @click="$router.push(`/orders/${orderId}`)"
            class="btn-secondary"
          >
            Sipariş Detayına Dön
          </button>
        </div>
      </div>
    </div>

    <!-- Kargo Takip -->
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <!-- Kargo Durumu -->
        <div class="flex items-center space-x-4 mb-8">
          <truck-icon 
            :class="[
              'h-8 w-8',
              isDelivered ? 'text-green-500' : 'text-primary-500'
            ]"
          />
          <div>
            <p class="text-lg font-medium text-gray-900">
              {{ currentStatus }}
            </p>
            <p class="text-sm text-gray-500">
              {{ currentStatusDescription }}
            </p>
          </div>
        </div>

        <!-- Tahmini Teslimat -->
        <div v-if="!isDelivered" class="mb-8">
          <p class="text-sm font-medium text-gray-900">Tahmini Teslimat:</p>
          <p class="text-sm text-gray-500">
            {{ formatDate(order.estimatedDeliveryDate) }}
          </p>
        </div>

        <!-- Takip Timeline -->
        <div class="relative">
          <div
            class="absolute top-0 left-4 h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
          <div class="space-y-8">
            <div
              v-for="(event, index) in trackingEvents"
              :key="index"
              class="relative"
            >
              <div class="flex items-center">
                <div
                  :class="[
                    'h-8 w-8 rounded-full flex items-center justify-center',
                    index === 0 ? 'bg-primary-500' : 'bg-gray-300'
                  ]"
                >
                  <check-icon
                    v-if="index === 0"
                    class="h-5 w-5 text-white"
                  />
                  <div
                    v-else
                    class="h-2 w-2 rounded-full bg-white"
                  />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900">
                    {{ event.status }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ event.location }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ formatDateTime(event.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Harita -->
    <div v-if="currentLocation" class="mt-6">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h4 class="text-base font-medium text-gray-900 mb-4">
            Kargo Konumu
          </h4>
          <div class="h-96 rounded-lg overflow-hidden">
            <tracking-map
              :location="currentLocation"
              :destination="deliveryAddress"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate, formatDateTime } from '@/utils/formatters'
import { TruckIcon, CheckIcon } from '@heroicons/vue/outline'
import TrackingMap from './TrackingMap.vue'

export default {
  name: 'OrderTracking',

  components: {
    TruckIcon,
    CheckIcon,
    TrackingMap
  },

  props: {
    orderId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const trackingEvents = ref([])
    const currentLocation = ref(null)

    const order = computed(() => store.getters['order/getOrderById'](props.orderId))
    
    const isDelivered = computed(() => order.value.status === 'delivered')

    const currentStatus = computed(() => {
      if (isDelivered.value) return 'Teslim Edildi'
      return trackingEvents.value[0]?.status || 'Kargoya Verildi'
    })

    const currentStatusDescription = computed(() => {
      if (isDelivered.value) {
        return `${formatDate(order.value.deliveredAt)} tarihinde teslim edildi`
      }
      return trackingEvents.value[0]?.location || 'Kargo firmasına teslim edildi'
    })

    const deliveryAddress = computed(() => ({
      lat: order.value.shippingAddress.latitude,
      lng: order.value.shippingAddress.longitude
    }))

    const fetchTrackingInfo = async () => {
      try {
        const response = await store.dispatch(
          'order/getTrackingInfo',
          order.value.trackingNumber
        )
        trackingEvents.value = response.events
        currentLocation.value = response.currentLocation
      } catch (error) {
        console.error('Kargo takip bilgileri alınamadı:', error)
      }
    }

    onMounted(() => {
      fetchTrackingInfo()
      // Her 5 dakikada bir güncelle
      const interval = setInterval(fetchTrackingInfo, 5 * 60 * 1000)
      return () => clearInterval(interval)
    })

    return {
      order,
      trackingEvents,
      currentLocation,
      isDelivered,
      currentStatus,
      currentStatusDescription,
      deliveryAddress,
      formatDate,
      formatDateTime
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-secondary {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm 
         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style>
