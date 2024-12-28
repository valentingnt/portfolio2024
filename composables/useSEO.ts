import type { UseSeoReturn } from '@/types/seo'

export const useSEO = (lang: string, isEnglish: boolean): UseSeoReturn => {
  const title = isEnglish
    ? 'Valentin Genest - Front-end Developer'
    : 'Valentin Genest - Développeur Front-end'
  
  const description = isEnglish
    ? 'Valentin Genest - Front-end developer with 5 years of experience. Specialized in creating quality web experiences. Let\'s build the internet as it should be.'
    : "Valentin Genest - Développeur front-end avec 5 ans d'expérience. Spécialisé dans la création d'expériences web de qualité. Construisons un internet comme il se doit."

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Valentin Genest',
    jobTitle: isEnglish ? 'Front-end Developer' : 'Développeur Front-end',
    url: 'https://valentingenest.com',
    image: 'https://valentingenest.com/img/moi.webp',
    sameAs: [
      'https://github.com/valentingnt',
      'https://linkedin.com/in/valentin-genest',
      'https://twitter.com/valentingnt',
      'https://instagram.com/valentingnt'
    ],
    email: 'valentin64.genest@gmail.com',
    nationality: 'French',
    knowsLanguage: ['fr', 'en']
  }

  const meta = {
    title,
    htmlAttrs: { lang },
    meta: [
      { name: 'description', content: description },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Valentin Genest' },
      // OpenGraph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/img/og-image.jpg' },
      { property: 'og:url', content: 'https://valentingenest.com' },
      { property: 'og:locale', content: isEnglish ? 'en_US' : 'fr_FR' },
      { property: 'og:site_name', content: 'Valentin Genest' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@valentingnt' },
      { name: 'twitter:creator', content: '@valentingnt' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: '/img/og-image.jpg' },
      // Additional social metadata
      { name: 'linkedin:author', content: 'valentin-genest' },
      { name: 'github:author', content: 'valentingnt' },
      { name: 'threads:author', content: 'nulentin' },
      { name: 'instagram:author', content: 'nulentin' }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(structuredData)
      }
    ],
    link: [
      { rel: 'canonical', href: `https://valentingenest.com/${lang}` },
      { rel: 'me', href: 'https://github.com/valentingnt' },
      { rel: 'me', href: 'https://linkedin.com/in/valentin-genest' },
      { rel: 'me', href: 'https://threads.net/nulentin' },
      { rel: 'me', href: 'https://instagram.com/nulentin' }
    ]
  }

  return {
    meta
  }
} 