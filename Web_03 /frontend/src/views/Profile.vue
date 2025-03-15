<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sol Sidebar - Menü -->
      <div class="lg:w-1/4">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Profil Özeti -->
          <div class="p-6 bg-gray-50 border-b">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {{ userInitials }}
              </div>
              <div>
                <h2 class="font-bold">{{ user.name }}</h2>
                <p class="text-sm text-gray-600">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <!-- Menü -->
          <nav class="p-2">
            <button 
              v-for="item in menuItems" 
              :key="item.id"
              @click="activeTab = item.id"
              class="w-full text-left px-4 py-3 rounded-lg transition-colors"
              :class="activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'"
            >
              <i :class="item.icon" class="mr-3"></i>
              {{ item.title }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Sağ Taraf - İçerik -->
      <div class="lg:w-3/4">
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- Siparişlerim -->
          <div v-if="activeTab === 'orders'" class="space-y-6">
            <h2 class="text-2xl font-bold mb-6">Siparişlerim</h2>
            
            <div v-if="orders.length === 0" class="text-center py-12">
              <i class="fas fa-shopping-bag text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-lg font-medium text-gray-900">Henüz siparişiniz yok</h3>
              <p class="text-gray-600 mt-2">Alışverişe başlamak için ürünleri inceleyin.</p>
              <router-link 
                to="/products"
                class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Alışverişe Başla
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div v-for="order in orders" :key="order.id" 
                   class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <p class="font-medium">Sipariş #{{ order.orderNumber }}</p>
                    <p class="text-sm text-gray-600">{{ order.date }}</p>
                  </div>
                  <span :class="getOrderStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <div class="space-y-3">
                  <div v-for="item in order.items" :key="item.id"
                       class="flex items-center space-x-4">
                    <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                      <h4 class="font-medium">{{ item.name }}</h4>
                      <p class="text-sm text-gray-600">{{ item.quantity }} adet x {{ item.price }}₺</p>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t flex justify-between items-center">
                  <span class="font-bold">Toplam: {{ order.total }}₺</span>
                  <button 
                    class="px-4 py-2 border rounded hover:bg-gray-50"
                    @click="showOrderDetails(order.id)"
                  >
                    Detayları Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Adreslerim -->
          <div v-if="activeTab === 'addresses'" class="space-y-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold">Adreslerim</h2>
              <button 
                @click="showAddressForm = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Yeni Adres Ekle
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="address in addresses" :key="address.id"
                   class="border rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-medium">{{ address.title }}</h3>
                  <div class="flex space-x-2">
                    <button 
                      @click="editAddress(address)"
                      class="text-blue-600 hover:text-blue-700"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      @click="deleteAddress(address.id)"
                      class="text-red-600 hover:text-red-700"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p class="text-gray-600">{{ address.fullAddress }}</p>
                <p class="text-gray-600">{{ address.city }}/{{ address.district }}</p>
              </div>
            </div>
          </div>

          <!-- Favorilerim -->
          <div v-if="activeTab === 'favorites'" class="space-y-6">
            <h2 class="text-2xl font-bold mb-6">Favorilerim</h2>

            <div v-if="favorites.length === 0" class="text-center py-12">
              <i class="fas fa-heart text-4xl text-gray-400 mb-4"></i>
              <h3 class="text-lg font-medium text-gray-900">Favori ürününüz yok</h3>
              <p class="text-gray-600 mt-2">Beğendiğiniz ürünleri favorilere ekleyin.</p>
              <router-link 
                to="/products"
                class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Ürünleri İncele
              </router-link>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductCard 
                v-for="product in favorites" 
                :key="product.id"
                :product="product"
              />
            </div>
          </div>

          <!-- Hesap Ayarları -->
          <div v-if="activeTab === 'settings'" class="space-y-6">
            <h2 class="text-2xl font-bold mb-6">Hesap Ayarları</h2>

            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Kişisel Bilgiler -->
              <div class="space-y-4">
                <h3 class="font-medium">Kişisel Bilgiler</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
                    <input 
                      v-model="profileForm.name"
                      type="text"
                      class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">E-posta</label>
                    <input 
                      v-model="profileForm.email"
                      type="email"
                      class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                    >
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Telefon</label>
                    <input 
                      v-model="profileForm.phone"
                      type="tel"
                      class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                    >
                  </div>
                </div>
              </div>

              <!-- Şifre Değiştirme -->
              <div class="space-y-4 pt-6 border-t">
                <h3 class="font-medium">Şifre Değiştir</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
                    <input 
                      v-model="profileForm.currentPassword"
                      type="password"
                      class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Yeni Şifre</label>
                    <input 
                      v-model="profileForm.newPassword"
                      type="password"
                      class="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
                    >
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button 
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import ProductCard from '@/components/product/ProductCard.vue'

export default {
  name: 'ProfilePage',
  components: {
    ProductCard
  },
  setup() {
    const store = useStore()
    const activeTab = ref('orders')
    const showAddressForm = ref(false)

    const user = computed(() => store.state.user)
    const userInitials = computed(() => {
      if (!user.value.name) return ''
      return user.value.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    })

    const menuItems = [
      { id: 'orders', title: 'Siparişlerim', icon: 'fas fa-shopping-bag' },
      { id: 'addresses', title: 'Adreslerim', icon: 'fas fa-map-marker-alt' },
      { id: 'favorites', title: 'Favorilerim', icon: 'fas fa-heart' },
      { id: 'settings', title: 'Hesap Ayarları', icon: 'fas fa-cog' }
    ]

    // Örnek veriler
    const orders = ref([])
    const addresses = ref([])
    const favorites = ref([])

    const profileForm = ref({
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      currentPassword: '',
      newPassword: ''
    })

    const getOrderStatusClass = (status) => {
      const classes = {
        'Hazırlanıyor': 'text-yellow-600',
        'Kargoya Verildi': 'text-blue-600',
        'Teslim Edildi': 'text-green-600',
        'İptal Edildi': 'text-red-600'
      }
      return classes[status] || 'text-gray-600'
    }

    const showOrderDetails = (orderId) => {
      // Sipariş detay modalını göster
      console.log('Showing order details for:', orderId) // Geçici olarak console.log ekleyelim
    }

    const editAddress = (address) => {
      // Adres düzenleme modalını göster
      console.log('Editing address:', address) // Geçici olarak console.log ekleyelim
    }

    const deleteAddress = async (addressId) => {
      if (confirm('Bu adresi silmek istediğinize emin misiniz?')) {
        try {
          await store.dispatch('deleteAddress', addressId)
          // Başarılı mesajı göster
        } catch (error) {
          console.error('Error deleting address:', error)
          // Hata mesajı göster
        }
      }
    }

    const updateProfile = async () => {
      try {
        await store.dispatch('updateProfile', profileForm.value)
        // Başarılı mesajı göster
      } catch (error) {
        console.error('Error updating profile:', error)
        // Hata mesajı göster
      }
    }

    return {
      activeTab,
      showAddressForm,
      user,
      userInitials,
      menuItems,
      orders,
      addresses,
      favorites,
      profileForm,
      getOrderStatusClass,
      showOrderDetails,
      editAddress,
      deleteAddress,
      updateProfile
    }
  }
}
</script> 