export default defineNuxtConfig({
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
