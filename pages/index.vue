<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useCookie } from '#app'

const router = useRouter()
const cookieLang = useCookie('lang')

onMounted(() => {
  if (!cookieLang.value) {
    cookieLang.value = 'fr'
  }
  router.push(`/${cookieLang.value}`)
})
</script>

<template>
  <div>
    <!-- Loading indicator -->
  </div>
</template>
