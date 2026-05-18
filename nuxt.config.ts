export default defineNuxtConfig({
  ssr: true,

  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "preload",
          as: "image",
          href: "/img/moi.webp",
          imagesrcset: "/img/moi.webp 1x, /img/moi@2x.webp 2x",
          fetchpriority: "high",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/DMMono/DMMono-Regular.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/DMSerifText/DMSerifText-Regular.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/DMMono/DMMono-Medium.woff2",
          crossorigin: "anonymous",
        },
      ],
    },
  },

  modules: [
    "@nuxt/image",
    "@vercel/analytics/nuxt",
    "@vercel/speed-insights/nuxt",
  ],

  image: {
    format: ["webp"],
    densities: [1, 2],
    quality: 80,
  },

  devtools: { enabled: false },

  css: ["~/assets/stylesheets/globals.scss"],

  compatibilityDate: "2024-09-16",

  vite: {
    optimizeDeps: {
      include: ["lenis"],
    },
  },
})
