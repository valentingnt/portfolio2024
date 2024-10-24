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
            <NuxtImg src="/img/dl.svg" alt="Download" width="12" height="15" class="icon" />
            {{ contentData.downloadText }}

            <span class="pdfSize">(2.4 Mo)</span>
          </button>
        </div>

        <svg class="separator" width="100%" height="1" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-black)" />
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

  .lang-selector {
    @extend %text-body;

    position: fixed;
    top: 16px;
    right: 24px;
    display: flex;
    gap: 8px;

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
    margin: 48px 24px;

    text-shadow: 0px 0px 8px var(--color-white);

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
            color: var(--color-black);
          }

          &::after {
            content: '”';
            position: absolute;
            font-family: "DM Serif Text";
            line-height: 0;
            font-size: 56px;
            bottom: -12px;
            right: 0;
            color: var(--color-black);
          }
        }
      }

      .button-container {
        display: flex;
        justify-content: center;

        .button {
          @extend %text-body;

          color: var(--color-black);
          font-weight: 600;
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 60px;
          border: 1px solid var(--color-black);
          background: transparent;
          box-shadow: 1px 1px 0px 0px var(--color-black);
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
              box-shadow: 3px 3px 0px 0px var(--color-black);
            }
          }

          &:active {
            transform: translate(0, 0);
            box-shadow: 0px 0px 0px 0px var(--color-black);
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
