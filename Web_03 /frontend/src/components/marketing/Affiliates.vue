<template>
  <div class="affiliates-container">
    <div class="affiliates-header">
      <h2 class="affiliates-title">{{ title }}</h2>
      <p class="affiliates-description">{{ description }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ totalEarnings }}₺</div>
        <div class="stat-label">Toplam Kazanç</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ referralCount }}</div>
        <div class="stat-label">Toplam Referans</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">%{{ commissionRate }}</div>
        <div class="stat-label">Komisyon Oranı</div>
      </div>
    </div>

    <div class="affiliate-actions">
      <div class="referral-link">
        <label>Referans Linkiniz</label>
        <div class="link-group">
          <input
            type="text"
            :value="referralLink"
            readonly
            class="link-input"
          />
          <button 
            @click="copyLink"
            class="copy-button"
          >
            {{ copied ? 'Kopyalandı!' : 'Kopyala' }}
          </button>
        </div>
      </div>

      <div class="share-buttons">
        <button 
          v-for="platform in sharePlatforms"
          :key="platform.id"
          class="share-button"
          :class="platform.class"
          @click="shareLink(platform)"
        >
          {{ platform.name }} ile Paylaş
        </button>
      </div>
    </div>

    <div class="referrals-section">
      <h3 class="section-title">Referanslarınız</h3>
      
      <div v-if="loading" class="loading-state">
        <LoadingSpinner />
      </div>

      <div v-else-if="error" class="error-state">
        <ErrorMessage :message="error" />
      </div>

      <div v-else-if="referrals.length === 0" class="empty-state">
        <p>Henüz referansınız bulunmuyor.</p>
      </div>

      <div v-else class="referrals-table">
        <table>
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>Kazanç</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="referral in referrals" :key="referral.id">
              <td>{{ referral.userName }}</td>
              <td>{{ formatDate(referral.date) }}</td>
              <td>
                <span :class="getReferralStatusClass(referral.status)">
                  {{ getReferralStatusText(referral.status) }}
                </span>
              </td>
              <td>{{ referral.earnings }}₺</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/helpers/date'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import { notify } from '@/utils/notification'

export default {
  name: 'Affiliates',

  components: {
    LoadingSpinner,
    ErrorMessage
  },

  props: {
    title: {
      type: String,
      default: 'Referans Programı'
    },
    description: {
      type: String,
      default: 'Arkadaşlarınızı davet edin, birlikte kazanalım'
    }
  },

  setup() {
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const copied = ref(false)

    const totalEarnings = computed(() => 
      store.getters['affiliate/totalEarnings']
    )

    const referralCount = computed(() => 
      store.getters['affiliate/referralCount']
    )

    const commissionRate = computed(() => 
      store.getters['affiliate/commissionRate']
    )

    const referralLink = computed(() => 
      store.getters['affiliate/referralLink']
    )

    const referrals = computed(() => 
      store.getters['affiliate/referrals']
    )

    const sharePlatforms = [
      { id: 1, name: 'WhatsApp', class: 'whatsapp' },
      { id: 2, name: 'Facebook', class: 'facebook' },
      { id: 3, name: 'Twitter', class: 'twitter' },
      { id: 4, name: 'Telegram', class: 'telegram' }
    ]

    const loadReferrals = async () => {
      try {
        loading.value = true
        await store.dispatch('affiliate/fetchReferrals')
      } catch (err) {
        error.value = 'Referanslar yüklenirken bir hata oluştu'
      } finally {
        loading.value = false
      }
    }

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(referralLink.value)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
        notify.success('Referans linki kopyalandı')
      } catch (err) {
        notify.error('Link kopyalanırken bir hata oluştu')
      }
    }

    const shareLink = (platform) => {
      // Platform'a göre paylaşım URL'i oluştur
      const shareUrl = encodeURIComponent(referralLink.value)
      const text = encodeURIComponent('Size özel indirim fırsatı!')
      
      let url = ''
      switch (platform.class) {
        case 'whatsapp':
          url = `https://wa.me/?text=${text} ${shareUrl}`
          break
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
          break
        case 'twitter':
          url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`
          break
        case 'telegram':
          url = `https://t.me/share/url?url=${shareUrl}&text=${text}`
          break
      }

      window.open(url, '_blank')
    }

    const getReferralStatusClass = (status) => {
      switch (status) {
        case 'completed': return 'status-completed'
        case 'pending': return 'status-pending'
        case 'failed': return 'status-failed'
        default: return ''
      }
    }

    const getReferralStatusText = (status) => {
      switch (status) {
        case 'completed': return 'Tamamlandı'
        case 'pending': return 'Beklemede'
        case 'failed': return 'Başarısız'
        default: return status
      }
    }

    onMounted(() => {
      loadReferrals()
    })

    return {
      loading,
      error,
      copied,
      totalEarnings,
      referralCount,
      commissionRate,
      referralLink,
      referrals,
      sharePlatforms,
      formatDate,
      copyLink,
      shareLink,
      getReferralStatusClass,
      getReferralStatusText
    }
  }
}
</script>

<style scoped>
.affiliates-container {
  @apply space-y-8 p-6;
}

.affiliates-header {
  @apply text-center space-y-2;
}

.affiliates-title {
  @apply text-3xl font-bold text-gray-800;
}

.affiliates-description {
  @apply text-gray-600;
}

.stats-grid {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.stat-card {
  @apply bg-white p-6 rounded-lg shadow-md text-center;
}

.stat-value {
  @apply text-3xl font-bold text-blue-600;
}

.stat-label {
  @apply text-gray-600 mt-2;
}

.affiliate-actions {
  @apply space-y-6;
}

.referral-link {
  @apply space-y-2;
}

.link-group {
  @apply flex gap-2;
}

.link-input {
  @apply flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-50;
}

.copy-button {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
}

.share-buttons {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.share-button {
  @apply px-4 py-2 text-white rounded-md transition-colors;
}

.share-button.whatsapp {
  @apply bg-green-600 hover:bg-green-700;
}

.share-button.facebook {
  @apply bg-blue-800 hover:bg-blue-900;
}

.share-button.twitter {
  @apply bg-blue-400 hover:bg-blue-500;
}

.share-button.telegram {
  @apply bg-blue-500 hover:bg-blue-600;
}

.referrals-section {
  @apply space-y-4;
}

.section-title {
  @apply text-xl font-semibold text-gray-800;
}

.referrals-table {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

table {
  @apply w-full;
}

th {
  @apply px-4 py-2 text-left bg-gray-50 text-gray-600;
}

td {
  @apply px-4 py-3 border-t border-gray-100;
}

.status-completed {
  @apply text-green-600;
}

.status-pending {
  @apply text-yellow-600;
}

.status-failed {
  @apply text-red-600;
}

.loading-state,
.error-state,
.empty-state {
  @apply flex justify-center items-center min-h-[200px] text-gray-500;
}
</style> 