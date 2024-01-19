<script setup lang="ts">
export interface ProjectData {
  name: string
  type: string[]
  year: string
  description: string
  mainMedia: string
  medias: string[]
  who: string
  where: string
  asWho: string
  howLong: string
  stackUsed: string
}

export interface ListProjectData {
  name: string
  type: string[]
  year: string
}

export interface ProjectsListData {
  projects: ListProjectData[]
}

export interface ProjectsListProps extends ProjectsListData { }

const { projects } = defineProps<ProjectsListProps>()

const slugifiedProjects = computed(() => {
  return projects.map(project => ({
    ...project,
    slug: slugify(project.name)
  }))
})
</script>

<template>
  <div class="ProjectsList">
    <svg class="separator" style="display: block;" width="100%" height="1" viewBox="0 0 100% 1" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-black)" />
    </svg>

    <div class="list-headers">
      <h3 class="list-header">name</h3>
      <h3 class="list-header">type</h3>
      <h3 class="list-header">year</h3>
    </div>

    <div class="list">
      <NuxtLink class="row" v-for="project in slugifiedProjects" :key="project.name" :to="`/projects/${project.slug}`">
        <p class="list-item">{{ project.name }}</p>
        <p class="list-item">{{ project.type.join(' ~ ') }}</p>
        <p class="list-item">{{ project.year }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@mixin gridStyles($span1: 4, $span2: 3, $span3: 1, $paddingTop: 20px, $paddingBottom: 0) {
  @include grid(8);
  @extend %text-body;

  gap: 5px;
  padding: $paddingTop 0 $paddingBottom 0;

  .list-item:nth-child(1),
  .list-header:nth-child(1) {
    grid-column: 1 / span $span1;
  }

  .list-item:nth-child(2),
  .list-header:nth-child(2) {
    grid-column: ($span1 + 1) / span $span2;
  }

  .list-item:nth-child(3),
  .list-header:nth-child(3) {
    grid-column: ($span1 + $span2 + 1) / span $span3;
    text-align: right;
  }

  @media screen and (min-width: $screen-tablet) {
    @include grid(12);

    font-size: 12px;
    gap: 10px;

    .list-item:nth-child(1),
    .list-header:nth-child(1) {
      grid-column: 1 / span 5;
    }

    .list-item:nth-child(2),
    .list-header:nth-child(2) {
      grid-column: 6 / span 6;
    }

    .list-item:nth-child(3),
    .list-header:nth-child(3) {
      grid-column: 12 / -1;
      text-align: right;
    }
  }
}

.ProjectsList {
  margin: 32px 0 64px 0;

  @media screen and (min-width: $screen-tablet) {
    margin: 0;
  }

  .list-headers {
    @include gridStyles(4, 3, 1, 12px, 32px);

    font-size: 2.5vw;
  }

  .list {
    .row {
      @include gridStyles(4, 3, 1, 6px, 6px);

      font-size: 2.5vw;
      white-space: pre;
    }
  }
}
</style>