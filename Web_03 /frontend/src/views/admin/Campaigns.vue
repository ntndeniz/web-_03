<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <h1 class="text-2xl font-semibold">Kampanyalar</h1>

        <!-- Filtreler ve Arama -->
        <div class="flex flex-wrap items-center gap-4">
          <!-- Durum Filtresi -->
          <select 
            v-model="filters.status"
            class="px-3 py-2 border rounded-lg"
          >
            <option value="">Tüm Kampanyalar</option>
            <option value="active">Aktif</option>
            <option value="scheduled">Planlanmış</option>
            <option value="expired">Süresi Dolmuş</option>
          </select>

          <!-- Arama -->
          <div class="relative">
            <input 
              type="text"
              v-model="filters.search"
              placeholder="Kampanya Ara..."
              class="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <span class="material-icons absolute left-3 top-2.5 text-gray-400">
              search
            </span>
          </div>

          <!-- Yeni Kampanya -->
          <button 
            @click="showNewCampaignForm = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <span class="material-icons">add</span>
            Yeni Kampanya
          </button>
        </div>
      </div>
    </div>

    <!-- Kampanya Listesi -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <div 
        v-for="campaign in filteredCampaigns" 
        :key="campaign.id"
        class="border rounded-lg overflow-hidden group"
      >
        <!-- Kampanya Görseli -->
        <div class="relative pb-[60%]">
          <img 
            :src="campaign.image" 
            :alt="campaign.title"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div class="absolute top-2 right-2 flex gap-1">
            <button 
              @click="editCampaign(campaign)"
              class="p-1.5 bg-white rounded-full shadow hover:bg-gray-50 text-blue-600"
            >
              <span class="material-icons">edit</span>
            </button>
            <button 
              @click="toggleCampaignStatus(campaign)"
              class="p-1.5 bg-white rounded-full shadow hover:bg-gray-50"
              :class="campaign.active ? 'text-red-600' : 'text-green-600'"
            >
              <span class="material-icons">
                {{ campaign.active ? 'visibility_off' : 'visibility' }}
              </span>
            </button>
            <button 
              @click="deleteCampaign(campaign)"
              class="p-1.5 bg-white rounded-full shadow hover:bg-gray-50 text-red-600"
            >
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>

        <!-- Kampanya Detayları -->
        <div class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <span 
              class="w-2 h-2 rounded-full"
              :class="getCampaignStatusColor(campaign)"
            ></span>
            <span class="text-sm">{{ getCampaignStatusText(campaign) }}</span>
          </div>

          <h3 class="font-semibold mb-1">{{ campaign.title }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ campaign.description }}</p>

          <div class="text-sm text-gray-600">
            <div class="flex justify-between mb-1">
              <span>Başlangıç:</span>
              <span>{{ formatDate(campaign.startDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Bitiş:</span>
              <span>{{ formatDate(campaign.endDate) }}</span>
            </div>
          </div>

          <div class="mt-3 pt-3 border-t">
            <div class="font-medium text-green-600">
              {{ campaign.discountType === 'percentage' ? `%${campaign.discountAmount}` : formatPrice(campaign.discountAmount) }}
              {{ campaign.discountType === 'percentage' ? 'İndirim' : 'Net İndirim' }}
            </div>
            <div class="text-sm text-gray-600">
              Min. {{ formatPrice(campaign.minAmount) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Boş Durum -->
      <div 
        v-if="filteredCampaigns.length === 0" 
        class="col-span-full text-center py-12"
      >
        <span class="material-icons text-6xl text-gray-400 mb-4">campaign</span>
        <p class="text-gray-600">Henüz kampanya bulunmuyor.</p>
      </div>
    </div>

    <!-- Kampanya Formu Modal -->
    <Modal 
      v-if="showNewCampaignForm || editingCampaign"
      @close="cancelCampaignForm"
    >
      <template #title>
        {{ editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya' }}
      </template>
      <template #content>
        <CampaignForm 
          :initial-campaign="editingCampaign"
          @save="saveCampaign"
          @cancel="cancelCampaignForm"
        />
      </template>
    </Modal>

    <!-- Silme Onay Modal -->
    <Modal v-if="campaignToDelete" @close="campaignToDelete = null">
      <template #title>
        Kampanya Silinecek
      </template>
      <template #content>
        <div class="p-4">
          <p class="mb-4">
            "{{ campaignToDelete.title }}" kampanyasını silmek istediğinize emin misiniz?
          </p>
          <div class="flex justify-end gap-4">
            <button 
              @click="campaignToDelete = null"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button 
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sil
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/components/common/Modal.vue'
import CampaignForm from '@/components/admin/CampaignForm.vue'

export default {
  name: 'AdminCampaigns',
  components: {
    Modal,
    CampaignForm
  },
  data() {
    return {
      filters: {
        search: '',
        status: ''
      },
      showNewCampaignForm: false,
      editingCampaign: null,
      campaignToDelete: null
    }
  },
  computed: {
    campaigns() {
      return this.$store.state.admin.campaigns
    },
    filteredCampaigns() {
      let filtered = [...this.campaigns]

      // Arama filtresi
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(campaign => 
          campaign.title.toLowerCase().includes(search) ||
          campaign.description.toLowerCase().includes(search)
        )
      }

      // Durum filtresi
      if (this.filters.status) {
        const now = new Date()
        filtered = filtered.filter(campaign => {
          const startDate = new Date(campaign.startDate)
          const endDate = new Date(campaign.endDate)

          switch (this.filters.status) {
            case 'active':
              return campaign.active && startDate <= now && endDate >= now
            case 'scheduled':
              return campaign.active && startDate > now
            case 'expired':
              return endDate < now
            default:
              return true
          }
        })
      }

      return filtered
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    },
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    },
    getCampaignStatusColor(campaign) {
      const now = new Date()
      const startDate = new Date(campaign.startDate)
      const endDate = new Date(campaign.endDate)

      if (!campaign.active) return 'bg-gray-500'
      if (endDate < now) return 'bg-red-500'
      if (startDate > now) return 'bg-yellow-500'
      return 'bg-green-500'
    },
    getCampaignStatusText(campaign) {
      const now = new Date()
      const startDate = new Date(campaign.startDate)
      const endDate = new Date(campaign.endDate)

      if (!campaign.active) return 'Pasif'
      if (endDate < now) return 'Süresi Dolmuş'
      if (startDate > now) return 'Planlanmış'
      return 'Aktif'
    },
    editCampaign(campaign) {
      this.editingCampaign = { ...campaign }
      this.showNewCampaignForm = true
    },
    async toggleCampaignStatus(campaign) {
      try {
        await this.$store.dispatch('admin/toggleCampaignStatus', campaign.id)
        this.$toast.success(
          campaign.active ? 'Kampanya pasife alındı' : 'Kampanya aktife alındı'
        )
      } catch (error) {
        this.$toast.error('Kampanya durumu güncellenirken bir hata oluştu')
      }
    },
    deleteCampaign(campaign) {
      this.campaignToDelete = campaign
    },
    async confirmDelete() {
      try {
        await this.$store.dispatch('admin/deleteCampaign', this.campaignToDelete.id)
        this.$toast.success('Kampanya başarıyla silindi')
        this.campaignToDelete = null
      } catch (error) {
        this.$toast.error('Kampanya silinirken bir hata oluştu')
      }
    },
    async saveCampaign(campaignData) {
      try {
        if (this.editingCampaign) {
          await this.$store.dispatch('admin/updateCampaign', {
            id: this.editingCampaign.id,
            ...campaignData
          })
          this.$toast.success('Kampanya başarıyla güncellendi')
        } else {
          await this.$store.dispatch('admin/createCampaign', campaignData)
          this.$toast.success('Kampanya başarıyla oluşturuldu')
        }
        this.cancelCampaignForm()
      } catch (error) {
        this.$toast.error('Kampanya kaydedilirken bir hata oluştu')
      }
    },
    cancelCampaignForm() {
      this.showNewCampaignForm = false
      this.editingCampaign = null
    }
  },
  created() {
    this.$store.dispatch('admin/fetchCampaigns')
  }
}
</script> 