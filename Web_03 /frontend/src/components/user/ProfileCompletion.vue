<template>
  <div class="profile-completion">
    <div class="header mb-6">
      <h1 class="text-2xl font-bold">Profil Tamamlama</h1>
      <p class="text-gray-600">
        Profilinizi tamamlayarak daha iyi bir alışveriş deneyimi yaşayın
      </p>
    </div>

    <!-- İlerleme Çubuğu -->
    <div class="mb-8">
      <div class="flex justify-between mb-2">
        <span class="text-sm font-medium">Profil Tamamlanma Oranı</span>
        <span class="text-sm font-medium">{{ completionPercentage }}%</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full">
        <div 
          class="h-full bg-blue-600 rounded-full transition-all duration-300"
          :style="{ width: `${completionPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Tamamlanacak Görevler -->
    <div class="space-y-4">
      <div 
        v-for="task in tasks" 
        :key="task.id"
        class="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
      >
        <div class="flex items-center space-x-4">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="task.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'"
          >
            <i :class="task.icon"></i>
          </div>
          <div>
            <h3 class="font-medium">{{ task.title }}</h3>
            <p class="text-sm text-gray-600">{{ task.description }}</p>
          </div>
        </div>
        <button
          v-if="!task.completed"
          @click="completeTask(task.id)"
          class="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Tamamla
        </button>
        <i v-else class="fas fa-check text-green-600"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ProfileCompletion',
  
  setup() {
    const store = useStore();
    const tasks = ref([
      {
        id: 1,
        title: 'Profil Fotoğrafı',
        description: 'Profil fotoğrafı ekleyin',
        icon: 'fas fa-user',
        completed: false
      },
      {
        id: 2,
        title: 'İletişim Bilgileri',
        description: 'Telefon numaranızı doğrulayın',
        icon: 'fas fa-phone',
        completed: false
      },
      {
        id: 3,
        title: 'Adres Bilgileri',
        description: 'En az bir teslimat adresi ekleyin',
        icon: 'fas fa-map-marker-alt',
        completed: false
      },
      {
        id: 4,
        title: 'E-posta Doğrulama',
        description: 'E-posta adresinizi doğrulayın',
        icon: 'fas fa-envelope',
        completed: true
      }
    ]);

    const completionPercentage = computed(() => {
      const completedTasks = tasks.value.filter(task => task.completed).length;
      return Math.round((completedTasks / tasks.value.length) * 100);
    });

    const completeTask = async (taskId) => {
      try {
        await store.dispatch('user/completeProfileTask', taskId);
        const task = tasks.value.find(t => t.id === taskId);
        if (task) {
          task.completed = true;
        }
      } catch (error) {
        store.dispatch('ui/showToast', {
          type: 'error',
          message: 'Görev tamamlanırken bir hata oluştu'
        });
      }
    };

    return {
      tasks,
      completionPercentage,
      completeTask
    };
  }
};
</script>

<style scoped>
.profile-completion {
  @apply max-w-2xl mx-auto py-8 px-4;
}
</style> 