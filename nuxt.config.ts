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
    "/fr": AGENT_ROUTE_RULE,
    "/en": AGENT_ROUTE_RULE,
  },

  app: {
    head: {
      htmlAttrs: { lang: "fr" },
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
