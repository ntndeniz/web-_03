<template>
  <div class="space-y-6">
    <!-- Temel Bilgiler -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Temel Bilgiler</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-600">Ad Soyad</div>
            <div class="font-medium">{{ customer.fullName }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">E-posta</div>
            <div class="font-medium">{{ customer.email }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Telefon</div>
            <div class="font-medium">{{ customer.phone }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Üyelik Tarihi</div>
            <div class="font-medium">{{ formatDate(customer.createdAt) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- İstatistikler -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Alışveriş İstatistikleri</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 rounded-lg p-4">
          <div class="text-sm text-blue-600 mb-1">Toplam Sipariş</div>
          <div class="text-2xl font-bold text-blue-700">{{ customer.orderCount }}</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <div class="text-sm text-green-600 mb-1">Toplam Harcama</div>
          <div class="text-2xl font-bold text-green-700">{{ formatPrice(customer.totalSpent) }}</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <div class="text-sm text-purple-600 mb-1">Ortalama Sepet</div>
          <div class="text-2xl font-bold text-purple-700">{{ formatPrice(customer.averageCart) }}</div>
        </div>
      </div>
    </section>

    <!-- Adresler -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Kayıtlı Adresler</h3>
      <div class="space-y-4">
        <div 
          v-for="address in customer.addresses" 
          :key="address.id"
          class="border rounded-lg p-4"
        >
          <div class="text-sm text-gray-600 mb-1">{{ address.title }}</div>
          <div class="font-medium">{{ address.fullName }}</div>
          <div>{{ address.phone }}</div>
          <div>
            {{ address.fullAddress }}
            <br>
            {{ address.district }} / {{ address.city }}
          </div>
        </div>
      </div>
    </section>

    <!-- Son Siparişler -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Son Siparişler</h3>
      <div class="border rounded-lg divide-y">
        <div 
          v-for="order in customer.recentOrders" 
          :key="order.id"
          class="p-4"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="font-medium">Sipariş #{{ order.number }}</div>
              <div class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div class="text-right">
              <div class="font-medium">{{ formatPrice(order.total) }}</div>
              <div 
                class="text-sm"
                :class="getStatusColor(order.status)"
              >
                {{ getStatusText(order.status) }}
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex items-center gap-3"
            >
              <img 
                :src="item.product.image" 
                :alt="item.product.name"
                class="w-12 h-12 object-cover rounded"
              />
              <div class="flex-1">
                <div class="text-sm">{{ item.product.name }}</div>
                <div class="text-sm text-gray-600">
                  {{ item.quantity }} adet x {{ formatPrice(item.price) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Notlar -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Müşteri Notları</h3>
      <div class="space-y-4">
        <div 
          v-for="note in customer.notes" 
          :key="note.id"
          class="bg-gray-50 rounded-lg p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="font-medium">{{ note.title }}</div>
            <div class="text-sm text-gray-600">{{ formatDate(note.createdAt) }}</div>
          </div>
          <p class="text-gray-600">{{ note.content }}</p>
        </div>

        <!-- Not Ekleme Formu -->
        <form @submit.prevent="addNote" class="border rounded-lg p-4">
          <div class="space-y-4">
            <div>
              <label class="block mb-1">Not Başlığı</label>
              <input 
                v-model="noteForm.title"
                type="text"
                class="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label class="block mb-1">Not İçeriği</label>
              <textarea 
                v-model="noteForm.content"
                rows="3"
                class="w-full px-4 py-2 border rounded-lg"
                required
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                :disabled="isAddingNote"
              >
                {{ isAddingNote ? 'Ekleniyor...' : 'Not Ekle' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'CustomerDetails',
  props: {
    customer: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      noteForm: {
        title: '',
        content: ''
      },
      isAddingNote: false
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getStatusColor(status) {
      const colors = {
        pending: 'text-yellow-600',
        processing: 'text-blue-600',
        shipped: 'text-purple-600',
        delivered: 'text-green-600',
        cancelled: 'text-red-600'
      }
      return colors[status] || ''
    },
    getStatusText(status) {
      const texts = {
        pending: 'Onay Bekliyor',
        processing: 'Hazırlanıyor',
        shipped: 'Kargoya Verildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      }
      return texts[status] || status
    },
    async addNote() {
      this.isAddingNote = true
      
      try {
        await this.$store.dispatch('admin/addCustomerNote', {
          customerId: this.customer.id,
          ...this.noteForm
        })
        
        this.noteForm = {
          title: '',
          content: ''
        }
        
        this.$toast.success('Not başarıyla eklendi')
      } catch (error) {
        this.$toast.error('Not eklenirken bir hata oluştu')
      } finally {
        this.isAddingNote = false
      }
    }
  }
}
</script> 