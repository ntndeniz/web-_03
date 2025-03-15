<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b flex justify-between items-center">
      <h2 class="text-xl font-semibold">Adreslerim</h2>
      <button 
        @click="showNewAddressForm = true"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        + Yeni Adres Ekle
      </button>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="address in addresses" 
          :key="address.id"
          class="border rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="font-semibold">{{ address.title }}</div>
            <div class="flex gap-2">
              <button 
                @click="editAddress(address)"
                class="text-blue-600 hover:text-blue-800"
              >
                <span class="material-icons">edit</span>
              </button>
              <button 
                @click="deleteAddress(address.id)"
                class="text-red-600 hover:text-red-800"
              >
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>

          <div class="text-sm text-gray-600">
            <div class="mb-1">{{ address.fullName }}</div>
            <div class="mb-1">{{ address.phone }}</div>
            <div>
              {{ address.fullAddress }}
              <br>
              {{ address.district }} / {{ address.city }}
            </div>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div v-if="addresses.length === 0" class="text-center py-8">
        <span class="material-icons text-6xl text-gray-400 mb-4">location_on</span>
        <p class="text-gray-600">Henüz kayıtlı adresiniz bulunmuyor.</p>
      </div>
    </div>

    <!-- Adres Formu Modal -->
    <Modal v-if="showNewAddressForm" @close="showNewAddressForm = false">
      <template #title>
        {{ editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle' }}
      </template>
      <template #content>
        <AddressForm 
          :initial-address="editingAddress"
          @save="saveAddress"
          @cancel="cancelAddressForm"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import AddressForm from '@/components/checkout/AddressForm.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'Addresses',
  components: {
    AddressForm,
    Modal
  },
  data() {
    return {
      showNewAddressForm: false,
      editingAddress: null
    }
  },
  computed: {
    addresses() {
      return this.$store.state.user.addresses
    }
  },
  methods: {
    editAddress(address) {
      this.editingAddress = address
      this.showNewAddressForm = true
    },
    async saveAddress(address) {
      try {
        if (this.editingAddress) {
          await this.$store.dispatch('user/updateAddress', {
            id: this.editingAddress.id,
            ...address
          })
          this.$toast.success('Adres başarıyla güncellendi')
        } else {
          await this.$store.dispatch('user/addAddress', address)
          this.$toast.success('Adres başarıyla eklendi')
        }
        this.cancelAddressForm()
      } catch (error) {
        this.$toast.error('Adres kaydedilirken bir hata oluştu')
      }
    },
    async deleteAddress(addressId) {
      try {
        await this.$store.dispatch('user/deleteAddress', addressId)
        this.$toast.success('Adres başarıyla silindi')
      } catch (error) {
        this.$toast.error('Adres silinirken bir hata oluştu')
      }
    },
    cancelAddressForm() {
      this.showNewAddressForm = false
      this.editingAddress = null
    }
  },
  created() {
    this.$store.dispatch('user/fetchAddresses')
  }
}
</script> 