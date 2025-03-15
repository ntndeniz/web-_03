<template>
  <div class="relative">
    <!-- Seçili Renk Gösterimi -->
    <div
      class="w-full h-10 rounded-md border shadow-sm cursor-pointer"
      :style="{ backgroundColor: modelValue || '#FFFFFF' }"
      @click="togglePicker"
    >
      <div
        v-if="!modelValue"
        class="w-full h-full flex items-center justify-center text-gray-400"
      >
        Renk seçin
      </div>
    </div>

    <!-- Renk Seçici -->
    <div
      v-if="showPicker"
      class="absolute z-10 mt-1 p-4 bg-white rounded-md shadow-lg"
    >
      <!-- Renk Paleti -->
      <div class="grid grid-cols-8 gap-2">
        <button
          v-for="color in defaultColors"
          :key="color"
          @click="selectColor(color)"
          class="w-6 h-6 rounded-full border shadow-sm hover:scale-110 transition-transform"
          :style="{ backgroundColor: color }"
          :class="{ 'ring-2 ring-offset-2 ring-blue-500': modelValue === color }"
        ></button>
      </div>

      <!-- Özel Renk Seçimi -->
      <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Özel Renk
        </label>
        <div class="flex space-x-2">
          <input
            v-model="customColor"
            type="color"
            class="h-8 w-8 rounded border shadow-sm cursor-pointer"
          />
          <input
            v-model="customColor"
            type="text"
            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="#FFFFFF"
          />
          <button
            @click="selectColor(customColor)"
            class="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Uygula
          </button>
        </div>
      </div>

      <!-- Butonlar -->
      <div class="mt-4 flex justify-end space-x-2">
        <button
          @click="clearColor"
          class="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
        >
          Temizle
        </button>
        <button
          @click="closePicker"
          class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
        >
          Kapat
        </button>
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
  name: 'ColorPicker',

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const showPicker = ref(false)
    const customColor = ref('#FFFFFF')

    // Varsayılan renk paleti
    const defaultColors = [
      '#FF0000', '#FF4D00', '#FF9900', '#FFCC00', 
      '#FFFF00', '#B2FF00', '#66FF00', '#1AFF00',
      '#00FF19', '#00FF66', '#00FFB2', '#00FFFF',
      '#00B2FF', '#0066FF', '#001AFF', '#1900FF',
      '#6600FF', '#B200FF', '#FF00FF', '#FF00B2',
      '#FF0066', '#FF001A', '#000000', '#808080',
      '#C0C0C0', '#FFFFFF', '#800000', '#808000',
      '#008000', '#800080', '#008080', '#000080'
    ]

    const togglePicker = () => {
      showPicker.value = !showPicker.value
      if (showPicker.value && props.modelValue) {
        customColor.value = props.modelValue
      }
    }

    const selectColor = (color) => {
      emit('update:modelValue', color)
    }

    const clearColor = () => {
      emit('update:modelValue', '')
      customColor.value = '#FFFFFF'
    }

    const closePicker = () => {
      showPicker.value = false
    }

    return {
      showPicker,
      customColor,
      defaultColors,
      togglePicker,
      selectColor,
      clearColor,
      closePicker
    }
  }
}
</script> 