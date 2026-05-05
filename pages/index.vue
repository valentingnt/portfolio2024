<script lang="ts" setup>
const cookieLang = useCookie<string>('lang', { default: () => 'fr' })
const targetLang = cookieLang.value === 'en' ? 'en' : 'fr'

await navigateTo(`/${targetLang}`, { redirectCode: 302 })
</script>

<template>
  <div>
    <!-- Loading indicator -->
  </div>
</template>
