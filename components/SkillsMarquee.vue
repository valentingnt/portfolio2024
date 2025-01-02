<script setup lang="ts">
interface Skill {
  name: string
  description: {
    en: string
    fr: string
  }
}

const skillsData: Skill[] = [
  {
    name: 'Vue.js',
    description: {
      en: 'My go-to framework for building reactive web applications',
      fr: 'Mon framework préféré pour créer des applications web réactives'
    }
  },
  {
    name: 'TypeScript',
    description: {
      en: 'Adding type safety to JavaScript for more robust applications',
      fr: 'Ajout de la sécurité des types à JavaScript pour des applications plus robustes'
    }
  },
  {
    name: 'Nuxt',
    description: {
      en: 'The Vue.js framework for building full-stack applications',
      fr: 'Le framework Vue.js pour créer des applications full-stack'
    }
  },
  {
    name: 'JavaScript',
    description: {
      en: 'The foundation of modern web development',
      fr: 'La base du développement web moderne'
    }
  },
  {
    name: 'SCSS',
    description: {
      en: 'Writing maintainable and scalable stylesheets',
      fr: 'Écriture de feuilles de style maintenables et évolutives'
    }
  },
  {
    name: 'Node.js',
    description: {
      en: 'Server-side JavaScript runtime environment',
      fr: 'Environnement d\'exécution JavaScript côté serveur'
    }
  },
  {
    name: 'Git',
    description: {
      en: 'Version control for collaborative development',
      fr: 'Contrôle de version pour le développement collaboratif'
    }
  },
  {
    name: 'REST API',
    description: {
      en: 'Building and consuming RESTful web services',
      fr: 'Création et utilisation de services web RESTful'
    }
  },
  {
    name: 'UI/UX',
    description: {
      en: 'Creating intuitive and beautiful user experiences',
      fr: 'Création d\'expériences utilisateur intuitives et élégantes'
    }
  },
  {
    name: 'Responsive Design',
    description: {
      en: 'Adapting layouts for all screen sizes',
      fr: 'Adaptation des mises en page pour tous les écrans'
    }
  },
  {
    name: 'GraphQL',
    description: {
      en: 'Efficient data querying and manipulation',
      fr: 'Requêtes et manipulation efficaces des données'
    }
  },
  {
    name: 'Shopify',
    description: {
      en: 'Building custom e-commerce solutions',
      fr: 'Création de solutions e-commerce personnalisées'
    }
  },
  {
    name: 'Figma',
    description: {
      en: 'Collaborative design and prototyping',
      fr: 'Design collaboratif et prototypage'
    }
  },
  {
    name: 'Tailwind CSS',
    description: {
      en: 'Utility-first CSS framework for rapid development',
      fr: 'Framework CSS utilitaire pour un développement rapide'
    }
  },
  {
    name: 'Liquid',
    description: {
      en: 'Template language for Shopify themes',
      fr: 'Langage de template pour les thèmes Shopify'
    }
  },
  {
    name: 'Creative Development',
    description: {
      en: 'Bringing creative ideas to life through code',
      fr: 'Donner vie aux idées créatives par le code'
    }
  },
  {
    name: 'React',
    description: {
      en: 'Building user interfaces with components',
      fr: 'Construction d\'interfaces utilisateur avec des composants'
    }
  },
  {
    name: 'React Native',
    description: {
      en: 'Cross-platform mobile app development',
      fr: 'Développement d\'applications mobiles multiplateformes'
    }
  },
  {
    name: 'Three.js',
    description: {
      en: 'Creating 3D experiences for the web',
      fr: 'Création d\'expériences 3D pour le web'
    }
  },
  {
    name: '3D',
    description: {
      en: 'Bringing depth and dimension to web experiences',
      fr: 'Apporter profondeur et dimension aux expériences web'
    }
  }
]

const speed = ref(0.2)
const toast = ref<{ showToast: (title: string, description: string) => void } | null>(null)
const { isEnglish } = useLanguage(useRoute().params.lang as string)

const shuffledSkills = computed(() => {
  const shuffled = [...skillsData]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
})

const onTagClick = (skill: Skill) => {
  const description = isEnglish.value ? skill.description.en : skill.description.fr
  toast.value?.showToast(skill.name, description)
}
</script>

<template>
  <div class="SkillsMarqueeWrapper" @mouseenter="speed = 0" @mouseleave="speed = 0.2">
    <UiMarquee class="SkillsMarquee" :speed="speed" :strength="2">
      <div class="skills-container">
        <UiTag v-for="skill in shuffledSkills" :key="skill.name" :title="skill.name" @click="() => onTagClick(skill)" />
      </div>
    </UiMarquee>
  </div>
  <UiToast ref="toast" />
</template>

<style lang="scss" scoped>
@import '@/assets/stylesheets/variables/animations';

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