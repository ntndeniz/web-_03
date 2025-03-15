<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Ödeme Yöntemlerim</h2>
      <button
        @click="showAddCard = true"
        class="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <i class="fas fa-plus"></i>
        <span>Yeni Kart Ekle</span>
      </button>
    </div>

    <!-- Kayıtlı Kartlar -->
    <div v-if="cards.length" class="space-y-4">
      <div 
        v-for="card in cards"
        :key="card.id"
        class="flex items-center justify-between rounded-lg border p-4"
      >
        <!-- Kart Bilgileri -->
        <div class="flex items-center space-x-4">
          <div class="flex h-12 w-16 items-center justify-center rounded-md border">
            <img 
              :src="`/images/card-brands/${card.brand}.svg`"
              :alt="card.brand"
              class="h-6"
            />
          </div>
          <div>
            <p class="font-medium">
              **** **** **** {{ card.last4 }}
            </p>
            <p class="text-sm text-gray-600">
              Son Kullanma: {{ card.expMonth }}/{{ card.expYear }}
            </p>
          </div>
        </div>

        <!-- Aksiyonlar -->
        <div class="flex items-center space-x-4">
          <button 
            v-if="!card.isDefault"
            @click="setDefaultCard(card.id)"
            class="text-sm text-blue-600 hover:text-blue-500"
          >
            Varsayılan Yap
          </button>
          <span 
            v-else
            class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600"
          >
            Varsayılan
          </span>
          <button 
            @click="deleteCard(card.id)"
            class="text-sm text-red-600 hover:text-red-500"
          >
            Kartı Sil
          </button>
        </div>
      </div>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center rounded-lg border border-dashed py-12"
    >
      <i class="fas fa-credit-card text-4xl text-gray-400"></i>
      <p class="mt-4 text-gray-600">Henüz kayıtlı kartınız bulunmuyor.</p>
      <button
        @click="showAddCard = true"
        class="mt-4 text-blue-600 hover:text-blue-500"
      >
        Yeni Kart Ekle
      </button>
    </div>

    <!-- Yeni Kart Ekleme Modal -->
    <Modal v-model="showAddCard">
      <template #title>Yeni Kart Ekle</template>
      <form @submit.prevent="addNewCard" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Kart Üzerindeki İsim
          </label>
          <input 
            v-model="newCard.name"
            type="text"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Kart Numarası
          </label>
          <input 
            v-model="newCard.number"
            type="text"
            required
            maxlength="19"
            @input="formatCardNumber"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Son Kullanma Tarihi
            </label>
            <input 
              v-model="newCard.expiry"
              type="text"
              required
              placeholder="AA/YY"
              maxlength="5"
              @input="formatExpiry"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              CVV
            </label>
            <input 
              v-model="newCard.cvv"
              type="text"
              required
              maxlength="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="flex items-center">
          <input
            v-model="newCard.setDefault"
            type="checkbox"
            class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label class="ml-2 text-sm text-gray-600">
            Bu kartı varsayılan ödeme yöntemi olarak kaydet
          </label>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="showAddCard = false"
            class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <span v-if="!loading">Kartı Kaydet</span>
            <LoadingSpinner v-else size="sm" color="white" />
          </button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import Modal from '../common/Modal.vue'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'PaymentMethods',
  components: {
    Modal,
    LoadingSpinner
  },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const showAddCard = ref(false)
    const cards = ref([])
    const newCard = ref({
      name: '',
      number: '',
      expiry: '',
      cvv: '',
      setDefault: false
    })

    const formatCardNumber = () => {
      newCard.value.number = newCard.value.number
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
    }

    const formatExpiry = () => {
      newCard.value.expiry = newCard.value.expiry
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
    }

    const addNewCard = async () => {
      loading.value = true
      try {
        const [expMonth, expYear] = newCard.value.expiry.split('/')
        await store.dispatch('payment/addCard', {
          name: newCard.value.name,
          number: newCard.value.number.replace(/\s/g, ''),
          expMonth,
          expYear: `20${expYear}`,
          cvv: newCard.value.cvv,
          setDefault: newCard.value.setDefault
        })
        
        await loadCards()
        showAddCard.value = false
        newCard.value = {
          name: '',
          number: '',
          expiry: '',
          cvv: '',
          setDefault: false
        }
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Kart başarıyla eklendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Kart eklenirken bir hata oluştu'
        })
      } finally {
        loading.value = false
      }
    }

    const setDefaultCard = async (cardId) => {
      try {
        await store.dispatch('payment/setDefaultCard', cardId)
        await loadCards()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Varsayılan kart güncellendi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'İşlem sırasında bir hata oluştu'
        })
      }
    }

    const deleteCard = async (cardId) => {
      if (!confirm('Bu kartı silmek istediğinizden emin misiniz?')) return

      try {
        await store.dispatch('payment/deleteCard', cardId)
        await loadCards()
        
        store.dispatch('ui/showToast', {
          type: 'success',
          message: 'Kart başarıyla silindi'
        })
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Kart silinirken bir hata oluştu'
        })
      }
    }

    const loadCards = async () => {
      try {
        const response = await store.dispatch('payment/getCards')
        cards.value = response
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Kartlar yüklenirken bir hata oluştu'
        })
      }
    }

    onMounted(() => {
      loadCards()
    })

    return {
      loading,
      showAddCard,
      cards,
      newCard,
      formatCardNumber,
      formatExpiry,
      addNewCard,
      setDefaultCard,
      deleteCard
    }
  }
}
</script> 
</script> 