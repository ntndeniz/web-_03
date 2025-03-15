<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold">Hesap Ayarları</h2>

    <!-- Profil Ayarları -->
    <section class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium mb-4">Profil Ayarları</h3>
      
      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Ad Soyad -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Ad</label>
            <input
              v-model="profile.firstName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Soyad</label>
            <input
              v-model="profile.lastName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- E-posta -->
        <div>
          <label class="block text-sm font-medium text-gray-700">E-posta</label>
          <input
            v-model="profile.email"
            type="email"
            required
            disabled
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>

        <!-- Telefon -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Telefon</label>
          <input
            v-model="profile.phone"
            type="tel"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <!-- Kaydet Butonu -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="savingProfile"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="!savingProfile">Değişiklikleri Kaydet</span>
            <i v-else class="fas fa-circle-notch fa-spin"></i>
          </button>
        </div>
      </form>
    </section>

    <!-- Bildirim Ayarları -->
    <section class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium mb-4">Bildirim Ayarları</h3>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900">E-posta Bildirimleri</h4>
            <p class="text-sm text-gray-500">
              Kampanya ve indirimlerden haberdar olun
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="notifications.email"
            @click="toggleNotification('email')"
            :class="[
              notifications.email ? 'bg-blue-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            ]"
          >
            <span
              :class="[
                notifications.email ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900">SMS Bildirimleri</h4>
            <p class="text-sm text-gray-500">
              Sipariş durumu ve teslimat bilgileri
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="notifications.sms"
            @click="toggleNotification('sms')"
            :class="[
              notifications.sms ? 'bg-blue-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            ]"
          >
            <span
              :class="[
                notifications.sms ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-sm font-medium text-gray-900">Push Bildirimleri</h4>
            <p class="text-sm text-gray-500">
              Anlık bildirimler ve özel teklifler
            </p>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="notifications.push"
            @click="toggleNotification('push')"
            :class="[
              notifications.push ? 'bg-blue-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            ]"
          >
            <span
              :class="[
                notifications.push ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              ]"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- Hesap Silme -->
    <section class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-red-600 mb-4">Tehlikeli Bölge</h3>
      
      <div class="space-y-4">
        <p class="text-sm text-gray-500">
          Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
        </p>
        
        <button
          @click="confirmDelete"
          class="inline-flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Hesabımı Sil
        </button>
      </div>
    </section>

    <!-- Silme Onay Modalı -->
    <Modal v-model="showDeleteModal">
      <div class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Hesabınızı Silmek İstediğinize Emin misiniz?
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
        </p>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            İptal
          </button>
          <button
            @click="deleteAccount"
            :disabled="deleting"
            class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <span v-if="!deleting">Hesabı Sil</span>
            <i v-else class="fas fa-circle-notch fa-spin"></i>
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'Settings',

  components: {
    Modal
  },

  setup() {
    const store = useStore()
    const router = useRouter()

    const profile = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    })

    const notifications = reactive({
      email: true,
      sms: true,
      push: true
    })

    const savingProfile = ref(false)
    const showDeleteModal = ref(false)
    const deleting = ref(false)

    // Profil bilgilerini yükle
    const loadProfile = async () => {
      try {
        const userData = await store.dispatch('user/getProfile')
        Object.assign(profile, userData)
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Profil bilgileri yüklenirken bir hata oluştu'
        })
      }
    }

    // Profil bilgilerini kaydet
    const saveProfile = async () => {
      savingProfile.value = true

      try {
        await store.dispatch('user/updateProfile', profile)
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Profil bilgileri güncellendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Profil bilgileri güncellenirken bir hata oluştu'
        })
      } finally {
        savingProfile.value = false
      }
    }

    // Bildirim ayarlarını değiştir
    const toggleNotification = async (type) => {
      notifications[type] = !notifications[type]

      try {
        await store.dispatch('user/updateNotificationSettings', notifications)
      } catch (error) {
        notifications[type] = !notifications[type] // Hata durumunda geri al
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Bildirim ayarları güncellenirken bir hata oluştu'
        })
      }
    }

    // Hesap silme modalını göster
    const confirmDelete = () => {
      showDeleteModal.value = true
    }

    // Hesabı sil
    const deleteAccount = async () => {
      deleting.value = true

      try {
        await store.dispatch('user/deleteAccount')
        await store.dispatch('auth/logout')
        router.push('/')
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Hesap silinirken bir hata oluştu'
        })
        showDeleteModal.value = false
      } finally {
        deleting.value = false
      }
    }

    // Sayfa yüklendiğinde profil bilgilerini getir
    loadProfile()

    return {
      profile,
      notifications,
      savingProfile,
      showDeleteModal,
      deleting,
      saveProfile,
      toggleNotification,
      confirmDelete,
      deleteAccount
    }
  }
}
</script> 