const AGENT_LINK_HEADER = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</api/openapi.json>; rel="service-desc"; type="application/openapi+json"',
  '</api/docs>; rel="service-doc"; type="text/html"',
  '</api/health>; rel="status"; type="application/json"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="describedby"; type="application/json"',
  '</llms.txt>; rel="alternate"; type="text/plain"',
].join(", ")

const AGENT_ROUTE_RULE = {
  headers: {
    Link: AGENT_LINK_HEADER,
    Vary: "Accept",
  },
  prerender: false,
}

export default defineNuxtConfig({
  ssr: false,

  routeRules: {
    "/": AGENT_ROUTE_RULE,
    "/fr": AGENT_ROUTE_RULE,
    "/en": AGENT_ROUTE_RULE,
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [],
    },
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
