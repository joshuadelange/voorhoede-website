<template>
  <div class="responsive-video">
    <figure>
      <fixed-ratio
        class="responsive-video__canvas"
        :width="canvasWidth"
        :height="canvasHeight"
      >
        <div
          class="responsive-video__background"
          :style="{ backgroundImage: imageUrl ? `url(${imageUrl})` : null }"
        />
        <iframe
          v-if="video && isPlaying"
          class="responsive-video__i-frame"
          :src="videoUrl"
          :title="video.title"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
          allow="autoplay"
        />
        <video
          v-if="gif && isPlaying"
          class="responsive-video__i-frame"
          autoplay="true"
          :loop="loop"
          muted
          controls
        >
          <source
            :src="`${gif.url}?fm=mp4`"
            type="video/mp4"
          >
        </video>
        <button
          v-if="!isPlaying"
          class="responsive-video__button"
          @click.prevent="play"
        >
          <span class="sr-only">Play video</span>
          <app-icon
            fill="white"
            name="play"
          />
        </button>
      </fixed-ratio>
      <figcaption class="responsive-video__caption">
        <a
          v-if="video"
          class="responsive-video__caption-content body-detail link"
          target="_blank"
          rel="noreferrer noopener"
          :href="video.url"
        >
          {{ video.title }}
        </a>
        <span
          v-if="gif"
          class="responsive-video__caption-content body-detail"
        >{{ gif.title }}</span>
      </figcaption>
    </figure>
  </div>
</template>

<script>
  const binaryBoolean = value => (value) ? 1 : 0

  export default {
    props: {
      video: {
        type: Object,
        default: null
      },
      gif: {
        type: Object,
        default: null
      },
      autoplay: {
        type: Boolean,
        required: true,
      },
      loop: {
        type: Boolean,
        required: true,
      },
      mute: {
        type: Boolean,
        required: true,
      },
    },
    data () {
      return {
        isPlaying: this.autoplay,
        width: null,
        canvasWidth: null,
        canvasHeight: null,
      }
    },
    computed: {
      imageUrl() {
        if(this.gif) {
          return `${this.gif.url}?fm=jpg`
        }

        let preset = '/maxresdefault.jpg'

        switch (this.video.provider) {
          case 'vimeo': {
            const sizeRegex = /\/\d+_(\d+x?\d+?.\w+)$/
            const roundedWidth = Math.round(this.width)

            return (
              this.width === null
                ? false
                : this.video.thumbnailUrl.replace(sizeRegex, (match, $1, offset, string) => string.replace($1, `${roundedWidth}.jpg`))
            )
          }
          case 'youtube':
            if (this.width < 320) {
              preset = '/mqdefault.jpg'
            } else if (this.width < 480) {
              preset = '/hqdefault.jpg'
            }

            return this.video.thumbnailUrl.replace('/hqdefault.jpg', preset)
          default:
            throw Error(`unsupported video provider for cover image: ${this.video.provider}`)
        }
      },
      videoUrl() {
        if (!this.isPlaying) {
          return ''
        }

        const { autoplay, loop, mute = autoplay } = this
        const { provider, providerUid } = this.video

        // using embeds that do not track the user
        switch (provider) {
          case 'vimeo':
            return `https://player.vimeo.com/video/${providerUid}?autoplay=1&muted=${binaryBoolean(mute)}&loop=${binaryBoolean(loop)}&dnt=true`
          case 'youtube':
            return `https://www.youtube-nocookie.com/embed/${providerUid}?autoplay=1&mute=${binaryBoolean(mute)}&loop=${binaryBoolean(loop)}&playlist=${providerUid}`
          default:
            throw Error(`unsupported video provider: ${provider}`)
        }
      },
    },
    created() {
      this.canvasWidth = this.video ? this.video.width : this.gif.width
      this.canvasHeight = this.video ? this.video.height : this.gif.height
    },
    mounted() {
      const pixelRatio = window.devicePixelRatio || 1
      const cssWidth = this.$el.getBoundingClientRect().width

      this.width = cssWidth * pixelRatio
    },
    methods: {
      play() {
        this.isPlaying = true
      },
    },
  }
</script>

<style>
  .responsive-video {
    position: relative;
    grid-column: var(--grid-page);
  }

  .responsive-video__canvas {
    background-color: var(--bg-pastel);
  }

  .responsive-video__background {
    position: absolute;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center center;
  }

  .responsive-video__i-frame {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .responsive-video video {
    width: 100%;
  }

  .responsive-video__button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    background-color: rgba(0, 0, 0, 0);
    transition: background-color .25s ease;
    cursor: pointer;
  }

  .responsive-video__button:hover,
  .responsive-video__button:focus {
    border-bottom: none;
    background-color: rgba(0, 0, 0, .25);
  }

  .responsive-video .app-icon {
    position: absolute;
    display: block;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 60px;
    transform: translate(-50%, -50%);
  }

  .responsive-video .app-icon svg {
    width: 100%;
    height: 100%;
  }

  .responsive-video__caption {
    display: flex;
    justify-content: center;
  }

  .responsive-video__caption-content {
    display: inline-block;
    margin-top: var(--spacing-smaller);
  }

  @media (min-width: 1440px) {
    .responsive-video {
      width: 1440px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
