<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <h2 class="text-xl font-semibold">Hesap Ayarları</h2>
    </div>

    <div class="p-6">
      <!-- Profil Bilgileri -->
      <section class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Profil Bilgileri</h3>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Ad</label>
              <input 
                v-model="profile.firstName"
                type="text"
                class="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label class="block mb-1">Soyad</label>
              <input 
                v-model="profile.lastName"
                type="text"
                class="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label class="block mb-1">E-posta</label>
            <input 
              v-model="profile.email"
              type="email"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label class="block mb-1">Telefon</label>
            <input 
              v-model="profile.phone"
              type="tel"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div class="flex justify-end">
            <button 
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              :disabled="isProfileUpdating"
            >
              {{ isProfileUpdating ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Şifre Değiştirme -->
      <section class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Şifre Değiştir</h3>
        <form @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label class="block mb-1">Mevcut Şifre</label>
            <input 
              v-model="passwordForm.currentPassword"
              type="password"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label class="block mb-1">Yeni Şifre</label>
            <input 
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label class="block mb-1">Yeni Şifre (Tekrar)</label>
            <input 
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div class="flex justify-end">
            <button 
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              :disabled="isPasswordUpdating || !isPasswordFormValid"
            >
              {{ isPasswordUpdating ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}
            </button>
          </div>
        </form>
      </section>

      <!-- Bildirim Ayarları -->
      <section class="mb-8">
        <h3 class="text-lg font-semibold mb-4">Bildirim Ayarları</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">E-posta Bildirimleri</div>
              <div class="text-sm text-gray-600">Sipariş durumu ve kampanyalar hakkında e-posta al</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                v-model="notifications.email"
                class="sr-only peer"
                @change="updateNotificationSettings"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">SMS Bildirimleri</div>
              <div class="text-sm text-gray-600">Özel teklifler ve kampanyalar hakkında SMS al</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                v-model="notifications.sms"
                class="sr-only peer"
                @change="updateNotificationSettings"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium">Mobil Bildirimler</div>
              <div class="text-sm text-gray-600">Uygulama bildirimleri al</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                v-model="notifications.push"
                class="sr-only peer"
                @change="updateNotificationSettings"
              />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </section>

      <!-- Hesap Silme -->
      <section>
        <h3 class="text-lg font-semibold text-red-600 mb-4">Tehlikeli Bölge</h3>
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 class="font-medium mb-2">Hesabı Sil</h4>
          <p class="text-sm text-gray-600 mb-4">
            Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
          </p>
          <button 
            @click="showDeleteAccountModal = true"
            class="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            Hesabımı Sil
          </button>
        </div>
      </section>
    </div>

    <!-- Hesap Silme Modal -->
    <Modal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false">
      <template #title>
        <div class="text-red-600">Hesabı Sil</div>
      </template>
      <template #content>
        <div class="mb-6">
          <p class="mb-4">
            Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve:
          </p>
          <ul class="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Tüm siparişleriniz ve geçmişiniz silinecek</li>
            <li>Kayıtlı adresleriniz silinecek</li>
            <li>Favori ürünleriniz silinecek</li>
            <li>Kuponlarınız iptal edilecek</li>
          </ul>
        </div>
        <div class="flex justify-end gap-4">
          <button 
            @click="showDeleteAccountModal = false"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            İptal
          </button>
          <button 
            @click="deleteAccount"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            :disabled="isDeletingAccount"
          >
            {{ isDeletingAccount ? 'Siliniyor...' : 'Hesabı Sil' }}
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'Settings',
  components: {
    Modal
  },
  data() {
    return {
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      },
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      notifications: {
        email: true,
        sms: true,
        push: true
      },
      isProfileUpdating: false,
      isPasswordUpdating: false,
      isDeletingAccount: false,
      showDeleteAccountModal: false
    }
  },
  computed: {
    isPasswordFormValid() {
      return this.passwordForm.newPassword === this.passwordForm.confirmPassword &&
        this.passwordForm.newPassword.length >= 6
    }
  },
  methods: {
    async updateProfile() {
      try {
        this.isProfileUpdating = true
        await this.$store.dispatch('user/updateProfile', this.profile)
        this.$toast.success('Profil bilgileri güncellendi')
      } catch (error) {
        this.$toast.error('Profil güncellenirken bir hata oluştu')
      } finally {
        this.isProfileUpdating = false
      }
    },
    async updatePassword() {
      if (!this.isPasswordFormValid) return

      try {
        this.isPasswordUpdating = true
        await this.$store.dispatch('user/updatePassword', {
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        })
        this.$toast.success('Şifreniz başarıyla güncellendi')
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        this.$toast.error('Şifre güncellenirken bir hata oluştu')
      } finally {
        this.isPasswordUpdating = false
      }
    },
    async updateNotificationSettings() {
      try {
        await this.$store.dispatch('user/updateNotificationSettings', this.notifications)
        this.$toast.success('Bildirim ayarları güncellendi')
      } catch (error) {
        this.$toast.error('Ayarlar güncellenirken bir hata oluştu')
      }
    },
    async deleteAccount() {
      try {
        this.isDeletingAccount = true
        await this.$store.dispatch('user/deleteAccount')
        this.$router.push('/')
        this.$store.dispatch('auth/logout')
        this.$toast.success('Hesabınız başarıyla silindi')
      } catch (error) {
        this.$toast.error('Hesap silinirken bir hata oluştu')
      } finally {
        this.isDeletingAccount = false
        this.showDeleteAccountModal = false
      }
    }
  },
  created() {
    // Mevcut kullanıcı bilgilerini yükle
    const user = this.$store.state.auth.user
    this.profile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone
    }
    this.notifications = { ...user.notificationSettings }
  }
}
</script> 