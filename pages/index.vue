<script lang="ts" setup>
const cookieLang = useCookie<string>('lang', { default: () => 'fr' })
const targetLang = cookieLang.value === 'en' ? 'en' : 'fr'

useHead({
  title: 'Valentin Genest — Développeur Front-end',
  htmlAttrs: { lang: targetLang },
  meta: [
    { name: 'robots', content: 'noindex, follow' },
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
