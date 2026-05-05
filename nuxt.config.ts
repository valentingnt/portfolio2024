const AGENT_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</api/openapi.json>; rel="service-desc"; type="application/openapi+json"',
  '</api/docs>; rel="service-doc"; type="text/html"',
  '</api/health>; rel="status"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
].join(", ")

const AGENT_ROUTE_HEADERS = {
  Link: AGENT_LINK_HEADER,
}

export default defineNuxtConfig({
  ssr: false,

  routeRules: {
    "/": { headers: AGENT_ROUTE_HEADERS },
    "/fr": { headers: AGENT_ROUTE_HEADERS },
    "/en": { headers: AGENT_ROUTE_HEADERS },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "fr",
      },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
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
