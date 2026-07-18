<script setup lang="ts">
import aboutAll from '@/content/about.json'
import type { AboutMultiLangContent, AboutPageContent } from '@/types/about'

definePageMeta({
  validate: (route) => ['fr', 'en'].includes(route.params.lang as string),
  // Key by route name (not full path) so switching /fr <-> /en reuses the
  // same component instance instead of remounting and replaying the
  // entrance fade/blur animation.
  key: (route) => route.name as string
})

const EMAIL = 'contact@valentingenest.fr'
const MAIL_LABEL_RESET_MS = 2000

const route = useRoute()
const { setLanguage, isEnglish, lang } = useLanguage(route.params.lang as string)
const { mediaRef, onScroll } = useScrollEffect()
const { isVisible } = usePageTransition()
const { meta } = useSEO(lang)

const contentSource = aboutAll as AboutMultiLangContent
const content = computed<AboutPageContent>(() => isEnglish.value ? contentSource.en : contentSource.fr)

const mailLabel = ref('email')
let mailLabelTimeout: ReturnType<typeof setTimeout> | undefined

function handleMailClick() {
  copyToClipboard(EMAIL)
  trackEvent('copy_email', { language: lang.value })
  mailLabel.value = isEnglish.value ? 'copied!' : 'copié!'

  clearTimeout(mailLabelTimeout)
  mailLabelTimeout = setTimeout(() => (mailLabel.value = 'email'), MAIL_LABEL_RESET_MS)
}

function handleResumeDownload() {
  const fileName = isEnglish.value ? 'EN_CV2024_Valentin_Genest.pdf' : 'CV2024_Valentin_Genest.pdf'
  trackEvent('download_cv', { language: lang.value, file_name: fileName })
  window.open(`/${fileName}`, '_blank')
}

onUnmounted(() => clearTimeout(mailLabelTimeout))

watchScroll(onScroll, { defer: true })

useHead(() => meta.value)
</script>

<template>
  <div class="AboutPage" :class="{ 'is-visible': isVisible }">
    <div class="container" data-duck-mask>
      <AboutHeader :content="content" :is-english="isEnglish" @language-change="setLanguage" />

      <main class="content">
        <div ref="mediaRef" class="media-container">
          <img src="/img/moi.webp" srcset="/img/moi.webp 1x, /img/moi@2x.webp 2x" alt="Valentin Genest" class="media"
            width="480" loading="eager" fetchpriority="high" decoding="async">
        </div>

        <AboutSections :sections="content.sections" />

        <SkillsMarquee />

        <div class="button-container">
          <button class="button" type="button" @click.passive="handleResumeDownload">
            <svg viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon" width="12"
              height="15">
              <path
                d="M7.5 0.5C7.5 0.223858 7.27614 1.20705e-08 7 0C6.72386 -1.20705e-08 6.5 0.223858 6.5 0.5L7.5 0.5ZM6.64645 12.4325C6.84171 12.6278 7.15829 12.6278 7.35355 12.4325L10.5355 9.25052C10.7308 9.05526 10.7308 8.73868 10.5355 8.54341C10.3403 8.34815 10.0237 8.34815 9.82843 8.54341L7 11.3718L4.17157 8.54341C3.97631 8.34815 3.65973 8.34815 3.46447 8.54341C3.2692 8.73867 3.2692 9.05526 3.46447 9.25052L6.64645 12.4325ZM6.5 0.5L6.5 12.0789L7.5 12.0789L7.5 0.5L6.5 0.5Z" />
              <path d="M1 15.5H13" stroke="currentColor" stroke-linecap="round" />
            </svg>

            {{ content.downloadText }}

            <span class="pdfSize">{{ isEnglish ? '(1.8Mo)' : '(1.9Mo)' }}</span>
          </button>
        </div>

        <svg class="separator" width="100%" height="1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-primary)" />
        </svg>

        <AboutFooter :content="content" :mail="mailLabel" @mail-click="handleMailClick" />
      </main>
    </div>

    <!-- Mobile-only duck playground: open space below the content where the
         flock lives and reacts to touch. Invisible by design; DuckFeet.vue
         finds it via [data-duck-zone] and switches to an in-document,
         touch-interactive canvas over this area. -->
    <div class="duck-zone" data-duck-zone aria-hidden="true" />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.AboutPage {
  display: flex;
  justify-content: center;
  text-wrap: pretty;
  color: var(--color-primary);

  // Hidden on desktop; the ducks roam the full fixed viewport there.
  .duck-zone {
    display: none;
  }

  // On mobile the ducks get a dedicated pen below the content. Stacking the
  // page column and the pen vertically means the flex axis flips, so re-centre
  // the column horizontally. svh (not dvh) keeps the pen a stable height as the
  // URL bar shows/hides, avoiding layout churn under the scrolling canvas.
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;

    .duck-zone {
      display: block;
      width: 100%;
      height: 70svh;
    }
  }

  .container {
    align-self: auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 48px 24px 72px;
    max-width: 480px;

    @media (max-width: 640px) {
      margin-top: 64px;
    }
  }

  .content {
    @extend %text-body;
    text-align: justify;

    .media-container {
      position: relative;
      width: 100%;
      margin-top: 64px;
      overflow: hidden;
      aspect-ratio: 1.6180339887 / 1;
      @include page-transition($page-transition-media-delay);

      .media {
        will-change: transform;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        transform: translateY(calc(var(--scrollY) * 1px));
      }
    }

    .button-container {
      display: flex;
      justify-content: center;
      @include page-transition($page-transition-button-delay);

      .button {
        @extend %text-body;
        color: var(--color-primary);
        font-weight: 500;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: 60px;
        border: 1px solid var(--color-primary);
        background: transparent;
        box-shadow: 1px 1px 0px 0px var(--color-primary);
        padding: 8px 16px;
        cursor: pointer;
        transition: transform cubic-bezier(0.22, 1, 0.36, 1) 0.2s,
          box-shadow cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

        .icon {
          transition: filter 0.3s;
        }

        .pdfSize {
          font-size: 8px;
          font-style: italic;
          align-content: center;
          margin-top: 2px;
        }

        @media (hover: hover) {
          &:hover {
            transform: translate(-2px, -2px);
            box-shadow: 3px 3px 0px 0px var(--color-primary);
          }
        }

        &:active {
          transform: translate(0, 0);
          box-shadow: 0px 0px 0px 0px var(--color-primary);
        }
      }
    }

    .separator {
      @include page-transition($page-transition-separator-delay);

      margin: 64px 0 48px 0;
    }
  }

  &.is-visible {
    .content {

      .media-container,
      .button-container,
      .separator {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    }
  }
}
</style>
