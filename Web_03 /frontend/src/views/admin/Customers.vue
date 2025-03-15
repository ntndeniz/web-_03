<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold">Müşteriler</h1>

        <!-- Filtreler ve Arama -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Üyelik Durumu -->
          <select 
            v-model="filters.status"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="">Tüm Üyeler</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="blocked">Engellenmiş</option>
          </select>

          <!-- Sıralama -->
          <select 
            v-model="filters.sort"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="newest">En Yeni Üyeler</option>
            <option value="oldest">En Eski Üyeler</option>
            <option value="most_orders">En Çok Sipariş Verenler</option>
            <option value="most_spent">En Çok Harcama Yapanlar</option>
          </select>

          <!-- Arama -->
          <div class="relative">
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Müşteri Ara..."
              class="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Müşteri Listesi -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="p-4 font-medium">Müşteri</th>
            <th class="p-4 font-medium">Üyelik Tarihi</th>
            <th class="p-4 font-medium">Sipariş</th>
            <th class="p-4 font-medium">Toplam Harcama</th>
            <th class="p-4 font-medium">Durum</th>
            <th class="p-4 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr 
            v-for="customer in filteredCustomers" 
            :key="customer.id"
            class="hover:bg-gray-50"
          >
            <td class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span class="material-icons text-gray-600">person</span>
                </div>
                <div>
                  <div class="font-medium">{{ customer.fullName }}</div>
                  <div class="text-sm text-gray-600">{{ customer.email }}</div>
                </div>
              </div>
            </td>
            <td class="p-4">
              <div>{{ formatDate(customer.createdAt) }}</div>
              <div class="text-sm text-gray-600">{{ formatTime(customer.createdAt) }}</div>
            </td>
            <td class="p-4">
              <div class="font-medium">{{ customer.orderCount }} sipariş</div>
              <div class="text-sm text-gray-600">
                Son sipariş: {{ formatDate(customer.lastOrderDate) }}
              </div>
            </td>
            <td class="p-4 font-medium">
              {{ formatPrice(customer.totalSpent) }}
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="getStatusColor(customer.status)"
                ></span>
                {{ getStatusText(customer.status) }}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="viewCustomerDetails(customer)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <span class="material-icons">visibility</span>
                </button>
                <button 
                  v-if="customer.status !== 'blocked'"
                  @click="blockCustomer(customer)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <span class="material-icons">block</span>
                </button>
                <button 
                  v-else
                  @click="unblockCustomer(customer)"
                  class="p-1.5 text-green-600 hover:bg-green-50 rounded"
                >
                  <span class="material-icons">check_circle</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sayfalama -->
    <div class="p-4 border-t">
      <div class="flex items-center justify-between">
        <div class="text-gray-600">
          Toplam {{ totalCustomers }} müşteri
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="material-icons">chevron_left</span>
          </button>
          <span>Sayfa {{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="p-2 border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="material-icons">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Müşteri Detay Modal -->
    <Modal v-if="selectedCustomer" @close="selectedCustomer = null">
      <template #title>
        Müşteri Detayı
      </template>
      <template #content>
        <CustomerDetails :customer="selectedCustomer" />
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'
import CustomerDetails from '@/components/admin/CustomerDetails.vue'

export default {
  name: 'AdminCustomers',
  components: {
    Modal,
    CustomerDetails
  },
  data() {
    return {
      filters: {
        search: '',
        status: '',
        sort: 'newest'
      },
      currentPage: 1,
      selectedCustomer: null
    }
  },
  computed: {
    customers() {
      return this.$store.state.admin.customers
    },
    totalCustomers() {
      return this.$store.state.admin.totalCustomers
    },
    totalPages() {
      return Math.ceil(this.totalCustomers / 20)
    },
    filteredCustomers() {
      let filtered = [...this.customers]

      // Arama filtresi
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(customer => 
          customer.fullName.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search)
        )
      }

      // Durum filtresi
      if (this.filters.status) {
        filtered = filtered.filter(customer => 
          customer.status === this.filters.status
        )
      }

      // Sıralama
      filtered.sort((a, b) => {
        switch (this.filters.sort) {
          case 'newest':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'oldest':
            return new Date(a.createdAt) - new Date(b.createdAt)
          case 'most_orders':
            return b.orderCount - a.orderCount
          case 'most_spent':
            return b.totalSpent - a.totalSpent
          default:
            return 0
        }
      })

      return filtered
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString('tr-TR')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getStatusColor(status) {
      const colors = {
        active: 'bg-green-500',
        inactive: 'bg-gray-500',
        blocked: 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    },
    getStatusText(status) {
      const texts = {
        active: 'Aktif',
        inactive: 'Pasif',
        blocked: 'Engellenmiş'
      }
      return texts[status] || status
    },
    viewCustomerDetails(customer) {
      this.selectedCustomer = customer
    },
    async blockCustomer(customer) {
      try {
        await this.$store.dispatch('admin/blockCustomer', customer.id)
        this.$toast.success('Müşteri engellendi')
      } catch (error) {
        this.$toast.error('İşlem sırasında bir hata oluştu')
      }
    },
    async unblockCustomer(customer) {
      try {
        await this.$store.dispatch('admin/unblockCustomer', customer.id)
        this.$toast.success('Müşteri engeli kaldırıldı')
      } catch (error) {
        this.$toast.error('İşlem sırasında bir hata oluştu')
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchCustomers()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchCustomers()
      }
    },
    async fetchCustomers() {
      try {
        await this.$store.dispatch('admin/fetchCustomers', {
          page: this.currentPage,
          ...this.filters
        })
      } catch (error) {
        this.$toast.error('Müşteriler yüklenirken bir hata oluştu')
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.fetchCustomers()
      }
    }
  },
  created() {
    this.fetchCustomers()
  }
}
</script> 