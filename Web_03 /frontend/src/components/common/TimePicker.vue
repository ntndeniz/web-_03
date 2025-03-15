<template>
  <div class="relative">
    <input
      type="text"
      :value="formattedTime"
      readonly
      @click="togglePicker"
      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      :class="{ 'border-red-500': error }"
      :placeholder="placeholder"
    />

    <!-- Zaman Seçici -->
    <div
      v-if="showPicker"
      class="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg"
    >
      <div class="p-4">
        <!-- Saat ve Dakika -->
        <div class="flex justify-center space-x-4">
          <!-- Saat -->
          <div class="flex flex-col items-center">
            <button
              @click="incrementHour"
              class="p-1 hover:bg-gray-100 rounded-full"
            >
              <i class="fas fa-chevron-up"></i>
            </button>
            <input
              v-model="hour"
              type="text"
              class="w-12 text-center border-0 text-xl font-medium focus:ring-0"
              readonly
            />
            <button
              @click="decrementHour"
              class="p-1 hover:bg-gray-100 rounded-full"
            >
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>

          <div class="text-xl font-medium self-center">:</div>

          <!-- Dakika -->
          <div class="flex flex-col items-center">
            <button
              @click="incrementMinute"
              class="p-1 hover:bg-gray-100 rounded-full"
            >
              <i class="fas fa-chevron-up"></i>
            </button>
            <input
              v-model="minute"
              type="text"
              class="w-12 text-center border-0 text-xl font-medium focus:ring-0"
              readonly
            />
            <button
              @click="decrementMinute"
              class="p-1 hover:bg-gray-100 rounded-full"
            >
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        </div>

        <!-- Hızlı Seçim -->
        <div class="mt-4 grid grid-cols-3 gap-2">
          <button
            v-for="time in quickTimes"
            :key="time.value"
            @click="selectQuickTime(time.value)"
            class="px-2 py-1 text-sm rounded-md hover:bg-gray-100"
          >
            {{ time.label }}
          </button>
        </div>

        <!-- Butonlar -->
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="cancel"
            class="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
          >
            İptal
          </button>
          <button
            @click="confirm"
            class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>

    <!-- Hata Mesajı -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'TimePicker',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Saat seçin'
    },
    error: {
      type: String,
      default: ''
    },
    format24: {
      type: Boolean,
      default: true
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const showPicker = ref(false)
    const hour = ref('00')
    const minute = ref('00')

    // Hızlı seçim seçenekleri
    const quickTimes = [
      { label: 'Şimdi', value: 'now' },
      { label: '09:00', value: '09:00' },
      { label: '12:00', value: '12:00' },
      { label: '13:00', value: '13:00' },
      { label: '15:00', value: '15:00' },
      { label: '17:00', value: '17:00' }
    ]

    const formattedTime = computed(() => {
      return props.modelValue || ''
    })

    const togglePicker = () => {
      showPicker.value = !showPicker.value
      if (showPicker.value && props.modelValue) {
        const [h, m] = props.modelValue.split(':')
        hour.value = h
        minute.value = m
      }
    }

    const incrementHour = () => {
      let h = parseInt(hour.value)
      h = (h + 1) % (props.format24 ? 24 : 12)
      hour.value = h.toString().padStart(2, '0')
    }

    const decrementHour = () => {
      let h = parseInt(hour.value)
      h = (h - 1 + (props.format24 ? 24 : 12)) % (props.format24 ? 24 : 12)
      hour.value = h.toString().padStart(2, '0')
    }

    const incrementMinute = () => {
      let m = parseInt(minute.value)
      m = (m + 1) % 60
      minute.value = m.toString().padStart(2, '0')
    }

    const decrementMinute = () => {
      let m = parseInt(minute.value)
      m = (m - 1 + 60) % 60
      minute.value = m.toString().padStart(2, '0')
    }

    const selectQuickTime = (time) => {
      if (time === 'now') {
        const now = new Date()
        hour.value = now.getHours().toString().padStart(2, '0')
        minute.value = now.getMinutes().toString().padStart(2, '0')
      } else {
        const [h, m] = time.split(':')
        hour.value = h
        minute.value = m
      }
      confirm()
    }

    const confirm = () => {
      emit('update:modelValue', `${hour.value}:${minute.value}`)
      showPicker.value = false
    }

    const cancel = () => {
      showPicker.value = false
    }

    return {
      showPicker,
      hour,
      minute,
      quickTimes,
      formattedTime,
      togglePicker,
      incrementHour,
      decrementHour,
      incrementMinute,
      decrementMinute,
      selectQuickTime,
      confirm,
      cancel
    }
  }
}
</script> 