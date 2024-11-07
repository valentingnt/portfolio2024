<script setup lang="ts">
import aboutFr from '@/content/about_fr.json'
import aboutEn from '@/content/about_en.json'

type AboutPageContent = {
  header: {
    title: string
    subtitle: string
  }
  sections: {
    title?: string
    content: string | string[] | { title: string, href?: string, subtitle?: string }[]
  }[]
  downloadText: string
  footer: {
    content: string[]
    links: {
      title: string, url?: string, onClick?: () => void
    }[]
  }
}

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
    <ThemeToggle />

    <span class="lang-selector">
      <span :class="{ active: !isEnglish }" @click="updateLanguage('fr')">FR</span>
      <span :class="{ active: isEnglish }" @click="updateLanguage('en')">EN</span>
    </span>

    <div class="container">
      <div class="content">
        <BigTitle :title="contentData.header.title" :subtitle="contentData.header.subtitle" />

        <div ref="mediaRef" class="media-container">
          <NuxtImg src="/img/moi.webp" alt="Valentin Genest" class="media" sizes="sm:480px md:640px lg:800px xl:960px"
            densities="1x 2x" :placeholder="[480, 480, 75, 40]" />
        </div>

        <div v-for="(section, index) in contentData.sections" :key="index" class="sections">
          <h2 v-if="section.title" class="title">
            {{ section.title }}
          </h2>

          <span v-if="Array.isArray(section.content)">
            <ul class="list">
              <li v-for="(item, index) in section.content" :key="index" class="list-item">
                <span v-if="typeof item === 'object' && item.href">
                  <NuxtLink :to="item.href" class="link" target="_blank">
                    {{ item.title }}
                  </NuxtLink>
                </span>

                <span v-else-if="typeof item === 'object' && !item.href">
                  <span>{{ item.title }}</span>
                </span>

                <span v-else>{{ item }}</span>

                <span v-if="typeof item === 'object' && item.subtitle" class="link-subtitle">
                  {{ item.subtitle }}
                </span>
              </li>
            </ul>
          </span>

          <p v-else :class="section.title ? null : 'quote'"
            v-html="section.title ? parseMarkdown(section.content) : section.content" />
        </div>

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

        <footer class="footer">
          <p v-for="(content, index) in contentData.footer.content" :key="index">
            {{ content }}
          </p>

          <ul class="links">
            <li class="link-title" :style="{ cursor: 'pointer' }" @click="copyMail">
              {{ mail }}
            </li>

            <li class="link-separator">
              ~
            </li>

            <li v-for="(link, index) in contentData.footer.links" :key="index" class="link">
              <NuxtLink :to="link.url" target="_blank" class="link-title">
                {{ link.title }}
              </NuxtLink>

              <span v-if="index !== contentData.footer.links.length - 1" class="link-separator">
                ~
              </span>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-wrap: pretty;
  color: var(--color-primary);

  @media (max-width: 640px) {
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 72px;
      z-index: 1;
      opacity: 1;
      transition: opacity 0.3s ease;
      background: linear-gradient(to bottom,
          #FFFDF9 0%,
          color-mix(in srgb, #FFFDF9 98.7%, transparent) 8.1%,
          color-mix(in srgb, #FFFDF9 95.1%, transparent) 15.5%,
          color-mix(in srgb, #FFFDF9 89.6%, transparent) 22.5%,
          color-mix(in srgb, #FFFDF9 82.5%, transparent) 29%,
          color-mix(in srgb, #FFFDF9 74.1%, transparent) 35.3%,
          color-mix(in srgb, #FFFDF9 64.8%, transparent) 41.2%,
          color-mix(in srgb, #FFFDF9 55%, transparent) 47.1%,
          color-mix(in srgb, #FFFDF9 45%, transparent) 52.9%,
          color-mix(in srgb, #FFFDF9 35.2%, transparent) 58.8%,
          color-mix(in srgb, #FFFDF9 25.9%, transparent) 64.7%,
          color-mix(in srgb, #FFFDF9 17.5%, transparent) 71%,
          color-mix(in srgb, #FFFDF9 10.4%, transparent) 77.5%,
          color-mix(in srgb, #FFFDF9 4.9%, transparent) 84.5%,
          color-mix(in srgb, #FFFDF9 1.3%, transparent) 91.9%,
          color-mix(in srgb, #FFFDF9 0%, transparent) 100%);

      [data-theme="dark"] & {
        opacity: 0;
      }
    }

    &::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 72px;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
      background: linear-gradient(to bottom,
          #2B2B2B 0%,
          color-mix(in srgb, #2B2B2B 98.7%, transparent) 8.1%,
          color-mix(in srgb, #2B2B2B 95.1%, transparent) 15.5%,
          color-mix(in srgb, #2B2B2B 89.6%, transparent) 22.5%,
          color-mix(in srgb, #2B2B2B 82.5%, transparent) 29%,
          color-mix(in srgb, #2B2B2B 74.1%, transparent) 35.3%,
          color-mix(in srgb, #2B2B2B 64.8%, transparent) 41.2%,
          color-mix(in srgb, #2B2B2B 55%, transparent) 47.1%,
          color-mix(in srgb, #2B2B2B 45%, transparent) 52.9%,
          color-mix(in srgb, #2B2B2B 35.2%, transparent) 58.8%,
          color-mix(in srgb, #2B2B2B 25.9%, transparent) 64.7%,
          color-mix(in srgb, #2B2B2B 17.5%, transparent) 71%,
          color-mix(in srgb, #2B2B2B 10.4%, transparent) 77.5%,
          color-mix(in srgb, #2B2B2B 4.9%, transparent) 84.5%,
          color-mix(in srgb, #2B2B2B 1.3%, transparent) 91.9%,
          color-mix(in srgb, #2B2B2B 0%, transparent) 100%);

      [data-theme="dark"] & {
        opacity: 1;
      }
    }
  }

  .lang-selector {
    @extend %text-body;

    position: fixed;
    top: 16px;
    right: 24px;
    display: flex;
    gap: 8px;
    z-index: 2;

    span {
      cursor: pointer;
      position: relative;

      &.active {
        font-weight: 600;

        &::after {
          content: '•';
          position: absolute;
          bottom: -12px;
          left: calc(50% - 4px);
        }
      }

      @media (hover: hover) {
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .container {
    max-width: 480px;
    align-self: auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 48px 24px 72px;

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

      .sections {
        margin-top: 40px;

        .title {
          @extend %text-h2;
          margin-bottom: 20px;
        }

        .list {
          text-align: left;

          .list-item {
            list-style: '• ' inside;
            padding-left: 5px;

            .link {
              @extend %link;

              transition: padding-left cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

              @media (hover: hover) {
                &:hover {
                  padding-left: 8px;
                }
              }
            }

            .link-subtitle {
              font-size: 10px;
              opacity: 0.5;
              margin-left: 5px;
              font-style: italic;
            }
          }
        }

        .quote {
          font-style: italic;
          position: relative;
          padding: 0 40px;

          &::before {
            content: '“';
            position: absolute;
            font-family: "DM Serif Text";
            line-height: 0;
            font-size: 56px;
            top: 12px;
            left: 0px;
          }

          &::after {
            content: '”';
            position: absolute;
            font-family: "DM Serif Text";
            line-height: 0;
            font-size: 56px;
            bottom: -12px;
            right: 0;
          }
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

      .footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;

        .links {
          display: flex;
          gap: 8px;
          list-style: none;

          .link {
            display: flex;
            gap: 8px;
          }

          .link-title {
            @extend %link;
            transition: transform cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

            @media (hover: hover) {
              &:hover {
                transform: translateY(-2px);
              }
            }
          }
        }
      }
    }
  }
}
</style>
