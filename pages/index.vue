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
const cursor = ref<HTMLElement>()
const path = ref<HTMLElement>()
const { lang, setLang } = useLang()
const cookieLang = useCookie('lang')
const MOCK_DATA: ComputedRef<AboutPageContent> = computed(() => lang.value === 'en' ? aboutEn : aboutFr)

const EMAIL = 'valentin64.genest@gmail.com'

function copyMail() {
  navigator.clipboard.writeText(EMAIL)
  mail.value = lang.value === 'en' ? 'copied!' : 'copié!'

  setTimeout(() => mail.value = 'mail', 2000)
}

function downloadResume() {
  window.open('/CV2024_Valentin_Genest.pdf', '_blank')
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

const points: { x: number, y: number }[] = []
const segments = 100
const mouse = { x: 0, y: 0 }

function move(event: MouseEvent) {
  const x = event.clientX
  const y = event.clientY

  mouse.x = x
  mouse.y = y

  if (points.length === 0) {
    for (let i = 0; i < segments; i++) {
      points.push({ x, y })
    }
  }
}

function animateCursorTrail() {
  if (!path.value) return

  let previousX = mouse.x
  let previousY = mouse.y

  points.forEach((point, index) => {
    point.x = previousX
    point.y = previousY

    const nextPoint = points[index + 1]

    if (nextPoint) {
      previousX = previousX - (point.x - nextPoint.x) * 0.1
      previousY = previousY - (point.y - nextPoint.y) * 0.1
    }
  })

  window.requestAnimationFrame(() => {
    if (path.value && points.length !== 0) {
      path.value?.setAttribute('d', `M ${points.map(point => `${point.x} ${point.y}`).join(' L ')}`)

      animateCursorTrail()
    } else {
      animateCursorTrail()
    }
  })
}

function resize() {
  if (!cursor.value) return

  const ww = window.innerWidth
  const wh = window.innerHeight
  cursor.value.style.width = `${ww}px`
  cursor.value.style.height = `${wh}px`
  cursor.value.setAttribute('viewBox', `0 0 ${ww} ${wh}`)
}

onMounted(() => {
  document.addEventListener('mousemove', move, { passive: true })

  if (cookieLang.value) {
    lang.value = cookieLang.value
  } else {
    cookieLang.value = lang.value
  }

  animateCursorTrail()
})

onUnmounted(() => document.removeEventListener('mousemove', move))

watch(lang, () => {
  cookieLang.value = lang.value
})

watchWindowResize(resize)
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
            src="/img/moi.jpeg"
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
          <h3
            v-if="section.title"
            class="title"
          >
            {{ section.title }}
          </h3>
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
            {{ MOCK_DATA.downloadText }}<span class="pdfSize">(1.80 Mo)</span>
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
    <svg
      ref="cursor"
      class="trail"
      viewBox="0 0 1791 838"
      style="width: 1791px; height: 838px;"
    >
      <path
        ref="path"
        d="M 0 0 L 0 0"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  cursor: none;

  .trail {
    display: none;
  }

  @media (hover: hover) {
    .trail {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
    }

    .trail path {
      fill: none;
      stroke: var(--color-accent);
      stroke-width: 6px;
      stroke-linecap: round;
      stroke-linejoin: round;
      will-change: d;
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

      &:hover {
        text-decoration: underline;
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

              &:hover {
                padding-left: 8px;
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
          background: var(--color-white);
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

            &:hover {
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
}
</style>
