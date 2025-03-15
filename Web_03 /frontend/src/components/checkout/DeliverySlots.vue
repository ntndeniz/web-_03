<template>
  <div class="delivery-slots">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Teslimat Zamanı Seçimi</h3>

    <!-- Tarih Seçimi -->
    <div class="date-selection mb-6">
      <div class="flex space-x-4 overflow-x-auto pb-2">
        <button
          v-for="date in availableDates"
          :key="date.value"
          class="date-option"
          :class="{ 'selected': selectedDate === date.value }"
          @click="selectDate(date.value)"
        >
          <span class="text-sm font-medium">{{ date.dayName }}</span>
          <span class="text-lg font-bold">{{ date.day }}</span>
          <span class="text-sm">{{ date.month }}</span>
        </button>
      </div>
    </div>

    <!-- Saat Aralıkları -->
    <div v-if="selectedDate" class="time-slots">
      <h4 class="text-sm font-medium text-gray-900 mb-3">Teslimat Saati</h4>
      
      <div class="grid grid-cols-2 gap-4">
        <button
          v-for="slot in availableTimeSlots"
          :key="slot.id"
          class="time-slot"
          :class="{
            'selected': selectedSlot === slot.id,
            'disabled': !slot.available
          }"
          :disabled="!slot.available"
          @click="selectTimeSlot(slot)"
        >
          <div class="slot-content">
            <div class="time-range">
              <i class="fas fa-clock mr-2"></i>
              {{ slot.startTime }} - {{ slot.endTime }}
            </div>
            <div class="slot-info">
              <span v-if="slot.available" class="availability">
                {{ slot.remainingSlots }} slot kaldı
              </span>
              <span v-else class="text-red-500 text-sm">
                Dolu
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Teslimat Notu -->
    <div v-if="selectedSlot" class="delivery-note mt-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Teslimat Notu
      </label>
      <textarea
        v-model="deliveryNote"
        rows="3"
        class="form-textarea"
        placeholder="Teslimat görevlisi için özel notunuz..."
      ></textarea>
    </div>

    <!-- Temassız Teslimat -->
    <div class="contactless-delivery mt-4">
      <div class="flex items-center">
        <input
          type="checkbox"
          v-model="contactless"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
        >
        <label class="ml-2 text-sm text-gray-700">
          Temassız teslimat istiyorum
        </label>
      </div>
    </div>

    <!-- Seçim Onayı -->
    <div class="confirmation mt-6 pt-6 border-t border-gray-200">
      <div v-if="selectedDate && selectedSlot" class="selected-info mb-4">
        <p class="text-sm text-gray-600">Seçilen Teslimat Zamanı:</p>
        <p class="text-base font-medium text-gray-900">
          {{ formatSelectedDateTime() }}
        </p>
      </div>
      <button
        class="confirm-button w-full"
        :disabled="!selectedDate || !selectedSlot"
        @click="confirmSelection"
      >
        Teslimat Zamanını Onayla
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatDate } from '@/utils/date'

export default {
  name: 'DeliverySlots',

  props: {
    availableDates: {
      type: Array,
      required: true
    }
  },

  setup(props, { emit }) {
    const selectedDate = ref(null)
    const selectedSlot = ref(null)
    const deliveryNote = ref('')
    const contactless = ref(false)

    const availableTimeSlots = computed(() => {
      if (!selectedDate.value) return []
      return [
        {
          id: 'morning',
          startTime: '09:00',
          endTime: '12:00',
          available: true,
          remainingSlots: 5
        },
        {
          id: 'afternoon',
          startTime: '13:00',
          endTime: '17:00',
          available: true,
          remainingSlots: 3
        },
        {
          id: 'evening',
          startTime: '18:00',
          endTime: '21:00',
          available: false,
          remainingSlots: 0
        }
      ]
    })

    const selectDate = (date) => {
      selectedDate.value = date
      selectedSlot.value = null
    }

    const selectTimeSlot = (slot) => {
      if (slot.available) {
        selectedSlot.value = slot.id
      }
    }

    const formatSelectedDateTime = () => {
      if (!selectedDate.value || !selectedSlot.value) return ''
      
      const date = props.availableDates.find(d => d.value === selectedDate.value)
      const slot = availableTimeSlots.value.find(s => s.id === selectedSlot.value)
      
      return `${date.dayName}, ${date.day} ${date.month} ${slot.startTime} - ${slot.endTime}`
    }

    const confirmSelection = () => {
      emit('confirm', {
        date: selectedDate.value,
        timeSlot: selectedSlot.value,
        note: deliveryNote.value,
        contactless: contactless.value
      })
    }

    return {
      selectedDate,
      selectedSlot,
      deliveryNote,
      contactless,
      availableTimeSlots,
      formatSelectedDateTime,
      selectDate,
      selectTimeSlot,
      confirmSelection
    }
  }
}
</script>

<style lang="scss" scoped>
.delivery-slots {
  @apply bg-white rounded-lg p-6;

  .date-option {
    @apply flex flex-col items-center min-w-[80px] p-3 rounded-lg border-2
           border-gray-200 hover:border-primary-200 transition-all;

    &.selected {
      @apply border-primary-500 bg-primary-50;
    }
  }

  .time-slot {
    @apply relative p-4 rounded-lg border-2 border-gray-200 hover:border-primary-200
           transition-all text-left;

    &.selected {
      @apply border-primary-500 ring-2 ring-primary-500;
    }

    &.disabled {
      @apply opacity-50 cursor-not-allowed hover:border-gray-200;
    }
  }

  .form-textarea {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .confirm-button {
    @apply inline-flex items-center justify-center px-6 py-3 border border-transparent
           rounded-md shadow-sm text-base font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
</style> 