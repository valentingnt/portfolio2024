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

const mousePosition = ref({ x: 0, y: 0 })
const listHeaders = ref<HTMLElement | null>(null)
const backgroundDiv = ref<HTMLElement | null>(null)

const slugifiedProjects = computed(() => {
  return projects.map(project => ({
    ...project,
    slug: slugify(project.name)
  }))
})

function updateBackground() {
  if (!listHeaders.value || !backgroundDiv.value) return

  backgroundDiv.value.style.setProperty('--mouse-x', `${mousePosition.value.x}px`)
  backgroundDiv.value.style.setProperty('--mouse-y', `${mousePosition.value.y}px`)
  backgroundDiv.value.style.setProperty('--scale', '1')
}

function updateMousePosition(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  mousePosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }

  window.requestAnimationFrame(updateBackground)
}
</script>

<template>
  <div class="ProjectsList">
    <div class="mouse-event-container" @mousemove.passive="updateMousePosition">
      <div class="background" ref="backgroundDiv" />
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
    transform: translate3d(calc(var(--mouse-x) - #{$backgroundSize / 2}), calc(var(--mouse-y) - #{$backgroundSize / 2}), 0) scale(var(--scale));
    transition: transform 0.7s cubic-bezier(0.33, 1, 0.68, 1);

    background-color: var(--color-black);
    border-radius: 50%;
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
    transition-property: background-color color;
    transition-duration: 0.15s;
    transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
    background-color: var(--color-white);
    color: var(--color-black);
    backdrop-filter: blur(50px);
    --webkit-backdrop-filter: blur(50px);

    @media screen and (max-width: $screen-mobile) {
      font-size: 2.5vw;
    }

    .list-item {
      transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
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
      background-color: rgba(43, 43, 43, 0.5);
      color: rgba(255, 253, 249, 0.5);

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