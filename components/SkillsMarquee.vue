<script setup lang="ts">
import skillsData from '@/content/skills.json'
import type { SkillsMultiLangContent, Skill } from '@/types/skills'

const MARQUEE_SPEED = 0.2
const MARQUEE_HOVER_SPEED = 0.05

const speed = ref(MARQUEE_SPEED)
const toast = ref<{ showToast: (title: string, description: string) => void } | null>(null)
const { isEnglish } = useLanguage(useRoute().params.lang as string)

const skillsByLang = skillsData as SkillsMultiLangContent
const skills = computed<Skill[]>(() => (isEnglish.value ? skillsByLang.en : skillsByLang.fr))

// Render unshuffled on the server so hydration matches, then shuffle client-side
const shuffledSkills = ref<Skill[]>(skills.value)

function shuffle(source: Skill[]): Skill[] {
  const out = [...source]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

onMounted(() => (shuffledSkills.value = shuffle(skills.value)))

watch(skills, (next) => (shuffledSkills.value = shuffle(next)))

function handleTagClick(skill: Skill) {
  toast.value?.showToast(skill.name, skill.description)
}
</script>

<template>
  <div class="SkillsMarqueeWrapper" @mouseenter.passive="speed = MARQUEE_HOVER_SPEED"
    @mouseleave.passive="speed = MARQUEE_SPEED">
    <UiMarquee class="SkillsMarquee" :speed="speed" :strength="2">
      <div class="skills-container">
        <UiTag v-for="skill in shuffledSkills" :key="skill.name" :title="skill.name"
          @click.passive="handleTagClick(skill)" />
      </div>
    </UiMarquee>
  </div>
  <UiToast ref="toast" />
</template>

<style lang="scss" scoped>
@use '~/assets/stylesheets/resources/easeGradient' as *;
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
    @include theme-ease-gradient(to right);
  }

  &::after {
    right: 0;
    @include theme-ease-gradient(to left);
  }
}
</style>
