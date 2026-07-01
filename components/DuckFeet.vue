<script setup lang="ts">
const isReducedMotion = useReducedMotion()

const MOBILE_BREAKPOINT = 640
const MAX_DUCKS_DESKTOP = 10
const MAX_DUCKS_MOBILE = 3
const PARALLAX_FACTOR_DESKTOP = 0.15
const PARALLAX_FACTOR_MOBILE = 0.08
const DUCK_SPEED_MULTIPLIER_MIN = 0.75
const DUCK_SPEED_MULTIPLIER_MAX = 1.35

const BASE_SPEED = 36
const SPEED_NOISE_RATE = 1.6
const SPEED_NOISE_DECAY = 0.06
const SPEED_NOISE_AMOUNT = 0.7

const FLEE_RADIUS = 170
const FLEE_MAX_SPEED = 175
const FLEE_SETTLE_S = 1.4

const WANDER_BIG_TURN_CHANCE = 0.15
const WANDER_BIG_TURN_MAX = Math.PI * 0.5
const WANDER_SMALL_TURN_MAX = Math.PI * 0.15
const WANDER_MIN_INTERVAL_S = 2.6
const WANDER_INTERVAL_RANGE_S = 3.4
const WANDER_TURN_EASE = 1.1
const WANDER_JITTER = 0.1

const EDGE_MARGIN_DESKTOP = 90
const EDGE_MARGIN_MOBILE = 50
const EDGE_SETTLE_S = 1.8

const STEP_LENGTH = 17
const STANCE_WIDTH = 4.5
const TOE_OUT_ANGLE = 0.18

const FOOT_WIDTH_PX = 15
const FADE_IN_MS = 100
const FADE_OUT_MIN_MS = 300
const FADE_OUT_MAX_MS = 560

const MAX_FOOTPRINTS = 4

const MASK_BLUR_PX = 3
const MASK_OPACITY_FACTOR = 0.3
const MASK_RECT_REFRESH_MS = 500
const MASK_CANVAS_PADDING_PX = 24

const FOOT_D = 'M90.679,71.643C79.394,82.192 56.347,85.525 38.506,86.549C17.906,87.731 16.237,84.277 17.186,79.497C19.251,69.096 37.891,3.879 51.134,15.897C53.904,18.41 53.019,30.949 70.511,30.584C75.567,30.478 80.629,27.48 83.756,31.358C87.618,36.146 69.931,51.999 88.261,62.942C94.481,66.655 92.82,69.641 90.679,71.643Z'
const FOOT_ROT_A = 0.638524
const FOOT_ROT_B = -0.769602
const FOOT_ROT_C = 0.769602
const FOOT_ROT_D = 0.638524
const PIVOT_X = 76.68286105943966
const PIVOT_Y = -2.30809205274074
const FORWARD_OFFSET = (88.73463688342117 * Math.PI) / 180

interface Footprint {
  x: number
  y: number
  heading: number
  side: number
  birth: number
  lifetime: number
  fadeOut: number
}

interface Duck {
  x: number
  y: number
  heading: number
  wanderTarget: number
  wanderTimer: number
  speedNoise: number
  speedMultiplier: number
  distSinceStep: number
  side: number
  footprints: Footprint[]
}

function normalizeAngle(a: number) {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

const canvasEl = ref<HTMLCanvasElement | null>(null)
const isMobile = ref(false)
const maxDucks = computed(() => (isMobile.value ? MAX_DUCKS_MOBILE : MAX_DUCKS_DESKTOP))
const edgeMargin = computed(() => (isMobile.value ? EDGE_MARGIN_MOBILE : EDGE_MARGIN_DESKTOP))
const parallaxFactor = computed(() => (isMobile.value ? PARALLAX_FACTOR_MOBILE : PARALLAX_FACTOR_DESKTOP))

watchWindowResize(({ width }) => (isMobile.value = width <= MOBILE_BREAKPOINT))

// The canvas visually shifts on screen by this many px via a CSS transform,
// but everything drawn onto it stays in the canvas's own unshifted "draw
// space" — any comparison against real screen coordinates (pointer position,
// getBoundingClientRect) must convert through this offset first.
let parallaxY = 0

function onPageScroll(scrollY: number) {
  parallaxY = Math.max(scrollY * parallaxFactor.value, 0)
  canvasEl.value?.style.setProperty('--duck-parallax-y', `${parallaxY}`)
  updateMaskRect()
}

watchScroll(onPageScroll, { defer: true })

// getBoundingClientRect forces layout, so [data-duck-mask]'s rect is only
// re-measured on scroll/resize plus a slow fallback poll, never per-frame.
let maskRect: DOMRect | null = null
let maskRectCheckedAt = 0

function updateMaskRect() {
  const el = document.querySelector<HTMLElement>('[data-duck-mask]')
  maskRect = el ? el.getBoundingClientRect() : null
}

function isBehindMask(x: number, drawY: number): boolean {
  if (!maskRect) return false
  const y = drawY - parallaxY
  return x >= maskRect.left && x <= maskRect.right && y >= maskRect.top && y <= maskRect.bottom
}

let ctx: CanvasRenderingContext2D | null = null
let footPath: Path2D | null = null
let ducks: Duck[] = []
let raf = 0
let lastTime = 0
const mouse = { x: -9999, y: -9999 }

// Masked footprints are drawn sharp onto this offscreen canvas, then blurred
// and composited in a single ctx.filter + drawImage call per frame —
// ctx.filter forces CPU rasterization, so batching keeps it affordable when
// several footprints are behind the mask at once.
let maskCanvas: HTMLCanvasElement | null = null
let maskCtx: CanvasRenderingContext2D | null = null

function ensureMaskCanvas(width: number, height: number) {
  if (!maskCanvas) {
    maskCanvas = document.createElement('canvas')
    maskCtx = maskCanvas.getContext('2d')
  }
  if (maskCanvas.width !== width || maskCanvas.height !== height) {
    maskCanvas.width = width
    maskCanvas.height = height
  }
}

// Mobile address-bar show/hide and desktop drag-resize can fire many
// 'resize' events for the same effective device-pixel size, so the backing
// store is only reallocated when that size actually changes.
let lastCanvasW = 0
let lastCanvasH = 0
let resizeRaf = 0

// Cached to avoid a style recalculation every frame; re-read for a short
// window after a theme toggle so it rides the site's 0.5s CSS transition.
let cachedColor = '#2B2B2B'
let colorTransitionUntil = 0
let themeObserver: MutationObserver | null = null

function readColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2B2B2B'
}

function resize() {
  const canvas = canvasEl.value
  if (!canvas || !ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.floor(window.innerWidth * dpr)
  const h = Math.floor(window.innerHeight * dpr)
  if (w === lastCanvasW && h === lastCanvasH) return
  lastCanvasW = w
  lastCanvasH = h
  canvas.width = w
  canvas.height = h
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function onResize() {
  if (resizeRaf) return
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0
    resize()
    updateMaskRect()
  })
}

function onMove(e: PointerEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}
function onLeave() {
  mouse.x = -9999
  mouse.y = -9999
}

function onClick(e: MouseEvent) {
  if (ducks.length >= maxDucks.value) return
  ducks = [...ducks, createDuck(e.clientX, e.clientY + parallaxY)]
  ensureLoopRunning()
}

function step(d: Duck, dt: number, now: number, W: number, H: number) {
  const dxm = d.x - mouse.x
  const dym = d.y - (mouse.y + parallaxY)
  const distm = Math.hypot(dxm, dym)

  d.wanderTimer -= dt
  if (d.wanderTimer <= 0) {
    const bigTurn = Math.random() < WANDER_BIG_TURN_CHANCE
    const turn = bigTurn
      ? (Math.random() * 2 - 1) * WANDER_BIG_TURN_MAX
      : (Math.random() * 2 - 1) * WANDER_SMALL_TURN_MAX
    d.wanderTarget = d.heading + turn
    d.wanderTimer = WANDER_MIN_INTERVAL_S + Math.random() * WANDER_INTERVAL_RANGE_S
  }
  const wanderDiff = normalizeAngle(d.wanderTarget - d.heading)
  d.heading += wanderDiff * Math.min(1, WANDER_TURN_EASE * dt)
  d.heading += (Math.random() - 0.5) * WANDER_JITTER * dt

  d.speedNoise += (Math.random() * 2 - 1) * SPEED_NOISE_RATE * dt
  d.speedNoise *= Math.pow(SPEED_NOISE_DECAY, dt)
  d.speedNoise = Math.max(-1, Math.min(1, d.speedNoise))
  let speed = BASE_SPEED * d.speedMultiplier * (1 + d.speedNoise * SPEED_NOISE_AMOUNT)

  if (distm < FLEE_RADIUS) {
    const desired = Math.atan2(dym, dxm)
    const strength = 1 - distm / FLEE_RADIUS
    const diff = normalizeAngle(desired - d.heading)
    d.heading += diff * Math.min(1, strength * 6 * dt)
    speed = Math.max(speed, BASE_SPEED * d.speedMultiplier) + (FLEE_MAX_SPEED - BASE_SPEED) * strength
    d.wanderTarget = d.heading
    d.wanderTimer = FLEE_SETTLE_S
  }

  const distToEdge = Math.min(d.x, W - d.x, d.y, H - d.y)
  if (distToEdge < edgeMargin.value) {
    const toCenter = Math.atan2(H / 2 - d.y, W / 2 - d.x)
    const strength2 = 1 - Math.max(0, distToEdge) / edgeMargin.value
    const diff2 = normalizeAngle(toCenter - d.heading)
    d.heading += diff2 * Math.min(1, strength2 * 4 * dt)
    if (strength2 > 0.5) {
      d.wanderTarget = d.heading
      d.wanderTimer = EDGE_SETTLE_S
    }
  }

  d.x += Math.cos(d.heading) * speed * dt
  d.y += Math.sin(d.heading) * speed * dt
  d.x = Math.max(8, Math.min(W - 8, d.x))
  d.y = Math.max(8, Math.min(H - 8, d.y))

  d.distSinceStep += speed * dt
  if (d.distSinceStep >= STEP_LENGTH) {
    d.distSinceStep -= STEP_LENGTH
    const px = d.x + Math.cos(d.heading + Math.PI / 2) * STANCE_WIDTH * d.side
    const py = d.y + Math.sin(d.heading + Math.PI / 2) * STANCE_WIDTH * d.side
    const fadeOut = FADE_OUT_MIN_MS + Math.random() * (FADE_OUT_MAX_MS - FADE_OUT_MIN_MS)
    const lifetime = Math.max(550, fadeOut + 200, (STEP_LENGTH / speed) * 1000 * 2.4)
    d.footprints.push({ x: px, y: py, heading: d.heading, side: d.side, birth: now, lifetime, fadeOut })
    d.side *= -1
    if (d.footprints.length > MAX_FOOTPRINTS) d.footprints.shift()
  }

  // Most frames have nothing expired — check first to skip the filter's
  // array allocation on the common case.
  let hasExpired = false
  for (const f of d.footprints) {
    if (now - f.birth >= f.lifetime) {
      hasExpired = true
      break
    }
  }
  if (hasExpired) d.footprints = d.footprints.filter((f) => now - f.birth < f.lifetime)
}

function paintFootprint(
  target: CanvasRenderingContext2D,
  x: number,
  y: number,
  heading: number,
  side: number,
  alpha: number,
  color: string,
  footScale: number
) {
  target.save()
  target.globalAlpha = alpha
  target.fillStyle = color
  target.translate(x, y)
  // Mirroring the shape (scale.x = -1) for the opposite foot also reflects
  // its own "forward" direction, so each side needs a different base rotation
  // to still point along heading.
  const base = side > 0 ? heading + FORWARD_OFFSET : heading - Math.PI - FORWARD_OFFSET
  target.rotate(base + (side > 0 ? TOE_OUT_ANGLE : -TOE_OUT_ANGLE))
  target.scale(footScale * (side > 0 ? 1 : -1), footScale)
  target.translate(-PIVOT_X, -PIVOT_Y)
  target.transform(FOOT_ROT_A, FOOT_ROT_B, FOOT_ROT_C, FOOT_ROT_D, 0, 0)
  target.fill(footPath!)
  target.restore()
}

function draw(now: number, W: number, H: number) {
  if (!ctx || !footPath) return
  ctx.clearRect(0, 0, W, H)

  if (now < colorTransitionUntil) cachedColor = readColor()
  const color = cachedColor
  const footScale = FOOT_WIDTH_PX / 79

  const maskOriginX = maskRect ? maskRect.left - MASK_CANVAS_PADDING_PX : 0
  const maskOriginY = maskRect ? maskRect.top + parallaxY - MASK_CANVAS_PADDING_PX : 0
  let maskCanvasReady = false

  for (const duck of ducks) {
    for (const f of duck.footprints) {
      const age = now - f.birth
      let op = 0.75
      if (age < FADE_IN_MS) op = age / FADE_IN_MS
      else if (age > f.lifetime - f.fadeOut) op = Math.max(0, (f.lifetime - age) / f.fadeOut)
      op = Math.max(0, Math.min(0.75, op))

      if (maskRect && isBehindMask(f.x, f.y)) {
        if (!maskCanvasReady) {
          ensureMaskCanvas(
            Math.ceil(maskRect.width + MASK_CANVAS_PADDING_PX * 2),
            Math.ceil(maskRect.height + MASK_CANVAS_PADDING_PX * 2)
          )
          maskCtx!.clearRect(0, 0, maskCanvas!.width, maskCanvas!.height)
          maskCanvasReady = true
        }
        paintFootprint(maskCtx!, f.x - maskOriginX, f.y - maskOriginY, f.heading, f.side, op, color, footScale)
      } else {
        paintFootprint(ctx!, f.x, f.y, f.heading, f.side, op, color, footScale)
      }
    }
  }

  if (maskCanvasReady) {
    ctx.save()
    ctx.globalAlpha = MASK_OPACITY_FACTOR
    ctx.filter = `blur(${MASK_BLUR_PX}px)`
    ctx.drawImage(maskCanvas!, maskOriginX, maskOriginY)
    ctx.restore()
  }
}

function createDuck(x: number, y: number): Duck {
  const startHeading = Math.random() * Math.PI * 2
  return {
    x,
    y,
    heading: startHeading,
    wanderTarget: startHeading,
    wanderTimer: 0,
    speedNoise: 0,
    speedMultiplier: DUCK_SPEED_MULTIPLIER_MIN + Math.random() * (DUCK_SPEED_MULTIPLIER_MAX - DUCK_SPEED_MULTIPLIER_MIN),
    distSinceStep: 0,
    side: 1,
    footprints: []
  }
}

function tick(now: number) {
  const dt = Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now

  if (now - maskRectCheckedAt > MASK_RECT_REFRESH_MS) {
    maskRectCheckedAt = now
    updateMaskRect()
  }

  const W = window.innerWidth
  const H = window.innerHeight

  for (const d of ducks) step(d, dt, now, W, H)
  draw(now, W, H)
  raf = requestAnimationFrame(tick)
}

// Loop only starts once a duck exists, so idle page views pay nothing.
function ensureLoopRunning() {
  if (raf) return
  updateMaskRect()
  lastTime = performance.now()
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  if (isReducedMotion.value || !canvasEl.value) return

  ctx = canvasEl.value.getContext('2d')
  footPath = new Path2D(FOOT_D)
  resize()
  updateMaskRect()
  cachedColor = readColor()

  themeObserver = new MutationObserver(() => {
    cachedColor = readColor()
    colorTransitionUntil = performance.now() + 600
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave, { passive: true })
  window.addEventListener('click', onClick, { passive: true })
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  if (resizeRaf) cancelAnimationFrame(resizeRaf)
  themeObserver?.disconnect()
  window.removeEventListener('resize', onResize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerleave', onLeave)
  window.removeEventListener('click', onClick)
})
</script>

<template>
  <canvas v-if="!isReducedMotion" ref="canvasEl" class="DuckFeet" aria-hidden="true" />
</template>

<style scoped lang="scss">
.DuckFeet {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  display: block;
  will-change: transform;
  transform: translateY(calc(var(--duck-parallax-y, 0) * -1px));
}
</style>
