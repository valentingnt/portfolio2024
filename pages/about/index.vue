<script setup lang="ts">
interface AboutPageData { }

interface AboutPageProps extends AboutPageData { }

defineProps<AboutPageProps>()

type AboutPageContent = {
  sections: {
    title?: string
    content: string | string[] | { title: string, href: string }[]
  }[]
}

const MOCK_DATA: AboutPageContent = {
  sections: [
    {
      title: 'Who am I:',
      content: 'Web developer for 5 years. Started from the bottom with wordpress, now at the top working with cutting-edge front-end related technology. I worked for 2 years for @derniercri and now in freelance accompanied by @studiowawww for biggest dreams. I love what I do and do it the right way. The stack I use differs depending on the project and needs, but I keep learning new things to build an internet as it should be.'
    },
    {
      title: 'More about me:',
      content: [
        'Live in Bordeaux',
        'Practice volley-Ball',
        'Watch netflix',
        'Love coffee'
      ]
    },
    {
      title: 'I work with:',
      content: [
        'A computer',
        'Everything JS related (and more!)'
      ]
    },
    {
      title: 'I worked for:',
      content: [
        {
          title: 'Maison Sablayrolles',
          href: 'https://maisonsablayrolles.com'
        },
        {
          title: 'Givenchy (NDA)',
          href: 'https://givenchy.com'
        },
        {
          title: 'iad mobile',
          href: 'https://iadmobile.com'
        },
      ]
    },
    {
      content: 'Comme un lundi: frais dans la matinée, soleil l’après-midi, la recette des sports d’hiver réussis.'
    }
  ]
}
</script>

<template>
  <div class="AboutPage">
    <div class="container">
      <div class="content">
        <BigTitle
          title="Valentin Genest"
          subtitle="Welcome to the official website of"
        />

        <NuxtImg 
          src="/img/moi.jpeg"
          alt="Valentin Genest"
          class="media"
        />

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
                  class="list-link"
                >
                  {{ item.title }}
                </NuxtLink>
                <span v-else>{{ item }}</span>
              </li>
            </ul>
          </span>
          <span
            v-else
            class="quote"
          >{{ section.content }}</span>
        </div>
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
    margin: 64px 0;
    
    .content {
      .media {
        width: 100%;
        height: 250px;
        object-fit: cover;
        object-position: center;
        margin-top: 64px;
      }

      .sections {
        margin-top: 40px;

        .title {
          @extend %text-h2;
        }

        .list {
          list-style: '• ' inside;
          padding-left: 5px;
        }

        .list-item {
          @extend %text-body;

          /* .list-link { */
            &::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 100%;
              height: 1px;
              background-color: var(--color-black);
            }
          /* } */
        }
      }
    }
  }
}
</style>