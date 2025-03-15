<template>
  <Modal v-model="isOpen" maxWidth="sm">
    <div class="p-6">
      <!-- Başlık -->
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {{ title }}
      </h3>

      <!-- Mesaj -->
      <p class="text-sm text-gray-500 mb-6">
        {{ message }}
      </p>

      <!-- Butonlar -->
      <div class="flex justify-end space-x-3">
        <button
          @click="cancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ cancelText }}
        </button>
        <button
          @click="confirm"
          :class="[
            'px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
            type === 'danger' 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { ref } from 'vue'
import Modal from './Modal.vue'

export default {
  name: 'ConfirmDialog',

  components: {
    Modal
  },

  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'Onayla'
    },
    cancelText: {
      type: String,
      default: 'İptal'
    },
    type: {
      type: String,
      default: 'primary',
      validator: value => ['primary', 'danger'].includes(value)
    }
  },

  emits: ['confirm', 'cancel'],

  setup(props, { emit }) {
    const isOpen = ref(false)

    const open = () => {
      isOpen.value = true
    }

    const confirm = () => {
      emit('confirm')
      isOpen.value = false
    }

    const cancel = () => {
      emit('cancel')
      isOpen.value = false
    }

    return {
      isOpen,
      open,
      confirm,
      cancel
    }
  }
}
</script> 