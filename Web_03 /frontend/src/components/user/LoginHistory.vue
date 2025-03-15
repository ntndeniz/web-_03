<template>
  <div class="login-history">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">Giriş Geçmişi</h1>
      <p class="text-gray-600">Son giriş aktiviteleriniz</p>
    </div>

    <!-- Filtreler -->
    <div class="filters bg-white p-4 rounded-lg shadow-sm mb-6">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tarih Aralığı
          </label>
          <date-range-picker v-model="dateRange" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cihaz Tipi
          </label>
          <select v-model="deviceFilter" 
                  class="w-full rounded-md border-gray-300">
            <option value="">Tümü</option>
            <option value="mobile">Mobil</option>
            <option value="desktop">Masaüstü</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select v-model="statusFilter" 
                  class="w-full rounded-md border-gray-300">
            <option value="">Tümü</option>
            <option value="success">Başarılı</option>
            <option value="failed">Başarısız</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Giriş Listesi -->
    <div class="login-list">
      <div v-if="loading" class="loading-state">
        <loading-spinner />
      </div>

      <template v-else>
        <div v-if="filteredLogins.length" class="space-y-4">
          <div v-for="login in filteredLogins" 
               :key="login.id" 
               class="login-item bg-white p-4 rounded-lg shadow-sm">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <i :class="getDeviceIcon(login.deviceType)" 
                     class="text-gray-600"></i>
                  <h3 class="font-medium">
                    {{ login.deviceInfo }}
                  </h3>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  {{ login.location }}
                </p>
                <div class="mt-2 flex items-center gap-4">
                  <span class="text-sm text-gray-500">
                    {{ formatDate(login.timestamp) }}
                  </span>
                  <span :class="getStatusClass(login.status)" 
                        class="text-sm px-2 py-1 rounded-full">
                    {{ login.status === 'success' ? 'Başarılı' : 'Başarısız' }}
                  </span>
                </div>
              </div>
              <div v-if="login.status === 'failed'" 
                   class="text-sm text-red-600">
                {{ login.failureReason }}
              </div>
            </div>
            <div v-if="login.additionalInfo" 
                 class="mt-3 pt-3 border-t">
              <div class="text-sm text-gray-600">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="font-medium">IP Adresi:</span>
                    {{ login.additionalInfo.ip }}
                  </div>
                  <div>
                    <span class="font-medium">Tarayıcı:</span>
                    {{ login.additionalInfo.browser }}
                  </div>
                  <div>
                    <span class="font-medium">İşletim Sistemi:</span>
                    {{ login.additionalInfo.os }}
                  </div>
                  <div>
                    <span class="font-medium">Oturum Süresi:</span>
                    {{ formatDuration(login.additionalInfo.sessionDuration) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sayfalama -->
          <pagination v-model="currentPage" 
                     :total="totalPages"
                     @change="fetchLoginHistory" />
        </div>

        <empty-state v-else
                    icon="history"
                    title="Giriş Geçmişi Bulunamadı"
                    description="Seçili kriterlere uygun giriş kaydı bulunmamaktadır." />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { formatDate, formatDuration } from '@/utils/date';
import DateRangePicker from '@/components/common/DateRangePicker.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import Pagination from '@/components/common/Pagination.vue';
import EmptyState from '@/components/common/EmptyState.vue';

export default {
  name: 'LoginHistory',

  components: {
    DateRangePicker,
    LoadingSpinner,
    Pagination,
    EmptyState
  },

  setup() {
    const store = useStore();
    const loading = ref(false);
    const logins = ref([]);
    const dateRange = ref({ start: null, end: null });
    const deviceFilter = ref('');
    const statusFilter = ref('');
    const currentPage = ref(1);
    const totalPages = ref(1);

    const filteredLogins = computed(() => {
      return logins.value.filter(login => {
        if (deviceFilter.value && login.deviceType !== deviceFilter.value) {
          return false;
        }
        if (statusFilter.value && login.status !== statusFilter.value) {
          return false;
        }
        if (dateRange.value.start && dateRange.value.end) {
          const loginDate = new Date(login.timestamp);
          return loginDate >= dateRange.value.start && 
                 loginDate <= dateRange.value.end;
        }
        return true;
      });
    });

    const fetchLoginHistory = async () => {
      loading.value = true;
      try {
        const response = await store.dispatch('user/fetchLoginHistory', {
          page: currentPage.value,
          filters: {
            dateRange: dateRange.value,
            device: deviceFilter.value,
            status: statusFilter.value
          }
        });
        
        logins.value = response.data;
        totalPages.value = response.totalPages;
      } catch (error) {
        console.error('Giriş geçmişi yüklenirken hata:', error);
      } finally {
        loading.value = false;
      }
    };

    const getDeviceIcon = (deviceType) => {
      const icons = {
        mobile: 'fas fa-mobile-alt',
        desktop: 'fas fa-desktop',
        tablet: 'fas fa-tablet-alt'
      };
      return icons[deviceType] || 'fas fa-question-circle';
    };

    const getStatusClass = (status) => {
      return status === 'success' 
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';
    };

    onMounted(fetchLoginHistory);

    return {
      loading,
      logins,
      dateRange,
      deviceFilter,
      statusFilter,
      currentPage,
      totalPages,
      filteredLogins,
      formatDate,
      formatDuration,
      fetchLoginHistory,
      getDeviceIcon,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.login-history {
  @apply max-w-4xl mx-auto py-8 px-4;
}

.loading-state {
  @apply flex justify-center items-center py-12;
}
</style> 