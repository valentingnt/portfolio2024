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
    lang: cookieLang.value,
  },
  title: 'Valentin Genest - Développeur Front-end',
  meta: [
    {
      name: 'description',
      content: 'Développeur front-end avec 5 ans d\'expérience. Spécialisé dans la création d\'expériences web de qualité. Construisons un internet comme il se doit. - Valentin Genest.',
    },
    {
      property: 'og:description',
      content: 'Développeur front-end. Construisons un internet comme il se doit.',
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
  <div>
    <!-- Loading indicator -->
  </div>
</template>
