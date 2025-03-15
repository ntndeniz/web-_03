<template>
  <div class="profile-settings">
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Profil Ayarları
        </h3>

        <form @submit.prevent="handleSubmit" class="mt-6 space-y-6">
          <!-- Kişisel Bilgiler -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                Ad
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                class="input-field mt-1"
                :class="{ 'error': errors.firstName }"
              />
              <p v-if="errors.firstName" class="error-message">{{ errors.firstName }}</p>
            </div>

            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Soyad
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="input-field mt-1"
                :class="{ 'error': errors.lastName }"
              />
              <p v-if="errors.lastName" class="error-message">{{ errors.lastName }}</p>
            </div>
          </div>

          <!-- İletişim Bilgileri -->
          <div class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="input-field flex-1"
                  :class="{ 'error': errors.email }"
                  :disabled="user.emailVerified"
                />
                <button
                  v-if="!user.emailVerified"
                  type="button"
                  @click="handleVerifyEmail"
                  class="btn-secondary ml-3"
                >
                  Doğrula
                </button>
              </div>
              <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="input-field flex-1"
                  :class="{ 'error': errors.phone }"
                  :disabled="user.phoneVerified"
                />
                <button
                  v-if="!user.phoneVerified"
                  type="button"
                  @click="handleVerifyPhone"
                  class="btn-secondary ml-3"
                >
                  Doğrula
                </button>
              </div>
              <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Şifre Değiştirme -->
          <div class="space-y-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">
                Mevcut Şifre
              </label>
              <div class="mt-1 relative">
                <input
                  id="currentPassword"
                  v-model="form.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="input-field"
                  :class="{ 'error': errors.currentPassword }"
                />
                <button
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <eye-icon v-if="!showCurrentPassword" class="h-5 w-5 text-gray-400" />
                  <eye-off-icon v-else class="h-5 w-5 text-gray-400" />
                </button>
                <p v-if="errors.currentPassword" class="error-message">
                  {{ errors.currentPassword }}
                </p>
              </div>
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">
                Yeni Şifre
              </label>
              <div class="mt-1 relative">
                <input
                  id="newPassword"
                  v-model="form.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="input-field"
                  :class="{ 'error': errors.newPassword }"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <eye-icon v-if="!showNewPassword" class="h-5 w-5 text-gray-400" />
                  <eye-off-icon v-else class="h-5 w-5 text-gray-400" />
                </button>
                <p v-if="errors.newPassword" class="error-message">
                  {{ errors.newPassword }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bildirim Tercihleri -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-gray-900">Bildirim Tercihleri</h4>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="emailNotifications"
                    v-model="form.notifications.email"
                    type="checkbox"
                    class="checkbox"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="emailNotifications" class="font-medium text-gray-700">
                    E-posta Bildirimleri
                  </label>
                  <p class="text-gray-500">
                    Sipariş durumu ve kampanyalar hakkında e-posta al
                  </p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="smsNotifications"
                    v-model="form.notifications.sms"
                    type="checkbox"
                    class="checkbox"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="smsNotifications" class="font-medium text-gray-700">
                    SMS Bildirimleri
                  </label>
                  <p class="text-gray-500">
                    Sipariş durumu ve kampanyalar hakkında SMS al
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Kaydet Butonu -->
          <div class="flex justify-end">
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
            >
              <spinner v-if="loading" class="h-5 w-5" />
              <span v-else>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { validateEmail, validatePhone, validatePassword } from '@/utils/validators'
import { EyeIcon, EyeOffIcon } from '@heroicons/vue/outline'
import Spinner from '@/components/common/Spinner.vue'

export default {
  name: 'ProfileSettings',

  components: {
    EyeIcon,
    EyeOffIcon,
    Spinner
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const toast = useToast()

    const loading = ref(false)
    const showCurrentPassword = ref(false)
    const showNewPassword = ref(false)
    const errors = reactive({})

    const user = computed(() => store.state.auth.user)

    const form = reactive({
      firstName: user.value?.firstName || '',
      lastName: user.value?.lastName || '',
      email: user.value?.email || '',
      phone: user.value?.phone || '',
      currentPassword: '',
      newPassword: '',
      notifications: {
        email: user.value?.notifications?.email ?? true,
        sms: user.value?.notifications?.sms ?? true
      }
    })

    const validateForm = () => {
      errors.firstName = !form.firstName.trim() ? 'Ad alanı zorunludur' : ''
      errors.lastName = !form.lastName.trim() ? 'Soyad alanı zorunludur' : ''
      errors.email = validateEmail(form.email)
      errors.phone = validatePhone(form.phone)

      if (form.newPassword) {
        errors.currentPassword = !form.currentPassword ? 'Mevcut şifre gereklidir' : ''
        errors.newPassword = validatePassword(form.newPassword)
      }

      return !Object.values(errors).some(error => error)
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await store.dispatch('auth/updateProfile', form)
        toast.success('Profil bilgileri başarıyla güncellendi')
      } catch (error) {
        toast.error(error.message)
      } finally {
        loading.value = false
      }
    }

    const handleVerifyEmail = () => {
      router.push('/auth/verify-email')
    }

    const handleVerifyPhone = () => {
      router.push('/auth/verify-phone')
    }

    return {
      user,
      form,
      loading,
      errors,
      showCurrentPassword,
      showNewPassword,
      handleSubmit,
      handleVerifyEmail,
      handleVerifyPhone
    }
  }
}
</script>

<style lang="scss" scoped>
.input-field {
  @apply appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
         placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  
  &.error {
    @apply border-red-500;
  }
}

.error-message {
  @apply mt-2 text-sm text-red-600;
}

.checkbox {
  @apply h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded;
}

.btn-primary {
  @apply inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm 
         text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 
         disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm 
         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}
</style> 