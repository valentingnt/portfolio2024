export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/') {
    const router = useRouter()
    const cookieLang = useCookie('lang')

    if (!cookieLang.value) {
      cookieLang.value = 'fr'
    }

    return router.push(`/${cookieLang.value}`)
  }
})