<template>
  <div class="google-maps-container">
    <div ref="mapContainer" class="map-container"></div>
    
    <div v-if="loading" class="loading-overlay">
      <LoadingSpinner />
    </div>

    <div class="map-controls" v-if="!loading">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Konum ara..."
        class="search-input"
        @keyup.enter="searchLocation"
      />
      
      <div class="control-buttons">
        <button @click="getCurrentLocation" class="control-button">
          <i class="fas fa-location-arrow"></i>
        </button>
        <button @click="zoomIn" class="control-button">
          <i class="fas fa-plus"></i>
        </button>
        <button @click="zoomOut" class="control-button">
          <i class="fas fa-minus"></i>
        </button>
      </div>
    </div>

    <div v-if="selectedLocation" class="location-info">
      <h3>{{ selectedLocation.name }}</h3>
      <p>{{ selectedLocation.address }}</p>
      <div class="location-actions">
        <button @click="getDirections" class="action-button">
          Yol Tarifi Al
        </button>
        <button @click="saveLocation" class="action-button">
          Kaydet
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { loadGoogleMapsScript } from '@/utils/googleMaps'
import { notify } from '@/utils/notification'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

export default {
  name: 'GoogleMaps',

  components: {
    LoadingSpinner
  },

  props: {
    apiKey: {
      type: String,
      required: true
    },
    initialCenter: {
      type: Object,
      default: () => ({ lat: 41.0082, lng: 28.9784 }) // İstanbul
    },
    initialZoom: {
      type: Number,
      default: 13
    }
  },

  setup(props) {
    const store = useStore()
    const mapContainer = ref(null)
    const map = ref(null)
    const loading = ref(true)
    const searchQuery = ref('')
    const selectedLocation = ref(null)

    // Google Maps yükleme ve başlatma
    onMounted(async () => {
      try {
        await loadGoogleMapsScript(props.apiKey)
        initializeMap()
      } catch (error) {
        notify.error('Harita yüklenemedi')
        console.error('Maps Error:', error)
      }
    })

    // Harita temizleme
    onUnmounted(() => {
      if (map.value) {
        map.value = null
      }
    })

    const initializeMap = () => {
      const mapOptions = {
        center: props.initialCenter,
        zoom: props.initialZoom,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
      }

      map.value = new google.maps.Map(mapContainer.value, mapOptions)
      loading.value = false
    }

    // Konum arama
    const searchLocation = async () => {
      if (!searchQuery.value) return

      const geocoder = new google.maps.Geocoder()
      
      try {
        const result = await geocoder.geocode({ address: searchQuery.value })
        if (result.results[0]) {
          const location = result.results[0].geometry.location
          map.value.setCenter(location)
          setSelectedLocation(result.results[0])
        }
      } catch (error) {
        notify.error('Konum bulunamadı')
      }
    }

    // Mevcut konumu al
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        notify.error('Konum servisi desteklenmiyor')
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          map.value.setCenter(pos)
        },
        () => {
          notify.error('Konum alınamadı')
        }
      )
    }

    // Zoom işlemleri
    const zoomIn = () => map.value.setZoom(map.value.getZoom() + 1)
    const zoomOut = () => map.value.setZoom(map.value.getZoom() - 1)

    // Seçili konum işlemleri
    const setSelectedLocation = (place) => {
      selectedLocation.value = {
        name: place.formatted_address,
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
    }

    const getDirections = () => {
      if (!selectedLocation.value) return
      
      const url = `https://www.google.com/maps/dir/?api=1&destination=${
        selectedLocation.value.coordinates.lat
      },${selectedLocation.value.coordinates.lng}`
      
      window.open(url, '_blank')
    }

    const saveLocation = () => {
      if (!selectedLocation.value) return
      
      store.dispatch('locations/saveLocation', selectedLocation.value)
      notify.success('Konum kaydedildi')
    }

    return {
      mapContainer,
      loading,
      searchQuery,
      selectedLocation,
      searchLocation,
      getCurrentLocation,
      zoomIn,
      zoomOut,
      getDirections,
      saveLocation
    }
  }
}
</script>

<style scoped>
.google-maps-container {
  @apply relative w-full h-[500px] rounded-lg overflow-hidden;
}

.map-container {
  @apply w-full h-full;
}

.loading-overlay {
  @apply absolute inset-0 flex items-center justify-center bg-white bg-opacity-75;
}

.map-controls {
  @apply absolute top-4 left-4 right-4 flex gap-4;
}

.search-input {
  @apply flex-1 px-4 py-2 bg-white rounded-md shadow-md;
}

.control-buttons {
  @apply flex gap-2;
}

.control-button {
  @apply p-2 bg-white rounded-md shadow-md hover:bg-gray-50;
}

.location-info {
  @apply absolute bottom-4 left-4 right-4 p-4 bg-white rounded-md shadow-md;
}

.location-actions {
  @apply flex gap-4 mt-4;
}

.action-button {
  @apply flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700;
}
</style> 