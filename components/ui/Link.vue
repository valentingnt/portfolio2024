<script setup lang="ts">
export interface LinkData {
  text: string
  href?: string
  external?: boolean
}

interface LinkProps extends LinkData { }

const { href, text, external = false } = defineProps<LinkProps>()

const isExternal = computed(() => href?.startsWith('http') || href?.startsWith('//'))
const component = computed(() => {
  if (!href) return 'span'
  return isExternal.value ? 'a' : resolveComponent('NuxtLink')
})
</script>

<template>
  <component :is="component" :target="external || isExternal ? '_blank' : undefined"
    :to="isExternal ? undefined : href" :href="isExternal ? href : undefined"
    :rel="external || isExternal ? 'noopener noreferrer' : ''" class="Link">
    {{ text }}
  </component>
</template>

<style scoped lang="scss">
.Link {
  @extend %link;
}
</style>