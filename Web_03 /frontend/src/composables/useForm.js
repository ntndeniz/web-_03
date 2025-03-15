import { ref } from 'vue'
import { useField, useForm } from 'vee-validate'

export function useFormValidation(schema) {
  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema
  })

  const isSubmitting = ref(false)
  const submitError = ref(null)

  const onSubmit = async (submitFn) => {
    isSubmitting.value = true
    submitError.value = null

    try {
      await handleSubmit(submitFn)()
    } catch (error) {
      submitError.value = error.message
    } finally {
      isSubmitting.value = false
    }
  }

  const reset = () => {
    resetForm()
    submitError.value = null
  }

  return {
    errors,
    isSubmitting,
    submitError,
    onSubmit,
    reset,
    useField
  }
}

export function useFormFields(fields) {
  const formFields = {}

  fields.forEach(field => {
    const { value, errorMessage } = useField(field)
    formFields[field] = {
      value,
      error: errorMessage
    }
  })

  return formFields
}

export function useAddressForm() {
  const initialValues = {
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    zipCode: '',
    isDefault: false
  }

  const { handleSubmit, values, errors, resetForm } = useForm({
    initialValues
  })

  const reset = () => {
    resetForm()
  }

  return {
    values,
    errors,
    handleSubmit,
    reset
  }
}

export function usePaymentForm() {
  const initialValues = {
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  }

  const { handleSubmit, values, errors, resetForm } = useForm({
    initialValues
  })

  const reset = () => {
    resetForm()
  }

  return {
    values,
    errors,
    handleSubmit,
    reset
  }
} 