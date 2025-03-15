<template>
  <div class="invoice-container">
    <div class="invoice-header">
      <div class="company-info">
        <img :src="companyLogo" alt="Şirket Logo" class="company-logo" />
        <div class="company-details">
          <h2>{{ companyName }}</h2>
          <p>{{ companyAddress }}</p>
          <p>Vergi No: {{ taxNumber }}</p>
        </div>
      </div>

      <div class="invoice-details">
        <h1>FATURA</h1>
        <div class="invoice-number">No: {{ invoiceNumber }}</div>
        <div class="invoice-date">Tarih: {{ formatDate(invoiceDate) }}</div>
      </div>
    </div>

    <div class="customer-section">
      <div class="billing-info">
        <h3>Fatura Adresi</h3>
        <div class="address-details">
          <p>{{ customer.name }}</p>
          <p>{{ customer.address }}</p>
          <p>{{ customer.taxInfo }}</p>
        </div>
      </div>

      <div class="shipping-info" v-if="hasShippingAddress">
        <h3>Teslimat Adresi</h3>
        <div class="address-details">
          <p>{{ shippingAddress.name }}</p>
          <p>{{ shippingAddress.address }}</p>
          <p>{{ shippingAddress.phone }}</p>
        </div>
      </div>
    </div>

    <div class="items-section">
      <table class="items-table">
        <thead>
          <tr>
            <th>Ürün</th>
            <th>Miktar</th>
            <th>Birim Fiyat</th>
            <th>KDV</th>
            <th>Toplam</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ formatCurrency(item.unitPrice) }}</td>
            <td>%{{ item.taxRate }}</td>
            <td>{{ formatCurrency(item.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="totals-section">
      <div class="totals-grid">
        <div class="total-row">
          <span>Ara Toplam:</span>
          <span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div class="total-row">
          <span>KDV:</span>
          <span>{{ formatCurrency(taxTotal) }}</span>
        </div>
        <div class="total-row">
          <span>Kargo:</span>
          <span>{{ formatCurrency(shippingCost) }}</span>
        </div>
        <div class="total-row grand-total">
          <span>Genel Toplam:</span>
          <span>{{ formatCurrency(grandTotal) }}</span>
        </div>
      </div>
    </div>

    <div class="footer-section">
      <div class="payment-info">
        <h4>Ödeme Bilgileri</h4>
        <p>Banka: {{ bankInfo.name }}</p>
        <p>IBAN: {{ bankInfo.iban }}</p>
      </div>

      <div class="notes">
        <p>{{ notes }}</p>
      </div>

      <div class="barcode">
        <img :src="barcodeUrl" :alt="invoiceNumber" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatDate } from '@/helpers/date'
import { formatCurrency } from '@/helpers/number'
import { generateBarcode } from '@/utils/barcode'

export default {
  name: 'Invoice',

  props: {
    companyInfo: {
      type: Object,
      required: true
    },
    customer: {
      type: Object,
      required: true
    },
    shippingAddress: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      required: true
    },
    invoiceNumber: {
      type: String,
      required: true
    },
    invoiceDate: {
      type: Date,
      required: true
    },
    bankInfo: {
      type: Object,
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const hasShippingAddress = computed(() => !!props.shippingAddress)

    const subtotal = computed(() => {
      return props.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
    })

    const taxTotal = computed(() => {
      return props.items.reduce((sum, item) => {
        return sum + (item.unitPrice * item.quantity * item.taxRate / 100)
      }, 0)
    })

    const shippingCost = computed(() => props.shippingCost || 0)

    const grandTotal = computed(() => {
      return subtotal.value + taxTotal.value + shippingCost.value
    })

    const barcodeUrl = computed(() => {
      return generateBarcode(props.invoiceNumber)
    })

    return {
      hasShippingAddress,
      subtotal,
      taxTotal,
      shippingCost,
      grandTotal,
      barcodeUrl,
      formatDate,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.invoice-container {
  @apply max-w-4xl mx-auto p-8 bg-white;
}

.invoice-header {
  @apply flex justify-between mb-8 pb-8 border-b;
}

.company-info {
  @apply flex gap-4;
}

.company-logo {
  @apply h-16 w-auto;
}

.company-details {
  @apply space-y-1;
}

.invoice-details {
  @apply text-right;
}

.invoice-number {
  @apply text-xl font-semibold text-gray-800;
}

.invoice-date {
  @apply text-gray-600;
}

.customer-section {
  @apply grid grid-cols-2 gap-8 mb-8;
}

.billing-info,
.shipping-info {
  @apply space-y-2;
}

.address-details {
  @apply text-gray-600;
}

.items-table {
  @apply w-full mb-8;
}

.items-table th {
  @apply px-4 py-2 text-left bg-gray-50;
}

.items-table td {
  @apply px-4 py-3 border-t border-gray-100;
}

.totals-section {
  @apply flex justify-end mb-8;
}

.totals-grid {
  @apply w-64 space-y-2;
}

.total-row {
  @apply flex justify-between;
}

.grand-total {
  @apply text-lg font-semibold border-t border-gray-200 pt-2 mt-2;
}

.footer-section {
  @apply grid grid-cols-3 gap-8 pt-8 border-t;
}

.payment-info {
  @apply space-y-2;
}

.notes {
  @apply text-sm text-gray-600;
}

.barcode {
  @apply flex justify-end;
}

@media print {
  .invoice-container {
    @apply p-0;
  }
}
</style> 