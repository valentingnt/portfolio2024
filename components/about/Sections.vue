<script setup lang="ts">
import type { AboutPageContent, AboutSectionItem } from '@/types/about'

interface SectionsProps {
  sections: AboutPageContent['sections']
}

defineProps<SectionsProps>()

function isItemObject(item: string | AboutSectionItem): item is AboutSectionItem {
  return typeof item === 'object'
}
</script>

<template>
  <div
    v-for="(section, sectionIndex) in sections"
    :key="sectionIndex"
    class="sections"
    :style="{ '--index': sectionIndex }"
  >
    <h2 v-if="section.title" class="title">
      <UiSplitText :text="section.title" />
    </h2>

    <ul v-if="Array.isArray(section.content)" class="list">
      <li
        v-for="(item, itemIndex) in section.content"
        :key="itemIndex"
        class="list-item"
        :class="{ 'has-badge': isItemObject(item) && item.badge }"
      >
        <template v-if="isItemObject(item)">
          <a v-if="item.href" :href="item.href" class="link" target="_blank" rel="noopener noreferrer">
            <UiSplitText :text="item.title" />
          </a>
          <UiSplitText v-else :text="item.title" />

          <span v-if="item.subtitle" class="link-subtitle">
            <UiSplitText :text="item.subtitle" />
          </span>

          <NuxtImg
            v-if="item.badge"
            :src="item.badge"
            alt=""
            width="300"
            height="300"
            class="badge-preview"
            aria-hidden="true"
            loading="lazy"
          />
        </template>

        <UiSplitText v-else :text="item" />
      </li>
    </ul>

    <!-- Content comes from local JSON, not user input -->
    <p v-else class="paragraph" :class="{ quote: !section.title }">
      <UiSplitText :text="section.title ? parseMarkdown(section.content) : section.content" html />
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

// Certification badge previews live in the left gutter, beside the column.
// They shrink with the gutter and are dropped once it can't fit a legible one
// (the link still leads to the badge on Credly) rather than covering text.
$badge-max-size: 300px;
$badge-min-size: 160px;
$badge-gap: 12px; // between badge and column
$badge-edge-margin: 12px; // between badge and window edge (also absorbs classic scrollbars in 100vw)
$column-max-width: 480px; // .AboutPage .container
$badge-hide-below: $column-max-width + 2 * ($badge-min-size + $badge-gap + $badge-edge-margin);

.sections {
  @include page-transition(calc($page-transition-sections-base-delay + var(--index) * $page-transition-sections-increment));

  margin-top: 40px;

  .title {
    @extend %text-h2;
    margin-bottom: 20px;
  }

  :deep(.link) {
    @extend %link;
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

      .badge-preview {
        position: absolute;
        right: calc(100% + #{$badge-gap});
        top: 50%;
        transform: translateY(-50%);
        // The containing block is the section column (its transform makes it
        // one), so (100vw - 100%) / 2 is the gutter beside it
        width: min(#{$badge-max-size}, calc((100vw - 100%) / 2 - #{$badge-gap + $badge-edge-margin}));
        height: auto;
        aspect-ratio: 1;
        object-fit: contain;
        border-radius: 8px;
        pointer-events: none;
        opacity: 0;
        filter: blur(5px);
        will-change: opacity, filter;
        transition: opacity cubic-bezier(0.22, 1, 0.36, 1) 0.4s,
          filter cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
      }

      @media (hover: hover) {
        &.has-badge:hover .badge-preview {
          opacity: 1;
          filter: blur(0);
          will-change: auto;
          transform: translateY(-50%);
          transition: opacity cubic-bezier(0.22, 1, 0.36, 1) 0.4s,
            filter cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
        }
      }

      @media (max-width: #{$badge-hide-below - 1px}) {
        .badge-preview {
          display: none;
        }
      }
    }
  }

  .quote {
    font-style: italic;
    position: relative;
    padding: 0 40px;
    text-align: center;

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
