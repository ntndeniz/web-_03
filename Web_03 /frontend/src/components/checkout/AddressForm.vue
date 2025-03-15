<template>
  <form @submit.prevent="saveAddress" class="space-y-4 mt-4">
    <div>
      <label class="block mb-1">Adres Başlığı</label>
      <input 
        v-model="address.title"
        type="text"
        class="w-full px-4 py-2 border rounded-lg"
        placeholder="Ev, İş vb."
        required
      />
    </div>

    <div>
      <label class="block mb-1">Ad Soyad</label>
      <input 
        v-model="address.fullName"
        type="text"
        class="w-full px-4 py-2 border rounded-lg"
        required
      />
    </div>

    <div>
      <label class="block mb-1">Telefon</label>
      <input 
        v-model="address.phone"
        type="tel"
        class="w-full px-4 py-2 border rounded-lg"
        required
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block mb-1">İl</label>
        <select 
          v-model="address.city"
          class="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Seçiniz</option>
          <option v-for="city in cities" :key="city" :value="city">
            {{ city }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block mb-1">İlçe</label>
        <select 
          v-model="address.district"
          class="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Seçiniz</option>
          <option v-for="district in districts" :key="district" :value="district">
            {{ district }}
          </option>
        </select>
      </div>
    </div>

    <div>
      <label class="block mb-1">Açık Adres</label>
      <textarea 
        v-model="address.fullAddress"
        rows="3"
        class="w-full px-4 py-2 border rounded-lg"
        required
      ></textarea>
    </div>

    <div class="flex justify-end gap-4">
      <button 
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        İptal
      </button>
      <button 
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Kaydet
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'AddressForm',
  data() {
    return {
      address: {
        title: '',
        fullName: '',
        phone: '',
        city: '',
        district: '',
        fullAddress: ''
      },
      cities: [
        'İstanbul',
        'Ankara',
        'İzmir',
        // ... diğer şehirler
      ],
      districts: [
        'Kadıköy',
        'Beşiktaş',
        'Üsküdar',
        // ... diğer ilçeler
      ]
    }
  },
  methods: {
    saveAddress() {
      this.$emit('save', { ...this.address })
    }
  }
}
</script> 