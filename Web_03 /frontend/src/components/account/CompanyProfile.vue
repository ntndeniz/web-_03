<template>
  <div class="company-profile">
    <h3 class="text-lg font-medium text-gray-900 mb-4">Şirket Profili</h3>

    <!-- Temel Bilgiler -->
    <div class="section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Temel Bilgiler</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="form-group">
          <label class="form-label">Şirket Adı</label>
          <input
            type="text"
            v-model="profile.companyName"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label class="form-label">Vergi Numarası</label>
          <input
            type="text"
            v-model="profile.taxNumber"
            class="form-input"
            @input="validateTaxNumber"
          >
          <p v-if="errors.taxNumber" class="error-text">
            {{ errors.taxNumber }}
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Telefon</label>
          <input
            type="tel"
            v-model="profile.phone"
            class="form-input"
          >
        </div>

        <div class="form-group">
          <label class="form-label">E-posta</label>
          <input
            type="email"
            v-model="profile.email"
            class="form-input"
          >
        </div>
      </div>
    </div>

    <!-- Adres Bilgileri -->
    <div class="section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Adres Bilgileri</h4>
      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">Adres</label>
          <textarea
            v-model="profile.address"
            rows="3"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="form-label">Şehir</label>
            <input
              type="text"
              v-model="profile.city"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Ülke</label>
            <select
              v-model="profile.country"
              class="form-select"
            >
              <option value="">Ülke Seçin</option>
              <option 
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
              >
                {{ country.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Posta Kodu</label>
            <input
              type="text"
              v-model="profile.postalCode"
              class="form-input"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Logo ve Marka -->
    <div class="section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Logo ve Marka</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="logo-upload">
          <label class="form-label">Şirket Logosu</label>
          <div class="mt-2">
            <div 
              class="upload-area"
              @click="$refs.logoInput.click()"
              @dragover.prevent
              @drop.prevent="handleLogoDrop"
            >
              <input
                type="file"
                ref="logoInput"
                class="hidden"
                accept="image/*"
                @change="handleLogoSelect"
              >
              <div v-if="profile.logo" class="preview">
                <img :src="profile.logo" alt="Logo" class="preview-image">
                <button 
                  class="remove-button"
                  @click.stop="removeLogo"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-else class="upload-placeholder">
                <i class="fas fa-cloud-upload-alt text-2xl text-gray-400 mb-2"></i>
                <p class="text-sm text-gray-600">
                  Logo yüklemek için tıklayın veya sürükleyin
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="brand-colors">
          <label class="form-label">Marka Renkleri</label>
          <div class="grid grid-cols-2 gap-4 mt-2">
            <div class="color-picker">
              <label class="text-sm text-gray-600">Ana Renk</label>
              <input
                type="color"
                v-model="profile.brandColors.primary"
                class="form-color"
              >
            </div>
            <div class="color-picker">
              <label class="text-sm text-gray-600">İkincil Renk</label>
              <input
                type="color"
                v-model="profile.brandColors.secondary"
                class="form-color"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sosyal Medya -->
    <div class="section mb-8">
      <h4 class="text-sm font-medium text-gray-900 mb-4">Sosyal Medya</h4>
      <div class="space-y-4">
        <div 
          v-for="(platform, index) in socialPlatforms"
          :key="index"
          class="form-group"
        >
          <label class="form-label">{{ platform.label }}</label>
          <div class="flex">
            <span class="platform-prefix">
              {{ platform.prefix }}
            </span>
            <input
              type="text"
              v-model="profile.socialMedia[platform.key]"
              class="form-input flex-1"
              :placeholder="platform.placeholder"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Kaydet Butonu -->
    <div class="actions">
      <button 
        class="save-button"
        :disabled="isSaving"
        @click="saveProfile"
      >
        <i class="fas fa-save mr-2"></i>
        {{ isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'CompanyProfile',

  setup() {
    const profile = reactive({
      companyName: '',
      taxNumber: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      logo: null,
      brandColors: {
        primary: '#000000',
        secondary: '#ffffff'
      },
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      }
    })

    const errors = reactive({
      taxNumber: ''
    })

    const isSaving = ref(false)

    const countries = [
      { code: 'TR', name: 'Türkiye' },
      { code: 'US', name: 'Amerika Birleşik Devletleri' },
      { code: 'GB', name: 'Birleşik Krallık' },
      { code: 'DE', name: 'Almanya' }
      // Diğer ülkeler...
    ]

    const socialPlatforms = [
      {
        key: 'facebook',
        label: 'Facebook',
        prefix: 'facebook.com/',
        placeholder: 'sayfaadi'
      },
      {
        key: 'twitter',
        label: 'Twitter',
        prefix: 'twitter.com/',
        placeholder: 'kullaniciadi'
      },
      {
        key: 'instagram',
        label: 'Instagram',
        prefix: 'instagram.com/',
        placeholder: 'kullaniciadi'
      },
      {
        key: 'linkedin',
        label: 'LinkedIn',
        prefix: 'linkedin.com/company/',
        placeholder: 'sirket-adi'
      }
    ]

    const validateTaxNumber = () => {
      if (!/^\d{10}$/.test(profile.taxNumber)) {
        errors.taxNumber = 'Vergi numarası 10 haneli olmalıdır'
      } else {
        errors.taxNumber = ''
      }
    }

    const handleLogoSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          profile.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const handleLogoDrop = (event) => {
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          profile.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const removeLogo = () => {
      profile.logo = null
    }

    const saveProfile = async () => {
      try {
        isSaving.value = true
        // API çağrısı burada yapılacak
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Profil kaydedildi:', profile)
      } catch (error) {
        console.error('Hata:', error)
      } finally {
        isSaving.value = false
      }
    }

    return {
      profile,
      errors,
      isSaving,
      countries,
      socialPlatforms,
      validateTaxNumber,
      handleLogoSelect,
      handleLogoDrop,
      removeLogo,
      saveProfile
    }
  }
}
</script>

<style lang="scss" scoped>
.company-profile {
  @apply bg-white rounded-lg p-6;

  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }

  .form-input,
  .form-select,
  .form-textarea {
    @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm
           focus:border-primary-500 focus:ring-primary-500 sm:text-sm;
  }

  .error-text {
    @apply mt-1 text-sm text-red-600;
  }

  .upload-area {
    @apply border-2 border-dashed border-gray-300 rounded-lg p-6
           flex flex-col items-center justify-center cursor-pointer
           hover:border-primary-500 transition-colors duration-150;

    .preview {
      @apply relative w-full;

      .preview-image {
        @apply w-full h-48 object-contain;
      }

      .remove-button {
        @apply absolute top-2 right-2 p-1 rounded-full bg-red-100
               text-red-600 hover:bg-red-200 transition-colors duration-150;
      }
    }
  }

  .form-color {
    @apply w-full h-10 p-1 rounded border border-gray-300;
  }

  .platform-prefix {
    @apply inline-flex items-center px-3 rounded-l-md border border-r-0
           border-gray-300 bg-gray-50 text-gray-500 sm:text-sm;
  }

  .save-button {
    @apply inline-flex items-center justify-center px-6 py-3 border border-transparent
           rounded-md shadow-sm text-base font-medium text-white bg-primary-600
           hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2
           focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
</style> 