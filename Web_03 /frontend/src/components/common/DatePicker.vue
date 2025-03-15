<template>
  <div class="relative">
    <input
      type="text"
      :value="formattedDate"
      readonly
      @click="toggleCalendar"
      class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      :class="{ 'border-red-500': error }"
      :placeholder="placeholder"
    />

    <!-- Takvim -->
    <div
      v-if="showCalendar"
      class="absolute z-10 mt-1 w-64 bg-white rounded-md shadow-lg"
    >
      <div class="p-2">
        <!-- Başlık -->
        <div class="flex items-center justify-between mb-2">
          <button
            @click="previousMonth"
            class="p-1 hover:bg-gray-100 rounded-full"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="text-sm font-medium">
            {{ currentMonthName }} {{ currentYear }}
          </span>
          <button
            @click="nextMonth"
            class="p-1 hover:bg-gray-100 rounded-full"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Haftanın Günleri -->
        <div class="grid grid-cols-7 gap-1 mb-1">
          <span
            v-for="day in weekDays"
            :key="day"
            class="text-center text-xs font-medium text-gray-500"
          >
            {{ day }}
          </span>
        </div>

        <!-- Günler -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="date in calendarDays"
            :key="date.getTime()"
            @click="selectDate(date)"
            :disabled="isDisabled(date)"
            class="p-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none"
            :class="{
              'bg-blue-50 text-blue-600': isSelected(date),
              'text-gray-400': !isSameMonth(date),
              'text-gray-300': isDisabled(date)
            }"
          >
            {{ date.getDate() }}
          </button>
        </div>

        <!-- Bugün Butonu -->
        <div class="mt-2 text-center border-t pt-2">
          <button
            @click="selectToday"
            class="text-sm text-blue-600 hover:text-blue-700"
          >
            Bugün
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
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns'
import { tr } from 'date-fns/locale'

export default {
  name: 'DatePicker',

  props: {
    modelValue: {
      type: Date,
      default: null
    },
    minDate: {
      type: Date,
      default: null
    },
    maxDate: {
      type: Date,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Tarih seçin'
    },
    error: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const showCalendar = ref(false)
    const currentDate = ref(props.modelValue || new Date())

    const weekDays = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz']

    const currentMonthName = computed(() => {
      return format(currentDate.value, 'MMMM', { locale: tr })
    })

    const currentYear = computed(() => {
      return currentDate.value.getFullYear()
    })

    const calendarDays = computed(() => {
      const start = startOfMonth(currentDate.value)
      const end = endOfMonth(currentDate.value)
      return eachDayOfInterval({ start, end })
    })

    const formattedDate = computed(() => {
      return props.modelValue
        ? format(props.modelValue, 'dd.MM.yyyy')
        : ''
    })

    const toggleCalendar = () => {
      showCalendar.value = !showCalendar.value
    }

    const previousMonth = () => {
      currentDate.value = subMonths(currentDate.value, 1)
    }

    const nextMonth = () => {
      currentDate.value = addMonths(currentDate.value, 1)
    }

    const selectDate = (date) => {
      emit('update:modelValue', date)
      showCalendar.value = false
    }

    const selectToday = () => {
      const today = new Date()
      if (!isDisabled(today)) {
        selectDate(today)
      }
    }

    const isSelected = (date) => {
      return props.modelValue && isSameDay(date, props.modelValue)
    }

    const isSameMonth = (date) => {
      return date.getMonth() === currentDate.value.getMonth()
    }

    const isDisabled = (date) => {
      if (props.minDate && date < props.minDate) return true
      if (props.maxDate && date > props.maxDate) return true
      return false
    }

    return {
      showCalendar,
      weekDays,
      currentMonthName,
      currentYear,
      calendarDays,
      formattedDate,
      toggleCalendar,
      previousMonth,
      nextMonth,
      selectDate,
      selectToday,
      isSelected,
      isSameMonth,
      isDisabled
    }
  }
}
</script> 