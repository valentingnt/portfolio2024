<script setup lang="ts">
import aboutFr from '@/content/about_fr.json'
import aboutEn from '@/content/about_en.json'

import { Application } from '@splinetool/runtime';

type AboutPageContent = {
  header: {
    title: string
    subtitle: string
  }
  sections: {
    title?: string
    content: string | string[] | { title: string, href?: string }[]
  }[]
  downloadText: string
  footer: {
    content: string[]
    links: {
      title: string, url?: string, onClick?: () => void
    }[]
  }
}

const mediaRef = ref<HTMLElement>()
const mail = ref<string>('mail')
const canvas3d = ref()
const app = ref<Application>()
const isMobile = ref(false)
const isReducedMotion = ref(false)

const MOCK_DATA: ComputedRef<AboutPageContent> = computed(() => lang.value === 'en' ? aboutEn : aboutFr)
  
const { lang, setLang } = useLang()
const cookieLang = useCookie('lang')

const EMAIL: string = 'valentin64.genest@gmail.com'
  
function copyMail() {
  navigator.clipboard.writeText(EMAIL)
  mail.value = lang.value === 'en' ? 'copied!' : 'copié!'

  setTimeout(() => mail.value = 'mail', 2000)
}

function downloadResume() {
  if (lang.value === 'en') {
    window.open('/EN_CV2024_Valentin_Genest.pdf', '_blank')
  } else {
    window.open('/CV2024_Valentin_Genest.pdf', '_blank')
  }
}

function parseMarkdown(content: string) {
  return content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="link" target="_blank" rel="noopener noreferrer">$1</a>')
}

function onScroll(scrollY: number) {
  const value = Math.max(scrollY * 0.1, 0)

  window.requestAnimationFrame(() => {
    mediaRef.value?.style.setProperty('--scrollY', `${value}px`)
  })
}

function preventSpacebarScroll(event: KeyboardEvent) {
  if (event.key === ' ') event.preventDefault()
}

async function initializeSpline() {
  if (!isMobile.value && !isReducedMotion.value) {
    app.value = new Application(canvas3d.value)
    
    try {
      await app.value.load('https://prod.spline.design/kz-R06edYbCwBzh0/scene.splinecode')
      
      app.value.addEventListener('rendered', () => {
        canvas3d.value.style.display = 'block'
      })
    } catch (error) {
      console.error('Failed to load Spline scene:', error)
    }
  }
}

onMounted(() => {
  isMobile.value = window.matchMedia('(hover: none)').matches
  isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isMobile.value || !isReducedMotion.value) {
    document.addEventListener('keypress', preventSpacebarScroll)
    initializeSpline()
  }

  if (cookieLang.value) {
    lang.value = cookieLang.value
  } else {
    cookieLang.value = lang.value
  }
})



onUnmounted(() => {
  document.removeEventListener('keypress', preventSpacebarScroll)
  app.value?.dispose()
})

watch(lang, () => {
  cookieLang.value = lang.value
})

watchScroll(onScroll)
</script>

<template>
  <div class="AboutPage">
    <span class="lang-selector">
      <span
        :class="{ active: lang === 'fr' }"
        @click="setLang('fr')"
      >FR</span>
      <span
        :class="{ active: lang === 'en' }"
        @click="setLang('en')"
      >EN</span>
    </span>

    <div class="container">
      <div class="content">
        <BigTitle
          :title="MOCK_DATA.header.title"
          :subtitle="MOCK_DATA.header.subtitle"
        />
        <div
          ref="mediaRef"
          class="media-container"
        >
          <NuxtImg
            src="/img/moi.webp"
            alt="Valentin Genest"
            class="media"
            sizes="sm:480px md:640px lg:800px xl:960px"
            densities="1x 2x"
            :placeholder="[480, 480, 75, 40]"
          />
        </div>
        <div
          v-for="(section, index) in MOCK_DATA.sections"
          :key="index"
          class="sections"
        >
          <h2
            v-if="section.title"
            class="title"
          >
            {{ section.title }}
          </h2>
          <span v-if="Array.isArray(section.content)">
            <ul class="list">
              <li
                v-for="(item, index) in section.content"
                :key="index"
                class="list-item"
              >
                <NuxtLink
                  v-if="typeof item === 'object'"
                  :to="item.href"
                  :class="item.href ? 'link' : 'link-disabled'"
                  target="_blank"
                  @click.passive="item.href ? null : $event.preventDefault()"
                >
                  {{ item.title }}
                </NuxtLink>
                <span v-else>{{ item }}</span>
              </li>
            </ul>
          </span>
          <div
            v-else
            :class="section.title ? null : 'quote'"
            v-html="section.title ? parseMarkdown(section.content) : section.content"
          />
        </div>
        <div class="button-container">
          <button
            class="button"
            type="button"
            @click="downloadResume"
          >
            <NuxtImg
              src="/img/dl.svg"
              alt="Download"
              width="12"
              height="15"
              class="icon"
            />
            {{ MOCK_DATA.downloadText }}<span class="pdfSize">(2.4 Mo)</span>
          </button>
        </div>
        <svg
          class="separator"
          width="100%"
          height="1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.5"
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="var(--color-black)"
          />
        </svg>
        <footer class="footer">
          <span
            v-for="(content, index) in MOCK_DATA.footer.content"
            :key="index"
          >{{ content }}</span>
          <div class="links">
            <span
              class="link-title"
              :style="{ cursor: 'pointer' }"
              @click="copyMail"
            >{{ mail }}</span>
            <p class="link-separator">
              ~
            </p>
            <div
              v-for="(link, index) in MOCK_DATA.footer.links"
              :key="index"
              class="link"
            >
              <NuxtLink
                :to="link.url"
                target="_blank"
                class="link-title"
              >
                {{ link.title }}
              </NuxtLink>
              <p
                v-if="index !== MOCK_DATA.footer.links.length - 1"
                class="link-separator"
              >
                ~
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <canvas
      id="canvas"
      ref="canvas3d"
    />
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  align-items: flex-start;
  justify-content: center;


  #canvas {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;

    @media (max-width: 1600px) {
      display: none !important;
    }
  }

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
        aspect-ratio: 1.618 / 1;

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

            .link-disabled {
              cursor: auto;
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
