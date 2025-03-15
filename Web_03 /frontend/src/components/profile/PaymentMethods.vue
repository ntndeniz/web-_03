<template>
  <div class="payment-methods">
    <div class="bg-white shadow sm:rounded-lg">
      <!-- Başlık ve Kart Ekle Butonu -->
      <div class="px-4 py-5 sm:p-6 flex justify-between items-center">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Ödeme Yöntemleri
        </h3>
        <button
          type="button"
          @click="showCardModal = true"
          class="btn-primary"
        >
          <plus-icon class="h-5 w-5 mr-2" />
          Yeni Kart Ekle
        </button>
      </div>

      <!-- Kayıtlı Kartlar -->
      <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div v-if="cards.length" class="space-y-4">
          <div
            v-for="card in cards"
            :key="card.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center space-x-3">
                <credit-card-icon 
                  :class="getCardBrandClass(card.brand)"
                  class="h-8 w-8"
                />
                <div>
                  <h4 class="font-medium text-gray-900">
                    •••• •••• •••• {{ card.last4 }}
                    <badge
                      v-if="card.isDefault"
                      variant="success"
                      class="ml-2"
                    >
                      Varsayılan
                    </badge>
                  </h4>
                  <p class="mt-1 text-sm text-gray-600">
                    Son Kullanma: {{ formatExpiry(card.expMonth, card.expYear) }}
                  </p>
                </div>
              </div>
              <div class="flex space-x-2">
                <button
                  type="button"
                  @click="deleteCard(card)"
                  class="btn-icon text-red-500"
                >
                  <trash-icon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <div v-if="!card.isDefault" class="mt-4">
              <button
                type="button"
                @click="setDefaultCard(card)"
                class="text-sm text-primary-600 hover:text-primary-500"
              >
                Varsayılan Yap
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <credit-card-icon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Kart Bulunamadı</h3>
          <p class="mt-1 text-sm text-gray-500">
            Henüz kayıtlı kartınız bulunmamaktadır.
          </p>
        </div>
      </div>
    </div>

    <!-- Kart Ekleme Modal -->
    <modal
      v-if="showCardModal"
      title="Yeni Kart Ekle"
      @close="closeCardModal"
    >
      <card-form
        @submit="handleCardSubmit"
        @cancel="closeCardModal"
      />
    </modal>

    <!-- Silme Onay Modal -->
    <confirm-modal
      v-if="showDeleteModal"
      title="Kartı Sil"
      message="Bu kartı silmek istediğinizden emin misiniz?"
      @confirm="confirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from '@/composables/useToast'
import {
  PlusIcon,
  TrashIcon,
  CreditCardIcon
} from '@heroicons/vue/outline'
import Modal from '@/components/common/Modal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'
import CardForm from '@/components/payment/CardForm.vue'
import Badge from '@/components/common/Badge.vue'

export default {
  name: 'PaymentMethods',

  components: {
    Modal,
    ConfirmModal,
    CardForm,
    Badge,
    PlusIcon,
    TrashIcon,
    CreditCardIcon
  },

  setup() {
    const store = useStore()
    const toast = useToast()

    const cards = computed(() => store.state.payment.cards)
    const showCardModal = ref(false)
    const showDeleteModal = ref(false)
    const cardToDelete = ref(null)

    const formatExpiry = (month, year) => {
      return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
    }

    const getCardBrandClass = (brand) => {
      const brands = {
        visa: 'text-blue-600',
        mastercard: 'text-red-600',
        amex: 'text-indigo-600'
      }
      return brands[brand.toLowerCase()] || 'text-gray-600'
    }

    const deleteCard = (card) => {
      cardToDelete.value = card
      showDeleteModal.value = true
    }

    const confirmDelete = async () => {
      try {
        await store.dispatch('payment/deleteCard', cardToDelete.value.id)
        toast.success('Kart başarıyla silindi')
      } catch (error) {
        toast.error('Kart silinirken bir hata oluştu')
      } finally {
        showDeleteModal.value = false
        cardToDelete.value = null
      }
    }

    const setDefaultCard = async (card) => {
      try {
        await store.dispatch('payment/setDefaultCard', card.id)
        toast.success('Varsayılan kart güncellendi')
      } catch (error) {
        toast.error('Varsayılan kart güncellenirken bir hata oluştu')
      }
    }

    const handleCardSubmit = async (cardData) => {
      try {
        await store.dispatch('payment/addCard', cardData)
        toast.success('Kart başarıyla eklendi')
        closeCardModal()
      } catch (error) {
        toast.error(error.message)
      }
    }

    const closeCardModal = () => {
      showCardModal.value = false
    }

    return {
      cards,
      showCardModal,
      showDeleteModal,
      formatExpiry,
      getCardBrandClass,
      deleteCard,
      confirmDelete,
      setDefaultCard,
      handleCardSubmit,
      closeCardModal
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-primary {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm 
         text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
}

.btn-icon {
  @apply p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 
         focus:ring-primary-500;
}
</style> 