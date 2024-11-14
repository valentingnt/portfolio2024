<script setup lang="ts">
import aboutFr from '@/content/about_fr.json'
import aboutEn from '@/content/about_en.json'
import type { AboutPageContent } from '@/types/about'

const route = useRoute()
const lang = computed(() => route.params.lang as string)
const mail = ref('mail')
const EMAIL = 'valentin64.genest@gmail.com'

const contentData: ComputedRef<AboutPageContent> = computed(() => isEnglish.value ? aboutEn : aboutFr)

function copyMail() {
  copyToClipboard(EMAIL)
  mail.value = isEnglish.value ? 'copied!' : 'copié!'
  setTimeout(() => mail.value = 'mail', 2000)
}

function downloadResume() {
  const fileName = isEnglish.value ? 'EN_CV2024_Valentin_Genest.pdf' : 'CV2024_Valentin_Genest.pdf'
  window.open(`/${fileName}`, '_blank')
}

const { mediaRef, onScroll } = useScrollEffect()
const { updateLanguage, isEnglish } = useLanguage(lang.value)

watchScroll(onScroll)

useHead(() => ({
  htmlAttrs: {
    lang: lang.value,
  },
  title: 'Valentin Genest',
  meta: [
    {
      name: 'description',
      content: isEnglish.value
        ? 'Valentin Genest - Front-end developer with 5 years of experience. Specialized in creating quality web experiences. Let\'s build the internet as it should be.'
        : "Valentin Genest - Développeur front-end avec 5 ans d'expérience. Spécialisé dans la création d'expériences web de qualité. Construisons un internet comme il se doit.",
    },
    {
      property: 'og:description',
      content: isEnglish.value
        ? 'Valentin Genest - Front-end developer. Let\'s build the internet as it should be.'
        : 'Valentin Genest - Développeur front-end. Construisons un internet comme il se doit.',
    },
    { property: 'og:title', content: 'Valentin Genest' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: `https://valentingenest.fr` },
    { property: 'og:image', content: '/img/ogImage.jpg' },
    { property: 'og:image:alt', content: 'Valentin Genest' },
    { property: 'og:site_name', content: 'Valentin Genest' },
  ],
}))
</script>

<template>
  <div class="AboutPage">
    <div class="container">
      <AboutHeader :content="contentData" :is-english="isEnglish" :on-language-change="updateLanguage" />

      <div class="content">
        <div ref="mediaRef" class="media-container">
          <NuxtImg src="/img/moi.webp" alt="Valentin Genest" class="media" sizes="sm:480px md:640px lg:800px xl:960px"
            densities="1x 2x" :placeholder="[480, 480, 75, 40]" />
        </div>

        <AboutSections :sections="contentData.sections" />

        <div class="button-container">
          <button class="button" type="button" @click="downloadResume">
            <svg viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon" width="12"
              height="15">
              <path
                d="M7.5 0.5C7.5 0.223858 7.27614 1.20705e-08 7 0C6.72386 -1.20705e-08 6.5 0.223858 6.5 0.5L7.5 0.5ZM6.64645 12.4325C6.84171 12.6278 7.15829 12.6278 7.35355 12.4325L10.5355 9.25052C10.7308 9.05526 10.7308 8.73868 10.5355 8.54341C10.3403 8.34815 10.0237 8.34815 9.82843 8.54341L7 11.3718L4.17157 8.54341C3.97631 8.34815 3.65973 8.34815 3.46447 8.54341C3.2692 8.73867 3.2692 9.05526 3.46447 9.25052L6.64645 12.4325ZM6.5 0.5L6.5 12.0789L7.5 12.0789L7.5 0.5L6.5 0.5Z" />
              <path d="M1 15.5H13" stroke="currentColor" stroke-linecap="round" />
            </svg>
            {{ contentData.downloadText }}

            <span class="pdfSize">(2.4 Mo)</span>
          </button>
        </div>

        <svg class="separator" width="100%" height="1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-primary)" />
        </svg>

        <AboutFooter :content="contentData" :mail="mail" :on-mail-click="copyMail" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  justify-content: center;
  text-wrap: pretty;
  color: var(--color-primary);

  .container {
    align-self: auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 48px 24px 72px;
    max-width: 480px;
  }

  .content {
    @extend %text-body;
    text-align: justify;

    .media-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      margin-top: 64px;
      aspect-ratio: 1.6180339887 / 1;

      .media {
        will-change: transform;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        transform: translateY(var(--scrollY));
      }
    }

    .button-container {
      display: flex;
      justify-content: center;

      .button {
        @extend %text-body;
        color: var(--color-primary);
        font-weight: 600;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 60px;
        border: 1px solid var(--color-primary);
        background: transparent;
        box-shadow: 1px 1px 0px 0px var(--color-primary);
        padding: 8px 16px;
        cursor: pointer;
        transition: transform cubic-bezier(0.22, 1, 0.36, 1) 0.2s, box-shadow cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

        .icon {
          margin-right: 10px;
          transition: filter 0.3s;
        }

        .pdfSize {
          font-size: 8px;
          font-style: italic;
          margin-left: 8px;
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
      margin: 64px 0 48px 0;
    }
  }
}
</style>
