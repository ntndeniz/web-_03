<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Adres Bilgilerim</h2>

    <!-- Adres Listesi -->
    <div class="space-y-4 mb-8">
      <div v-for="address in addresses" :key="address.id" 
           class="border rounded-lg p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold">{{ address.title }}</h3>
            <p class="text-gray-600 mt-2">{{ address.fullAddress }}</p>
            <p class="text-gray-600">{{ address.city }}/{{ address.district }}</p>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="editAddress(address)"
              class="text-blue-500 hover:text-blue-600"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deleteAddress(address.id)"
              class="text-red-500 hover:text-red-600"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Adres Ekleme Formu -->
    <button 
      @click="showAddressForm = true"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      v-if="!showAddressForm"
    >
      <i class="fas fa-plus mr-2"></i>
      Yeni Adres Ekle
    </button>

    <form v-if="showAddressForm" @submit.prevent="saveAddress" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Adres Başlığı</label>
        <input 
          v-model="newAddress.title"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Açık Adres</label>
        <textarea 
          v-model="newAddress.fullAddress"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">İl</label>
          <input 
            v-model="newAddress.city"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">İlçe</label>
          <input 
            v-model="newAddress.district"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button 
          type="button"
          @click="cancelAddressForm"
          class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
        >
          İptal
        </button>
        <button 
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Kaydet
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddressManagement',
  data() {
    return {
      showAddressForm: false,
      addresses: [
        {
          id: 1,
          title: 'Ev Adresi',
          fullAddress: 'Örnek Mahallesi, Örnek Sokak No:1 D:2',
          city: 'İstanbul',
          district: 'Kadıköy'
        }
      ],
      newAddress: {
        title: '',
        fullAddress: '',
        city: '',
        district: ''
      }
    }
  },
  methods: {
    editAddress(address) {
      this.newAddress = { ...address }
      this.showAddressForm = true
    },
    deleteAddress(id) {
      // Adres silme işlemi
      if (confirm('Bu adresi silmek istediğinize emin misiniz?')) {
        this.addresses = this.addresses.filter(address => address.id !== id)
      }
    },
    saveAddress() {
      if (this.newAddress.id) {
        // Mevcut adresi güncelle
        const index = this.addresses.findIndex(a => a.id === this.newAddress.id)
        this.addresses[index] = { ...this.newAddress }
      } else {
        // Yeni adres ekle
        this.addresses.push({
          ...this.newAddress,
          id: Date.now()
        })
      }
      this.cancelAddressForm()
    },
    cancelAddressForm() {
      this.showAddressForm = false
      this.newAddress = {
        title: '',
        fullAddress: '',
        city: '',
        district: ''
      }
    }
  }
}
</script> 