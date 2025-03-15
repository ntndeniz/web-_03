<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Fatura Geçmişi</h2>
      
      <!-- Filtreler -->
      <div class="flex items-center space-x-4">
        <select 
          v-model="filter"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tüm Faturalar</option>
          <option value="paid">Ödenenler</option>
          <option value="pending">Bekleyenler</option>
          <option value="cancelled">İptal Edilenler</option>
        </select>

        <select 
          v-model="period"
          class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tüm Zamanlar</option>
          <option value="last_month">Son 1 Ay</option>
          <option value="last_3_months">Son 3 Ay</option>
          <option value="last_year">Son 1 Yıl</option>
        </select>
      </div>
    </div>

    <!-- Fatura Listesi -->
    <div v-if="filteredInvoices.length" class="space-y-4">
      <div 
        v-for="invoice in filteredInvoices"
        :key="invoice.id"
        class="rounded-lg border p-4"
      >
        <div class="flex items-center justify-between">
          <!-- Fatura Detayları -->
          <div class="flex-1">
            <div class="flex items-center space-x-4">
              <span class="text-lg font-medium">
                Fatura #{{ invoice.number }}
              </span>
              <span 
                class="rounded-full px-3 py-1 text-sm"
                :class="getStatusClass(invoice.status)"
              >
                {{ getStatusText(invoice.status) }}
              </span>
            </div>
            
            <div class="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p class="font-medium">Tarih</p>
                <p>{{ formatDate(invoice.date) }}</p>
              </div>
              <div>
                <p class="font-medium">Ödeme Yöntemi</p>
                <p>{{ invoice.paymentMethod }}</p>
              </div>
              <div>
                <p class="font-medium">Tutar</p>
                <p class="text-lg font-bold text-blue-600">
                  {{ formatPrice(invoice.amount) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Aksiyonlar -->
          <div class="flex items-center space-x-4">
            <button 
              @click="downloadInvoice(invoice.id)"
              class="flex items-center space-x-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <i class="fas fa-download"></i>
              <span>İndir</span>
            </button>
            
            <button 
              v-if="invoice.status === 'pending'"
              @click="payInvoice(invoice.id)"
              class="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <i class="fas fa-credit-card"></i>
              <span>Öde</span>
            </button>
          </div>
        </div>

        <!-- Sipariş Detayları -->
        <div 
          v-if="invoice.order"
          class="mt-4 rounded-lg bg-gray-50 p-4"
        >
          <h4 class="font-medium">Sipariş Detayları</h4>
          <div class="mt-2 space-y-2">
            <div 
              v-for="item in invoice.order.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <span>{{ formatPrice(item.price * item.quantity) }}</span>
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
      <i class="fas fa-file-invoice text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz faturanız bulunmuyor.</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
  name: 'BillingHistory',
  setup() {
    const store = useStore()
    const filter = ref('all')
    const period = ref('all')

    const invoices = computed(() => store.state.billing.invoices)

    const filteredInvoices = computed(() => {
      let filtered = [...invoices.value]
      
      // Status filtresi
      if (filter.value !== 'all') {
        filtered = filtered.filter(i => i.status === filter.value)
      }
      
      // Tarih filtresi
      const now = new Date()
      if (period.value === 'last_month') {
        const lastMonth = new Date(now.setMonth(now.getMonth() - 1))
        filtered = filtered.filter(i => new Date(i.date) >= lastMonth)
      } else if (period.value === 'last_3_months') {
        const last3Months = new Date(now.setMonth(now.getMonth() - 3))
        filtered = filtered.filter(i => new Date(i.date) >= last3Months)
      } else if (period.value === 'last_year') {
        const lastYear = new Date(now.setFullYear(now.getFullYear() - 1))
        filtered = filtered.filter(i => new Date(i.date) >= lastYear)
      }
      
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    const getStatusClass = (status) => {
      const classes = {
        paid: 'bg-green-100 text-green-600',
        pending: 'bg-yellow-100 text-yellow-600',
        cancelled: 'bg-red-100 text-red-600'
      }
      return classes[status]
    }

    const getStatusText = (status) => {
      const texts = {
        paid: 'Ödendi',
        pending: 'Bekliyor',
        cancelled: 'İptal Edildi'
      }
      return texts[status]
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: tr })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const downloadInvoice = async (id) => {
      try {
        await store.dispatch('billing/downloadInvoice', id)
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Fatura indirilirken bir hata oluştu'
        })
      }
    }

    const payInvoice = async (id) => {
      try {
        await store.dispatch('billing/payInvoice', id)
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Ödeme başarıyla gerçekleşti'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Ödeme işlemi sırasında bir hata oluştu'
        })
      }
    }

    return {
      filter,
      period,
      filteredInvoices,
      getStatusClass,
      getStatusText,
      formatDate,
      formatPrice,
      downloadInvoice,
      payInvoice
    }
  }
}
</script> 