<template>
  <div class="space-y-6">
    <!-- Başlık ve Ekle Butonu -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Adreslerim</h2>
      <button 
        @click="showAddressModal = true"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
      >
        <i class="fas fa-plus mr-2"></i>
        Yeni Adres Ekle
      </button>
    </div>

    <!-- Yükleniyor -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Adres Listesi -->
    <div v-else-if="addresses.length" class="grid gap-6 sm:grid-cols-2">
      <div 
        v-for="address in addresses" 
        :key="address.id"
        class="relative rounded-lg border bg-white p-6 shadow-sm"
      >
        <!-- Adres Başlığı -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="font-medium">{{ address.title }}</h3>
          <div class="flex space-x-2">
            <button 
              @click="editAddress(address)"
              class="text-gray-600 hover:text-blue-600"
              title="Düzenle"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="confirmDelete(address)"
              class="text-gray-600 hover:text-red-600"
              title="Sil"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- Adres Detayları -->
        <div class="space-y-2 text-gray-600">
          <p>{{ address.fullAddress }}</p>
          <p>{{ address.district }}/{{ address.city }}</p>
          <p>{{ address.phone }}</p>
        </div>

        <!-- Varsayılan Adres -->
        <div 
          v-if="address.isDefault"
          class="mt-4 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
        >
          <i class="fas fa-check-circle mr-1"></i>
          Varsayılan Adres
        </div>
        <button 
          v-else
          @click="setDefaultAddress(address.id)"
          class="mt-4 text-sm text-blue-600 hover:text-blue-700"
        >
          Varsayılan Yap
        </button>
      </div>
    </div>

    <!-- Adres Yok -->
    <div 
      v-else
      class="rounded-lg border-2 border-dashed p-12 text-center"
    >
      <div class="mb-4 text-gray-400">
        <i class="fas fa-map-marker-alt text-6xl"></i>
      </div>
      <h3 class="mb-2 text-lg font-medium">Henüz Adres Eklenmemiş</h3>
      <p class="mb-6 text-gray-600">
        Teslimat için en az bir adres eklemelisiniz.
      </p>
      <button 
        @click="showAddressModal = true"
        class="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        <i class="fas fa-plus mr-2"></i>
        Yeni Adres Ekle
      </button>
    </div>

    <!-- Adres Modalı -->
    <Modal 
      v-model="showAddressModal"
      :title="editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'"
    >
      <AddressForm 
        :initial-data="editingAddress"
        @submit="handleAddressSubmit"
      />
    </Modal>

    <!-- Silme Onay Modalı -->
    <Modal v-model="showDeleteModal" title="Adresi Sil">
      <div class="space-y-4">
        <p>Bu adresi silmek istediğinizden emin misiniz?</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="showDeleteModal = false"
            class="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            İptal
          </button>
          <button 
            @click="deleteAddress"
            class="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Sil
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Modal from '../common/Modal.vue'
import AddressForm from './AddressForm.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'AddressList',
  components: {
    Modal,
    AddressForm,
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const loading = ref(true)
    const addresses = ref([])
    const showAddressModal = ref(false)
    const showDeleteModal = ref(false)
    const editingAddress = ref(null)
    const addressToDelete = ref(null)

    const loadAddresses = async () => {
      try {
        addresses.value = await store.dispatch('user/getAddresses')
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Adresler yüklenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const handleAddressSubmit = async (addressData) => {
      try {
        if (editingAddress.value) {
          await store.dispatch('user/updateAddress', {
            id: editingAddress.value.id,
            ...addressData
          })
          const index = addresses.value.findIndex(a => a.id === editingAddress.value.id)
          if (index !== -1) {
            addresses.value[index] = { ...addresses.value[index], ...addressData }
          }
        } else {
          const newAddress = await store.dispatch('user/addAddress', addressData)
          addresses.value.push(newAddress)
        }
        showAddressModal.value = false
        editingAddress.value = null
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const editAddress = (address) => {
      editingAddress.value = address
      showAddressModal.value = true
    }

    const confirmDelete = (address) => {
      addressToDelete.value = address
      showDeleteModal.value = true
    }

    const deleteAddress = async () => {
      try {
        await store.dispatch('user/deleteAddress', addressToDelete.value.id)
        addresses.value = addresses.value.filter(a => a.id !== addressToDelete.value.id)
        showDeleteModal.value = false
        addressToDelete.value = null
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Adres silinirken bir hata oluştu'
        })
      }
    }

    const setDefaultAddress = async (addressId) => {
      try {
        await store.dispatch('user/setDefaultAddress', addressId)
        addresses.value = addresses.value.map(address => ({
          ...address,
          isDefault: address.id === addressId
        }))
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Varsayılan adres ayarlanırken bir hata oluştu'
        })
      }
    }

    onMounted(loadAddresses)

    return {
      loading,
      addresses,
      showAddressModal,
      showDeleteModal,
      editingAddress,
      handleAddressSubmit,
      editAddress,
      confirmDelete,
      deleteAddress,
      setDefaultAddress
    }
  }
}
</script> 