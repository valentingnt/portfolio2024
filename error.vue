<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const cookieLang = useCookie<string>('lang', { default: () => 'fr' })
const isEnglish = cookieLang.value === 'en'
const lang = isEnglish ? 'en' : 'fr'

const title = props.error?.statusCode === 404
  ? (isEnglish ? 'Page not found — Valentin Genest' : 'Page introuvable — Valentin Genest')
  : (isEnglish ? 'Something went wrong — Valentin Genest' : 'Une erreur est survenue — Valentin Genest')

const heading = props.error?.statusCode === 404
  ? (isEnglish ? 'This page does not exist.' : "Cette page n'existe pas.")
  : (isEnglish ? 'Something went wrong.' : 'Une erreur est survenue.')

const linkLabel = isEnglish ? 'Back to home' : "Retour à l'accueil"

useHead({
  title,
  htmlAttrs: { lang },
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'description', content: heading },
  ],
})

function handleError() {
  clearError({ redirect: `/${lang}` })
}
</script>

<template>
  <main class="error-page">
    <div class="container">
      <p class="status">{{ error.statusCode }}</p>
      <h1 class="heading">{{ heading }}</h1>
      <button type="button" class="link" @click.passive="handleError">{{ linkLabel }}</button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  color: var(--color-primary);
  text-align: center;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    max-width: 480px;
  }

  .status {
    font-size: 64px;
    font-weight: 500;
    opacity: 0.5;
  }

  .heading {
    font-size: 20px;
    font-weight: 500;
  }

  .link {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    border-radius: 60px;
    padding: 8px 16px;
    cursor: pointer;
    margin-top: 16px;
  }
}
</style>
