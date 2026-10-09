<script setup lang="ts">
interface UiTagProps {
  title: string
}

const { title } = defineProps<UiTagProps>()

const emit = defineEmits<{
  click: [title: string]
}>()

const NON_BREAKING_SPACE = '\u00A0'

const characters = computed(() => [...title].map((char) => (char === ' ' ? NON_BREAKING_SPACE : char)))
</script>

<template>
  <button type="button" class="Tag" :aria-label="title" @click.passive="emit('click', title)">
    <span class="dot" aria-hidden="true" data-marquee-item />
    <span class="title" aria-hidden="true">
      <span v-for="(char, index) in characters" :key="`${char}-${index}`" class="char" data-marquee-item>{{ char }}</span>
    </span>
  </button>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;

.Tag {
  @extend %text-body;

  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  opacity: 0.8;
  position: relative;
  white-space: nowrap;
  cursor: pointer;

  .title {
    display: inline-block;
  }

  .char {
    display: inline-block;
  }

  // Centred with `top` rather than a translateY: the marquee bend owns `transform`
  .dot {
    position: absolute;
    left: 0;
    top: calc(50% - 2px);
    width: 4px;
    height: 4px;
    background-color: var(--color-primary);
    border-radius: 50%;
    opacity: 0.5;
    margin-left: -12px;
  }

  @media (hover: hover) {
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;

      .dot {
        opacity: 0.8;
      }
    }
  }
}
</style>
