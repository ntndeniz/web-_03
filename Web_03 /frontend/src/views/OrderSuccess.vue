<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <!-- Başarı İkonu -->
        <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
          <i class="fas fa-check text-4xl text-green-600"></i>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          Siparişiniz Alındı!
        </h2>

        <p class="text-gray-600 mb-6">
          Sipariş numaranız: <span class="font-semibold">{{ orderNumber }}</span>
        </p>

        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 class="font-medium text-gray-900 mb-2">Sipariş Özeti</h3>
          <div class="space-y-2 text-sm text-gray-600">
            <p>Toplam Tutar: {{ orderDetails.total }}₺</p>
            <p>Teslimat Adresi: {{ orderDetails.address }}</p>
            <p>Tahmini Teslimat: {{ deliveryDate }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <p class="text-gray-600 text-sm">
            Siparişinizle ilgili güncellemeleri e-posta adresinize göndereceğiz.
          </p>

          <div class="flex flex-col space-y-3">
            <router-link 
              to="/orders"
              class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Siparişlerimi Görüntüle
            </router-link>

            <router-link 
              to="/"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Alışverişe Devam Et
            </router-link>
          </div>
        </div>

        <!-- Sipariş Takip Adımları -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-2 bg-white text-sm text-gray-500">
                Sipariş Durumu
              </span>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex justify-between">
              <div class="text-center flex-1">
                <div class="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-blue-600 text-white">
                  <i class="fas fa-check text-sm"></i>
                </div>
                <p class="mt-2 text-xs text-gray-500">Sipariş Alındı</p>
              </div>

              <div class="text-center flex-1">
                <div class="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-gray-200">
                  <i class="fas fa-box text-sm text-gray-400"></i>
                </div>
                <p class="mt-2 text-xs text-gray-500">Hazırlanıyor</p>
              </div>

              <div class="text-center flex-1">
                <div class="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-gray-200">
                  <i class="fas fa-truck text-sm text-gray-400"></i>
                </div>
                <p class="mt-2 text-xs text-gray-500">Kargoya Verildi</p>
              </div>

              <div class="text-center flex-1">
                <div class="w-8 h-8 mx-auto flex items-center justify-center rounded-full bg-gray-200">
                  <i class="fas fa-home text-sm text-gray-400"></i>
                </div>
                <p class="mt-2 text-xs text-gray-500">Teslim Edildi</p>
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
import { useRouter } from 'vue-router'

export default {
  name: 'OrderSuccess',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const orderNumber = ref('')
    const orderDetails = ref({
      total: 0,
      address: '',
      items: []
    })

    // Teslimat tarihini 3 iş günü sonrası olarak ayarla
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 3)
    
    onMounted(async () => {
      try {
        // Son siparişin detaylarını al
        const lastOrder = await store.dispatch('getLastOrder')
        if (!lastOrder) {
          router.push('/')
          return
        }

        orderNumber.value = lastOrder.orderNumber
        orderDetails.value = {
          total: lastOrder.total,
          address: lastOrder.address,
          items: lastOrder.items
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        router.push('/')
      }
    })

    return {
      orderNumber,
      orderDetails,
      deliveryDate: deliveryDate.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script> 