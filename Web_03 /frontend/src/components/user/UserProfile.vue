<template>
  <div class="space-y-6">
    <!-- Profil Bilgileri -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Profil Bilgileri</h2>
      
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Ad</label>
            <input 
              v-model="form.firstName"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label class="block mb-1">Soyad</label>
            <input 
              v-model="form.lastName"
              type="text"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label class="block mb-1">E-posta</label>
          <input 
            v-model="form.email"
            type="email"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Telefon</label>
          <input 
            v-model="form.phone"
            type="tel"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <button 
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          :disabled="loading"
        >
          {{ loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
        </button>
      </form>
    </section>

    <!-- Şifre Değiştirme -->
    <section class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Şifre Değiştir</h2>
      
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

        <button 
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          :disabled="passwordLoading"
        >
          {{ passwordLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle' }}
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'UserProfile',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const passwordLoading = ref(false)

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    onMounted(async () => {
      const user = store.state.auth.user
      form.value = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      }
    })

    const updateProfile = async () => {
      loading.value = true
      try {
        await store.dispatch('user/updateProfile', form.value)
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Profil bilgileriniz güncellendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Profil güncellenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const updatePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Yeni şifreler eşleşmiyor'
        })
        return
      }

      passwordLoading.value = true
      try {
        await store.dispatch('user/updatePassword', {
          currentPassword: passwordForm.value.currentPassword,
          newPassword: passwordForm.value.newPassword
        })
        
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }

        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Şifreniz başarıyla güncellendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Şifre güncellenirken bir hata oluştu'
        })
      } finally {
        passwordLoading.value = false
      }
    }

    return {
      form,
      passwordForm,
      loading,
      passwordLoading,
      updateProfile,
      updatePassword
    }
  }
}
</script> 