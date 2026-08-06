<script setup lang="ts">
interface MarqueeProps {
  enableAnimation?: boolean
  strength?: number
  speed?: number
  /** Degrees of drum arc between centre and each edge. 0 disables the effect. */
  bend?: number
}

const { enableAnimation = true, strength = 1.5, speed = 0.5, bend = 0 } = defineProps<MarqueeProps>()

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
    applyBend()
    return
  }

  currentSpeed += (speed - currentSpeed) * SPEED_EASING
  if (Math.abs(speed - currentSpeed) < 0.001) {
    currentSpeed = speed
  }

  transform.value = normalizeTransform(transform.value + currentSpeed * scrollState.direction + velocity.value * strength)
  applyBend()
}

const BEND_ITEM_SELECTOR = '[data-marquee-item]'
const BEND_FOCAL = 800
const BEND_MIN_STEP = 0.5
const BEND_MAX_ANGLE = Math.PI / 2

interface BendItem {
  el: HTMLElement
  center: number
  angle: number
}

let bendItems: BendItem[] = []
let bendHalf = 0
let bendRadius = 0
let lastBendOffset = Number.NaN

function measureBendItems() {
  bendItems = []
  lastBendOffset = Number.NaN

  const root = component.value
  if (!bend || !root) return

  const items = root.querySelectorAll<HTMLElement>(BEND_ITEM_SELECTOR)
  for (const el of items) el.style.transform = ''

  bendHalf = root.clientWidth / 2
  bendRadius = bendHalf / ((bend * Math.PI) / 180)
  if (!bendHalf) return

  const base = root.getBoundingClientRect().left
  for (const el of items) {
    const rect = el.getBoundingClientRect()
    bendItems.push({ el, center: rect.left - base + transform.value + rect.width / 2, angle: Number.NaN })
  }

  applyBend(true)
}

function applyBend(force = false) {
  if (!bendItems.length) return

  const offsetBase = transform.value + bendHalf
  if (!force && Math.abs(offsetBase - lastBendOffset) < BEND_MIN_STEP) return

  lastBendOffset = offsetBase

  for (const item of bendItems) {
    const offset = item.center - offsetBase
    const angle = clamp(offset / bendRadius, -BEND_MAX_ANGLE, BEND_MAX_ANGLE)

    if (angle === item.angle) continue
    item.angle = angle

    if (!angle) {
      item.el.style.transform = ''
      continue
    }

    const squeeze = Math.cos(angle)
    const scale = BEND_FOCAL / (BEND_FOCAL + bendRadius * (1 - squeeze))
    const shift = bendRadius * Math.sin(angle) * scale - offset

    item.el.style.transform = `translate(${shift.toFixed(2)}px,0) scale(${(scale * squeeze).toFixed(4)},${scale.toFixed(4)})`
  }
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
  measureBendItems()
}

function pointerX(event: MouseEvent | TouchEvent): number | undefined {
  return 'touches' in event ? event.touches[0]?.clientX : event.clientX
}

function handleDragStart(event: MouseEvent | TouchEvent) {
  const startX = pointerX(event)
  if (startX === undefined) return

  dragState.isDragging = true
  dragState.startX = startX
  dragState.startTransform = transform.value
  dragState.lastX = startX
  dragState.lastTime = performance.now()
  stopAnimation()
}

function handleDragMove(event: MouseEvent | TouchEvent) {
  if (!dragState.isDragging) return

  const currentX = pointerX(event)
  if (currentX === undefined) return

  const currentTime = performance.now()
  const deltaTime = currentTime - dragState.lastTime

  if (deltaTime > 0) {
    dragState.velocity = (currentX - dragState.lastX) / deltaTime
  }

  dragState.lastX = currentX
  dragState.lastTime = currentTime

  transform.value = normalizeTransform(dragState.startTransform + (dragState.startX - currentX))
  applyBend()
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
  applyBend()
}

watchScroll(handleScroll, { enabled: shouldAnimate })
watchWindowResize(handleResize)

// Wake the loop when speed comes back (e.g. hover ends) or motion preference changes
watch(() => speed, () => startAnimation())
watch(shouldAnimate, (value) => (value ? startAnimation() : stopAnimation()))

watch([slotCount, wrapperWidth], () => nextTick(measureBendItems))

defineExpose({ refreshBend: () => nextTick(measureBendItems) })

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
    const entry = entries[0]
    if (!entry) return

    isVisible = entry.isIntersecting
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

  nextTick(measureBendItems)
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
