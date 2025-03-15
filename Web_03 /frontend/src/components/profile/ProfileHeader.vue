<template>
  <div class="profile-header bg-white shadow">
    <div class="px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center space-x-5">
        <!-- Profil Fotoğrafı -->
        <div class="flex-shrink-0">
          <div class="relative">
            <img
              :src="profileImage || defaultAvatar"
              :alt="user.fullName"
              class="h-16 w-16 rounded-full object-cover"
            />
            <span
              class="absolute inset-0 rounded-full shadow-inner"
              aria-hidden="true"
            />
            <button
              @click="triggerImageUpload"
              class="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 shadow-sm"
            >
              <camera-icon class="h-4 w-4 text-gray-500" />
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            />
          </div>
        </div>

        <!-- Kullanıcı Bilgileri -->
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold text-gray-900 truncate">
            {{ user.fullName }}
          </h1>
          <div class="mt-1 flex items-center space-x-2 text-sm text-gray-500">
            <mail-icon class="h-4 w-4" />
            <span>{{ user.email }}</span>
            <badge
              v-if="user.emailVerified"
              variant="success"
              class="ml-2"
            >
              Doğrulanmış
            </badge>
          </div>
          <div class="mt-1 flex items-center space-x-2 text-sm text-gray-500">
            <phone-icon class="h-4 w-4" />
            <span>{{ user.phone }}</span>
            <badge
              v-if="user.phoneVerified"
              variant="success"
              class="ml-2"
            >
              Doğrulanmış
            </badge>
          </div>
        </div>

        <!-- Sağ Taraf Butonları -->
        <div class="flex-shrink-0 flex space-x-4">
          <button
            type="button"
            @click="$router.push('/profile/settings')"
            class="btn-outline"
          >
            <cog-icon class="h-5 w-5 mr-2" />
            Ayarlar
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="btn-danger"
          >
            <logout-icon class="h-5 w-5 mr-2" />
            Çıkış Yap
          </button>
        </div>
      </div>

      <!-- Sekmeler -->
      <nav class="mt-6">
        <div class="border-b border-gray-200">
          <div class="-mb-px flex space-x-8">
            <router-link
              v-for="tab in tabs"
              :key="tab.name"
              :to="tab.route"
              class="tab-link"
              :class="[
                isActiveTab(tab.route)
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-2" />
              {{ tab.name }}
            </router-link>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'
import {
  CameraIcon,
  CogIcon,
  LogoutIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  LocationMarkerIcon,
  ShoppingBagIcon
} from '@heroicons/vue/outline'
import Badge from '@/components/common/Badge.vue'
import defaultAvatar from '@/assets/images/default-avatar.png'

export default {
  name: 'ProfileHeader',

  components: {
    Badge,
    CameraIcon,
    CogIcon,
    LogoutIcon,
    MailIcon,
    PhoneIcon
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    const fileInput = ref(null)

    const user = computed(() => store.state.auth.user)
    const profileImage = computed(() => store.state.auth.user?.profileImage)

    const tabs = [
      { name: 'Profil', route: '/profile', icon: UserIcon },
      { name: 'Adreslerim', route: '/profile/addresses', icon: LocationMarkerIcon },
      { name: 'Siparişlerim', route: '/profile/orders', icon: ShoppingBagIcon }
    ]

    const isActiveTab = (path) => {
      return route.path === path
    }

    const triggerImageUpload = () => {
      fileInput.value.click()
    }

    const handleImageChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        toast.error('Lütfen geçerli bir resim dosyası seçin')
        return
      }

      try {
        await store.dispatch('auth/updateProfileImage', file)
        toast.success('Profil fotoğrafı güncellendi')
      } catch (error) {
        toast.error('Profil fotoğrafı güncellenirken bir hata oluştu')
      }
    }

    const handleLogout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/auth/login')
      } catch (error) {
        toast.error('Çıkış yapılırken bir hata oluştu')
      }
    }

    return {
      user,
      profileImage,
      defaultAvatar,
      fileInput,
      tabs,
      isActiveTab,
      triggerImageUpload,
      handleImageChange,
      handleLogout
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-link {
  @apply border-b-2 py-4 px-1 text-sm font-medium flex items-center;
}

.btn-outline {
  @apply inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm 
         text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-danger {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm 
         text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-red-500;
}
</style> 