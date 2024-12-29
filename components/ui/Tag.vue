<script setup lang="ts">
export interface Media {
  src: string
  alt: string
}

export interface UiTagData {
  title: string
  icon?: Media
}

export interface UiTagProps extends UiTagData { }

defineProps<UiTagProps>()
const emit = defineEmits<{
  click: [title: string]
}>()
</script>

<template>
  <div class="Tag" @click="emit('click', title)">
    <NuxtImg v-if="icon" :src="icon.src" :alt="icon.alt" class="icon" sizes="16px" />
    <span class="title">{{ title }}</span>
  </div>
</template>

<style scoped lang="scss">
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

  .icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  @media (hover: hover) {
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;

      &::before {
        opacity: 0.8;
      }

      .icon {
        opacity: 1;
      }
    }
  }
}
</style>