<template>
  <div class="address-book">
    <div class="bg-white shadow sm:rounded-lg">
      <!-- Başlık ve Ekle Butonu -->
      <div class="px-4 py-5 sm:p-6 flex justify-between items-center">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Adres Defteri
        </h3>
        <button
          type="button"
          @click="showAddressModal = true"
          class="btn-primary"
        >
          <plus-icon class="h-5 w-5 mr-2" />
          Yeni Adres Ekle
        </button>
      </div>

      <!-- Adres Listesi -->
      <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div v-if="addresses.length" class="space-y-4">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-medium text-gray-900">
                  {{ address.title }}
                  <badge
                    v-if="address.isDefault"
                    variant="success"
                    class="ml-2"
                  >
                    Varsayılan
                  </badge>
                </h4>
                <p class="mt-1 text-sm text-gray-600">
                  {{ address.fullName }}
                </p>
                <p class="mt-1 text-sm text-gray-600">
                  {{ address.phone }}
                </p>
                <p class="mt-1 text-sm text-gray-600">
                  {{ formatAddress(address) }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="editAddress(address)"
                  class="btn-icon"
                >
                  <pencil-icon class="h-5 w-5 text-gray-500" />
                </button>
                <button
                  type="button"
                  @click="deleteAddress(address)"
                  class="btn-icon text-red-500"
                >
                  <trash-icon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <div v-if="!address.isDefault" class="mt-4">
              <button
                type="button"
                @click="setDefaultAddress(address)"
                class="text-sm text-primary-600 hover:text-primary-500"
              >
                Varsayılan Yap
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <location-marker-icon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Adres Bulunamadı</h3>
          <p class="mt-1 text-sm text-gray-500">
            Henüz kayıtlı adresiniz bulunmamaktadır.
          </p>
        </div>
      </div>
    </div>

    <!-- Adres Modal -->
    <modal
      v-if="showAddressModal"
      :title="editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle'"
      @close="closeAddressModal"
    >
      <address-form
        :address="editingAddress"
        @submit="handleAddressSubmit"
        @cancel="closeAddressModal"
      />
    </modal>

    <!-- Silme Onay Modal -->
    <confirm-modal
      v-if="showDeleteModal"
      title="Adresi Sil"
      message="Bu adresi silmek istediğinizden emin misiniz?"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from '@/composables/useToast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  LocationMarkerIcon
} from '@heroicons/vue/outline'
import Modal from '@/components/common/Modal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import AddressForm from '@/components/profile/AddressForm.vue'
import Badge from '@/components/common/Badge.vue'

export default {
  name: 'AddressBook',

  components: {
    Modal,
    ConfirmModal,
    AddressForm,
    Badge,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    LocationMarkerIcon
  },

  setup() {
    const store = useStore()
    const toast = useToast()

    const addresses = computed(() => store.state.address.addresses)
    const showAddressModal = ref(false)
    const showDeleteModal = ref(false)
    const editingAddress = ref(null)
    const addressToDelete = ref(null)

    const formatAddress = (address) => {
      return `${address.street}, ${address.district}/${address.city} - ${address.postalCode}`
    }

    const editAddress = (address) => {
      editingAddress.value = address
      showAddressModal.value = true
    }

    const deleteAddress = (address) => {
      addressToDelete.value = address
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      try {
        await store.dispatch('address/deleteAddress', addressToDelete.value.id)
        toast.success('Adres başarıyla silindi')
      } catch (error) {
        toast.error('Adres silinirken bir hata oluştu')
      } finally {
        showDeleteModal.value = false
        addressToDelete.value = null
      }
    }

    const setDefaultAddress = async (address) => {
      try {
        await store.dispatch('address/setDefaultAddress', address.id)
        toast.success('Varsayılan adres güncellendi')
      } catch (error) {
        toast.error('Varsayılan adres güncellenirken bir hata oluştu')
      }
    }

    const handleAddressSubmit = async (addressData) => {
      try {
        if (editingAddress.value) {
          await store.dispatch('address/updateAddress', {
            id: editingAddress.value.id,
            ...addressData
          })
          toast.success('Adres başarıyla güncellendi')
        } else {
          await store.dispatch('address/addAddress', addressData)
          toast.success('Adres başarıyla eklendi')
        }
        closeAddressModal()
      } catch (error) {
        toast.error(error.message)
      }
    }

    const closeAddressModal = () => {
      showAddressModal.value = false
      editingAddress.value = null
    }

    return {
      addresses,
      showAddressModal,
      showDeleteModal,
      editingAddress,
      formatAddress,
      editAddress,
      deleteAddress,
      confirmDelete,
      setDefaultAddress,
      handleAddressSubmit,
      closeAddressModal
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm 
         text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-icon {
  @apply p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 
         focus:ring-primary-500;
}
</style> 