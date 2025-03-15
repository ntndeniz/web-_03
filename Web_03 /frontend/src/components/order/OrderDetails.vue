<template>
  <div class="order-details">
    <!-- Sipariş Başlığı -->
    <div class="bg-white shadow sm:rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              Sipariş #{{ order.orderNumber }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ formatDate(order.createdAt) }} tarihinde oluşturuldu
            </p>
          </div>
          <order-status-badge :status="order.status" size="large" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Sol Kolon: Ürünler -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h4 class="text-base font-medium text-gray-900 mb-4">
              Sipariş Ürünleri
            </h4>
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center space-x-4 py-4 border-b last:border-0"
              >
                <img
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="h-20 w-20 object-cover rounded-md"
                />
                <div class="flex-1">
                  <h5 class="text-sm font-medium text-gray-900">
                    {{ item.product.name }}
                  </h5>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ item.product.variant }}
                  </p>
                  <div class="mt-1 text-sm text-gray-500">
                    Adet: {{ item.quantity }} x {{ formatPrice(item.unitPrice) }} TL
                  </div>
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ formatPrice(item.totalPrice) }} TL
                </div>
              </div>
            </div>

            <!-- Fiyat Özeti -->
            <div class="mt-6 border-t pt-6">
              <dl class="space-y-4">
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600">Ara Toplam</dt>
                  <dd class="text-sm font-medium text-gray-900">
                    {{ formatPrice(order.subtotal) }} TL
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm text-gray-600">Kargo</dt>
                  <dd class="text-sm font-medium text-gray-900">
                    {{ formatPrice(order.shippingCost) }} TL
                  </dd>
                </div>
                <div v-if="order.discount" class="flex justify-between">
                  <dt class="text-sm text-gray-600">İndirim</dt>
                  <dd class="text-sm font-medium text-red-600">
                    -{{ formatPrice(order.discount) }} TL
                  </dd>
                </div>
                <div class="flex justify-between border-t pt-4">
                  <dt class="text-base font-medium text-gray-900">Toplam</dt>
                  <dd class="text-base font-medium text-gray-900">
                    {{ formatPrice(order.totalAmount) }} TL
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Sağ Kolon: Teslimat ve Ödeme -->
      <div class="space-y-6">
        <!-- Teslimat Bilgileri -->
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h4 class="text-base font-medium text-gray-900 mb-4">
              Teslimat Bilgileri
            </h4>
            <div class="text-sm text-gray-600">
              <p class="font-medium text-gray-900">{{ order.shippingAddress.fullName }}</p>
              <p>{{ order.shippingAddress.phone }}</p>
              <p class="mt-2">{{ formatAddress(order.shippingAddress) }}</p>
            </div>
            <div v-if="order.trackingNumber" class="mt-4">
              <p class="text-sm text-gray-600">Kargo Takip No:</p>
              <p class="text-sm font-medium text-gray-900">{{ order.trackingNumber }}</p>
              <button
                @click="trackOrder"
                class="mt-2 text-sm text-primary-600 hover:text-primary-500"
              >
                Kargo Durumunu Takip Et
              </button>
            </div>
          </div>
        </div>

        <!-- Ödeme Bilgileri -->
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h4 class="text-base font-medium text-gray-900 mb-4">
              Ödeme Bilgileri
            </h4>
            <div class="text-sm text-gray-600">
              <p>Ödeme Yöntemi:</p>
              <p class="font-medium text-gray-900">
                {{ order.payment.method === 'card' ? 'Kredi Kartı' : 'Havale/EFT' }}
              </p>
              <p v-if="order.payment.method === 'card'" class="mt-2">
                {{ order.payment.cardBrand }} **** {{ order.payment.last4 }}
              </p>
            </div>
          </div>
        </div>

        <!-- İşlem Butonları -->
        <div class="bg-white shadow sm:rounded-lg">
          <div class="px-4 py-5 sm:p-6 space-y-4">
            <button
              v-if="order.status === 'shipped'"
              @click="trackOrder"
              class="btn-primary w-full"
            >
              <truck-icon class="h-5 w-5 mr-2" />
              Kargo Takip
            </button>
            <button
              v-if="canRequestReturn"
              @click="initiateReturn"
              class="btn-secondary w-full"
            >
              <refresh-icon class="h-5 w-5 mr-2" />
              İade Talebi Oluştur
            </button>
            <button
              v-if="canCancel"
              @click="cancelOrder"
              class="btn-danger w-full"
            >
              <x-icon class="h-5 w-5 mr-2" />
              Siparişi İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { formatDate, formatPrice, formatAddress } from '@/utils/formatters'
import { useToast } from '@/composables/useToast'
import {
  TruckIcon,
  RefreshIcon,
  XIcon
} from '@heroicons/vue/outline'
import OrderStatusBadge from './OrderStatusBadge.vue'

export default {
  name: 'OrderDetails',

  components: {
    OrderStatusBadge,
    TruckIcon,
    RefreshIcon,
    XIcon
  },

  props: {
    orderId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const order = computed(() => store.getters['order/getOrderById'](props.orderId))

    const canRequestReturn = computed(() => {
      if (!order.value.deliveredAt) return false
      const deliveredDate = new Date(order.value.deliveredAt)
      const now = new Date()
      const daysSinceDelivery = (now - deliveredDate) / (1000 * 60 * 60 * 24)
      return order.value.status === 'delivered' && daysSinceDelivery <= 14
    })

    const canCancel = computed(() => {
      return ['pending', 'processing'].includes(order.value.status)
    })

    const trackOrder = () => {
      router.push(`/orders/${props.orderId}/tracking`)
    }

    const initiateReturn = () => {
      router.push(`/orders/${props.orderId}/return`)
    }

    const cancelOrder = async () => {
      try {
        await store.dispatch('order/cancelOrder', props.orderId)
        toast.success('Sipariş başarıyla iptal edildi')
      } catch (error) {
        toast.error('Sipariş iptal edilirken bir hata oluştu')
      }
    }

    return {
      order,
      canRequestReturn,
      canCancel,
      formatDate,
      formatPrice,
      formatAddress,
      trackOrder,
      initiateReturn,
      cancelOrder
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-primary {
  @apply inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-secondary {
  @apply inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md 
         shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-danger {
  @apply inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 
         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}
</style>
