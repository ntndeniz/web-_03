<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">Şifre Değiştir</h2>
    
    <form @submit.prevent="updatePassword" class="max-w-md space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
        <input 
          v-model="passwords.current"
          type="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Yeni Şifre</label>
        <input 
          v-model="passwords.new"
          type="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
        <input 
          v-model="passwords.confirm"
          type="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
      </div>

      <div class="flex justify-end">
        <button 
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Şifreyi Güncelle
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'PasswordUpdate',
  data() {
    return {
      passwords: {
        current: '',
        new: '',
        confirm: ''
      }
    }
  },
  methods: {
    updatePassword() {
      if (this.passwords.new !== this.passwords.confirm) {
        alert('Yeni şifreler eşleşmiyor!')
        return
      }
      
      // Şifre güncelleme API çağrısı burada yapılacak
      console.log('Şifre güncelleme isteği:', this.passwords)
      
      // Başarılı güncelleme sonrası
      this.passwords = {
        current: '',
        new: '',
        confirm: ''
      }
    }
  }
}
</script> 