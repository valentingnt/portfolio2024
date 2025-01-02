<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCookie } from '#app'

const router = useRouter()
const cookieLang = useCookie('lang')

onMounted(() => {
  if (!cookieLang.value) {
    cookieLang.value = 'fr'
  }
  router.push(`/${cookieLang.value}`)
})

useHead(() => ({
  htmlAttrs: {
    lang: cookieLang.value ?? 'fr',
  },
  title: 'Valentin Genest - Développeur Front-end',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'robots', content: 'index, follow' },
    { name: 'author', content: 'Valentin Genest' },
    {
      name: 'description',
      content: 'Développeur front-end avec 5 ans d\'expérience. Spécialisé dans la création d\'expériences web de qualité. Construisons un internet comme il se doit. - Valentin Genest.',
    },
    {
      property: 'og:description',
      content: 'Développeur front-end. Construisons un internet comme il se doit.',
    },
    { property: 'og:title', content: 'Valentin Genest - Développeur Front-end' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://valentingenest.fr' },
    { property: 'og:image', content: '/img/ogImage.jpg' },
    { property: 'og:image:alt', content: 'Valentin Genest' },
    { property: 'og:site_name', content: 'Valentin Genest' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:locale:alternate', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Valentin Genest - Développeur Front-end' },
    { name: 'twitter:description', content: 'Développeur front-end. Construisons un internet comme il se doit.' },
    { name: 'twitter:image', content: '/img/ogImage.jpg' },
    { name: 'twitter:image:alt', content: 'Valentin Genest' },
  ],
  link: [
    { rel: 'canonical', href: 'https://valentingenest.fr' },
    { rel: 'alternate', hreflang: 'fr', href: 'https://valentingenest.fr/fr' },
    { rel: 'alternate', hreflang: 'en', href: 'https://valentingenest.fr/en' },
  ]
}))
</script>

<template>
  <div>
    <!-- Loading indicator -->
  </div>
</template>
