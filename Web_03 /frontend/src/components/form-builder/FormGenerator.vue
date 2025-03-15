<template>
  <div class="form-generator">
    <!-- Form Başlığı -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-gray-600">{{ description }}</p>
    </div>

    <!-- Form Alanları -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-for="field in fields"
        :key="field.id"
        class="form-field"
      >
        <!-- Alan Etiketi -->
        <label :for="field.id" class="block text-sm font-medium text-gray-700 mb-1">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>

        <!-- Metin Girişi -->
        <input
          v-if="field.type === 'text'"
          :id="field.id"
          v-model="formData[field.id]"
          type="text"
          :placeholder="field.placeholder"
          :required="field.required"
          class="form-input"
          :class="{ 'border-red-500': errors[field.id] }"
        >

        <!-- Sayı Girişi -->
        <input
          v-else-if="field.type === 'number'"
          :id="field.id"
          v-model.number="formData[field.id]"
          type="number"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :required="field.required"
          class="form-input"
          :class="{ 'border-red-500': errors[field.id] }"
        >

        <!-- E-posta Girişi -->
        <input
          v-else-if="field.type === 'email'"
          :id="field.id"
          v-model="formData[field.id]"
          type="email"
          :placeholder="field.placeholder"
          :required="field.required"
          class="form-input"
          :class="{ 'border-red-500': errors[field.id] }"
        >

        <!-- Seçim Kutusu -->
        <select
          v-else-if="field.type === 'select'"
          :id="field.id"
          v-model="formData[field.id]"
          :required="field.required"
          class="form-select"
          :class="{ 'border-red-500': errors[field.id] }"
        >
          <option value="">Seçiniz</option>
          <option
            v-for="option in field.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Çoklu Seçim -->
        <div v-else-if="field.type === 'checkbox'" class="space-y-2">
          <label
            v-for="option in field.options"
            :key="option.value"
            class="flex items-center"
          >
            <input
              type="checkbox"
              :value="option.value"
              v-model="formData[field.id]"
              class="form-checkbox"
            >
            <span class="ml-2">{{ option.label }}</span>
          </label>
        </div>

        <!-- Metin Alanı -->
        <textarea
          v-else-if="field.type === 'textarea'"
          :id="field.id"
          v-model="formData[field.id]"
          :rows="field.rows || 4"
          :placeholder="field.placeholder"
          :required="field.required"
          class="form-textarea"
          :class="{ 'border-red-500': errors[field.id] }"
        ></textarea>

        <!-- Hata Mesajı -->
        <p v-if="errors[field.id]" class="mt-1 text-sm text-red-600">
          {{ errors[field.id] }}
        </p>

        <!-- Yardım Metni -->
        <p v-if="field.helpText" class="mt-1 text-sm text-gray-500">
          {{ field.helpText }}
        </p>
      </div>

      <!-- Form Butonları -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="resetForm"
          class="btn-secondary"
        >
          Sıfırla
        </button>
        <button
          type="submit"
          class="btn-primary"
          :disabled="loading"
        >
          <LoadingSpinner v-if="loading" class="w-4 h-4 mr-2" />
          {{ submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { validateField } from '@/utils/validation'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'FormGenerator',

  components: {
    LoadingSpinner
  },

  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    fields: {
      type: Array,
      required: true,
      validator: value => value.every(field => field.id && field.type && field.label)
    },
    submitButtonText: {
      type: String,
      default: 'Kaydet'
    }
  },

  emits: ['submit', 'reset'],

  setup(props, { emit }) {
    const formData = reactive({})
    const errors = reactive({})
    const loading = ref(false)

    // Form verilerini başlat
    props.fields.forEach(field => {
      formData[field.id] = field.type === 'checkbox' ? [] : ''
    })

    const validateForm = () => {
      let isValid = true
      errors.value = {}

      props.fields.forEach(field => {
        const error = validateField(formData[field.id], field)
        if (error) {
          errors[field.id] = error
          isValid = false
        }
      })

      return isValid
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      loading.value = true
      try {
        await emit('submit', formData)
        resetForm()
      } catch (error) {
        console.error('Form gönderme hatası:', error)
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      props.fields.forEach(field => {
        formData[field.id] = field.type === 'checkbox' ? [] : ''
      })
      errors.value = {}
      emit('reset')
    }

    return {
      formData,
      errors,
      loading,
      handleSubmit,
      resetForm
    }
  }
}
</script>

<style scoped>
.form-input,
.form-select,
.form-textarea {
  @apply w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 
         focus:ring-primary-500 focus:border-primary-500 outline-none;
}

.form-checkbox {
  @apply rounded border-gray-300 text-primary-600 focus:ring-primary-500;
}

.btn-primary {
  @apply flex items-center px-4 py-2 bg-primary-600 text-white rounded-md
         hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md
         hover:bg-gray-200;
}
</style> 