const AGENT_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
].join(", ")

const AGENT_ROUTE_RULE = {
  headers: {
    Link: AGENT_LINK_HEADER,
    Vary: "Accept",
    "Cache-Control": "no-store, must-revalidate",
  },
}

export default defineNuxtConfig({
  ssr: true,

  routeRules: {
    "/": AGENT_ROUTE_RULE,
    "/fr": AGENT_ROUTE_RULE,
    "/en": AGENT_ROUTE_RULE,
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "fr",
      },
      title: "Valentin Genest — Développeur Front-end",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "title", content: "Valentin Genest — Développeur Front-end" },
        {
          name: "description",
          content:
            "Développeur front-end avec 5 ans d'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d'expériences web accessibles et performantes.",
        },
        {
          property: "og:title",
          content: "Valentin Genest — Développeur Front-end",
        },
        {
          property: "og:description",
          content:
            "Développeur front-end avec 5 ans d'expérience, basé entre Paris et Bordeaux. Spécialisé dans la création d'expériences web accessibles et performantes.",
        },
        { property: "og:image", content: "https://valentingenest.fr/img/ogImage.jpg" },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://valentingenest.fr" },
        { name: "robots", content: "index, follow" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: "https://valentingenest.fr" },
      ],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Valentin Genest",
            jobTitle: "Front-end Developer",
            url: "https://valentingenest.fr",
            image: "https://valentingenest.fr/img/moi.webp",
            email: "contact@valentingenest.fr",
            nationality: "French",
            knowsLanguage: ["fr", "en"],
            sameAs: [
              "https://github.com/valentingnt",
              "https://www.linkedin.com/in/valentin-genest/",
              "https://www.malt.fr/profile/valentingenest",
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Bordeaux",
              addressCountry: "FR",
            },
          }),
        },
      ],
    },
  },

  modules: [
    "@nuxt/image",
    "@vercel/analytics/nuxt",
    "@vercel/speed-insights/nuxt",
  ],

  devtools: { enabled: false },

  css: ["~/assets/stylesheets/globals.scss"],

  compatibilityDate: "2024-09-16",

  vite: {
    optimizeDeps: {
      include: ["lenis"],
    },
  },
})
