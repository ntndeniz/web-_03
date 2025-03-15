<template>
    <div class="subscription-settings">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <!-- Başlık -->
          <h3 class="text-lg font-medium text-gray-900">Abonelik Ayarları</h3>
          
          <!-- Mevcut Plan -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900">Mevcut Plan</h4>
            <div class="mt-2 flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ currentPlan.name }}</p>
                <p class="mt-1 text-sm text-gray-500">
                  Yenileme Tarihi: {{ renewalDate }}
                </p>
              </div>
              <span class="inline-flex items-center px-3 py-0.5 rounded-full text-sm 
                         font-medium" :class="getStatusClass">
                {{ status }}
              </span>
            </div>
          </div>
  
          <!-- Ödeme Yöntemi -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900">Ödeme Yöntemi</h4>
            <div class="mt-2">
              <div class="flex items-center space-x-3">
                <img :src="paymentMethod.icon" class="h-8 w-auto" />
                <div>
                  <p class="text-sm text-gray-900">
                    **** **** **** {{ paymentMethod.last4 }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Son Kullanma: {{ paymentMethod.expiry }}
                  </p>
                </div>
              </div>
              <button @click="updatePaymentMethod" class="mt-4 update-button">
                Ödeme Yöntemini Güncelle
              </button>
            </div>
          </div>
  
          <!-- Fatura Ayarları -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-900">Fatura Ayarları</h4>
            <div class="mt-2 space-y-4">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input type="checkbox" v-model="settings.autoRenew" 
                         class="checkbox" />
                </div>
                <div class="ml-3">
                  <label class="text-sm text-gray-700">Otomatik Yenileme</label>
                  <p class="text-sm text-gray-500">
                    Aboneliğiniz otomatik olarak yenilensin
                  </p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input type="checkbox" v-model="settings.emailNotifications" 
                         class="checkbox" />
                </div>
                <div class="ml-3">
                  <label class="text-sm text-gray-700">Fatura Bildirimleri</label>
                  <p class="text-sm text-gray-500">
                    Fatura ödemeleriniz hakkında email bildirimleri alın
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Aksiyon Butonları -->
          <div class="mt-8 flex justify-end space-x-4">
            <button @click="cancelSubscription" class="cancel-button">
              Aboneliği İptal Et
            </button>
            <button @click="saveSettings" class="save-button">
              Ayarları Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue'
  
  export default {
    name: 'SubscriptionSettings',
    
    props: {
      currentPlan: {
        type: Object,
        required: true
      },
      paymentMethod: {
        type: Object,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      renewalDate: {
        type: String,
        required: true
      }
    },
  
    setup(props, { emit }) {
      const settings = ref({
        autoRenew: true,
        emailNotifications: true
      })
  
      const getStatusClass = computed(() => {
        const classes = {
          active: 'bg-green-100 text-green-800',
          suspended: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800'
        }
        return classes[props.status]
      })
  
      const updatePaymentMethod = () => {
        emit('update-payment')
      }
  
      const cancelSubscription = () => {
        emit('cancel-subscription')
      }
  
      const saveSettings = () => {
        emit('save-settings', settings.value)
      }
  
      return {
        settings,
        getStatusClass,
        updatePaymentMethod,
        cancelSubscription,
        saveSettings
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .checkbox {
    @apply h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded;
  }
  
  .update-button {
    @apply text-sm text-primary-600 hover:text-primary-900;
  }
  
  .cancel-button {
    @apply inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md 
           shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }
  
  .save-button {
    @apply inline-flex justify-center py-2 px-4 border border-transparent rounded-md 
           shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 
           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500;
  }
  </style>