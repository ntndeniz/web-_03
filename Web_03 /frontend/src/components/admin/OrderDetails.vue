<template>
  <div class="space-y-6">
    <!-- Müşteri Bilgileri -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Müşteri Bilgileri</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-600">Ad Soyad</div>
            <div class="font-medium">{{ order.customer.name }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">E-posta</div>
            <div class="font-medium">{{ order.customer.email }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Telefon</div>
            <div class="font-medium">{{ order.customer.phone }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Üyelik Tarihi</div>
            <div class="font-medium">{{ formatDate(order.customer.createdAt) }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Teslimat Adresi -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Teslimat Adresi</h3>
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="text-sm text-gray-600 mb-1">{{ order.shippingAddress.title }}</div>
        <div class="font-medium">{{ order.shippingAddress.fullName }}</div>
        <div>{{ order.shippingAddress.phone }}</div>
        <div>
          {{ order.shippingAddress.fullAddress }}
          <br>
          {{ order.shippingAddress.district }} / {{ order.shippingAddress.city }}
        </div>
      </div>
    </section>

    <!-- Sipariş Ürünleri -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Sipariş Detayı</h3>
      <div class="border rounded-lg divide-y">
        <div 
          v-for="item in order.items" 
          :key="item.id"
          class="p-4 flex items-center gap-4"
        >
          <img 
            :src="item.product.image" 
            :alt="item.product.name"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-1">
            <div class="font-medium">{{ item.product.name }}</div>
            <div class="text-sm text-gray-600">
              {{ item.quantity }} adet x {{ formatPrice(item.price) }}
            </div>
          </div>
          <div class="text-right">
            <div class="font-medium">{{ formatPrice(item.total) }}</div>
            <div v-if="item.discount" class="text-sm text-green-600">
              {{ item.discount }}% indirim
            </div>
          </div>
        </div>

        <!-- Özet -->
        <div class="p-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Ara Toplam</span>
              <span>{{ formatPrice(order.subtotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Kargo</span>
              <span>{{ formatPrice(order.shippingCost) }}</span>
            </div>
            <div v-if="order.discount" class="flex justify-between text-green-600">
              <span>İndirim</span>
              <span>-{{ formatPrice(order.discount) }}</span>
            </div>
            <div class="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Toplam</span>
              <span>{{ formatPrice(order.total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sipariş Durumu -->
    <section>
      <h3 class="text-lg font-semibold mb-3">Sipariş Durumu</h3>
      <div class="space-y-4">
        <div 
          v-for="status in orderTimeline" 
          :key="status.date"
          class="flex gap-4"
        >
          <div class="w-8 relative flex justify-center">
            <div 
              class="w-3 h-3 rounded-full mt-2"
              :class="status.done ? 'bg-green-500' : 'bg-gray-300'"
            ></div>
            <div 
              v-if="!status.isLast"
              class="absolute top-4 bottom-0 w-0.5 bg-gray-200"
            ></div>
          </div>
          <div>
            <div class="font-medium">{{ status.title }}</div>
            <div class="text-sm text-gray-600">{{ formatDateTime(status.date) }}</div>
            <div v-if="status.note" class="text-sm text-gray-600 mt-1">
              {{ status.note }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'OrderDetails',
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  computed: {
    orderTimeline() {
      const timeline = this.order.statusHistory.map((status, index, arr) => ({
        title: this.getStatusText(status.status),
        date: status.date,
        note: status.note,
        done: true,
        isLast: index === arr.length - 1
      }))

      return timeline
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    formatDateTime(date) {
      return new Date(date).toLocaleString('tr-TR')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getStatusText(status) {
      const statuses = {
        pending: 'Sipariş Alındı',
        processing: 'Hazırlanıyor',
        shipped: 'Kargoya Verildi',
        delivered: 'Teslim Edildi',
        cancelled: 'İptal Edildi'
      }
      return statuses[status] || status
    }
  }
}
</script> 