<script setup lang="ts">
export interface LinkData {
  text: string
  href?: string
  external?: boolean
}

interface LinkProps extends LinkData { }

const { href, text, external = false } = defineProps<LinkProps>()

const component = computed(() => href ? resolveComponent('NuxtLink') : 'span')
</script>

<template>
  <component :is="component" :target="external ? '_blank' : undefined" :to="href"
    :rel="external ? 'noopener noreferrer' : ''" class="Link">
    {{ text }}
  </component>
</template>

<style scoped lang="scss">
.Link {
  @extend %link;
}
</style>