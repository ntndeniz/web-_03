<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">İade Taleplerim</h2>
      
      <!-- Filtreler -->
      <select 
        v-model="filter"
        class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Tüm Talepler</option>
        <option value="pending">Bekleyen</option>
        <option value="approved">Onaylanan</option>
        <option value="rejected">Reddedilen</option>
        <option value="completed">Tamamlanan</option>
      </select>
    </div>

    <!-- İade Listesi -->
    <div v-if="filteredReturns.length" class="space-y-6">
      <div 
        v-for="returnRequest in filteredReturns"
        :key="returnRequest.id"
        class="rounded-lg border"
      >
        <!-- Talep Başlığı -->
        <div class="flex items-center justify-between border-b p-4">
          <div>
            <p class="font-medium">İade #{{ returnRequest.number }}</p>
            <p class="mt-1 text-sm text-gray-600">
              {{ formatDate(returnRequest.date) }}
            </p>
          </div>
          <span 
            class="rounded-full px-3 py-1 text-sm"
            :class="getStatusClass(returnRequest.status)"
          >
            {{ getStatusText(returnRequest.status) }}
          </span>
        </div>

        <!-- Talep Detayları -->
        <div class="p-4">
          <!-- Ürün Bilgileri -->
          <div class="flex items-center space-x-4">
            <img 
              :src="returnRequest.product.image"
              :alt="returnRequest.product.name"
              class="h-16 w-16 rounded-md object-cover"
            />
            <div class="flex-1">
              <router-link 
                :to="`/product/${returnRequest.product.id}`"
                class="font-medium hover:text-blue-600"
              >
                {{ returnRequest.product.name }}
              </router-link>
              <p class="mt-1 text-sm text-gray-600">
                Sipariş #{{ returnRequest.orderId }}
              </p>
            </div>
          </div>

          <!-- İade Nedeni -->
          <div class="mt-4 space-y-2">
            <h4 class="font-medium">İade Nedeni</h4>
            <p class="text-sm text-gray-600">
              {{ returnRequest.reason }}
            </p>
            <p v-if="returnRequest.description" class="text-sm text-gray-600">
              {{ returnRequest.description }}
            </p>
          </div>

          <!-- Kargo Bilgileri -->
          <div 
            v-if="returnRequest.shipping"
            class="mt-4 rounded-md bg-gray-50 p-4"
          >
            <h4 class="font-medium">Kargo Bilgileri</h4>
            <div class="mt-2 space-y-1 text-sm">
              <p>{{ returnRequest.shipping.courier }}</p>
              <p class="text-gray-600">
                Takip No: {{ returnRequest.shipping.trackingNumber }}
              </p>
              <a 
                :href="returnRequest.shipping.trackingUrl"
                target="_blank"
                rel="noopener"
                class="text-blue-600 hover:text-blue-500"
              >
                Kargo Takibi
              </a>
            </div>
          </div>

          <!-- İade Durumu -->
          <div class="mt-4 border-t pt-4">
            <div class="space-y-2">
              <div 
                v-for="(status, index) in returnRequest.statusHistory"
                :key="index"
                class="flex items-start space-x-3"
              >
                <div 
                  class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  :class="getStatusHistoryClass(status.type)"
                >
                  <i 
                    class="fas text-xs"
                    :class="getStatusHistoryIcon(status.type)"
                  ></i>
                </div>
                <div>
                  <p class="text-sm font-medium">{{ status.message }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(status.date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-undo text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz iade talebiniz bulunmuyor.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
  name: 'ReturnRequests',
  setup() {
    const store = useStore()
    const filter = ref('all')
    const returns = ref([])

    const filteredReturns = computed(() => {
      if (filter.value === 'all') return returns.value
      return returns.value.filter(r => r.status === filter.value)
    })

    const getStatusClass = (status) => {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-600',
        approved: 'bg-blue-100 text-blue-600',
        rejected: 'bg-red-100 text-red-600',
        completed: 'bg-green-100 text-green-600'
      }
      return classes[status]
    }

    const getStatusText = (status) => {
      const texts = {
        pending: 'Beklemede',
        approved: 'Onaylandı',
        rejected: 'Reddedildi',
        completed: 'Tamamlandı'
      }
      return texts[status]
    }

    const getStatusHistoryClass = (type) => {
      const classes = {
        success: 'bg-green-100 text-green-600',
        warning: 'bg-yellow-100 text-yellow-600',
        error: 'bg-red-100 text-red-600',
        info: 'bg-blue-100 text-blue-600'
      }
      return classes[type]
    }

    const getStatusHistoryIcon = (type) => {
      const icons = {
        success: 'fa-check',
        warning: 'fa-exclamation',
        error: 'fa-times',
        info: 'fa-info'
      }
      return icons[type]
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: tr })
    }

    const loadReturns = async () => {
      try {
        const response = await store.dispatch('returns/getReturns')
        returns.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İade talepleri yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadReturns()
    })

    return {
      filter,
      filteredReturns,
      getStatusClass,
      getStatusText,
      getStatusHistoryClass,
      getStatusHistoryIcon,
      formatDate
    }
  }
}
</script> 