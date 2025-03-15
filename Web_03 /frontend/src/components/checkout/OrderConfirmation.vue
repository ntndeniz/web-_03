<template>
  <div class="text-center space-y-6">
    <!-- Başarılı İkon -->
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
      <i class="fas fa-check text-2xl text-green-600"></i>
    </div>

    <div>
      <h2 class="text-2xl font-bold">Siparişiniz Alındı!</h2>
      <p class="mt-2 text-gray-600">
        Sipariş numaranız: #{{ order.id }}
      </p>
    </div>

    <!-- Sipariş Detayları -->
    <div class="bg-gray-50 rounded-lg p-6 text-left">
      <div class="space-y-4">
        <!-- Teslimat Bilgileri -->
        <div>
          <h3 class="font-medium mb-2">Teslimat Adresi</h3>
          <div class="text-sm text-gray-600">
            <p>{{ order.shippingAddress.fullName }}</p>
            <p>{{ order.shippingAddress.fullAddress }}</p>
            <p>{{ order.shippingAddress.city }}/{{ order.shippingAddress.district }}</p>
          </div>
        </div>

        <!-- Ödeme Bilgileri -->
        <div>
          <h3 class="font-medium mb-2">Ödeme Bilgileri</h3>
          <div class="text-sm text-gray-600">
            <p>{{ order.payment.method }}</p>
            <p v-if="order.payment.card">**** **** **** {{ order.payment.card.last4 }}</p>
          </div>
        </div>

        <!-- Ürünler -->
        <div>
          <h3 class="font-medium mb-2">Sipariş Edilen Ürünler</h3>
          <div class="space-y-2">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
        </div>

        <!-- Toplam -->
        <div class="border-t pt-4">
          <div class="flex justify-between font-medium">
            <span>Toplam</span>
            <span>{{ formatPrice(order.total) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bilgilendirme -->
    <div class="text-gray-600">
      <p>Siparişinizle ilgili güncellemeleri e-posta adresinize göndereceğiz.</p>
      <p class="mt-1">Sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.</p>
    </div>

    <!-- Butonlar -->
    <div class="flex justify-center space-x-4">
      <router-link 
        to="/account/orders"
        class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Siparişlerim
      </router-link>

      <router-link 
        to="/"
        class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Alışverişe Devam Et
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'OrderConfirmation',
  setup() {
    const store = useStore()
    const order = computed(() => store.state.checkout.currentOrder)

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    return {
      order,
      formatPrice
    }
  }
}
</script> 