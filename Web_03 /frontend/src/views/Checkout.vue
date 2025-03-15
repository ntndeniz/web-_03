<template>
  <div class="container py-8">
    <h1 class="text-3xl font-bold mb-8">Ödeme</h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sol Taraf - Form -->
      <div class="flex-1">
        <!-- Teslimat Adresi -->
        <section class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Teslimat Adresi</h2>
          <AddressForm
            v-model="shippingAddress"
            :errors="errors.shippingAddress"
            @update:modelValue="validateShippingAddress"
          />
        </section>

        <!-- Fatura Adresi -->
        <section class="bg-white rounded-lg shadow p-6 mb-6">
          <div class="flex items-center mb-4">
            <h2 class="text-xl font-semibold">Fatura Adresi</h2>
            <label class="flex items-center ml-auto">
              <input
                v-model="sameAsShipping"
                type="checkbox"
                class="form-checkbox"
              >
              <span class="ml-2 text-sm">Teslimat adresi ile aynı</span>
            </label>
          </div>

          <AddressForm
            v-if="!sameAsShipping"
            v-model="billingAddress"
            :errors="errors.billingAddress"
            @update:modelValue="validateBillingAddress"
          />
        </section>

        <!-- Ödeme Bilgileri -->
        <section class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Ödeme Bilgileri</h2>
          <PaymentForm
            v-model="paymentDetails"
            :errors="errors.payment"
            @update:modelValue="validatePayment"
          />
        </section>
      </div>

      <!-- Sağ Taraf - Sipariş Özeti -->
      <div class="lg:w-80">
        <OrderSummary
          :items="cartItems"
          :subtotal="subtotal"
          :shipping="shipping"
          :tax="tax"
          :discount="discount"
          :total="total"
        >
          <template #footer>
            <button
              class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
              :disabled="!isFormValid || isProcessing"
              @click="placeOrder"
            >
              {{ isProcessing ? 'İşleniyor...' : 'Siparişi Tamamla' }}
            </button>
          </template>
        </OrderSummary>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AddressForm from '@/components/checkout/AddressForm.vue';
import PaymentForm from '@/components/checkout/PaymentForm.vue';
import OrderSummary from '@/components/checkout/OrderSummary.vue';
import { validateAddress, validatePaymentDetails } from '@/utils/validators';

export default {
  name: 'Checkout',

  components: {
    AddressForm,
    PaymentForm,
    OrderSummary
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    // Form durumları
    const shippingAddress = ref({});
    const billingAddress = ref({});
    const paymentDetails = ref({});
    const sameAsShipping = ref(true);
    const isProcessing = ref(false);
    const errors = ref({
      shippingAddress: {},
      billingAddress: {},
      payment: {}
    });

    // Sepet verileri
    const cartItems = computed(() => store.getters['cart/items']);
    const subtotal = computed(() => store.getters['cart/subtotal']);
    const shipping = computed(() => store.getters['cart/shipping']);
    const tax = computed(() => store.getters['cart/tax']);
    const discount = computed(() => store.getters['cart/discount']);
    const total = computed(() => store.getters['cart/total']);

    // Form doğrulama
    const validateShippingAddress = () => {
      errors.value.shippingAddress = validateAddress(shippingAddress.value);
    };

    const validateBillingAddress = () => {
      if (!sameAsShipping.value) {
        errors.value.billingAddress = validateAddress(billingAddress.value);
      }
    };

    const validatePayment = () => {
      errors.value.payment = validatePaymentDetails(paymentDetails.value);
    };

    const isFormValid = computed(() => {
      const hasShippingErrors = Object.keys(errors.value.shippingAddress).length > 0;
      const hasBillingErrors = !sameAsShipping.value && Object.keys(errors.value.billingAddress).length > 0;
      const hasPaymentErrors = Object.keys(errors.value.payment).length > 0;
      
      return !hasShippingErrors && !hasBillingErrors && !hasPaymentErrors;
    });

    // Fatura adresi değişikliğini izle
    watch(sameAsShipping, (newValue) => {
      if (newValue) {
        billingAddress.value = { ...shippingAddress.value };
        errors.value.billingAddress = {};
      }
    });

    // Siparişi tamamla
    const placeOrder = async () => {
      if (!isFormValid.value || isProcessing.value) return;

      isProcessing.value = true;

      try {
        const orderData = {
          items: cartItems.value,
          shippingAddress: shippingAddress.value,
          billingAddress: sameAsShipping.value ? shippingAddress.value : billingAddress.value,
          paymentDetails: paymentDetails.value,
          totals: {
            subtotal: subtotal.value,
            shipping: shipping.value,
            tax: tax.value,
            discount: discount.value,
            total: total.value
          }
        };

        const orderId = await store.dispatch('order/create', orderData);
        await store.dispatch('cart/clear');

        router.push({
          name: 'order-confirmation',
          params: { id: orderId }
        });
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Sipariş oluşturulurken bir hata oluştu'
        });
      } finally {
        isProcessing.value = false;
      }
    };

    return {
      shippingAddress,
      billingAddress,
      paymentDetails,
      sameAsShipping,
      isProcessing,
      errors,
      cartItems,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      isFormValid,
      validateShippingAddress,
      validateBillingAddress,
      validatePayment,
      placeOrder
    };
  },

  metaInfo: {
    title: 'Ödeme',
    meta: [
      {
        name: 'description',
        content: 'Siparişinizi tamamlayın ve ödeme yapın.'
      }
    ]
  }
};
</script> 