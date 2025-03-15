<template>
  <div class="payment-gateways-container">
    <div class="payment-methods">
      <h3 class="section-title">Ödeme Yöntemi Seçin</h3>
      
      <div class="methods-grid">
        <div
          v-for="method in availableMethods"
          :key="method.id"
          class="method-card"
          :class="{ active: selectedMethod === method.id }"
          @click="selectMethod(method)"
        >
          <img :src="method.icon" :alt="method.name" class="method-icon" />
          <span class="method-name">{{ method.name }}</span>
          <span v-if="method.discount" class="method-discount">
            {{ method.discount }}% İndirim
          </span>
        </div>
      </div>
    </div>

    <div v-if="selectedMethod" class="payment-form">
      <component
        :is="currentForm"
        :amount="amount"
        :currency="currency"
        @payment-success="handlePaymentSuccess"
        @payment-error="handlePaymentError"
      />
    </div>

    <div class="payment-info">
      <div class="info-row">
        <span>Ara Toplam:</span>
        <span>{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="info-row">
        <span>İndirim:</span>
        <span>-{{ formatCurrency(discount) }}</span>
      </div>
      <div class="info-row total">
        <span>Toplam:</span>
        <span>{{ formatCurrency(total) }}</span>
      </div>
    </div>

    <div class="security-badges">
      <div v-for="badge in securityBadges" :key="badge.id" class="badge">
        <img :src="badge.icon" :alt="badge.name" />
        <span>{{ badge.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatCurrency } from '@/helpers/number'
import { notify } from '@/utils/notification'

// Ödeme formu bileşenleri
import CreditCardForm from './payment-forms/CreditCardForm.vue'
import BankTransferForm from './payment-forms/BankTransferForm.vue'
import PaypalForm from './payment-forms/PaypalForm.vue'

export default {
  name: 'PaymentGateways',

  components: {
    CreditCardForm,
    BankTransferForm,
    PaypalForm
  },

  props: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'TRY'
    }
  },

  setup(props) {
    const store = useStore()
    const selectedMethod = ref(null)

    // Kullanılabilir ödeme yöntemleri
    const availableMethods = [
      {
        id: 'credit-card',
        name: 'Kredi Kartı',
        icon: '/icons/credit-card.svg',
        component: 'CreditCardForm',
        discount: 0
      },
      {
        id: 'bank-transfer',
        name: 'Havale/EFT',
        icon: '/icons/bank-transfer.svg',
        component: 'BankTransferForm',
        discount: 5
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: '/icons/paypal.svg',
        component: 'PaypalForm',
        discount: 0
      }
    ]

    // Güvenlik rozetleri
    const securityBadges = [
      {
        id: 'ssl',
        name: '256-bit SSL Şifreleme',
        icon: '/icons/ssl.svg'
      },
      {
        id: 'pci',
        name: 'PCI DSS Uyumlu',
        icon: '/icons/pci.svg'
      },
      {
        id: '3d-secure',
        name: '3D Secure',
        icon: '/icons/3d-secure.svg'
      }
    ]

    // Seçili ödeme yöntemi formu
    const currentForm = computed(() => {
      if (!selectedMethod.value) return null
      
      const method = availableMethods.find(m => m.id === selectedMethod.value)
      return method ? method.component : null
    })

    // Ödeme hesaplamaları
    const subtotal = computed(() => props.amount)
    
    const discount = computed(() => {
      if (!selectedMethod.value) return 0
      
      const method = availableMethods.find(m => m.id === selectedMethod.value)
      return method ? (subtotal.value * method.discount) / 100 : 0
    })
    
    const total = computed(() => subtotal.value - discount.value)

    // Ödeme yöntemi seçimi
    const selectMethod = (method) => {
      selectedMethod.value = method.id
      
      // Analitiğe kaydet
      store.dispatch('analytics/trackPaymentMethodSelection', {
        method: method.id,
        amount: props.amount
      })
    }

    // Ödeme sonuç işlemleri
    const handlePaymentSuccess = (result) => {
      store.dispatch('payment/processPayment', {
        ...result,
        amount: total.value,
        method: selectedMethod.value
      })
      
      notify.success('Ödeme başarıyla tamamlandı')
      
      store.dispatch('analytics/trackPaymentSuccess', {
        method: selectedMethod.value,
        amount: total.value
      })
    }

    const handlePaymentError = (error) => {
      notify.error('Ödeme işlemi başarısız oldu')
      
      store.dispatch('analytics/trackPaymentError', {
        method: selectedMethod.value,
        error: error.message
      })
    }

    return {
      selectedMethod,
      availableMethods,
      securityBadges,
      currentForm,
      subtotal,
      discount,
      total,
      selectMethod,
      handlePaymentSuccess,
      handlePaymentError,
      formatCurrency
    }
  }
}
</script>

<style scoped>
.payment-gateways-container {
  @apply space-y-8;
}

.section-title {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

.methods-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-4;
}

.method-card {
  @apply flex flex-col items-center p-4 bg-white rounded-lg border-2 border-transparent cursor-pointer transition-all;
}

.method-card:hover {
  @apply border-blue-200 shadow-md;
}

.method-card.active {
  @apply border-blue-500 shadow-lg;
}

.method-icon {
  @apply w-12 h-12 mb-2;
}

.method-name {
  @apply font-medium text-gray-800;
}

.method-discount {
  @apply text-sm text-green-600 font-medium mt-1;
}

.payment-form {
  @apply bg-white rounded-lg shadow-md p-6;
}

.payment-info {
  @apply space-y-2 bg-gray-50 rounded-lg p-4;
}

.info-row {
  @apply flex justify-between text-gray-600;
}

.info-row.total {
  @apply text-lg font-semibold text-gray-800 border-t border-gray-200 pt-2 mt-2;
}

.security-badges {
  @apply flex justify-center gap-8 py-4;
}

.badge {
  @apply flex flex-col items-center gap-2;
}

.badge img {
  @apply w-8 h-8 opacity-50;
}

.badge span {
  @apply text-xs text-gray-500;
}
</style>