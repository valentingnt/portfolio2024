<script lang="ts" setup>
const cookieLang = useCookie<string>('lang', { default: () => 'fr' })
const targetLang = cookieLang.value === 'en' ? 'en' : 'fr'

useHead({
  title: targetLang === 'en' ? 'Valentin Genest | Frontend Developer in Bordeaux and Paris' : 'Valentin Genest | Développeur Front-end à Bordeaux et Paris',
  htmlAttrs: { lang: targetLang },
  meta: [
    { name: 'robots', content: 'noindex, follow' },
    { name: 'description', content: targetLang === 'en' ? 'Frontend developer with 5 years of experience, based between Paris and Bordeaux. Specialized in building accessible and performant web experiences.' : 'Développeur frontend avec 5 ans d\'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d\'expériences web accessibles et performantes.' },
  ],
  link: [
    { rel: 'canonical', href: `https://valentingenest.fr/${targetLang}` },
    { rel: 'alternate', hreflang: 'fr', href: 'https://valentingenest.fr/fr' },
    { rel: 'alternate', hreflang: 'en', href: 'https://valentingenest.fr/en' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://valentingenest.fr/fr' },
  ],
})

await navigateTo(`/${targetLang}`, { redirectCode: 302 })
</script>

<template>
  <div>
    <!-- Loading indicator -->
  </div>
</template>
