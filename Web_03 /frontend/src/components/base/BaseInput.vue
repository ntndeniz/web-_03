<template>
  <div class="base-input">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-wrapper" :class="{ 'has-error': !!error }">
      <input
        :id="id"
        ref="input"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input-field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <div v-if="$slots.suffix" class="input-suffix">
        <slot name="suffix" />
      </div>
    </div>
    
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="hint" class="hint-text">{{ hint }}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default() {
        return `input-${Math.random().toString(36).substr(2, 9)}`
      }
    }
  },
  
  emits: ['update:modelValue', 'blur', 'focus', 'input'],
  
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
      this.$emit('input', event)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
    focus() {
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
.base-input {
  @apply space-y-1;
}

.input-label {
  @apply block text-sm font-medium text-gray-700;
}

.required-mark {
  @apply text-red-500 ml-1;
}

.input-wrapper {
  @apply relative rounded-md;
  
  &.has-error {
    .input-field {
      @apply border-red-500 focus:border-red-500 focus:ring-red-500;
    }
  }
}

.input-field {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         focus:ring-2 focus:ring-primary-500 focus:border-primary-500
         disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.input-suffix {
  @apply absolute inset-y-0 right-0 flex items-center pr-3;
}

.error-message {
  @apply text-sm text-red-500;
}

.hint-text {
  @apply text-sm text-gray-500;
}
</style> 