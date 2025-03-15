<template>
  <div class="user-management">
    <div class="header flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Kullanıcı Yönetimi</h1>
      
      <button @click="openCreateModal" 
              class="btn-primary flex items-center">
        <i class="fas fa-plus mr-2"></i>
        Yeni Kullanıcı
      </button>
    </div>

    <!-- Filtreler -->
    <div class="filters bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="form-group">
          <label>Arama</label>
          <input v-model="filters.search" 
                 type="text"
                 placeholder="İsim, e-posta veya ID ara..."
                 class="form-input" />
        </div>
        
        <div class="form-group">
          <label>Rol</label>
          <select v-model="filters.role" class="form-select">
            <option value="">Tümü</option>
            <option v-for="role in roles" 
                    :key="role.id" 
                    :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Durum</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Tümü</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="blocked">Engelli</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Sıralama</label>
          <select v-model="filters.sort" class="form-select">
            <option value="created_desc">Yeniden Eskiye</option>
            <option value="created_asc">Eskiden Yeniye</option>
            <option value="name_asc">İsim (A-Z)</option>
            <option value="name_desc">İsim (Z-A)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Kullanıcı Tablosu -->
    <div class="users-table bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">
              <input type="checkbox" 
                     v-model="selectAll"
                     @change="toggleSelectAll"
                     class="form-checkbox" />
            </th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">E-posta</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Rol</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">Kayıt Tarihi</th>
            <th class="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-4 py-3">
              <input type="checkbox"
                     v-model="selectedUsers"
                     :value="user.id"
                     class="form-checkbox" />
            </td>
            <td class="px-4 py-3 text-sm">{{ user.id }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center">
                <img :src="user.avatar" 
                     :alt="user.name"
                     class="w-8 h-8 rounded-full mr-3" />
                <div>
                  <p class="text-sm font-medium">{{ user.name }}</p>
                  <p class="text-xs text-gray-500">{{ user.username }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span :class="['role-badge', user.role]">
                {{ user.roleName }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="['status-badge', user.status]">
                {{ user.statusText }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm">{{ formatDate(user.createdAt) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center space-x-2">
                <button @click="editUser(user)"
                        class="btn-icon text-blue-600">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(user)"
                        class="btn-icon text-red-600">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500">
        Toplam {{ pagination.total }} kullanıcıdan {{ startIndex }}-{{ endIndex }} arası gösteriliyor
      </div>
      
      <div class="flex items-center space-x-2">
        <button @click="prevPage"
                :disabled="pagination.currentPage === 1"
                class="btn-secondary">
          Önceki
        </button>
        
        <span class="text-sm">
          Sayfa {{ pagination.currentPage }} / {{ totalPages }}
        </span>
        
        <button @click="nextPage"
                :disabled="pagination.currentPage === totalPages"
                class="btn-secondary">
          Sonraki
        </button>
      </div>
    </div>

    <!-- Kullanıcı Modal -->
    <Modal v-if="showModal" @close="closeModal">
      <template #title>
        {{ isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı' }}
      </template>
      
      <template #content>
        <form @submit.prevent="saveUser" class="space-y-4">
          <div class="form-group">
            <label>Ad Soyad</label>
            <input v-model="userForm.name" 
                   type="text"
                   required
                   class="form-input" />
          </div>
          
          <div class="form-group">
            <label>E-posta</label>
            <input v-model="userForm.email"
                   type="email"
                   required
                   class="form-input" />
          </div>
          
          <div class="form-group">
            <label>Rol</label>
            <select v-model="userForm.role" 
                    required
                    class="form-select">
              <option v-for="role in roles"
                      :key="role.id"
                      :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Durum</label>
            <select v-model="userForm.status" 
                    required
                    class="form-select">
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="blocked">Engelli</option>
            </select>
          </div>
        </form>
      </template>
      
      <template #footer>
        <button @click="closeModal" 
                class="btn-secondary mr-2">
          İptal
        </button>
        <button @click="saveUser" 
                class="btn-primary">
          {{ isEditing ? 'Güncelle' : 'Kaydet' }}
        </button>
      </template>
    </Modal>

    <!-- Silme Onay Modal -->
    <ConfirmModal v-if="showDeleteModal"
                 @confirm="deleteUser"
                 @cancel="showDeleteModal = false">
      <template #title>Kullanıcı Sil</template>
      <template #content>
        <p>{{ userToDelete.name }} kullanıcısını silmek istediğinizden emin misiniz?</p>
        <p class="text-sm text-gray-500 mt-2">Bu işlem geri alınamaz.</p>
      </template>
    </ConfirmModal>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/formatters'
import Modal from '@/components/common/Modal.vue'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

export default {
  name: 'UserManagement',

  components: {
    Modal,
    ConfirmModal
  },

  setup() {
    const store = useStore()
    const users = ref([])
    const roles = ref([])
    const selectedUsers = ref([])
    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const userToDelete = ref(null)
    
    const filters = ref({
      search: '',
      role: '',
      status: '',
      sort: 'created_desc'
    })
    
    const pagination = ref({
      currentPage: 1,
      perPage: 10,
      total: 0
    })
    
    const userForm = ref({
      name: '',
      email: '',
      role: '',
      status: 'active'
    })
    const isEditing = ref(false)

    // Methods
    const loadUsers = async () => {
      try {
        const response = await store.dispatch('user/fetchUsers', {
          ...filters.value,
          page: pagination.value.currentPage,
          perPage: pagination.value.perPage
        })
        
        users.value = response.data
        pagination.value.total = response.total
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata:', error)
      }
    }

    const loadRoles = async () => {
      try {
        roles.value = await store.dispatch('user/fetchRoles')
      } catch (error) {
        console.error('Roller yüklenirken hata:', error)
      }
    }

    // Computed
    const totalPages = computed(() => {
      return Math.ceil(pagination.value.total / pagination.value.perPage)
    })

    const startIndex = computed(() => {
      return (pagination.value.currentPage - 1) * pagination.value.perPage + 1
    })

    const endIndex = computed(() => {
      return Math.min(
        startIndex.value + pagination.value.perPage - 1,
        pagination.value.total
      )
    })

    // Watchers
    watch(filters, () => {
      pagination.value.currentPage = 1
      loadUsers()
    })

    // Lifecycle
    onMounted(() => {
      loadUsers()
      loadRoles()
    })

    return {
      users,
      roles,
      filters,
      pagination,
      selectedUsers,
      showModal,
      showDeleteModal,
      userToDelete,
      userForm,
      isEditing,
      totalPages,
      startIndex,
      endIndex,
      formatDate,
      loadUsers,
      // ... diğer metodlar
    }
  }
}
</script>

<style lang="scss" scoped>
.user-management {
  @apply p-6;

  .role-badge {
    @apply px-2 py-1 text-xs rounded-full;

    &.admin { @apply bg-purple-100 text-purple-800; }
    &.manager { @apply bg-blue-100 text-blue-800; }
    &.user { @apply bg-gray-100 text-gray-800; }
  }

  .status-badge {
    @apply px-2 py-1 text-xs rounded-full;

    &.active { @apply bg-green-100 text-green-800; }
    &.inactive { @apply bg-gray-100 text-gray-800; }
    &.blocked { @apply bg-red-100 text-red-800; }
  }

  .btn-icon {
    @apply p-2 rounded-full hover:bg-gray-100 transition-colors;
  }
}
</style> 