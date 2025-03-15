<template>
  <div class="field-types">
    <!-- Alan Tipleri Başlığı -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold">Alan Tipleri</h3>
      <p class="text-sm text-gray-600">Formunuza ekleyebileceğiniz alan tipleri</p>
    </div>

    <!-- Alan Tipleri Listesi -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="type in fieldTypes"
        :key="type.id"
        class="field-type-card"
        draggable="true"
        @dragstart="handleDragStart($event, type)"
      >
        <div class="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-500 cursor-move">
          <div class="flex items-start justify-between">
            <div>
              <h4 class="font-medium text-gray-900">{{ type.label }}</h4>
              <p class="mt-1 text-sm text-gray-500">{{ type.description }}</p>
            </div>
            <i :class="type.icon" class="text-xl text-gray-400"></i>
          </div>

          <!-- Örnek Görünüm -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <component
              :is="type.preview"
              v-bind="type.defaultProps"
              disabled
            />
          </div>

          <!-- Özellikler -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <h5 class="text-sm font-medium text-gray-700 mb-2">Özellikler:</h5>
            <ul class="text-sm text-gray-500 space-y-1">
              <li
                v-for="(prop, index) in type.availableProps"
                :key="index"
                class="flex items-center"
              >
                <i class="fas fa-check text-xs text-green-500 mr-2"></i>
                {{ prop }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Alan Tipi Detayları -->
    <div
      v-if="selectedType"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click.self="selectedType = null"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-4">{{ selectedType.label }}</h3>
          <div class="space-y-4">
            <!-- Detaylı Açıklama -->
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Açıklama</h4>
              <p class="text-gray-600">{{ selectedType.description }}</p>
            </div>

            <!-- Kullanım Örneği -->
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Kullanım Örneği</h4>
              <pre class="bg-gray-50 p-4 rounded-md text-sm">{{ selectedType.usage }}</pre>
            </div>

            <!-- Özellikler -->
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Özellikler</h4>
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="(prop, key) in selectedType.props"
                  :key="key"
                  class="bg-gray-50 p-3 rounded-md"
                >
                  <div class="font-medium text-sm">{{ key }}</div>
                  <div class="text-sm text-gray-500">{{ prop.description }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Kapat Butonu -->
          <div class="mt-6 flex justify-end">
            <button
              @click="selectedType = null"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { fieldTypes as availableFieldTypes } from '@/constants/fieldTypes'

export default {
  name: 'FieldTypes',

  emits: ['field-selected'],

  setup(props, { emit }) {
    const selectedType = ref(null)
    const fieldTypes = availableFieldTypes

    const handleDragStart = (event, type) => {
      event.dataTransfer.setData('field-type', JSON.stringify(type))
      emit('field-selected', type)
    }

    return {
      selectedType,
      fieldTypes,
      handleDragStart
    }
  }
}
</script>

<style scoped>
.field-type-card {
  @apply transition-all duration-200;
}

.field-type-card:hover {
  @apply transform -translate-y-1 shadow-md;
}
</style> 