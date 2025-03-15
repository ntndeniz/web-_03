<template>
  <form @submit.prevent="saveCoupon" class="space-y-6">
    <!-- Temel Bilgiler -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Temel Bilgiler</h3>
      <div class="space-y-4">
        <div>
          <label class="block mb-1">Kupon Kodu</label>
          <div class="flex gap-2">
            <input 
              v-model="coupon.code"
              type="text"
              class="flex-1 px-4 py-2 border rounded-lg font-mono uppercase"
              :disabled="!!initialCoupon"
              required
            />
            <button 
              v-if="!initialCoupon"
              type="button"
              @click="generateCode"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Kod Üret
            </button>
          </div>
        </div>

        <div>
          <label class="block mb-1">Başlık</label>
          <input 
            v-model="coupon.title"
            type="text"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Açıklama</label>
          <textarea 
            v-model="coupon.description"
            rows="3"
            class="w-full px-4 py-2 border rounded-lg"
          ></textarea>
        </div>
      </div>
    </section>

    <!-- İndirim Detayları -->
    <section>
      <h3 class="text-lg font-semibold mb-4">İndirim Detayları</h3>
      <div class="space-y-4">
        <div>
          <label class="block mb-1">İndirim Tipi</label>
          <select 
            v-model="coupon.discountType"
            class="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="percentage">Yüzde İndirim (%)</option>
            <option value="fixed">Net İndirim (₺)</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">
            {{ coupon.discountType === 'percentage' ? 'İndirim Oranı (%)' : 'İndirim Tutarı (₺)' }}
          </label>
          <input 
            v-model.number="coupon.discountAmount"
            type="number"
            :min="0"
            :max="coupon.discountType === 'percentage' ? 100 : null"
            :step="coupon.discountType === 'percentage' ? 1 : 0.01"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Minimum Sepet Tutarı (₺)</label>
          <input 
            v-model.number="coupon.minAmount"
            type="number"
            min="0"
            step="0.01"
            class="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label class="block mb-1">Maksimum Kullanım Sayısı</label>
          <input 
            v-model.number="coupon.maxUsage"
            type="number"
            min="0"
            class="w-full px-4 py-2 border rounded-lg"
            placeholder="Sınırsız kullanım için boş bırakın"
          />
        </div>
      </div>
    </section>

    <!-- Geçerlilik Süresi -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Geçerlilik Süresi</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Başlangıç Tarihi</label>
          <input 
            v-model="coupon.startDate"
            type="date"
            class="w-full px-4 py-2 border rounded-lg"
            :min="today"
            required
          />
        </div>
        <div>
          <label class="block mb-1">Bitiş Tarihi</label>
          <input 
            v-model="coupon.endDate"
            type="date"
            class="w-full px-4 py-2 border rounded-lg"
            :min="coupon.startDate || today"
            required
          />
        </div>
      </div>
    </section>

    <!-- Diğer Ayarlar -->
    <section>
      <h3 class="text-lg font-semibold mb-4">Diğer Ayarlar</h3>
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <input 
            v-model="coupon.active"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-600"
            id="active"
          />
          <label for="active">Kupon aktif olarak kullanılabilsin</label>
        </div>

        <div class="flex items-center gap-2">
          <input 
            v-model="coupon.firstOrderOnly"
            type="checkbox"
            class="w-4 h-4 rounded text-blue-600"
            id="firstOrderOnly"
          />
          <label for="firstOrderOnly">Sadece ilk siparişte kullanılabilsin</label>
        </div>
      </div>
    </section>

    <!-- Form Butonları -->
    <div class="flex justify-end gap-4 pt-4 border-t">
      <button 
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-2 border rounded-lg hover:bg-gray-50"
      >
        İptal
      </button>
      <button 
        type="submit"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        :disabled="isSaving"
      >
        {{ isSaving ? 'Kaydediliyor...' : 'Kaydet' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'CouponForm',
  props: {
    initialCoupon: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      coupon: {
        code: '',
        title: '',
        description: '',
        discountType: 'percentage',
        discountAmount: 0,
        minAmount: 0,
        maxUsage: null,
        startDate: '',
        endDate: '',
        active: true,
        firstOrderOnly: false
      },
      isSaving: false
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    }
  },
  methods: {
    generateCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      this.coupon.code = code
    },
    saveCoupon() {
      this.$emit('save', this.coupon)
    }
  },
  created() {
    if (this.initialCoupon) {
      this.coupon = { ...this.initialCoupon }
    }
  }
}
</script> 