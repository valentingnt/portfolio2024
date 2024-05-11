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

const listHeaders = ref<HTMLElement | null>(null)
const componentRef = ref<HTMLElement | null>(null)
const cursorX = ref(0)
const cursorY = ref(0)

const slugifiedProjects = computed(() => {
  return projects.map(project => ({
    ...project,
    slug: slugify(project.name)
  }))
})

function updateBackground() {
  if (!componentRef.value) return
  componentRef.value.style.setProperty('--mouse-x', `${cursorX.value}px`)
  componentRef.value.style.setProperty('--mouse-y', `${cursorY.value}px`)
}

function updateCursorPosition(event: MouseEvent) {
  if (!componentRef.value) return
  const rect = componentRef.value.getBoundingClientRect();
  cursorX.value = event.clientX - rect.left - 125;
  cursorY.value = event.clientY - rect.top - 125;

  window.requestAnimationFrame(updateBackground)
}

</script>

<template>
  <div class="ProjectsList" ref="componentRef" @mousemove.passive="updateCursorPosition">
    <div class="background" ref="backgroundDiv" />
    <div class="mouse-event-container">
      <svg style="display: block;" width="100%" height="1" viewBox="0 0 100% 1" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <line x1="0.5" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-black)" />
      </svg>

      <div class="list-headers" ref="listHeaders">
        <h3 class="list-header">name</h3>
        <h3 class="list-header">type</h3>
        <h3 class="list-header">year</h3>
      </div>

      <NuxtLink class="row" v-for="project in slugifiedProjects" :key="project.name" :to="`#`">
        <!-- <NuxtLink class="row" v-for="project in slugifiedProjects" :key="project.name" :to="`/projects/${project.slug}`"> -->
        <p class="list-item list-item-name">{{ project.name }}</p>
        <p class="list-item">{{ project.type.join(' ~ ') }}</p>
        <p class="list-item list-item-year">{{ project.year }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
$backgroundSize: 250px;

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
  position: relative;
  overflow: hidden;

  @media screen and (min-width: $screen-tablet) {
    margin: 0;
  }

  .background {
    position: absolute;
    width: $backgroundSize;
    height: $backgroundSize;
    pointer-events: none;
    z-index: -1;
    background-color: var(--color-black);
    border-radius: 50%;

    @media (hover: hover) and (prefers-reduced-motion: no-preference) {
      transform: translate3d(var(--mouse-x), var(--mouse-y), 0);
      transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
    }

    @media (hover: none) or (prefers-reduced-motion: reduce) {
      display: none;
      aria-hidden: none;
    }
  }

  .list-headers {
    @include gridStyles(4, 3, 1, 12px, 32px);
    background-color: var(--color-white);

    @media screen and (max-width: $screen-mobile) {
      font-size: 2.5vw;
    }
  }

  .row {
    @include gridStyles(4, 3, 1, 10px, 10px);

    white-space: pre;
    background-color: var(--color-white);
    color: var(--color-black);
    backdrop-filter: blur(50px);
    --webkit-backdrop-filter: blur(50px);
    transition-property: transform;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);

    @media screen and (max-width: $screen-mobile) {
      font-size: 2.5vw;
    }

    .list-item {
      transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
    }

    @media (hover: hover) and (prefers-reduced-motion: no-preference) {
      &:hover {
        background-color: rgba(43, 43, 43, 0.8);
        color: var(--color-white);

        .list-item-name {
          transform: translateX(10px);
        }

        .list-item-year {
          transform: translateX(-10px);
        }
      }
    }

    &:active {
      background-color: rgba(43, 43, 43, 0.65);
      transform: scaleX(0.99);
      transition-property: background-color transform;
      transition-duration: 0.2s;
      transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);

      .list-item-name {
        transform: translateX(10px);
      }

      .list-item-year {
        transform: translateX(-10px);
      }
    }
  }
}
</style>