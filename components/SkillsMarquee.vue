<script setup lang="ts">
import skillsData from '@/content/skills.json'
import type { SkillsMultiLangContent, Skill } from '@/types/skills'

const speed = ref(0.2)
const toast = ref<{ showToast: (title: string, description: string) => void } | null>(null)
const { isEnglish } = useLanguage(useRoute().params.lang as string)
const skillsByLang = skillsData as SkillsMultiLangContent
const skills = computed<Skill[]>(() => (isEnglish.value ? skillsByLang.en : skillsByLang.fr))

const shuffledSkills = computed(() => {
  const source = skills.value
  const shuffled = [...source]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
})

const onTagClick = (skill: Skill) => {
  toast.value?.showToast(skill.name, skill.description)
}
</script>

<template>
  <div class="SkillsMarqueeWrapper" @mouseenter.passive="speed = 0" @mouseleave.passive="speed = 0.2">
    <UiMarquee class="SkillsMarquee" :speed="speed" :strength="2">
      <div class="skills-container">
        <UiTag v-for="skill in shuffledSkills" :key="skill.name" :title="skill.name"
          @click.passive="() => onTagClick(skill)" />
      </div>
    </UiMarquee>
  </div>
  <UiToast ref="toast" />
</template>

<style lang="scss" scoped>
@use '~/assets/stylesheets/resources/typography' as *;
@use '~/assets/stylesheets/variables/animations' as *;

.SkillsMarquee {
  .skills-container {
    display: flex;
    gap: 24px;
    padding: 8px 0;
    margin-right: 24px;
  }
}

.SkillsMarqueeWrapper {
  @include page-transition($page-transition-skills-delay);

  position: relative;
  margin: 48px 0 0;
  max-width: calc(100vw - 48px);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 72px;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right,
        #FFFDF9 0%,
        color-mix(in srgb, #FFFDF9 98.7%, transparent) 8.1%,
        color-mix(in srgb, #FFFDF9 95.1%, transparent) 15.5%,
        color-mix(in srgb, #FFFDF9 89.6%, transparent) 22.5%,
        color-mix(in srgb, #FFFDF9 82.5%, transparent) 29%,
        color-mix(in srgb, #FFFDF9 74.1%, transparent) 35.3%,
        color-mix(in srgb, #FFFDF9 64.8%, transparent) 41.2%,
        color-mix(in srgb, #FFFDF9 55%, transparent) 47.1%,
        color-mix(in srgb, #FFFDF9 45%, transparent) 52.9%,
        color-mix(in srgb, #FFFDF9 35.2%, transparent) 58.8%,
        color-mix(in srgb, #FFFDF9 25.9%, transparent) 64.7%,
        color-mix(in srgb, #FFFDF9 17.5%, transparent) 71%,
        color-mix(in srgb, #FFFDF9 10.4%, transparent) 77.5%,
        color-mix(in srgb, #FFFDF9 4.9%, transparent) 84.5%,
        color-mix(in srgb, #FFFDF9 1.3%, transparent) 91.9%,
        color-mix(in srgb, #FFFDF9 0%, transparent) 100%);

    [data-theme="dark"] & {
      background: linear-gradient(to right,
          #2B2B2B 0%,
          color-mix(in srgb, #2B2B2B 98.7%, transparent) 8.1%,
          color-mix(in srgb, #2B2B2B 95.1%, transparent) 15.5%,
          color-mix(in srgb, #2B2B2B 89.6%, transparent) 22.5%,
          color-mix(in srgb, #2B2B2B 82.5%, transparent) 29%,
          color-mix(in srgb, #2B2B2B 74.1%, transparent) 35.3%,
          color-mix(in srgb, #2B2B2B 64.8%, transparent) 41.2%,
          color-mix(in srgb, #2B2B2B 55%, transparent) 47.1%,
          color-mix(in srgb, #2B2B2B 45%, transparent) 52.9%,
          color-mix(in srgb, #2B2B2B 35.2%, transparent) 58.8%,
          color-mix(in srgb, #2B2B2B 25.9%, transparent) 64.7%,
          color-mix(in srgb, #2B2B2B 17.5%, transparent) 71%,
          color-mix(in srgb, #2B2B2B 10.4%, transparent) 77.5%,
          color-mix(in srgb, #2B2B2B 4.9%, transparent) 84.5%,
          color-mix(in srgb, #2B2B2B 1.3%, transparent) 91.9%,
          color-mix(in srgb, #2B2B2B 0%, transparent) 100%);
    }
  }

  &::after {
    right: 0;
    background: linear-gradient(to left,
        #FFFDF9 0%,
        color-mix(in srgb, #FFFDF9 98.7%, transparent) 8.1%,
        color-mix(in srgb, #FFFDF9 95.1%, transparent) 15.5%,
        color-mix(in srgb, #FFFDF9 89.6%, transparent) 22.5%,
        color-mix(in srgb, #FFFDF9 82.5%, transparent) 29%,
        color-mix(in srgb, #FFFDF9 74.1%, transparent) 35.3%,
        color-mix(in srgb, #FFFDF9 64.8%, transparent) 41.2%,
        color-mix(in srgb, #FFFDF9 55%, transparent) 47.1%,
        color-mix(in srgb, #FFFDF9 45%, transparent) 52.9%,
        color-mix(in srgb, #FFFDF9 35.2%, transparent) 58.8%,
        color-mix(in srgb, #FFFDF9 25.9%, transparent) 64.7%,
        color-mix(in srgb, #FFFDF9 17.5%, transparent) 71%,
        color-mix(in srgb, #FFFDF9 10.4%, transparent) 77.5%,
        color-mix(in srgb, #FFFDF9 4.9%, transparent) 84.5%,
        color-mix(in srgb, #FFFDF9 1.3%, transparent) 91.9%,
        color-mix(in srgb, #FFFDF9 0%, transparent) 100%);

    [data-theme="dark"] & {
      background: linear-gradient(to left,
          #2B2B2B 0%,
          color-mix(in srgb, #2B2B2B 98.7%, transparent) 8.1%,
          color-mix(in srgb, #2B2B2B 95.1%, transparent) 15.5%,
          color-mix(in srgb, #2B2B2B 89.6%, transparent) 22.5%,
          color-mix(in srgb, #2B2B2B 82.5%, transparent) 29%,
          color-mix(in srgb, #2B2B2B 74.1%, transparent) 35.3%,
          color-mix(in srgb, #2B2B2B 64.8%, transparent) 41.2%,
          color-mix(in srgb, #2B2B2B 55%, transparent) 47.1%,
          color-mix(in srgb, #2B2B2B 45%, transparent) 52.9%,
          color-mix(in srgb, #2B2B2B 35.2%, transparent) 58.8%,
          color-mix(in srgb, #2B2B2B 25.9%, transparent) 64.7%,
          color-mix(in srgb, #2B2B2B 17.5%, transparent) 71%,
          color-mix(in srgb, #2B2B2B 10.4%, transparent) 77.5%,
          color-mix(in srgb, #2B2B2B 4.9%, transparent) 84.5%,
          color-mix(in srgb, #2B2B2B 1.3%, transparent) 91.9%,
          color-mix(in srgb, #2B2B2B 0%, transparent) 100%);
    }
  }
}
</style>