<script setup lang="ts">
export interface Media {
  src: string
  alt: string
}

export interface UiTagData {
  title: string
  icon: Media
}

export interface UiTagProps extends UiTagData { }

defineProps<UiTagProps>()
</script>

<template>
  <div class="Tag">
    <NuxtImg :src="icon.src" :alt="icon.alt" class="icon" sizes="16px" />
    <p class="title">{{ title }}</p>
  </div>
</template>

<style scoped lang="scss">
.Tag {
  @extend %text-body;

  display: flex;
  padding: 8px 10px;
  margin: 1px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border-radius: 60px;
  border: 1px solid var(--color-primary);
  background-color: var(--color-secondary);
  box-shadow: 1px 1px 0px 0px var(--color-primary);

  .icon {
    width: 16px;
    height: 16px;
  }
}
</style>