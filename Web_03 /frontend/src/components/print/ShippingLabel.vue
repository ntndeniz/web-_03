<template>
  <div class="shipping-label">
    <div class="label-header">
      <img :src="carrierLogo" :alt="carrier" class="carrier-logo" />
      <div class="tracking-info">
        <div class="tracking-number">{{ trackingNumber }}</div>
        <div class="barcode">
          <img :src="barcodeUrl" :alt="trackingNumber" />
        </div>
      </div>
    </div>

    <div class="addresses">
      <div class="from-address">
        <h3>Gönderici</h3>
        <div class="address-content">
          <strong>{{ sender.name }}</strong>
          <p>{{ sender.street }}</p>
          <p>{{ sender.city }}, {{ sender.postalCode }}</p>
          <p>{{ sender.phone }}</p>
        </div>
      </div>

      <div class="divider"></div>

      <div class="to-address">
        <h3>Alıcı</h3>
        <div class="address-content">
          <strong>{{ recipient.name }}</strong>
          <p>{{ recipient.street }}</p>
          <p>{{ recipient.city }}, {{ recipient.postalCode }}</p>
          <p>{{ recipient.phone }}</p>
        </div>
      </div>
    </div>

    <div class="shipment-details">
      <div class="detail-row">
        <span>Teslimat Tipi:</span>
        <span>{{ deliveryType }}</span>
      </div>
      <div class="detail-row">
        <span>Paket Ağırlığı:</span>
        <span>{{ weight }} kg</span>
      </div>
      <div class="detail-row">
        <span>Ödeme Tipi:</span>
        <span>{{ paymentType }}</span>
      </div>
    </div>

    <div class="qr-code">
      <img :src="qrCodeUrl" :alt="trackingNumber" />
    </div>

    <div class="label-footer">
      <p class="shipping-date">{{ formatDate(shippingDate) }}</p>
      <p class="reference">Ref: {{ referenceNumber }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { formatDate } from '@/helpers/date'
import { generateBarcode, generateQRCode } from '@/utils/barcode'

export default {
  name: 'ShippingLabel',

  props: {
    carrier: {
      type: String,
      required: true
    },
    trackingNumber: {
      type: String,
      required: true
    },
    sender: {
      type: Object,
      required: true
    },
    recipient: {
      type: Object,
      required: true
    },
    deliveryType: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    paymentType: {
      type: String,
      required: true
    },
    shippingDate: {
      type: Date,
      required: true
    },
    referenceNumber: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const carrierLogo = computed(() => `/logos/${props.carrier.toLowerCase()}.svg`)
    
    const barcodeUrl = computed(() => generateBarcode(props.trackingNumber))
    
    const qrCodeUrl = computed(() => generateQRCode(props.trackingNumber))

    return {
      carrierLogo,
      barcodeUrl,
      qrCodeUrl,
      formatDate
    }
  }
}
</script>

<style scoped>
.shipping-label {
  @apply w-[384px] p-4 bg-white border border-gray-200;
}

.label-header {
  @apply flex justify-between items-start mb-4;
}

.carrier-logo {
  @apply h-8 w-auto;
}

.tracking-info {
  @apply text-right;
}

.tracking-number {
  @apply font-mono text-lg font-bold mb-1;
}

.barcode {
  @apply w-48;
}

.addresses {
  @apply space-y-4 mb-4;
}

.divider {
  @apply border-t border-dashed border-gray-300 my-4;
}

.from-address,
.to-address {
  @apply space-y-1;
}

.address-content {
  @apply text-sm;
}

.shipment-details {
  @apply space-y-2 text-sm mb-4;
}

.detail-row {
  @apply flex justify-between;
}

.qr-code {
  @apply flex justify-center mb-4;
}

.qr-code img {
  @apply w-24 h-24;
}

.label-footer {
  @apply flex justify-between text-xs text-gray-500;
}

@media print {
  .shipping-label {
    @apply border-0 p-0;
  }
}
</style> 