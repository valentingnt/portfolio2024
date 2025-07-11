<script setup lang="ts">
import type { AboutPageContent } from '@/types/about'

interface SectionsProps {
  sections: AboutPageContent['sections']
}

defineProps<SectionsProps>()
</script>

<template>
  <div v-for="(section, index) in sections" :key="index" class="sections" :style="{ '--index': index }">
    <h2 v-if="section.title" class="title">
      {{ section.title }}
    </h2>

    <span v-if="Array.isArray(section.content)">
      <ul class="list">
        <li v-for="(item, index) in section.content" :key="index" class="list-item">
          <span v-if="typeof item === 'object' && item.href">
            <NuxtLink :to="item.href" class="link" target="_blank">
              {{ item.title }}
            </NuxtLink>
          </span>

          <span v-else-if="typeof item === 'object' && !item.href">
            <span>{{ item.title }}</span>
          </span>

          <span v-else>{{ item }}</span>

          <span v-if="typeof item === 'object' && item.subtitle" class="link-subtitle">
            {{ item.subtitle }}
          </span>
        </li>
      </ul>
    </span>

    <p v-else :class="section.title ? null : 'quote'"
      v-html="section.title ? parseMarkdown(section.content) : section.content" />
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.sections {
  @include page-transition(calc($page-transition-sections-base-delay + var(--index) * $page-transition-sections-increment));

  margin-top: 40px;

  .title {
    @extend %text-h2;
    margin-bottom: 20px;
  }

  .list {
    text-align: left;

    .list-item {
      list-style: '• ' inside;
      padding-left: 5px;

      .link {
        @extend %link;

        transition: padding-left cubic-bezier(0.22, 1, 0.36, 1) 0.2s;

        @media (hover: hover) {
          &:hover {
            padding-left: 8px;
          }
        }
      }

      .link-subtitle {
        font-size: 10px;
        opacity: 0.65;
        margin-left: 5px;
        font-style: italic;
      }
    }
  }

  .quote {
    font-style: italic;
    position: relative;
    padding: 0 40px;

    &::before {
      content: '“';
      position: absolute;
      font-family: "DM Serif Text";
      line-height: 0;
      font-size: 56px;
      top: 12px;
      left: 0px;
    }

    &::after {
      content: '”';
      position: absolute;
      font-family: "DM Serif Text";
      line-height: 0;
      font-size: 56px;
      bottom: -12px;
      right: 0;
    }
  }
}
</style>