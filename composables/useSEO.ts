import type { UseSeoReturn } from "@/types/seo"

export function useSEO(lang: string, isEnglish: boolean): UseSeoReturn {
  const title = isEnglish
    ? "Valentin Genest — Front-end Developer"
    : "Valentin Genest — Développeur Front-end"

  const description = isEnglish
    ? "Front-end developer with 5 years of experience, based between Paris and Bordeaux. Specialized in building accessible and performant web experiences."
    : "Développeur front-end avec 5 ans d'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d'expériences web accessibles et performantes."

  const url = `https://valentingenest.fr/${lang}`

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Valentin Genest",
    jobTitle: isEnglish ? "Front-end Developer" : "Développeur Front-end",
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

  const meta = {
    title,
    htmlAttrs: { lang },
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

  return {
    meta,
  }
}
