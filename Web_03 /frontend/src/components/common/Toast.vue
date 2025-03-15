<template>
  <div 
    class="toast-container"
    :class="[position]"
  >
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="[`toast-${toast.type}`, position]"
      >
        <!-- İkon -->
        <span class="material-icons toast-icon">
          {{ getIcon(toast.type) }}
        </span>

        <!-- Mesaj -->
        <div class="toast-content">
          <div class="toast-message">{{ toast.message }}</div>
          <div 
            v-if="toast.description"
            class="toast-description"
          >
            {{ toast.description }}
          </div>
        </div>

        <!-- Kapatma butonu -->
        <button 
          @click="removeToast(toast.id)"
          class="toast-close"
        >
          <span class="material-icons">close</span>
        </button>

        <!-- İlerleme çubuğu -->
        <div 
          v-if="toast.duration > 0"
          class="toast-progress"
          :style="{ animationDuration: `${toast.duration}ms` }"
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'AppToast',

  props: {
    position: {
      type: String,
      default: 'top-right',
      validator: value => [
        'top-right',
        'top-left',
        'bottom-right',
        'bottom-left'
      ].includes(value)
    }
  },

  computed: {
    toasts() {
      return this.$store.state.ui.toast.messages
    }
  },

  methods: {
    getIcon(type) {
      const icons = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
      }
      return icons[type] || 'notifications'
    },

    removeToast(id) {
      this.$store.commit('ui/REMOVE_TOAST', id)
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

/* Pozisyonlar */
.top-right {
  top: 0;
  right: 0;
}

.top-left {
  top: 0;
  left: 0;
}

.bottom-right {
  bottom: 0;
  right: 0;
}

.bottom-left {
  bottom: 0;
  left: 0;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  position: relative;
  overflow: hidden;
}

.toast-icon {
  font-size: 1.5rem;
}

.toast-content {
  flex: 1;
}

.toast-message {
  font-weight: 500;
  line-height: 1.25;
}

.toast-description {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #666;
}

.toast-close {
  padding: 0.25rem;
  border-radius: 9999px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast tipleri */
.toast-success {
  border-left: 4px solid #10B981;
}
.toast-success .toast-icon {
  color: #10B981;
}

.toast-error {
  border-left: 4px solid #EF4444;
}
.toast-error .toast-icon {
  color: #EF4444;
}

.toast-warning {
  border-left: 4px solid #F59E0B;
}
.toast-warning .toast-icon {
  color: #F59E0B;
}

.toast-info {
  border-left: 4px solid #3B82F6;
}
.toast-info .toast-icon {
  color: #3B82F6;
}

/* İlerleme çubuğu */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(0, 0, 0, 0.1);
  transform-origin: left;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Animasyonlar */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Sol taraf için farklı animasyon */
.toast-item.top-left,
.toast-item.bottom-left {
  .toast-enter-from {
    transform: translateX(-100%);
  }
  .toast-leave-to {
    transform: translateX(100%);
  }
}
</style> 