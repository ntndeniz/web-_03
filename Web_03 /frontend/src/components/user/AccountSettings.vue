<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Hesap Ayarları</h2>
    
    <form @submit.prevent="saveSettings" class="max-w-md space-y-6">
      <!-- Profil Fotoğrafı -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Profil Fotoğrafı</label>
        <div class="flex items-center space-x-4">
          <img 
            :src="formData.avatar || '/images/default-avatar.png'" 
            alt="Profil Fotoğrafı"
            class="w-20 h-20 rounded-full object-cover"
          >
          <input 
            type="file" 
            @change="handleAvatarChange"
            accept="image/*"
            class="hidden"
            ref="avatarInput"
          >
          <button 
            type="button"
            @click="$refs.avatarInput.click()"
            class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            Fotoğraf Değiştir
          </button>
        </div>
      </div>

      <!-- Kişisel Bilgiler -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
        <input 
          v-model="formData.name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">E-posta</label>
        <input 
          v-model="formData.email"
          type="email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Telefon</label>
        <input 
          v-model="formData.phone"
          type="tel"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
      </div>

      <!-- Bildirim Tercihleri -->
      <div>
        <h3 class="font-medium text-gray-900 mb-2">Bildirim Tercihleri</h3>
        <div class="space-y-2">
          <label class="flex items-center">
            <input 
              v-model="formData.notifications.email"
              type="checkbox"
              class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            >
            <span class="ml-2">E-posta bildirimleri</span>
          </label>
          <label class="flex items-center">
            <input 
              v-model="formData.notifications.sms"
              type="checkbox"
              class="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            >
            <span class="ml-2">SMS bildirimleri</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4">
        <button 
          type="button"
          @click="resetForm"
          class="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
        >
          Vazgeç
        </button>
        <button 
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AccountSettings',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone || '',
        avatar: this.user.avatar,
        notifications: {
          email: true,
          sms: false
        }
      }
    }
  },
  methods: {
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formData.avatar = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    saveSettings() {
      // API'ye kaydetme işlemi burada yapılacak
      console.log('Ayarlar kaydediliyor:', this.formData)
    },
    resetForm() {
      this.formData = {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone || '',
        avatar: this.user.avatar,
        notifications: {
          email: true,
          sms: false
        }
      }
    }
  }
}
</script> 