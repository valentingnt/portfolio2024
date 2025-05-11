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

// Optimized drag state
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartTransform = ref(0)
const dragVelocity = ref(0)
const lastDragX = ref(0)
const lastDragTime = ref(0)
const rafId = ref<number>()

let resizeObserver: ResizeObserver | null = null

function normalizeTransform(value: number): number {
  if (wrapperWidth.value === 0) return 0;
  return ((value % wrapperWidth.value) + wrapperWidth.value) % wrapperWidth.value;
}

// Debounced transform update
function updateTransform() {
  if (Math.abs(velocity.value) > 0.001) {
    velocity.value *= 0.95
  }

  if (isDragging.value) {
    transform.value = dragStartTransform.value + (dragStartX.value - lastDragX.value)
  } else {
    transform.value += speed * scroll.value.direction + velocity.value * strength
  }

  // Always wrap the transform
  transform.value = normalizeTransform(transform.value)
}

function animate() {
  updateTransform()
  rafId.value = requestAnimationFrame(animate)
}

function startAnimation() {
  if (!rafId.value && shouldAnimate.value) {
    rafId.value = requestAnimationFrame(animate)
  }
}

function stopAnimation() {
  if (rafId.value) {
    cancelAnimationFrame(rafId.value)
    rafId.value = undefined
  }
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

// Optimized drag handlers
function handleDragStart(event: MouseEvent | TouchEvent) {
  isDragging.value = true
  dragStartX.value = 'touches' in event ? event.touches[0].clientX : event.clientX
  dragStartTransform.value = transform.value
  lastDragX.value = dragStartX.value
  lastDragTime.value = performance.now()
  stopAnimation()
}

function handleDragMove(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return

  const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const currentTime = performance.now()
  const deltaTime = currentTime - lastDragTime.value

  if (deltaTime > 0) {
    dragVelocity.value = (currentX - lastDragX.value) / deltaTime
  }

  lastDragX.value = currentX
  lastDragTime.value = currentTime

  // Update transform directly during drag
  transform.value = dragStartTransform.value + (dragStartX.value - currentX)
  transform.value = normalizeTransform(transform.value)
}

function handleDragEnd() {
  isDragging.value = false
  velocity.value = -dragVelocity.value * strength
  dragVelocity.value = 0
  startAnimation()
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
  startAnimation()
})

onUnmounted(() => {
  if (resizeObserver && wrapper.value) {
    resizeObserver.unobserve(wrapper.value)
    resizeObserver = null
  }
  stopAnimation()
})
</script>

<template>
  <section ref="component" class="Marquee" :class="{ animate: shouldAnimate }" @mousedown="handleDragStart"
    @mousemove="handleDragMove" @mouseup="handleDragEnd" @mouseleave="handleDragEnd" @touchstart="handleDragStart"
    @touchmove="handleDragMove" @touchend="handleDragEnd">
    <div class="scroller" :style="{ transform: `translate3d(${-transform}px, 0, 0)` }">
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
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  will-change: transform;

  &:active {
    cursor: grabbing;
  }

  &.animate {
    .scroller {
      will-change: transform;
    }
  }

  .scroller {
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    backface-visibility: hidden;
    transform-style: preserve-3d;
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