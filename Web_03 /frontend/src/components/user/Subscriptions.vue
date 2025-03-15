<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Aboneliklerim</h2>
      
      <!-- Filtreler -->
      <select 
        v-model="filter"
        class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Tüm Abonelikler</option>
        <option value="active">Aktif</option>
        <option value="paused">Duraklatılmış</option>
        <option value="cancelled">İptal Edilmiş</option>
      </select>
    </div>

    <!-- Abonelik Listesi -->
    <div v-if="filteredSubscriptions.length" class="space-y-6">
      <div 
        v-for="subscription in filteredSubscriptions"
        :key="subscription.id"
        class="rounded-lg border"
      >
        <!-- Abonelik Başlığı -->
        <div class="flex items-center justify-between border-b p-4">
          <div>
            <p class="font-medium">{{ subscription.plan.name }}</p>
            <p class="mt-1 text-sm text-gray-600">
              Başlangıç: {{ formatDate(subscription.startDate) }}
            </p>
          </div>
          <span 
            class="rounded-full px-3 py-1 text-sm"
            :class="getStatusClass(subscription.status)"
          >
            {{ getStatusText(subscription.status) }}
          </span>
        </div>

        <!-- Abonelik Detayları -->
        <div class="p-4">
          <div class="grid gap-4 sm:grid-cols-3">
            <!-- Fiyat Bilgisi -->
            <div>
              <p class="text-sm text-gray-600">Aylık Ücret</p>
              <p class="mt-1 text-lg font-medium">
                {{ formatPrice(subscription.plan.price) }}
              </p>
            </div>

            <!-- Yenileme Tarihi -->
            <div>
              <p class="text-sm text-gray-600">Sonraki Ödeme</p>
              <p class="mt-1 text-lg font-medium">
                {{ formatDate(subscription.nextBillingDate) }}
              </p>
            </div>

            <!-- Ödeme Yöntemi -->
            <div>
              <p class="text-sm text-gray-600">Ödeme Yöntemi</p>
              <div class="mt-1 flex items-center space-x-2">
                <img 
                  :src="`/images/card-brands/${subscription.paymentMethod.brand}.svg`"
                  :alt="subscription.paymentMethod.brand"
                  class="h-6"
                />
                <span>**** {{ subscription.paymentMethod.last4 }}</span>
              </div>
            </div>
          </div>

          <!-- Plan Özellikleri -->
          <div class="mt-6">
            <h4 class="font-medium">Plan Özellikleri</h4>
            <ul class="mt-2 space-y-2">
              <li 
                v-for="(feature, index) in subscription.plan.features"
                :key="index"
                class="flex items-center text-sm text-gray-600"
              >
                <i class="fas fa-check text-green-500 mr-2"></i>
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- Aksiyonlar -->
          <div class="mt-6 flex items-center justify-end space-x-4">
            <button
              v-if="subscription.status === 'active'"
              @click="pauseSubscription(subscription.id)"
              class="text-sm text-gray-600 hover:text-gray-900"
            >
              Duraklat
            </button>
            <button
              v-if="subscription.status === 'paused'"
              @click="resumeSubscription(subscription.id)"
              class="text-sm text-blue-600 hover:text-blue-500"
            >
              Devam Et
            </button>
            <button
              v-if="['active', 'paused'].includes(subscription.status)"
              @click="showCancelModal(subscription)"
              class="text-sm text-red-600 hover:text-red-500"
            >
              İptal Et
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-box-open text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz aboneliğiniz bulunmuyor.</p>
      <router-link 
        to="/plans"
        class="mt-4 text-blue-600 hover:text-blue-500"
      >
        Planları İncele
      </router-link>
    </div>

    <!-- İptal Modal -->
    <Modal v-model="showCancelDialog">
      <template #title>Aboneliği İptal Et</template>
      <div class="space-y-4">
        <p class="text-gray-600">
          Aboneliğinizi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">
            İptal Nedeni
          </label>
          <select
            v-model="cancelReason"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seçiniz...</option>
            <option value="too_expensive">Çok pahalı</option>
            <option value="not_using">Kullanmıyorum</option>
            <option value="missing_features">Özellikler yetersiz</option>
            <option value="switched">Başka bir hizmete geçtim</option>
            <option value="other">Diğer</option>
          </select>
        </div>

        <div v-if="cancelReason === 'other'">
          <label class="block text-sm font-medium text-gray-700">
            Açıklama
          </label>
          <textarea
            v-model="cancelDescription"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="showCancelDialog = false"
            class="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            @click="confirmCancel"
            :disabled="!cancelReason || loading"
            class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            <span v-if="!loading">İptal Et</span>
            <LoadingSpinner v-else size="sm" color="white" />
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Modal from '../common/Modal.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'Subscriptions',
  components: {
    Modal,
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const filter = ref('all')
    const subscriptions = ref([])
    const showCancelDialog = ref(false)
    const selectedSubscription = ref(null)
    const cancelReason = ref('')
    const cancelDescription = ref('')

    const filteredSubscriptions = computed(() => {
      if (filter.value === 'all') return subscriptions.value
      return subscriptions.value.filter(s => s.status === filter.value)
    })

    const getStatusClass = (status) => {
      const classes = {
        active: 'bg-green-100 text-green-600',
        paused: 'bg-yellow-100 text-yellow-600',
        cancelled: 'bg-red-100 text-red-600'
      }
      return classes[status]
    }

    const getStatusText = (status) => {
      const texts = {
        active: 'Aktif',
        paused: 'Duraklatıldı',
        cancelled: 'İptal Edildi'
      }
      return texts[status]
    }

    const formatDate = (date) => {
      return format(new Date(date), 'dd MMM yyyy', { locale: tr })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const showCancelModal = (subscription) => {
      selectedSubscription.value = subscription
      showCancelDialog.value = true
    }

    const confirmCancel = async () => {
      if (!selectedSubscription.value || !cancelReason.value) return

      loading.value = true
      try {
        await store.dispatch('subscriptions/cancelSubscription', {
          id: selectedSubscription.value.id,
          reason: cancelReason.value,
          description: cancelDescription.value
        })
        
        await loadSubscriptions()
        showCancelDialog.value = false
        cancelReason.value = ''
        cancelDescription.value = ''
        selectedSubscription.value = null
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Aboneliğiniz iptal edildi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const pauseSubscription = async (id) => {
      try {
        await store.dispatch('subscriptions/pauseSubscription', id)
        await loadSubscriptions()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Aboneliğiniz duraklatıldı'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const resumeSubscription = async (id) => {
      try {
        await store.dispatch('subscriptions/resumeSubscription', id)
        await loadSubscriptions()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Aboneliğiniz tekrar aktifleştirildi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const loadSubscriptions = async () => {
      try {
        const response = await store.dispatch('subscriptions/getSubscriptions')
        subscriptions.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Abonelikler yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadSubscriptions()
    })

    return {
      loading,
      filter,
      filteredSubscriptions,
      showCancelDialog,
      cancelReason,
      cancelDescription,
      getStatusClass,
      getStatusText,
      formatDate,
      formatPrice,
      showCancelModal,
      confirmCancel,
      pauseSubscription,
      resumeSubscription
    }
  }
}
</script> 