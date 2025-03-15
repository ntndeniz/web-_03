<template>
  <div class="packing-slip">
    <div class="slip-header">
      <div class="company-info">
        <img :src="companyLogo" alt="Şirket Logo" class="company-logo" />
        <div class="company-details">
          <h2>{{ companyName }}</h2>
          <p>{{ companyAddress }}</p>
        </div>
      </div>

      <div class="order-info">
        <h1>Sevk İrsaliyesi</h1>
        <div class="order-number">Sipariş No: {{ orderNumber }}</div>
        <div class="order-date">Tarih: {{ formatDate(orderDate) }}</div>
      </div>
    </div>

    <div class="addresses">
      <div class="shipping-address">
        <h3>Teslimat Adresi</h3>
        <div class="address-content">
          <strong>{{ shippingAddress.name }}</strong>
          <p>{{ shippingAddress.street }}</p>
          <p>{{ shippingAddress.city }}, {{ shippingAddress.postalCode }}</p>
          <p>{{ shippingAddress.phone }}</p>
        </div>
      </div>

      <div class="billing-address" v-if="showBillingAddress">
        <h3>Fatura Adresi</h3>
        <div class="address-content">
          <strong>{{ billingAddress.name }}</strong>
          <p>{{ billingAddress.street }}</p>
          <p>{{ billingAddress.city }}, {{ billingAddress.postalCode }}</p>
          <p>{{ billingAddress.phone }}</p>
        </div>
      </div>
    </div>

    <div class="items-section">
      <table class="items-table">
        <thead>
          <tr>
            <th>Ürün</th>
            <th>SKU</th>
            <th>Miktar</th>
            <th>Konum</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.sku }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.location }}</td>
            <td>
              <span :class="getStatusClass(item.status)">
                {{ item.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="package-info">
      <div class="package-details">
        <h4>Paket Detayları</h4>
        <div class="details-grid">
          <div class="detail-item">
            <span>Toplam Ağırlık:</span>
            <span>{{ totalWeight }} kg</span>
          </div>
          <div class="detail-item">
            <span>Paket Sayısı:</span>
            <span>{{ packageCount }}</span>
          </div>
          <div class="detail-item">
            <span>Kargo Firması:</span>
            <span>{{ carrier }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="slip-footer">
      <div class="special-notes" v-if="notes">
        <h4>Özel Notlar:</h4>
        <p>{{ notes }}</p>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <p>Hazırlayan</p>
          <div class="signature-line"></div>
        </div>
        <div class="signature-box">
          <p>Teslim Alan</p>
          <div class="signature-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatDate } from '@/helpers/date'

export default {
  name: 'PackingSlip',

  props: {
    companyInfo: {
      type: Object,
      required: true
    },
    orderNumber: {
      type: String,
      required: true
    },
    orderDate: {
      type: Date,
      required: true
    },
    shippingAddress: {
      type: Object,
      required: true
    },
    billingAddress: {
      type: Object,
      default: null
    },
    items: {
      type: Array,
      required: true
    },
    totalWeight: {
      type: Number,
      required: true
    },
    packageCount: {
      type: Number,
      required: true
    },
    carrier: {
      type: String,
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const showBillingAddress = computed(() => !!props.billingAddress)

    const getStatusClass = (status) => {
      return {
        'status-instock': status === 'Stokta',
        'status-backorder': status === 'Ön Sipariş',
        'status-outofstock': status === 'Stok Dışı'
      }
    }

    return {
      showBillingAddress,
      getStatusClass,
      formatDate
    }
  }
}
</script>

<style scoped>
.packing-slip {
  @apply max-w-4xl mx-auto p-8 bg-white;
}

.slip-header {
  @apply flex justify-between mb-8;
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

.order-info {
  @apply text-right;
}

.addresses {
  @apply grid grid-cols-2 gap-8 mb-8;
}

.address-content {
  @apply space-y-1 text-gray-600;
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

.status-instock {
  @apply text-green-600;
}

.status-backorder {
  @apply text-yellow-600;
}

.status-outofstock {
  @apply text-red-600;
}

.package-info {
  @apply mb-8;
}

.details-grid {
  @apply grid grid-cols-3 gap-4;
}

.detail-item {
  @apply flex justify-between text-sm;
}

.special-notes {
  @apply mb-8 text-sm text-gray-600;
}

.signatures {
  @apply grid grid-cols-2 gap-8;
}

.signature-box {
  @apply text-center;
}

.signature-line {
  @apply w-full h-px bg-gray-300 mt-16;
}

@media print {
  .packing-slip {
    @apply p-0;
  }
}
</style> 