<template>
  <div class="video-player" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="video-container" ref="container">
      <video
        ref="video"
        class="video-element"
        :src="src"
        :poster="poster"
        :autoplay="autoplay"
        :loop="loop"
        :muted="muted"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @ended="handleEnded"
      >
        <source :src="src" :type="type">
        {{ fallbackText }}
      </video>

      <div class="video-controls" v-show="!hideControls">
        <div class="progress-bar">
          <input
            type="range"
            class="progress-slider"
            :value="progress"
            min="0"
            max="100"
            @input="handleSeek"
          >
        </div>

        <div class="controls-buttons">
          <button class="control-button" @click="togglePlay">
            <span class="sr-only">{{ isPlaying ? 'Duraklat' : 'Oynat' }}</span>
            <svg v-if="isPlaying" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
          </button>

          <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>

          <div class="volume-control">
            <button class="control-button" @click="toggleMute">
              <span class="sr-only">{{ isMuted ? 'Sesi Aç' : 'Sesi Kapat' }}</span>
              <svg v-if="isMuted" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
            <input
              type="range"
              class="volume-slider"
              :value="volume"
              min="0"
              max="1"
              step="0.1"
              @input="handleVolumeChange"
            >
          </div>

          <button class="control-button" @click="toggleFullscreen">
            <span class="sr-only">{{ isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran' }}</span>
            <svg v-if="isFullscreen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h6v6H9z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',

  props: {
    src: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'video/mp4'
    },
    poster: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    },
    muted: {
      type: Boolean,
      default: false
    },
    hideControls: {
      type: Boolean,
      default: false
    },
    fallbackText: {
      type: String,
      default: 'Tarayıcınız video oynatmayı desteklemiyor.'
    }
  },

  data() {
    return {
      isPlaying: false,
      isMuted: this.muted,
      duration: 0,
      currentTime: 0,
      volume: 1,
      progress: 0,
      isFullscreen: false
    }
  },

  methods: {
    togglePlay() {
      if (this.isPlaying) {
        this.$refs.video.pause()
      } else {
        this.$refs.video.play()
      }
      this.isPlaying = !this.isPlaying
    },

    handleTimeUpdate() {
      this.currentTime = this.$refs.video.currentTime
      this.progress = (this.currentTime / this.duration) * 100
    },

    handleLoadedMetadata() {
      this.duration = this.$refs.video.duration
    },

    handleEnded() {
      this.isPlaying = false
      this.$emit('ended')
    },

    handleSeek(event) {
      const time = (event.target.value / 100) * this.duration
      this.$refs.video.currentTime = time
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      this.$refs.video.muted = this.isMuted
    },

    handleVolumeChange(event) {
      this.volume = event.target.value
      this.$refs.video.volume = this.volume
      this.isMuted = this.volume === 0
    },

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        this.$refs.container.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  },

  mounted() {
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement
    })
  },

  beforeUnmount() {
    document.removeEventListener('fullscreenchange', () => {})
  }
}
</script>

<style lang="scss" scoped>
.video-player {
  @apply relative w-full bg-black;

  &.is-fullscreen {
    @apply fixed inset-0 z-50;
  }
}

.video-container {
  @apply relative w-full aspect-video;
}

.video-element {
  @apply w-full h-full object-contain;
}

.video-controls {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent
         text-white p-4 opacity-0 transition-opacity duration-200;

  .video-container:hover & {
    @apply opacity-100;
  }
}

.progress-bar {
  @apply mb-4;
}

.progress-slider {
  @apply w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer;

  &::-webkit-slider-thumb {
    @apply appearance-none w-3 h-3 bg-white rounded-full;
  }
}

.controls-buttons {
  @apply flex items-center space-x-4;
}

.control-button {
  @apply p-1 hover:text-gray-300 focus:outline-none focus:text-gray-300;
}

.time-display {
  @apply text-sm font-medium;
}

.volume-control {
  @apply flex items-center space-x-2;
}

.volume-slider {
  @apply w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer;

  &::-webkit-slider-thumb {
    @apply appearance-none w-3 h-3 bg-white rounded-full;
  }
}
</style> 