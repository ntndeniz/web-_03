<template>
  <div class="rich-text-editor">
    <!-- Araç Çubuğu -->
    <div class="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
      <!-- Metin Biçimlendirme -->
      <div class="flex items-center space-x-1">
        <button
          v-for="format in textFormats"
          :key="format.command"
          @click="execCommand(format.command)"
          class="p-1.5 rounded hover:bg-gray-200"
          :title="format.label"
        >
          <i :class="format.icon"></i>
        </button>
      </div>

      <div class="w-px h-6 bg-gray-300 mx-2"></div>

      <!-- Paragraf Stilleri -->
      <select
        @change="execCommand('formatBlock', $event.target.value)"
        class="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="p">Normal</option>
        <option value="h1">Başlık 1</option>
        <option value="h2">Başlık 2</option>
        <option value="h3">Başlık 3</option>
        <option value="pre">Kod Bloğu</option>
        <option value="blockquote">Alıntı</option>
      </select>

      <div class="w-px h-6 bg-gray-300 mx-2"></div>

      <!-- Liste ve Hizalama -->
      <div class="flex items-center space-x-1">
        <button
          v-for="format in listFormats"
          :key="format.command"
          @click="execCommand(format.command)"
          class="p-1.5 rounded hover:bg-gray-200"
          :title="format.label"
        >
          <i :class="format.icon"></i>
        </button>
      </div>

      <div class="w-px h-6 bg-gray-300 mx-2"></div>

      <!-- Bağlantı ve Medya -->
      <div class="flex items-center space-x-1">
        <button
          v-for="action in mediaActions"
          :key="action.command"
          @click="handleMediaAction(action.command)"
          class="p-1.5 rounded hover:bg-gray-200"
          :title="action.label"
        >
          <i :class="action.icon"></i>
        </button>
      </div>
    </div>

    <!-- Düzenleyici Alanı -->
    <div
      ref="editor"
      contenteditable="true"
      class="p-4 min-h-[200px] focus:outline-none"
      :class="{ 'border-red-500': error }"
      @input="handleInput"
      @paste="handlePaste"
    ></div>

    <!-- Hata Mesajı -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <!-- Bağlantı Ekleme Modal -->
    <Modal v-model="showLinkModal">
      <div class="p-4">
        <h3 class="text-lg font-medium mb-4">Bağlantı Ekle</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">URL</label>
            <input
              v-model="linkUrl"
              type="url"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Metin</label>
            <input
              v-model="linkText"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="showLinkModal = false"
              class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              İptal
            </button>
            <button
              @click="insertLink"
              class="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Modal from './Modal.vue'

export default {
  name: 'RichTextEditor',

  components: {
    Modal
  },

  props: {
    modelValue: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const editor = ref(null)
    const showLinkModal = ref(false)
    const linkUrl = ref('')
    const linkText = ref('')

    // Metin biçimlendirme butonları
    const textFormats = [
      { command: 'bold', icon: 'fas fa-bold', label: 'Kalın' },
      { command: 'italic', icon: 'fas fa-italic', label: 'İtalik' },
      { command: 'underline', icon: 'fas fa-underline', label: 'Altı Çizili' },
      { command: 'strikeThrough', icon: 'fas fa-strikethrough', label: 'Üstü Çizili' }
    ]

    // Liste ve hizalama butonları
    const listFormats = [
      { command: 'insertUnorderedList', icon: 'fas fa-list-ul', label: 'Madde İşaretleri' },
      { command: 'insertOrderedList', icon: 'fas fa-list-ol', label: 'Numaralı Liste' },
      { command: 'justifyLeft', icon: 'fas fa-align-left', label: 'Sola Hizala' },
      { command: 'justifyCenter', icon: 'fas fa-align-center', label: 'Ortala' },
      { command: 'justifyRight', icon: 'fas fa-align-right', label: 'Sağa Hizala' }
    ]

    // Medya butonları
    const mediaActions = [
      { command: 'link', icon: 'fas fa-link', label: 'Bağlantı Ekle' },
      { command: 'image', icon: 'fas fa-image', label: 'Resim Ekle' },
      { command: 'video', icon: 'fas fa-video', label: 'Video Ekle' },
      { command: 'code', icon: 'fas fa-code', label: 'Kod Ekle' }
    ]

    // HTML içeriğini temizle
    const sanitizeHtml = (html) => {
      const div = document.createElement('div')
      div.innerHTML = html
      
      // İzin verilen etiketler
      const allowedTags = [
        'p', 'br', 'b', 'i', 'u', 'strong', 'em', 'strike',
        'h1', 'h2', 'h3', 'pre', 'code', 'blockquote',
        'ul', 'ol', 'li', 'a', 'img'
      ]

      // İzin verilen özellikler
      const allowedAttrs = {
        'a': ['href', 'target'],
        'img': ['src', 'alt']
      }

      const clean = (node) => {
        if (node.nodeType === 3) return // Metin düğümlerini atla

        if (node.nodeType === 1) {
          if (!allowedTags.includes(node.tagName.toLowerCase())) {
            node.parentNode.removeChild(node)
            return
          }

          const attrs = [...node.attributes]
          attrs.forEach(attr => {
            const allowed = allowedAttrs[node.tagName.toLowerCase()]
            if (!allowed || !allowed.includes(attr.name)) {
              node.removeAttribute(attr.name)
            }
          })
        }

        [...node.childNodes].forEach(clean)
      }

      clean(div)
      return div.innerHTML
    }

    // Komut çalıştır
    const execCommand = (command, value = null) => {
      document.execCommand(command, false, value)
      updateValue()
    }

    // Medya işlemleri
    const handleMediaAction = (command) => {
      switch (command) {
        case 'link':
          showLinkModal.value = true
          linkText.value = window.getSelection().toString()
          break
        case 'image':
          const imageUrl = prompt('Resim URL\'i:', '')
          if (imageUrl) {
            execCommand('insertImage', imageUrl)
          }
          break
        case 'video':
          const videoUrl = prompt('Video URL\'i:', '')
          if (videoUrl) {
            const embed = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`
            execCommand('insertHTML', embed)
          }
          break
        case 'code':
          execCommand('formatBlock', 'pre')
          break
      }
    }

    // Bağlantı ekle
    const insertLink = () => {
      if (linkUrl.value) {
        const link = `<a href="${linkUrl.value}" target="_blank">${linkText.value || linkUrl.value}</a>`
        execCommand('insertHTML', link)
        showLinkModal.value = false
        linkUrl.value = ''
        linkText.value = ''
      }
    }

    // İçerik değişikliğini izle
    const handleInput = () => {
      updateValue()
    }

    // Yapıştırma işlemini temizle
    const handlePaste = (e) => {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertText', false, text)
    }

    // Değeri güncelle
    const updateValue = () => {
      if (editor.value) {
        const html = sanitizeHtml(editor.value.innerHTML)
        emit('update:modelValue', html)
      }
    }

    // Props değişikliğini izle
    watch(() => props.modelValue, (newValue) => {
      if (editor.value && editor.value.innerHTML !== newValue) {
        editor.value.innerHTML = newValue
      }
    })

    // Component yüklendiğinde
    onMounted(() => {
      if (editor.value && props.modelValue) {
        editor.value.innerHTML = props.modelValue
      }
    })

    return {
      editor,
      showLinkModal,
      linkUrl,
      linkText,
      textFormats,
      listFormats,
      mediaActions,
      execCommand,
      handleMediaAction,
      insertLink,
      handleInput,
      handlePaste
    }
  }
}
</script>

<style scoped>
.rich-text-editor {
  @apply border rounded-lg overflow-hidden;
}

.rich-text-editor [contenteditable]:empty:before {
  content: 'Metin girin...';
  @apply text-gray-400;
}
</style> 