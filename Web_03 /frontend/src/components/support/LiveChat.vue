<template>
  <div class="live-chat-container">
    <div class="chat-header">
      <h3 class="chat-title">{{ title }}</h3>
      <div class="chat-status" :class="{ 'online': isOnline }">
        {{ isOnline ? 'Çevrimiçi' : 'Çevrimdışı' }}
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-if="loading" class="loading-state">
        <LoadingSpinner />
      </div>

      <div v-else-if="error" class="error-state">
        <ErrorMessage :message="error" />
      </div>

      <template v-else>
        <div
          v-for="message in messages"
          :key="message.id"
          class="message"
          :class="{ 'message-user': message.isUser, 'message-agent': !message.isUser }"
        >
          <div class="message-avatar">
            <img :src="message.avatar" :alt="message.name" />
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-name">{{ message.name }}</span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text">{{ message.text }}</div>
          </div>
        </div>

        <div v-if="isTyping" class="typing-indicator">
          Destek ekibi yazıyor...
        </div>
      </template>
    </div>

    <div class="chat-input">
      <form @submit.prevent="sendMessage" class="input-form">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Mesajınızı yazın..."
          :disabled="!isOnline"
          class="message-input"
        />
        <div class="input-actions">
          <button
            type="button"
            @click="openFileUpload"
            class="action-button"
            :disabled="!isOnline"
          >
            <i class="fas fa-paperclip"></i>
          </button>
          <button
            type="button"
            @click="openEmojiPicker"
            class="action-button"
            :disabled="!isOnline"
          >
            <i class="fas fa-smile"></i>
          </button>
          <button
            type="submit"
            class="send-button"
            :disabled="!canSendMessage"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>

    <input
      type="file"
      ref="fileInput"
      class="hidden"
      @change="handleFileUpload"
      accept="image/*,.pdf,.doc,.docx"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/helpers/date'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import { notify } from '@/utils/notification'

export default {
  name: 'LiveChat',

  components: {
    LoadingSpinner,
    ErrorMessage
  },

  props: {
    title: {
      type: String,
      default: 'Canlı Destek'
    }
  },

  setup() {
    const store = useStore()
    const messagesContainer = ref(null)
    const fileInput = ref(null)
    const loading = ref(false)
    const error = ref('')
    const newMessage = ref('')
    const isTyping = ref(false)

    const messages = computed(() => 
      store.getters['support/chatMessages']
    )

    const isOnline = computed(() => 
      store.getters['support/isSupportOnline']
    )

    const canSendMessage = computed(() => 
      isOnline.value && newMessage.value.trim().length > 0
    )

    const scrollToBottom = async () => {
      await nextTick()
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    const loadMessages = async () => {
      try {
        loading.value = true
        await store.dispatch('support/fetchChatMessages')
        scrollToBottom()
      } catch (err) {
        error.value = 'Mesajlar yüklenirken bir hata oluştu'
      } finally {
        loading.value = false
      }
    }

    const sendMessage = async () => {
      if (!canSendMessage.value) return

      try {
        await store.dispatch('support/sendMessage', {
          text: newMessage.value,
          timestamp: new Date()
        })
        newMessage.value = ''
        scrollToBottom()
      } catch (err) {
        notify.error('Mesaj gönderilemedi')
      }
    }

    const openFileUpload = () => {
      fileInput.value?.click()
    }

    const handleFileUpload = async (event) => {
      const file = event.target.files[0]
      if (!file) return

      try {
        await store.dispatch('support/uploadFile', file)
        notify.success('Dosya başarıyla yüklendi')
      } catch (err) {
        notify.error('Dosya yüklenemedi')
      }
    }

    const openEmojiPicker = () => {
      // Emoji picker implementasyonu
    }

    const formatTime = (timestamp) => {
      return formatDate(timestamp, 'HH:mm')
    }

    // WebSocket bağlantısını kur
    onMounted(() => {
      loadMessages()
      store.dispatch('support/connectToChat')
    })

    // WebSocket bağlantısını kapat
    onUnmounted(() => {
      store.dispatch('support/disconnectFromChat')
    })

    return {
      messagesContainer,
      fileInput,
      loading,
      error,
      messages,
      newMessage,
      isTyping,
      isOnline,
      canSendMessage,
      sendMessage,
      openFileUpload,
      handleFileUpload,
      openEmojiPicker,
      formatTime
    }
  }
}
</script>

<style scoped>
.live-chat-container {
  @apply flex flex-col h-[600px] bg-white rounded-lg shadow-md;
}

.chat-header {
  @apply flex justify-between items-center p-4 border-b border-gray-200;
}

.chat-title {
  @apply text-xl font-semibold text-gray-800;
}

.chat-status {
  @apply px-3 py-1 rounded-full text-sm;
}

.chat-status.online {
  @apply bg-green-100 text-green-800;
}

.chat-messages {
  @apply flex-1 overflow-y-auto p-4 space-y-4;
}

.message {
  @apply flex items-start gap-3;
}

.message-user {
  @apply flex-row-reverse;
}

.message-avatar {
  @apply w-8 h-8 rounded-full overflow-hidden flex-shrink-0;
}

.message-avatar img {
  @apply w-full h-full object-cover;
}

.message-content {
  @apply flex flex-col max-w-[70%];
}

.message-header {
  @apply flex items-center gap-2 text-sm mb-1;
}

.message-name {
  @apply font-medium;
}

.message-time {
  @apply text-gray-500;
}

.message-text {
  @apply p-3 rounded-lg;
}

.message-user .message-text {
  @apply bg-blue-600 text-white;
}

.message-agent .message-text {
  @apply bg-gray-100 text-gray-800;
}

.typing-indicator {
  @apply text-sm text-gray-500 italic;
}

.chat-input {
  @apply p-4 border-t border-gray-200;
}

.input-form {
  @apply flex gap-2;
}

.message-input {
  @apply flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.input-actions {
  @apply flex gap-2;
}

.action-button {
  @apply p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50;
}

.send-button {
  @apply p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600;
}

.hidden {
  @apply hidden;
}

.loading-state,
.error-state {
  @apply flex justify-center items-center h-full;
}
</style> 