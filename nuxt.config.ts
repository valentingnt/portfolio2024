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
        {
          // Self-heal a poisoned cache. Hashed /_nuxt/* files are served with
          // `immutable`, 404s included, so a chunk requested during a deploy
          // stays "404" in the browser (and CDN) for a year and the app never
          // boots. On a failed module load, refetch those files bypassing the
          // cache (this overwrites the cached 404), then reload once.
          innerHTML: `(function(){function h(){try{var k="chunk-heal",t=+sessionStorage.getItem(k)||0;if(Date.now()-t<30000)return;sessionStorage.setItem(k,Date.now())}catch(e){return}var u=[].map.call(document.querySelectorAll('link[rel=modulepreload],script[type=module][src]'),function(e){return e.href||e.src});Promise.all(u.map(function(x){return fetch(x,{cache:"reload"}).catch(function(){})})).then(function(){location.reload()})}window.addEventListener("error",function(e){var t=e.target;if(t&&((t.tagName==="SCRIPT"&&t.type==="module")||(t.tagName==="LINK"&&t.rel==="modulepreload")))h()},true)})()`,
          tagPosition: "head",
        },
      ],
      link: [
        // One duck paw: dark on light tabs, cream on dark ones (follows the OS
        // scheme: a tab icon cannot see the site's own theme toggle). The .ico is
        // the fallback for browsers that ignore the PNGs.
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon.png",
          sizes: "96x96",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-dark.png",
          sizes: "96x96",
          media: "(prefers-color-scheme: dark)",
        },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico", sizes: "any" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
          href: "/fonts/PaperMono/PaperMono-Variable.woff2",
          crossorigin: "anonymous",
        },
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/FamiljenGrotesk/FamiljenGrotesk-600.woff2",
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
})
