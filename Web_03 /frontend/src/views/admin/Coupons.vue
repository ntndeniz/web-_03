<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold">Kuponlar</h1>

        <!-- Filtreler ve Arama -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Durum Filtresi -->
          <select 
            v-model="filters.status"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="">Tüm Kuponlar</option>
            <option value="active">Aktif</option>
            <option value="expired">Süresi Dolmuş</option>
            <option value="used">Kullanılmış</option>
          </select>

          <!-- Arama -->
          <div class="relative">
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Kupon Kodu Ara..."
              class="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>

          <!-- Yeni Kupon Ekle -->
          <button 
            @click="showNewCouponForm = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <span class="material-icons">add</span>
            Yeni Kupon
          </button>
        </div>
      </div>
    </div>

    <!-- Kupon Listesi -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 text-left">
            <th class="p-4 font-medium">Kupon Kodu</th>
            <th class="p-4 font-medium">Açıklama</th>
            <th class="p-4 font-medium">İndirim</th>
            <th class="p-4 font-medium">Kullanım</th>
            <th class="p-4 font-medium">Geçerlilik</th>
            <th class="p-4 font-medium">Durum</th>
            <th class="p-4 font-medium">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr 
            v-for="coupon in filteredCoupons" 
            :key="coupon.id"
            class="hover:bg-gray-50"
          >
            <td class="p-4">
              <div class="font-mono font-medium">{{ coupon.code }}</div>
              <div class="text-sm text-gray-600">
                Min. {{ formatPrice(coupon.minAmount) }}
              </div>
            </td>
            <td class="p-4">
              <div class="font-medium">{{ coupon.title }}</div>
              <div class="text-sm text-gray-600">{{ coupon.description }}</div>
            </td>
            <td class="p-4">
              <div class="font-medium text-green-600">
                {{ coupon.discountType === 'percentage' ? `%${coupon.discountAmount}` : formatPrice(coupon.discountAmount) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ coupon.discountType === 'percentage' ? 'İndirim' : 'Net İndirim' }}
              </div>
            </td>
            <td class="p-4">
              <div class="font-medium">{{ coupon.usageCount }} / {{ coupon.maxUsage || '∞' }}</div>
              <div class="text-sm text-gray-600">kullanım</div>
            </td>
            <td class="p-4">
              <div>{{ formatDate(coupon.startDate) }}</div>
              <div class="text-sm text-gray-600">{{ formatDate(coupon.endDate) }}</div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="getCouponStatusColor(coupon)"
                ></span>
                {{ getCouponStatusText(coupon) }}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="editCoupon(coupon)"
                  class="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <span class="material-icons">edit</span>
                </button>
                <button 
                  @click="toggleCouponStatus(coupon)"
                  class="p-1.5 hover:bg-gray-100 rounded"
                  :class="coupon.active ? 'text-red-600' : 'text-green-600'"
                >
                  <span class="material-icons">
                    {{ coupon.active ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
                <button 
                  @click="deleteCoupon(coupon)"
                  class="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <span class="material-icons">delete</span>
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
          Toplam {{ totalCoupons }} kupon
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

    <!-- Kupon Formu Modal -->
    <Modal 
      v-if="showNewCouponForm || editingCoupon"
      @close="cancelCouponForm"
    >
      <template #title>
        {{ editingCoupon ? 'Kupon Düzenle' : 'Yeni Kupon Ekle' }}
      </template>
      <template #content>
        <CouponForm 
          :initial-coupon="editingCoupon"
          @save="saveCoupon"
          @cancel="cancelCouponForm"
        />
      </template>
    </Modal>

    <!-- Silme Onay Modal -->
    <Modal v-if="couponToDelete" @close="couponToDelete = null">
      <template #title>
        Kupon Silinecek
      </template>
      <template #content>
        <div class="p-4">
          <p class="mb-4">
            "{{ couponToDelete.code }}" kuponunu silmek istediğinize emin misiniz?
          </p>
          <div class="flex justify-end gap-4">
            <button 
              @click="couponToDelete = null"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'
import CouponForm from '@/components/admin/CouponForm.vue'

export default {
  name: 'AdminCoupons',
  components: {
    Modal,
    CouponForm
  },
  data() {
    return {
      filters: {
        search: '',
        status: ''
      },
      currentPage: 1,
      showNewCouponForm: false,
      editingCoupon: null,
      couponToDelete: null
    }
  },
  computed: {
    coupons() {
      return this.$store.state.admin.coupons
    },
    totalCoupons() {
      return this.$store.state.admin.totalCoupons
    },
    totalPages() {
      return Math.ceil(this.totalCoupons / 20)
    },
    filteredCoupons() {
      let filtered = [...this.coupons]

      // Arama filtresi
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(coupon => 
          coupon.code.toLowerCase().includes(search) ||
          coupon.title.toLowerCase().includes(search)
        )
      }

      // Durum filtresi
      if (this.filters.status) {
        filtered = filtered.filter(coupon => {
          const now = new Date()
          const isExpired = new Date(coupon.endDate) < now
          const isUsedUp = coupon.maxUsage && coupon.usageCount >= coupon.maxUsage

          switch (this.filters.status) {
            case 'active':
              return coupon.active && !isExpired && !isUsedUp
            case 'expired':
              return isExpired
            case 'used':
              return isUsedUp
            default:
              return true
          }
        })
      }

      return filtered
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
    getCouponStatusColor(coupon) {
      const now = new Date()
      const isExpired = new Date(coupon.endDate) < now
      const isUsedUp = coupon.maxUsage && coupon.usageCount >= coupon.maxUsage

      if (!coupon.active) return 'bg-gray-500'
      if (isExpired) return 'bg-red-500'
      if (isUsedUp) return 'bg-yellow-500'
      return 'bg-green-500'
    },
    getCouponStatusText(coupon) {
      const now = new Date()
      const isExpired = new Date(coupon.endDate) < now
      const isUsedUp = coupon.maxUsage && coupon.usageCount >= coupon.maxUsage

      if (!coupon.active) return 'Pasif'
      if (isExpired) return 'Süresi Dolmuş'
      if (isUsedUp) return 'Kullanım Doldu'
      return 'Aktif'
    },
    editCoupon(coupon) {
      this.editingCoupon = { ...coupon }
      this.showNewCouponForm = true
    },
    async toggleCouponStatus(coupon) {
      try {
        await this.$store.dispatch('admin/toggleCouponStatus', coupon.id)
        this.$toast.success(
          coupon.active ? 'Kupon pasife alındı' : 'Kupon aktife alındı'
        )
      } catch (error) {
        this.$toast.error('Kupon durumu güncellenirken bir hata oluştu')
      }
    },
    deleteCoupon(coupon) {
      this.couponToDelete = coupon
    },
    async confirmDelete() {
      try {
        await this.$store.dispatch('admin/deleteCoupon', this.couponToDelete.id)
        this.$toast.success('Kupon başarıyla silindi')
        this.couponToDelete = null
      } catch (error) {
        this.$toast.error('Kupon silinirken bir hata oluştu')
      }
    },
    async saveCoupon(couponData) {
      try {
        if (this.editingCoupon) {
          await this.$store.dispatch('admin/updateCoupon', {
            id: this.editingCoupon.id,
            ...couponData
          })
          this.$toast.success('Kupon başarıyla güncellendi')
        } else {
          await this.$store.dispatch('admin/createCoupon', couponData)
          this.$toast.success('Kupon başarıyla oluşturuldu')
        }
        this.cancelCouponForm()
      } catch (error) {
        this.$toast.error('Kupon kaydedilirken bir hata oluştu')
      }
    },
    cancelCouponForm() {
      this.showNewCouponForm = false
      this.editingCoupon = null
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchCoupons()
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchCoupons()
      }
    },
    async fetchCoupons() {
      try {
        await this.$store.dispatch('admin/fetchCoupons', {
          page: this.currentPage,
          ...this.filters
        })
      } catch (error) {
        this.$toast.error('Kuponlar yüklenirken bir hata oluştu')
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1
        this.fetchCoupons()
      }
    }
  },
  created() {
    this.fetchCoupons()
  }
}
</script> 