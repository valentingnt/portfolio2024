import type { UseSeoReturn } from "@/types/seo"

export function useSEO(lang: string, isEnglish: boolean): UseSeoReturn {
  const title = isEnglish
    ? "Valentin Genest - Front-end Developer"
    : "Valentin Genest - Développeur Front-end"

  const description = isEnglish
    ? "Valentin Genest - Building thoughtful digital experiences. Frontend developer with 5 years of experience specializing in modern web technologies, passionate about creating responsive, accessible, and performant web applications."
    : "Valentin Genest - Créateur d'expériences digitales réfléchies. Développeur front-end avec 5 ans d'expérience, passionné par les technologies web modernes et la création d'applications réactives, accessibles et performantes."

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Valentin Genest",
    jobTitle: isEnglish ? "Front-end Developer" : "Développeur Front-end",
    url: isEnglish
      ? "https://valentingenest.fr/en"
      : "https://valentingenest.fr",
    image: "https://valentingenest.fr/img/moi.webp",
    sameAs: [
      "https://github.com/valentingnt",
      "https://linkedin.com/in/valentin-genest",
      "https://threads.net/nulentin",
      "https://instagram.com/nulentin",
    ],
    email: "valentin64.genest@gmail.com",
    nationality: "French",
    knowsLanguage: ["fr", "en"],
  }

  const meta = {
    title,
    htmlAttrs: { lang },
    meta: [
      { name: "description", content: description },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "format-detection", content: "telephone=no" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Valentin Genest" },
      // OpenGraph
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/img/ogImage.jpg" },
      { property: "og:url", content: `https://valentingenest.fr/${lang}` },
      { property: "og:locale", content: isEnglish ? "en_US" : "fr_FR" },
      { property: "og:site_name", content: "Valentin Genest" },
      // Twitter
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@nulenting" },
      { name: "twitter:creator", content: "@nulenting" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: "/img/ogImage.jpg" },
      // Additional social metadata
      { name: "linkedin:author", content: "valentin-genest" },
      { name: "github:author", content: "valentingnt" },
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
      { rel: "canonical", href: `https://valentingenest.fr/${lang}` },
      { rel: "me", href: "https://github.com/valentingnt" },
      { rel: "me", href: "https://linkedin.com/in/valentin-genest" },
      { rel: "me", href: "https://threads.net/nulentin" },
      { rel: "me", href: "https://instagram.com/nulentin" },
    ],
  }

  return {
    meta,
  }
}
