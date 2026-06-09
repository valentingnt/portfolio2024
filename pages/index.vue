<script lang="ts" setup>
// Language root: redirects to the visitor's preferred language before render
const cookieLang = useCookie<string>('lang', { default: () => 'fr' })
const targetLang = cookieLang.value === 'en' ? 'en' : 'fr'

await navigateTo(`/${targetLang}`, { redirectCode: 302 })
</script>

<template>
  <div />
</template>
