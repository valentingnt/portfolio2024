export default defineNuxtConfig({
  ssr: true,

  app: {
    head: {
      htmlAttrs: { lang: "fr" },
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      script: [
        {
          // Apply the saved theme before first paint to avoid a light-mode flash
          innerHTML: `(function(){try{var m=document.cookie.match(/(?:^|; )theme-preference=([^;]*)/);var p=m?decodeURIComponent(m[1]).replace(/^"|"$/g,""):"system";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.setAttribute("data-theme",d?"dark":"light")}catch(e){}})()`,
          tagPosition: "head",
        },
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

  compatibilityDate: "2026-06-09",

  nitro: {
    prerender: {
      routes: ["/fr", "/en"],
    },
  },

  vite: {
    optimizeDeps: {
      include: ["lenis"],
    },
  },
})
