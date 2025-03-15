<template>
  <div class="audio-player">
    <div class="player-container">
      <div class="player-info">
        <img 
          v-if="coverImage"
          :src="coverImage"
          :alt="title"
          class="cover-image"
        />
        <div class="track-info">
          <h3 class="track-title">{{ title }}</h3>
          <p v-if="artist" class="track-artist">{{ artist }}</p>
        </div>
      </div>

      <div class="player-controls">
        <button class="control-button" @click="togglePlay">
          <span class="sr-only">{{ isPlaying ? 'Duraklat' : 'Oynat' }}</span>
          <svg v-if="isPlaying" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
          </svg>
          <svg v-else class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          </svg>
        </button>

        <div class="progress-container">
          <span class="time-display">{{ formatTime(currentTime) }}</span>
          <input
            type="range"
            class="progress-slider"
            :value="progress"
            min="0"
            max="100"
            @input="handleSeek"
          >
          <span class="time-display">{{ formatTime(duration) }}</span>
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
      </div>

      <audio
        ref="audio"
        :src="src"
        :autoplay="autoplay"
        :loop="loop"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @ended="handleEnded"
      >
        {{ fallbackText }}
      </audio>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',

  props: {
    src: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      default: ''
    },
    coverImage: {
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
    fallbackText: {
      type: String,
      default: 'Tarayıcınız ses oynatmayı desteklemiyor.'
    }
  },

  data() {
    return {
      isPlaying: false,
      isMuted: false,
      duration: 0,
      currentTime: 0,
      volume: 1,
      progress: 0
    }
  },

  methods: {
    togglePlay() {
      if (this.isPlaying) {
        this.$refs.audio.pause()
      } else {
        this.$refs.audio.play()
      }
      this.isPlaying = !this.isPlaying
    },

    handleTimeUpdate() {
      this.currentTime = this.$refs.audio.currentTime
      this.progress = (this.currentTime / this.duration) * 100
    },

    handleLoadedMetadata() {
      this.duration = this.$refs.audio.duration
    },

    handleEnded() {
      this.isPlaying = false
      this.$emit('ended')
    },

    handleSeek(event) {
      const time = (event.target.value / 100) * this.duration
      this.$refs.audio.currentTime = time
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      this.$refs.audio.muted = this.isMuted
    },

    handleVolumeChange(event) {
      this.volume = event.target.value
      this.$refs.audio.volume = this.volume
      this.isMuted = this.volume === 0
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = Math.floor(seconds % 60)
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style lang="scss" scoped>
.audio-player {
  @apply w-full bg-white rounded-lg shadow-md overflow-hidden;
}

.player-container {
  @apply p-4 space-y-4;
}

.player-info {
  @apply flex items-center space-x-4;
}

.cover-image {
  @apply w-16 h-16 rounded-lg object-cover;
}

.track-info {
  @apply flex-1 min-w-0;
}

.track-title {
  @apply text-lg font-medium text-gray-900 truncate;
}

.track-artist {
  @apply text-sm text-gray-500 truncate;
}

.player-controls {
  @apply space-y-4;
}

.progress-container {
  @apply flex items-center space-x-4;
}

.progress-slider {
  @apply flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer;

  &::-webkit-slider-thumb {
    @apply appearance-none w-3 h-3 bg-primary-500 rounded-full;
  }
}

.time-display {
  @apply text-sm text-gray-500 tabular-nums;
}

.volume-control {
  @apply flex items-center space-x-2;
}

.volume-slider {
  @apply w-24 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer;

  &::-webkit-slider-thumb {
    @apply appearance-none w-3 h-3 bg-primary-500 rounded-full;
  }
}

.control-button {
  @apply text-gray-500 hover:text-primary-500 focus:outline-none focus:text-primary-500;
}
</style> 