export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/') {
    const router = useRouter()
    const cookieLang = useCookie('lang')

    return router.push(`/${cookieLang.value}`)
  }
})