<script setup lang="ts">
interface MarqueeProps {
  enableAnimation?: boolean
  strength?: number
  speed?: number
}

const { enableAnimation = true, strength = 1.5, speed = 0.5 } = defineProps<MarqueeProps>()

const component = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLDivElement | null>(null)
const transform = ref(0)
const wrapperWidth = ref(1)
const componentWidth = ref(1)
const slotCount = computed(() => Math.ceil(componentWidth.value / wrapperWidth.value) + 1)

const { velocity, updateVelocity } = useVelocity()
const reducedMotion = useReducedMotion()
const shouldAnimate = computed<boolean>(() => enableAnimation && !reducedMotion.value)

const scrollState = {
  current: 0,
  last: 0,
  direction: 1
}

const dragState = {
  isDragging: false,
  startX: 0,
  startTransform: 0,
  velocity: 0,
  lastX: 0,
  lastTime: 0
}

let rafId: number | undefined
let isVisible = true
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

const SPEED_EASING = 0.06

// Eased toward the speed prop each frame so speed changes (e.g. hover) ramp smoothly
let currentSpeed = speed

function normalizeTransform(value: number): number {
  if (wrapperWidth.value === 0) return 0
  return ((value % wrapperWidth.value) + wrapperWidth.value) % wrapperWidth.value
}

function updateTransform() {
  if (Math.abs(velocity.value) > 0.001) {
    velocity.value *= 0.95
  }

  if (dragState.isDragging) {
    transform.value = normalizeTransform(dragState.startTransform + (dragState.startX - dragState.lastX))
    return
  }

  currentSpeed += (speed - currentSpeed) * SPEED_EASING
  if (Math.abs(speed - currentSpeed) < 0.001) {
    currentSpeed = speed
  }

  transform.value = normalizeTransform(transform.value + currentSpeed * scrollState.direction + velocity.value * strength)
}

function isSettled(): boolean {
  return speed === 0 && currentSpeed === 0 && Math.abs(velocity.value) < 0.001 && !dragState.isDragging
}

function animate() {
  if ((!shouldAnimate.value && !dragState.isDragging) || !isVisible || isSettled()) {
    rafId = undefined
    return
  }

  updateTransform()
  rafId = requestAnimationFrame(animate)
}

function startAnimation() {
  if (!rafId && shouldAnimate.value && isVisible && !isSettled()) {
    rafId = requestAnimationFrame(animate)
  }
}

function stopAnimation() {
  if (!rafId) return

  cancelAnimationFrame(rafId)
  rafId = undefined
}

function handleScroll(scrollValue: number) {
  updateVelocity(scrollState.last, scrollState.current, 2.5)
  scrollState.direction = scrollValue >= scrollState.current ? 1 : -1
  scrollState.last = scrollState.current
  scrollState.current = scrollValue
  // Scroll injects velocity, so wake the loop if it was settled
  startAnimation()
}

function handleResize() {
  if (!wrapper.value) return
  wrapperWidth.value = wrapper.value.clientWidth || 1
}

function handleDragStart(event: MouseEvent | TouchEvent) {
  dragState.isDragging = true
  dragState.startX = 'touches' in event ? event.touches[0].clientX : event.clientX
  dragState.startTransform = transform.value
  dragState.lastX = dragState.startX
  dragState.lastTime = performance.now()
  stopAnimation()
}

function handleDragMove(event: MouseEvent | TouchEvent) {
  if (!dragState.isDragging) return

  const currentX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const currentTime = performance.now()
  const deltaTime = currentTime - dragState.lastTime

  if (deltaTime > 0) {
    dragState.velocity = (currentX - dragState.lastX) / deltaTime
  }

  dragState.lastX = currentX
  dragState.lastTime = currentTime

  transform.value = normalizeTransform(dragState.startTransform + (dragState.startX - currentX))
}

function handleDragEnd() {
  if (!dragState.isDragging) return

  dragState.isDragging = false
  velocity.value = -dragState.velocity * strength
  dragState.velocity = 0
  startAnimation()
}

function handleWheel(event: WheelEvent) {
  // Only react to horizontal swipes; vertical scroll keeps scrolling the page
  if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return

  // Stop the browser's back/forward swipe gesture
  event.preventDefault()

  // deltaMode is 1 (lines) for some mice instead of 0 (pixels)
  const scale = event.deltaMode === 1 ? 16 : 1

  transform.value = normalizeTransform(transform.value + event.deltaX * scale)
}

watchScroll(handleScroll, { enabled: shouldAnimate })
watchWindowResize(handleResize)

// Wake the loop when speed comes back (e.g. hover ends) or motion preference changes
watch(() => speed, () => startAnimation())
watch(shouldAnimate, (value) => (value ? startAnimation() : stopAnimation()))

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === wrapper.value) {
        wrapperWidth.value = entry.contentRect.width
      } else if (entry.target === component.value) {
        componentWidth.value = entry.contentRect.width || 1
      }
    }
  })

  if (wrapper.value) resizeObserver.observe(wrapper.value)
  if (component.value) resizeObserver.observe(component.value)

  // Pause the rAF loop while the marquee is scrolled off-screen
  intersectionObserver = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting
    if (isVisible) {
      startAnimation()
    } else {
      stopAnimation()
    }
  })

  if (component.value) {
    componentWidth.value = component.value.clientWidth || 1
    intersectionObserver.observe(component.value)
  }

  startAnimation()
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  intersectionObserver?.disconnect()
  intersectionObserver = null
  stopAnimation()
})
</script>

<template>
  <section
    ref="component"
    class="Marquee"
    :class="{ animate: shouldAnimate }"
    @wheel="handleWheel"
    @mousedown.passive="handleDragStart"
    @mousemove.passive="handleDragMove"
    @mouseup.passive="handleDragEnd"
    @mouseleave.passive="handleDragEnd"
    @touchstart.passive="handleDragStart"
    @touchmove.passive="handleDragMove"
    @touchend.passive="handleDragEnd"
  >
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
