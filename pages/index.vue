<script setup lang="ts">
interface AboutPageData { }

interface AboutPageProps extends AboutPageData { }

defineProps<AboutPageProps>()

type AboutPageContent = {
  header: {
    title: string
    subtitle: string
  }
  sections: {
    title?: string
    content: string | string[] | { title: string, href?: string }[]
  }[],
  footer: {
    content: string[]
    links: {
      title: string, url?: string, onClick?: () => void
    }[]
  }
}

const MOCK_DATA: AboutPageContent = {
  header: {
    title: 'Valentin Genest',
    subtitle: 'Welcome to the official website of'
  },
  sections: [
    {
      title: 'Who am I:',
      content: 'Web developer for 5 years. Working with cutting-edge front-end related technology, I worked for 2 years for [@derniercri](https://derniercri.io) and now in freelance accompanied by [@studiowawww](https://wawww.studio) for biggest dreams. I love what I do and do it the right way. The stack I use differs depending on the project and needs, but I keep learning new things to build an internet as it should be. With a deep understanding of modern web technologies and frameworks, I strive to create responsive, accessible, and performant web applications. My expertise includes proficiency in JavaScript frameworks, as well as a strong command of HTML, CSS, and related tools and libraries. I prioritize writing clean, maintainable code and adhere to industry best practices. I stay up-to-date with the latest trends and best practices in web development, ensuring that my work is not only visually appealing but also optimized for performance and accessibility'
    },
    {
      title: 'I worked for:',
      content: [
        {
          title: 'Maison Sablayrolles (WIP)',
        },
        {
          title: 'Givenchy (NDA)',
        },
        {
          title: 'iad mobile',
          href: 'https://derniercri.io/clients/iad'
        },
      ]
    },
    {
      title: 'I work with:',
      content: [
        'A computer',
        'Everything JS related (and more!)',
        'A lot of coffee',
        'Cutting-edge development tools and technologies',
        'Agile methodologies and collaborative workflows'
      ]
    },
    {
      title: 'More about me:',
      content: [
        'Living in Bordeaux',
        'Practicing volley-Ball',
        'Continuously learning and exploring new technologies',
        'Passionate about creating intuitive and delightful user experiences',
        'Committed to writing clean, maintainable, and scalable code',
        'Love coffee',
        'Enjoy traveling. For real.',
      ]
    },
    {
      content: 'Comme un lundi: frais dans la matinée, soleil l’après-midi, la recette des sports d’hiver réussis.'
    }
  ],
  footer: {
    content: [
      'Paris / Bordeaux',
      '© 2024 Valentin Genest - All rights reserved.'
    ],
    links: [
      {
        title: 'linkedin',
        url: 'https://www.linkedin.com/valentin-genest'
      },
      {
        title: 'github',
        url: 'https://github.com/valentingnt'
      },
      {
        title: 'malt',
        url: 'https://www.malt.fr/profile/valentingenest'
      },
      {
        title: 'threads',
        url: 'https://threads.net/nulentin'
      }
    ],
  }
}

const mediaRef = ref<HTMLElement>()
const mail = ref<string>('mail')
const { width } = useOnWindowResize()
const img = useImage()

function copyMail() {
  navigator.clipboard.writeText('valentin64.genest@gmail.com')
  mail.value = 'copied!'
  
  setTimeout(() => mail.value = 'mail', 2000)
}

function downloadResume() {
  window.open('/CV2024_Valentin_Genest.pdf', '_blank')
}

function parseMarkdown(content: string) {
  return content.
    replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="link" target="_blank" rel="noopener noreferrer">$1</a>')
}

function onScroll(scrollY: number) {
  const value = Math.max(scrollY * 0.1, 0)

  window.requestAnimationFrame(() => {
    mediaRef.value?.style.setProperty('--scrollY', `${value}px`)
  })
}

watchScroll(onScroll)
</script>

<template>
  <div class="AboutPage">
    <div class="container">
      {{ console.log(width) }}
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
            densities="1x 2x 3x"
            :placeholder="img('/img/moi.jpeg', { h: 10, f: 'png', blur: 2, q: 50 })"
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
            Download my resume <span class="pdfSize">(1.80 Mo)</span>
          </button>
        </div>
        
        <svg
          class="separator"
          width="100%"
          height="1"
          viewBox="0 0 100% 1"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-v-77c8d1ae=""
        ><line
          x1="0.5"
          y1="0.5"
          x2="100%"
          y2="0.5"
          stroke="var(--color-black)"
          data-v-77c8d1ae=""
        />
        </svg>

        <footer class="footer">
          <span
            v-for="(content, index) in MOCK_DATA.footer.content"
            :key="index"
          >
            {{ content }}
          </span>
          <div class="links">
            <span
              class="link-title"
              :style="{ cursor: 'pointer' }"
              @click="copyMail"
            >
              {{ mail }}
            </span>
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
  </div>
</template>

<style scoped lang="scss">
.AboutPage {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .container {
    max-width: 480px;
    align-self: auto;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    margin: 32px 16px;

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

      .button-container{
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