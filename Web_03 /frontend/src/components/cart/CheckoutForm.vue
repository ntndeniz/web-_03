<template>
  <div class="space-y-8">
    <!-- Teslimat Adresi -->
    <div>
      <h3 class="mb-4 text-lg font-medium">Teslimat Adresi</h3>
      
      <!-- Kayıtlı Adresler -->
      <div v-if="addresses.length" class="space-y-4">
        <div 
          v-for="address in addresses" 
          :key="address.id"
          class="relative rounded-lg border p-4"
          :class="{ 'border-blue-500 bg-blue-50': selectedAddress === address.id }"
        >
          <label class="flex cursor-pointer items-start space-x-4">
            <input
              type="radio"
              name="address"
              :value="address.id"
              v-model="selectedAddress"
              class="mt-1"
            />
            <div>
              <div class="font-medium">{{ address.title }}</div>
              <div class="mt-1 text-sm text-gray-600">
                {{ address.fullAddress }}
              </div>
              <div class="mt-1 text-sm">
                {{ address.city }}/{{ address.district }}
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Yeni Adres Ekle -->
      <button 
        @click="showAddressModal = true"
        class="mt-4 flex items-center text-blue-600 hover:text-blue-700"
      >
        <i class="fas fa-plus-circle mr-2"></i>
        Yeni Adres Ekle
      </button>
    </div>

    <!-- Ödeme Yöntemi -->
    <div>
      <h3 class="mb-4 text-lg font-medium">Ödeme Yöntemi</h3>
      
      <div class="space-y-4">
        <!-- Kredi Kartı -->
        <div 
          class="relative rounded-lg border p-4"
          :class="{ 'border-blue-500 bg-blue-50': paymentMethod === 'card' }"
        >
          <label class="flex cursor-pointer items-start space-x-4">
            <input
              type="radio"
              name="payment"
              value="card"
              v-model="paymentMethod"
              class="mt-1"
            />
            <div class="flex-1">
              <div class="font-medium">Kredi/Banka Kartı</div>
              
              <!-- Kart Bilgileri Formu -->
              <div v-if="paymentMethod === 'card'" class="mt-4 space-y-4">
                <div class="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label class="mb-1 block text-sm">Kart Üzerindeki İsim</label>
                    <input
                      v-model="cardName"
                      type="text"
                      class="w-full rounded-lg border px-3 py-2"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm">Kart Numarası</label>
                    <input
                      v-model="cardNumber"
                      type="text"
                      class="w-full rounded-lg border px-3 py-2"
                      placeholder="0000 0000 0000 0000"
                      maxlength="19"
                      @input="formatCardNumber"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm">Son Kullanma Tarihi</label>
                    <input
                      v-model="cardExpiry"
                      type="text"
                      class="w-full rounded-lg border px-3 py-2"
                      placeholder="AA/YY"
                      maxlength="5"
                      @input="formatCardExpiry"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm">CVV</label>
                    <input
                      v-model="cardCvv"
                      type="text"
                      class="w-full rounded-lg border px-3 py-2"
                      placeholder="000"
                      maxlength="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </label>
        </div>

        <!-- Kapıda Ödeme -->
        <div 
          class="relative rounded-lg border p-4"
          :class="{ 'border-blue-500 bg-blue-50': paymentMethod === 'cash' }"
        >
          <label class="flex cursor-pointer items-start space-x-4">
            <input
              type="radio"
              name="payment"
              value="cash"
              v-model="paymentMethod"
              class="mt-1"
            />
            <div>
              <div class="font-medium">Kapıda Ödeme</div>
              <div class="mt-1 text-sm text-gray-600">
                +5 TL kapıda ödeme ücreti
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Sipariş Özeti -->
    <div class="rounded-lg bg-gray-50 p-6">
      <h3 class="mb-4 text-lg font-medium">Sipariş Özeti</h3>
      
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">Ara Toplam</span>
          <span>{{ formatPrice(subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">KDV (%18)</span>
          <span>{{ formatPrice(tax) }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Kargo</span>
          <span>{{ shipping > 0 ? formatPrice(shipping) : 'Ücretsiz' }}</span>
        </div>
        <div class="flex justify-between" v-if="paymentMethod === 'cash'">
          <span class="text-gray-600">Kapıda Ödeme Ücreti</span>
          <span>5,00 TL</span>
        </div>
        <div class="border-t pt-2">
          <div class="flex justify-between">
            <span class="text-lg font-medium">Toplam</span>
            <span class="text-lg font-bold text-blue-600">{{ formatPrice(total) }}</span>
          </div>
        </div>
      </div>

      <!-- Sipariş Ver Butonu -->
      <button 
        @click="placeOrder"
        :disabled="!isFormValid || loading"
        class="mt-6 w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        <span v-if="!loading">Sipariş Ver</span>
        <LoadingSpinner v-else size="sm" color="white" />
      </button>
    </div>

    <!-- Adres Ekleme Modal -->
    <Modal v-model="showAddressModal" title="Yeni Adres Ekle">
      <AddressForm @submit="handleAddressSubmit" />
    </Modal>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Modal from '../common/Modal.vue'
import AddressForm from '../user/AddressForm.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'CheckoutForm',
  components: {
    Modal,
    AddressForm,
    LoadingSpinner
  },
  props: {
    subtotal: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const store = useStore()
    const router = useRouter()
    
    const loading = ref(false)
    const showAddressModal = ref(false)
    const addresses = ref([])
    const selectedAddress = ref('')
    const paymentMethod = ref('card')
    
    // Kart bilgileri
    const cardName = ref('')
    const cardNumber = ref('')
    const cardExpiry = ref('')
    const cardCvv = ref('')

    const tax = computed(() => props.subtotal * 0.18)
    const shipping = computed(() => props.subtotal >= 150 ? 0 : 14.99)
    const total = computed(() => {
      let total = props.subtotal + tax.value + shipping.value
      if (paymentMethod.value === 'cash') total += 5
      return total
    })

    const isFormValid = computed(() => {
      if (!selectedAddress.value) return false
      if (paymentMethod.value === 'card') {
        return cardName.value && 
               cardNumber.value.length === 19 && 
               cardExpiry.value.length === 5 &&
               cardCvv.value.length === 3
      }
      return true
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const formatCardNumber = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      cardNumber.value = value.replace(/(\d{4})/g, '$1 ').trim()
    }

    const formatCardExpiry = (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2)
      }
      cardExpiry.value = value
    }

    const handleAddressSubmit = async (address) => {
      try {
        const newAddress = await store.dispatch('user/addAddress', address)
        addresses.value.push(newAddress)
        selectedAddress.value = newAddress.id
        showAddressModal.value = false
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Adres eklenirken bir hata oluştu'
        })
      }
    }

    const placeOrder = async () => {
      loading.value = true
      try {
        const order = {
          addressId: selectedAddress.value,
          paymentMethod: paymentMethod.value,
          ...(paymentMethod.value === 'card' && {
            cardInfo: {
              name: cardName.value,
              number: cardNumber.value,
              expiry: cardExpiry.value,
              cvv: cardCvv.value
            }
          })
        }

        await store.dispatch('orders/createOrder', order)
        await store.dispatch('cart/clearCart')
        
        router.push('/siparis-basarili')
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Sipariş oluşturulurken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    // Adresleri yükle
    const loadAddresses = async () => {
      try {
        addresses.value = await store.dispatch('user/getAddresses')
        if (addresses.value.length) {
          selectedAddress.value = addresses.value[0].id
        }
      } catch (error) {
        console.error('Adresler yüklenirken hata:', error)
      }
    }

    loadAddresses()

    return {
      loading,
      showAddressModal,
      addresses,
      selectedAddress,
      paymentMethod,
      cardName,
      cardNumber,
      cardExpiry,
      cardCvv,
      tax,
      shipping,
      total,
      isFormValid,
      formatPrice,
      formatCardNumber,
      formatCardExpiry,
      handleAddressSubmit,
      placeOrder
    }
  }
}
</script> 