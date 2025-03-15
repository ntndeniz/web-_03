<template>
  <Form @submit="onSubmit">
    <Field
      name="email"
      type="email"
      rules="required|email"
      v-slot="{ field, errors }"
    >
      <input
        v-bind="field"
        class="form-input"
        :class="{ 'error': errors.length }"
      >
      <span class="error-message">{{ errors[0] }}</span>
    </Field>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'

export default {
  components: {
    Form,
    Field
  },
  methods: {
    onSubmit(values) {
      // form işlemleri
    }
  }
}
</script> 