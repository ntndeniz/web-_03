<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Adres Defterim</h2>
      <button
        @click="showAddAddress = true"
        class="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <i class="fas fa-plus"></i>
        <span>Yeni Adres Ekle</span>
      </button>
    </div>

    <!-- Adres Listesi -->
    <div v-if="addresses.length" class="grid gap-6 md:grid-cols-2">
      <div 
        v-for="address in addresses"
        :key="address.id"
        class="relative rounded-lg border p-4"
      >
        <!-- Adres Başlığı ve Tip -->
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <h3 class="font-medium">{{ address.title }}</h3>
            <span 
              class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600"
            >
              {{ address.type === 'home' ? 'Ev' : 'İş' }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button 
              @click="editAddress(address)"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button 
              @click="deleteAddress(address.id)"
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>

        <!-- Adres Detayları -->
        <div class="space-y-2 text-sm text-gray-600">
          <p>{{ address.fullName }}</p>
          <p>{{ address.phone }}</p>
          <p>
            {{ address.street }}<br>
            {{ address.district }} / {{ address.city }}<br>
            {{ address.postalCode }}
          </p>
        </div>

        <!-- Varsayılan Adres -->
        <div class="mt-4 flex items-center justify-between border-t pt-4">
          <div class="flex items-center space-x-2">
            <input
              :checked="address.isDefault"
              @change="setDefaultAddress(address.id)"
              type="radio"
              name="default-address"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-600">
              Varsayılan teslimat adresi olarak kullan
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-map-marker-alt text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz kayıtlı adresiniz bulunmuyor.</p>
      <button
        @click="showAddAddress = true"
        class="mt-4 text-blue-600 hover:text-blue-500"
      >
        Yeni Adres Ekle
      </button>
    </div>

    <!-- Adres Ekleme/Düzenleme Modal -->
    <Modal v-model="showAddAddress">
      <template #title>
        {{ editingAddress ? 'Adresi Düzenle' : 'Yeni Adres Ekle' }}
      </template>
      <form @submit.prevent="saveAddress" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Adres Başlığı
          </label>
          <input 
            v-model="addressForm.title"
            type="text"
            required
            placeholder="Örn: Ev, İş"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input 
              v-model="addressForm.fullName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input 
              v-model="addressForm.phone"
              type="tel"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Adres
          </label>
          <textarea 
            v-model="addressForm.street"
            required
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              İlçe
            </label>
            <input 
              v-model="addressForm.district"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Şehir
            </label>
            <input 
              v-model="addressForm.city"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Posta Kodu
          </label>
          <input 
            v-model="addressForm.postalCode"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input
              v-model="addressForm.type"
              type="radio"
              value="home"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-600">Ev</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="addressForm.type"
              type="radio"
              value="work"
              class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-600">İş</span>
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="addressForm.isDefault"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label class="ml-2 text-sm text-gray-600">
            Bu adresi varsayılan teslimat adresi olarak kaydet
          </label>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelEdit"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="!loading">{{ editingAddress ? 'Güncelle' : 'Kaydet' }}</span>
            <LoadingSpinner v-else size="sm" color="white" />
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Modal from '../common/Modal.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'AddressBook',
  components: {
    Modal,
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const showAddAddress = ref(false)
    const addresses = ref([])
    const editingAddress = ref(null)
    const addressForm = ref({
      title: '',
      fullName: '',
      phone: '',
      street: '',
      district: '',
      city: '',
      postalCode: '',
      type: 'home',
      isDefault: false
    })

    const resetForm = () => {
      addressForm.value = {
        title: '',
        fullName: '',
        phone: '',
        street: '',
        district: '',
        city: '',
        postalCode: '',
        type: 'home',
        isDefault: false
      }
      editingAddress.value = null
    }

    const editAddress = (address) => {
      editingAddress.value = address.id
      addressForm.value = { ...address }
      showAddAddress.value = true
    }

    const cancelEdit = () => {
      resetForm()
      showAddAddress.value = false
    }

    const saveAddress = async () => {
      loading.value = true
      try {
        if (editingAddress.value) {
          await store.dispatch('address/updateAddress', {
            id: editingAddress.value,
            ...addressForm.value
          })
        } else {
          await store.dispatch('address/addAddress', addressForm.value)
        }
        
        await loadAddresses()
        showAddAddress.value = false
        resetForm()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: `Adres başarıyla ${editingAddress.value ? 'güncellendi' : 'eklendi'}`
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const deleteAddress = async (addressId) => {
      if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return

      try {
        await store.dispatch('address/deleteAddress', addressId)
        await loadAddresses()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Adres başarıyla silindi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Adres silinirken bir hata oluştu'
        })
      }
    }

    const setDefaultAddress = async (addressId) => {
      try {
        await store.dispatch('address/setDefaultAddress', addressId)
        await loadAddresses()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Varsayılan adres güncellendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const loadAddresses = async () => {
      try {
        const response = await store.dispatch('address/getAddresses')
        addresses.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Adresler yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadAddresses()
    })

    return {
      loading,
      showAddAddress,
      addresses,
      editingAddress,
      addressForm,
      editAddress,
      cancelEdit,
      saveAddress,
      deleteAddress,
      setDefaultAddress
    }
  }
}
</script> 