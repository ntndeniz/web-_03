<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">Teslimat Bilgileri</h2>

    <!-- Kayıtlı Adresler -->
    <div v-if="addresses.length" class="space-y-4">
      <div 
        v-for="address in addresses"
        :key="address.id"
        class="relative flex items-start space-x-4 rounded-lg border p-4"
        :class="{ 'border-blue-500 bg-blue-50': selectedAddress === address.id }"
      >
        <input
          type="radio"
          name="shipping-address"
          :value="address.id"
          v-model="selectedAddress"
          class="mt-1 h-4 w-4 text-blue-600"
        />
        
        <div class="flex-1">
          <div class="font-medium">{{ address.title }}</div>
          <div class="mt-1 text-sm text-gray-600">
            {{ address.fullAddress }}
          </div>
          <div class="mt-1 text-sm text-gray-600">
            {{ address.city }}/{{ address.district }}
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Adres Formu -->
    <form v-show="showNewAddressForm" @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Adres Başlığı</label>
        <input 
          v-model="form.title"
          type="text"
          required
          placeholder="Ev, İş vb."
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
        <input 
          v-model="form.fullName"
          type="text"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Telefon</label>
        <input 
          v-model="form.phone"
          type="tel"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">İl</label>
          <select 
            v-model="form.city"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">İlçe</label>
          <select 
            v-model="form.district"
            required
            :disabled="!form.city"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            <option v-for="district in districts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Açık Adres</label>
        <textarea 
          v-model="form.fullAddress"
          rows="3"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="flex items-center">
        <input 
          v-model="form.saveAddress"
          type="checkbox"
          class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label class="ml-2 block text-sm text-gray-900">
          Bu adresi kaydet
        </label>
      </div>
    </form>

    <!-- Yeni Adres Ekle Butonu -->
    <button 
      v-if="!showNewAddressForm"
      @click="showNewAddressForm = true"
      class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <i class="fas fa-plus mr-2"></i>
      Yeni Adres Ekle
    </button>

    <!-- Devam Et Butonu -->
    <button 
      @click="handleContinue"
      :disabled="loading || (!selectedAddress && !showNewAddressForm)"
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span v-if="!loading">Devam Et</span>
      <LoadingSpinner v-else size="sm" color="white" />
    </button>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'ShippingForm',
  components: {
    LoadingSpinner
  },
  emits: ['continue'],
  setup(props, { emit }) {
    const store = useStore()
    const loading = ref(false)
    const selectedAddress = ref('')
    const showNewAddressForm = ref(false)
    const form = ref({
      title: '',
      fullName: '',
      phone: '',
      city: '',
      district: '',
      fullAddress: '',
      saveAddress: false
    })

    const addresses = computed(() => store.state.user.addresses)
    const cities = computed(() => store.state.location.cities)
    const districts = computed(() => {
      if (!form.value.city) return []
      return store.state.location.districts[form.value.city] || []
    })

    const handleSubmit = async () => {
      loading.value = true
      try {
        const addressId = await store.dispatch('user/addAddress', form.value)
        selectedAddress.value = addressId
        showNewAddressForm.value = false
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Adres eklenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const handleContinue = async () => {
      if (!selectedAddress.value && !showNewAddressForm.value) return

      loading.value = true
      try {
        const shippingData = selectedAddress.value ? 
          { addressId: selectedAddress.value } : 
          form.value

        await store.dispatch('checkout/setShippingAddress', shippingData)
        emit('continue')
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      selectedAddress,
      showNewAddressForm,
      form,
      addresses,
      cities,
      districts,
      handleSubmit,
      handleContinue
    }
  }
}
</script> 