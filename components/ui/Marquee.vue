<script setup lang="ts">
interface MarqueeProps {
  enableAnimation?: boolean
  strength?: number
  speed?: number
}

const { enableAnimation, strength, speed } = withDefaults(defineProps<MarqueeProps>(), {
  enableAnimation: true,
  strength: 1.5,
  speed: 0.5
})

const component = ref<HTMLDivElement | null>(null)
const wrapper = ref<HTMLDivElement | null>(null)
const animationFrameRequest = ref<number>()
const transform = ref<number>(0)
const scroll = ref<{ current: number; last: number; direction: number }>({
  current: 0,
  last: 0,
  direction: 1
})

const wrapperWidth = ref<number>(1)
const componentWidth = computed<number>(() => component.value?.clientWidth || 1)
const slotCount = computed(() => Math.ceil(componentWidth.value / wrapperWidth.value) + 1)
const shouldAnimate = computed<boolean>(() => enableAnimation && !reducedMotion.value)

const { velocity, updateVelocity } = useVelocity()
const reducedMotion = useReducedMotion()

let resizeObserver: ResizeObserver | null = null

function updateTransform() {
  if (transform.value >= wrapperWidth.value && scroll.value.direction === 1) {
    transform.value = 0
  } else if (transform.value <= 0 && scroll.value.direction === -1) {
    transform.value = wrapperWidth.value
  }

  if (Math.abs(velocity.value) > 0.001) {
    velocity.value *= 0.95
  }

  transform.value += speed * scroll.value.direction + velocity.value * strength
}

function animate() {
  updateTransform()

  animationFrameRequest.value = window.requestAnimationFrame(animate)
}

function onScroll(scrollValue: number) {
  const direction = scrollValue >= scroll.value.current ? 1 : -1

  updateVelocity(scroll.value.last, scroll.value.current, 2.5)

  scroll.value = {
    last: scroll.value.current,
    current: scrollValue,
    direction
  }
}

function onResize() {
  wrapperWidth.value = wrapper.value?.clientWidth || 1
}

watchScroll(onScroll, { enabled: shouldAnimate })
watchWindowResize(onResize)

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === wrapper.value) {
        wrapperWidth.value = entry.contentRect.width
      }
    }
  })

  if (wrapper.value) resizeObserver.observe(wrapper.value)

  if (shouldAnimate.value) animationFrameRequest.value = window.requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (resizeObserver && wrapper.value) {
    resizeObserver.unobserve(wrapper.value)
    resizeObserver = null
  }

  if (shouldAnimate.value && animationFrameRequest.value) window.cancelAnimationFrame(animationFrameRequest.value)
})
</script>

<template>
  <section ref="component" class="Marquee" :class="{ animate: shouldAnimate }">
    <div class="scroller" :style="{ '--scroll-count': `-${transform}px` }">
      <div ref="wrapper" class="wrapper">
        <slot />
      </div>
      <div v-for="(_, index) in slotCount" :key="index" class="wrapper">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.Marquee {
  overflow: hidden;
  backface-visibility: hidden;

  &.animate {
    .scroller {
      will-change: transform;
    }
  }

  .scroller {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    transform: translate3d(var(--scroll-count), 0, 0);
    backface-visibility: hidden;
  }

  .wrapper {
    display: flex;
    flex-wrap: nowrap;
    transform: translateZ(0);
    justify-content: center;
    align-items: center;
  }
}
</style>