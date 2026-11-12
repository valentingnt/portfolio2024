<script setup lang="ts">
interface SplitTextProps {
  text: string
  /** `text` is trusted markup (local JSON) rather than plain text */
  html?: boolean
}

const { text, html = false } = defineProps<SplitTextProps>()

const markup = computed(() => splitChars(html ? text : escapeHtml(text)))
</script>

<template>
  <!-- Escaped above, or local JSON when `html` is set -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span class="SplitText" v-html="markup" />
</template>

<style scoped lang="scss">
.SplitText :deep(.ch) {
  // globals.scss gives every span a list of theme-colour transitions; glyphs
  // only inherit colour, and with ~1700 of them restyled by useCharRipple that
  // bookkeeping was ~30% of the per-frame style recalc
  transition: none;
}
</style>
