export default defineNuxtConfig({
  ssr: false,

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

  modules: ["@nuxt/image"],

  devtools: { enabled: false },

  css: ["~/assets/stylesheets/globals.scss"],

  compatibilityDate: "2024-09-16",
})
