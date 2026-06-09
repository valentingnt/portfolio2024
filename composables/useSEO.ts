import type { SeoMeta, UseSeoReturn } from "@/types/seo"

export function useSEO(lang: Ref<string>): UseSeoReturn {
  const meta = computed<SeoMeta>(() => {
    const isEnglish = lang.value === "en"

    const title = isEnglish
      ? "Valentin Genest — Front-end Developer in Bordeaux and Paris"
      : "Valentin Genest — Développeur Front-end à Bordeaux et Paris"

    const description = isEnglish
      ? "Frontend developer with 5 years of experience, based between Paris and Bordeaux. Specialized in building accessible and performant web experiences."
      : "Développeur front-end avec 5 ans d'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d'expériences web accessibles et performantes."

    const url = `https://valentingenest.fr/${lang.value}`

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Valentin Genest",
      jobTitle: isEnglish ? "Frontend Developer" : "Développeur Front-end",
      url,
      image: "https://valentingenest.fr/img/moi.webp",
      email: "contact@valentingenest.fr",
      nationality: "French",
      knowsLanguage: ["fr", "en"],
      inLanguage: isEnglish ? "en" : "fr",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bordeaux",
        addressCountry: "FR",
      },
      sameAs: [
        "https://github.com/valentingnt",
        "https://www.linkedin.com/in/valentin-genest/",
        "https://www.malt.fr/profile/valentingenest",
        "https://threads.com/nulentin",
        "https://instagram.com/nulentin",
      ],
    }

    return {
      title,
      htmlAttrs: { lang: lang.value },
      meta: [
        { name: "title", content: title },
        { name: "description", content: description },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        { name: "robots", content: "index, follow" },
        { name: "author", content: "Valentin Genest" },

        // OpenGraph
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        {
          property: "og:image",
          content: "https://valentingenest.fr/img/ogImage.jpg",
        },
        { property: "og:url", content: url },
        { property: "og:locale", content: isEnglish ? "en_US" : "fr_FR" },
        { property: "og:site_name", content: "Valentin Genest" },

        // Additional social metadata
        { name: "linkedin:author", content: "valentin-genest" },
        { name: "github:author", content: "valentingnt" },
        { name: "malt:author", content: "valentingenest" },
        { name: "threads:author", content: "nulentin" },
        { name: "instagram:author", content: "nulentin" },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
      ],
      link: [
        { rel: "canonical", href: url },
        {
          rel: "alternate",
          hreflang: "fr",
          href: "https://valentingenest.fr/fr",
        },
        {
          rel: "alternate",
          hreflang: "en",
          href: "https://valentingenest.fr/en",
        },
        {
          rel: "alternate",
          hreflang: "x-default",
          href: "https://valentingenest.fr/fr",
        },
        { rel: "me", href: "https://github.com/valentingnt" },
        { rel: "me", href: "https://www.linkedin.com/in/valentin-genest/" },
        { rel: "me", href: "https://www.malt.fr/profile/valentingenest" },
        { rel: "me", href: "https://threads.com/nulentin" },
        { rel: "me", href: "https://instagram.com/nulentin" },
      ],
    }
  })

  return {
    meta,
  }
}
