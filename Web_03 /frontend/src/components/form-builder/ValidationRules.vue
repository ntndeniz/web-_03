<template>
  <div class="validation-rules">
    <!-- Doğrulama Kuralları Başlığı -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold">Doğrulama Kuralları</h3>
      <p class="text-sm text-gray-600">Form alanları için doğrulama kuralları</p>
    </div>

    <!-- Kural Ekleme Formu -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 mb-6">
      <form @submit.prevent="addRule" class="space-y-4">
        <!-- Kural Tipi -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Kural Tipi
          </label>
          <select
            v-model="newRule.type"
            class="form-select w-full"
            required
          >
            <option value="">Seçiniz</option>
            <option
              v-for="type in availableRuleTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Kural Parametreleri -->
        <div v-if="newRule.type">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Parametreler
          </label>
          
          <!-- Metin Parametresi -->
          <input
            v-if="currentRuleType.paramType === 'text'"
            v-model="newRule.params"
            type="text"
            class="form-input w-full"
            :placeholder="currentRuleType.paramPlaceholder"
          >

          <!-- Sayı Parametresi -->
          <input
            v-else-if="currentRuleType.paramType === 'number'"
            v-model.number="newRule.params"
            type="number"
            class="form-input w-full"
            :min="currentRuleType.min"
            :max="currentRuleType.max"
          >

          <!-- Regex Parametresi -->
          <input
            v-else-if="currentRuleType.paramType === 'regex'"
            v-model="newRule.params"
            type="text"
            class="form-input w-full"
            placeholder="Regex pattern"
          >
        </div>

        <!-- Hata Mesajı -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Hata Mesajı
          </label>
          <input
            v-model="newRule.message"
            type="text"
            class="form-input w-full"
            placeholder="Geçersiz değer"
            required
          >
        </div>

        <!-- Ekle Butonu -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn-primary"
          >
            Kural Ekle
          </button>
        </div>
      </form>
    </div>

    <!-- Mevcut Kurallar -->
    <div class="space-y-4">
      <div
        v-for="(rule, index) in rules"
        :key="index"
        class="bg-white p-4 rounded-lg border border-gray-200"
      >
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium">{{ getRuleTypeLabel(rule.type) }}</h4>
            <p class="text-sm text-gray-500">
              {{ rule.message }}
              <span v-if="rule.params" class="text-gray-400">
                ({{ formatParams(rule) }})
              </span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="editRule(index)"
              class="text-gray-400 hover:text-gray-600"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              @click="deleteRule(index)"
              class="text-gray-400 hover:text-red-600"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div
        v-if="!rules.length"
        class="text-center py-8 text-gray-500"
      >
        Henüz kural eklenmemiş
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ValidationRules',

  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const rules = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const availableRuleTypes = [
      { value: 'required', label: 'Zorunlu Alan', paramType: null },
      { value: 'minLength', label: 'Minimum Uzunluk', paramType: 'number' },
      { value: 'maxLength', label: 'Maksimum Uzunluk', paramType: 'number' },
      { value: 'email', label: 'E-posta', paramType: null },
      { value: 'pattern', label: 'Regex Pattern', paramType: 'regex' },
      { value: 'min', label: 'Minimum Değer', paramType: 'number' },
      { value: 'max', label: 'Maksimum Değer', paramType: 'number' }
    ]

    const newRule = ref({
      type: '',
      params: null,
      message: ''
    })

    const currentRuleType = computed(() => {
      return availableRuleTypes.find(type => type.value === newRule.value.type)
    })

    const addRule = () => {
      rules.value = [...rules.value, { ...newRule.value }]
      newRule.value = { type: '', params: null, message: '' }
    }

    const editRule = (index) => {
      newRule.value = { ...rules.value[index] }
      rules.value.splice(index, 1)
    }

    const deleteRule = (index) => {
      rules.value = rules.value.filter((_, i) => i !== index)
    }

    const getRuleTypeLabel = (type) => {
      return availableRuleTypes.find(t => t.value === type)?.label || type
    }

    const formatParams = (rule) => {
      if (rule.type === 'pattern') {
        return rule.params
      }
      return rule.params !== null ? `Değer: ${rule.params}` : ''
    }

    return {
      rules,
      newRule,
      availableRuleTypes,
      currentRuleType,
      addRule,
      editRule,
      deleteRule,
      getRuleTypeLabel,
      formatParams
    }
  }
}
</script>

<style scoped>
.form-input,
.form-select {
  @apply border border-gray-300 rounded-md px-3 py-2 focus:ring-2 
         focus:ring-primary-500 focus:border-primary-500 outline-none;
}

.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-md
         hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style> 