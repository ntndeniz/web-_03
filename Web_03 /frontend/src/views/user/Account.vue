<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Hesabım</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Profil Bilgileri</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 mb-2">Ad Soyad</label>
            <input 
              type="text" 
              v-model="user.name"
              class="w-full px-4 py-2 border rounded"
            >
          </div>
          <div>
            <label class="block text-gray-700 mb-2">E-posta</label>
            <input 
              type="email" 
              v-model="user.email"
              class="w-full px-4 py-2 border rounded"
            >
          </div>
          <button 
            @click="updateProfile"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Güncelle
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Siparişlerim</h2>
        <div class="space-y-4">
          <div 
            v-for="order in orders" 
            :key="order.id"
            class="border-b pb-4"
          >
            <div class="flex justify-between">
              <span>Sipariş #{{ order.id }}</span>
              <span>{{ order.date }}</span>
            </div>
            <div class="text-gray-600">{{ order.status }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Adreslerim</h2>
        <div class="space-y-4">
          <div 
            v-for="address in addresses" 
            :key="address.id"
            class="border-b pb-4"
          >
            <div class="font-medium">{{ address.title }}</div>
            <div class="text-gray-600">{{ address.full }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountView',
  data() {
    return {
      user: {
        name: '',
        email: ''
      },
      orders: [],
      addresses: []
    }
  },
  async created() {
    try {
      await this.fetchUserData()
    } catch (error) {
      console.error('Kullanıcı bilgileri yüklenirken hata:', error)
    }
  },
  methods: {
    async fetchUserData() {
      // API'den kullanıcı bilgilerini al
      const userData = await this.$api.getUserData()
      this.user = userData.profile
      this.orders = userData.orders
      this.addresses = userData.addresses
    },
    async updateProfile() {
      try {
        await this.$api.updateProfile(this.user)
        this.$toast.success('Profil güncellendi')
      } catch (error) {
        this.$toast.error('Profil güncellenirken hata oluştu')
      }
    }
  }
}
</script> 