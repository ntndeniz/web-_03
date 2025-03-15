<template>
  <div class="tax-calculator">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Vergi Hesaplama</h3>

    <!-- Vergi Özeti -->
    <div class="tax-summary grid grid-cols-2 gap-4 mb-6">
      <div class="summary-item">
        <span class="text-sm text-gray-500">Ara Toplam</span>
        <span class="text-lg font-medium text-gray-900">{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="summary-item">
        <span class="text-sm text-gray-500">KDV ({{ taxRate }}%)</span>
        <span class="text-lg font-medium text-gray-900">{{ formatCurrency(taxAmount) }}</span>
      </div>
    </div>

    <!-- Vergi Detayları -->
    <div class="tax-details space-y-4">
      <div v-for="(item, index) in items" :key="index" class="tax-item">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
            <p class="text-sm text-gray-500">
              {{ item.quantity }} adet x {{ formatCurrency(item.price) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-900">{{ formatCurrency(item.total) }}</p>
            <p class="text-xs text-gray-500">
              KDV: {{ formatCurrency(calculateTax(item.total)) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Fatura Bilgileri -->
    <div class="invoice-details mt-6">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Fatura Bilgileri</h4>
      
      <!-- Fatura Tipi Seçimi -->
      <div class="mb-4">
        <div class="flex space-x-4">
          <label class="invoice-type-option">
            <input 
              type="radio" 
              v-model="invoiceType" 
              value="individual"
              class="sr-only"
            >
            <span class="option-text">Bireysel</span>
          </label>
          <label class="invoice-type-option">
            <input 
              type="radio" 
              v-model="invoiceType" 
              value="corporate"
              class="sr-only"
            >
            <span class="option-text">Kurumsal</span>
          </label>
        </div>
      </div>

      <!-- Kurumsal Fatura Formu -->
      <div v-if="invoiceType === 'corporate'" class="corporate-form space-y-4">
        <div class="form-group">
          <label class="form-label">Şirket Adı</label>
          <input 
            type="text"
            v-model="invoiceDetails.companyName"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Vergi Dairesi</label>
          <input 
            type="text"
            v-model="invoiceDetails.taxOffice"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Vergi Numarası</label>
          <input 
            type="text"
            v-model="invoiceDetails.taxNumber"
            class="form-input"
            @input="validateTaxNumber"
          >
          <p v-if="taxNumberError" class="error-text">
            {{ taxNumberError }}
          </p>
        </div>
      </div>
    </div>

    <!-- Toplam -->
    <div class="total-section mt-6 pt-6 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <span class="text-base font-medium text-gray-900">Toplam (KDV Dahil)</span>
        <span class="text-xl font-bold text-primary-600">
          {{ formatCurrency(total) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'TaxCalculator',

  props: {
    items: {
      type: Array,
      required: true
    },
    taxRate: {
      type: Number,
      default: 18
    }
  },

  emits: ['update:invoice-details'],

  setup(props, { emit }) {
    const invoiceType = ref('individual')
    const invoiceDetails = ref({
      companyName: '',
      taxOffice: '',
      taxNumber: ''
    })
    const taxNumberError = ref('')

    const subtotal = computed(() => {
      return props.items.reduce((sum, item) => sum + item.total, 0)
    })

    const taxAmount = computed(() => {
      return (subtotal.value * props.taxRate) / 100
    })

    const total = computed(() => {
      return subtotal.value + taxAmount.value
    })

    const calculateTax = (amount) => {
      return (amount * props.taxRate) / 100
    }

    const validateTaxNumber = () => {
      const taxNumber = invoiceDetails.value.taxNumber
      if (taxNumber.length !== 10) {
        taxNumberError.value = 'Vergi numarası 10 haneli olmalıdır'
      } else if (!/^\d+$/.test(taxNumber)) {
        taxNumberError.value = 'Vergi numarası sadece rakam içermelidir'
      } else {
        taxNumberError.value = ''
        emit('update:invoice-details', invoiceDetails.value)
      }
    }

    return {
      invoiceType,
      invoiceDetails,
      taxNumberError,
      subtotal,
      taxAmount,
      total,
      calculateTax,
      validateTaxNumber,
      formatCurrency
    }
  }
}
</script>

<style lang="scss" scoped>
.tax-calculator {
  @apply bg-white rounded-lg p-6;

  .summary-item {
    @apply flex flex-col;
  }

  .tax-item {
    @apply p-4 bg-gray-50 rounded-lg;
  }

  .invoice-type-option {
    @apply relative flex cursor-pointer rounded-lg border p-4 focus:outline-none;

    input:checked + .option-text {
      @apply border-primary-500 ring-2 ring-primary-500;
    }
  }

  .form-label {
    @apply block text-sm font-medium text-gray-700;
  }

  .form-input {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .error-text {
    @apply mt-1 text-sm text-red-600;
  }
}
</style> 