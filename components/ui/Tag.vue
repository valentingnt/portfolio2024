<script setup lang="ts">
interface UiTagProps {
  title: string
}

defineProps<UiTagProps>()

const emit = defineEmits<{
  click: [title: string]
}>()
</script>

<template>
  <button type="button" class="Tag" @click="emit('click', title)">
    <span class="title">{{ title }}</span>
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
  font-weight: 500;
  color: var(--color-primary);
  opacity: 0.8;
  position: relative;
  white-space: nowrap;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 4px;
    background-color: var(--color-primary);
    border-radius: 50%;
    transform: translateY(-50%);
    opacity: 0.5;
    margin-left: -12px;
  }

  @media (hover: hover) {
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;

      &::before {
        opacity: 0.8;
      }
    }
  }
}
</style>
