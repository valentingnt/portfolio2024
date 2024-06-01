export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  modules: [
    '@nuxt/image',
  ],
  devtools: { enabled: false },
  css: [
    '~/assets/stylesheets/globals.scss'
  ],
  vite: {
    plugins: [[
      {
        name: 'stylesheets',
        config: () => ({
          css: {
            preprocessorOptions: {
              scss: {
                additionalData: `
                  @import '~/assets/stylesheets/resources/index.scss';
                `,
              }
            }
          }
        })
      }
    ]]
  }
})
