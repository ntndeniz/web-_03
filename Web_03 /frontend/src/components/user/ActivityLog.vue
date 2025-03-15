<template>
  <div class="activity-log">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">Aktivite Geçmişi</h1>
      <p class="text-gray-600">Son 30 günlük aktiviteleriniz</p>
    </div>

    <!-- Filtreler -->
    <div class="filters mb-6 flex gap-4">
      <select v-model="selectedType" 
              class="form-select rounded-md border-gray-300">
        <option value="">Tüm Aktiviteler</option>
        <option v-for="type in activityTypes" 
                :key="type.value" 
                :value="type.value">
          {{ type.label }}
        </option>
      </select>

      <date-range-picker v-model="dateRange" 
                        class="w-64" />
    </div>

    <!-- Aktivite Listesi -->
    <div class="activities">
      <div v-if="loading" class="loading-state">
        <loading-spinner />
      </div>

      <template v-else>
        <div v-if="filteredActivities.length" class="space-y-4">
          <div v-for="activity in filteredActivities" 
               :key="activity.id" 
               class="activity-item">
            <div class="activity-card bg-white p-4 rounded-lg shadow-sm">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">{{ activity.title }}</h3>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ activity.description }}
                  </p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="text-sm text-gray-500">
                      {{ formatDate(activity.timestamp) }}
                    </span>
                    <span :class="getStatusClass(activity.status)" 
                          class="px-2 py-1 rounded-full text-xs">
                      {{ activity.status }}
                    </span>
                  </div>
                </div>
                <button v-if="activity.canUndo" 
                        @click="undoActivity(activity)"
                        class="text-blue-600 hover:text-blue-800">
                  Geri Al
                </button>
              </div>
              
              <div v-if="activity.details" 
                   class="mt-3 pt-3 border-t">
                <div class="text-sm text-gray-600">
                  <div v-for="(value, key) in activity.details" 
                       :key="key" 
                       class="flex justify-between">
                    <span>{{ key }}:</span>
                    <span class="font-medium">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sayfalama -->
          <pagination v-model="currentPage" 
                     :total="totalPages"
                     @change="fetchActivities" />
        </div>

        <empty-state v-else
                    icon="history"
                    title="Aktivite Bulunamadı"
                    description="Seçili tarih aralığında aktivite bulunmamaktadır." />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { formatDate } from '@/utils/date';
import DateRangePicker from '@/components/common/DateRangePicker.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Pagination from '@/components/common/Pagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'ActivityLog',

  components: {
    DateRangePicker,
    LoadingSpinner,
    Pagination,
    EmptyState
  },

  setup() {
    const store = useStore();
    const loading = ref(false);
    const activities = ref([]);
    const selectedType = ref('');
    const dateRange = ref({ start: null, end: null });
    const currentPage = ref(1);
    const totalPages = ref(1);

    const activityTypes = [
      { value: 'login', label: 'Giriş' },
      { value: 'order', label: 'Sipariş' },
      { value: 'profile', label: 'Profil Güncelleme' },
      { value: 'payment', label: 'Ödeme' }
    ];

    const filteredActivities = computed(() => {
      return activities.value.filter(activity => {
        if (selectedType.value && activity.type !== selectedType.value) {
          return false;
        }
        if (dateRange.value.start && dateRange.value.end) {
          const activityDate = new Date(activity.timestamp);
          return activityDate >= dateRange.value.start && 
                 activityDate <= dateRange.value.end;
        }
        return true;
      });
    });

    const fetchActivities = async () => {
      loading.value = true;
      try {
        const response = await store.dispatch('user/fetchActivityLog', {
          page: currentPage.value,
          type: selectedType.value,
          dateRange: dateRange.value
        });
        
        activities.value = response.data;
        totalPages.value = response.totalPages;
      } catch (error) {
        console.error('Aktiviteler yüklenirken hata:', error);
      } finally {
        loading.value = false;
      }
    };

    const undoActivity = async (activity) => {
      try {
        await store.dispatch('user/undoActivity', activity.id);
        await fetchActivities();
      } catch (error) {
        console.error('Aktivite geri alınırken hata:', error);
      }
    };

    const getStatusClass = (status) => {
      const classes = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800'
      };
      return classes[status] || classes.info;
    };

    onMounted(fetchActivities);

    return {
      loading,
      activities,
      selectedType,
      dateRange,
      currentPage,
      totalPages,
      activityTypes,
      filteredActivities,
      formatDate,
      fetchActivities,
      undoActivity,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.activity-log {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.activity-card {
  @apply transition-all hover:shadow-md;
}

.loading-state {
  @apply flex justify-center items-center py-12;
}
</style> 