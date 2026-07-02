<script setup lang="ts">
const isReducedMotion = useReducedMotion()

const MOBILE_BREAKPOINT = 640
const DUCK_COUNT = 2
const IDLE_SPAWN_TIMEOUT_MS = 3000
const IDLE_SPAWN_FALLBACK_MS = 1500
const DUCK_SPEED_MULTIPLIER_MIN = 0.75
const DUCK_SPEED_MULTIPLIER_MAX = 1.35

const SPEED_SLOW = 16
const SPEED_FAST = 58
const GAIT_ACCEL = 2.5
const GAIT_STOP_CHANCE = 0.35
const GAIT_SLOW_CHANCE = 0.45
const GAIT_RESUME_SLOW_CHANCE = 0.75
const STOP_MIN_S = 0.5
const STOP_RANGE_S = 1.3
const SLOW_MIN_S = 1.8
const SLOW_RANGE_S = 3.2
const FAST_MIN_S = 0.9
const FAST_RANGE_S = 1.6

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

const STEP_LENGTH_MIN = 9
const STEP_LENGTH_MAX = 22
const STEP_LEAD_FACTOR = 0.35
const STANCE_WIDTH = 4.5
const STANCE_JITTER = 0.3
const FOOTFALL_JITTER = 0.07
const TOE_OUT_ANGLE = 0.18
const WADDLE_YAW = 0.12
const TURN_ANTICIPATION_MAX = 0.35
const TURN_ANTICIPATION_FACTOR = 0.4

const FOOT_WIDTH_PX = 15
const LIFT_DUR_MIN_MS = 100
const LIFT_DUR_MAX_MS = 280
const LIFT_PEAK = 0.25
const LIFT_MIN_ALPHA = 0.35
const LIFT_BLUR_PX = 7
const LIFT_SCALE_DROP = 0.45
const LAND_SETTLE_MS = 130
const LAND_PULSE = 0.08
const PRESS_SCALE = 0.05
const PLANT_ALPHA_MIN = 0.78
const SPAWN_FADE_MS = 250

const BODY_LENGTH_PX = 100
const BODY_WIDTH_PX = 76
const BODY_ALPHA = 0.1
const BODY_SWAY_FACTOR = 0.5
const BODY_SETBACK_PX = 16
const BODY_BLUR_PX = 8
const SHADOW_SPRITE_SCALE = 2

const HEAD_POSES = 5
const HEAD_YAW_MAX = 0.4
const HEAD_LEAN_FACTOR = 0.8
const HEAD_TURN_RATE = 7
const HEAD_STABILIZE = 0.06
const HEAD_GLANCE_MIN_S = 1.2
const HEAD_GLANCE_RANGE_S = 3.5
const HEAD_GLANCE_CENTER_CHANCE = 0.4

// Deliberately underdamped (ζ ≈ 0.5): the body overshoots turns and stops
// with a small plump jiggle instead of tracking the feet rigidly.
const BODY_SPRING_K = 60
const BODY_SPRING_DAMP = 8
const BODY_YAW_K = 40
const BODY_YAW_DAMP = 6
const BODY_WOBBLE_YAW = 0.14
const BODY_BOB_SCALE = 0.04
const BODY_SQUASH_SCALE = 0.03
const BREATH_SCALE = 0.015
const BREATH_HZ = 0.4
const SHIMMY_CHANCE = 0.2
const SHIMMY_DUR_MS = 450
const SHIMMY_CYCLES = 3
const SHIMMY_AMP = 0.12
const CURIOUS_RADIUS = 320
const CURIOUS_LEAN_MAX = 0.35
const CURIOUS_EASE = 2.5

const WEIGHT_RATE_IDLE = 1.6
const IDLE_SHIFT_MIN_S = 1.0
const IDLE_SHIFT_RANGE_S = 1.6
const IDLE_SHUFFLE_CHANCE = 0.35
const SHUFFLE_DIST_PX = 3
const SHUFFLE_DUR_MS = 300

const MASK_BLUR_PX = 3
const MASK_OPACITY_FACTOR = 0.3
const MASK_RECT_REFRESH_MS = 500
// Width (px, straddling the mask edge) over which a duck crossfades between
// its on-glass and behind-glass look, instead of snapping at the boundary.
const MASK_FADE_MARGIN_PX = 28

// Clearance added to the off-screen shift used by the shadow-blur trick so
// no part of a shape (plus its blur) ever pokes back into view.
const SHADOW_SHIFT_MARGIN_PX = 100

// --color-primary flips instantly on theme change (custom properties don't
// transition), so the canvas lerps to the new color in JS over the same
// duration and curve as the site-wide CSS color transition.
const THEME_TRANSITION_MS = 500

const FOOT_D = 'M90.679,71.643C79.394,82.192 56.347,85.525 38.506,86.549C17.906,87.731 16.237,84.277 17.186,79.497C19.251,69.096 37.891,3.879 51.134,15.897C53.904,18.41 53.019,30.949 70.511,30.584C75.567,30.478 80.629,27.48 83.756,31.358C87.618,36.146 69.931,51.999 88.261,62.942C94.481,66.655 92.82,69.641 90.679,71.643Z'
const FOOT_ROT_A = 0.638524
const FOOT_ROT_B = -0.769602
const FOOT_ROT_C = 0.769602
const FOOT_ROT_D = 0.638524
const PIVOT_X = 76.68286105943966
const PIVOT_Y = -2.30809205274074
const FORWARD_OFFSET = (88.73463688342117 * Math.PI) / 180
// The foot path is ~79 SVG units wide; scale it down to FOOT_WIDTH_PX.
const FOOT_SCALE = FOOT_WIDTH_PX / 79

interface Foot {
  side: number
  x: number
  y: number
  heading: number
  fromX: number
  fromY: number
  fromHeading: number
  liftStart: number
  liftDur: number
  landAt: number
}

type Gait = 'stop' | 'slow' | 'fast'

interface Duck {
  x: number
  y: number
  heading: number
  wanderTarget: number
  wanderTimer: number
  gait: Gait
  gaitTimer: number
  speed: number
  speedMultiplier: number
  distSinceStep: number
  side: number
  stepParity: number
  weight: number
  restSide: number
  idleTimer: number
  bodyX: number
  bodyY: number
  bodyVX: number
  bodyVY: number
  bodyYaw: number
  bodyYawV: number
  lean: number
  headAngle: number
  headTarget: number
  headTimer: number
  shimmyStart: number
  birth: number
  feet: [Foot, Foot]
}

interface ThemeFade {
  from: [number, number, number]
  to: [number, number, number]
  start: number
}

function normalizeAngle(a: number) {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

function strideFor(speed: number) {
  return STEP_LENGTH_MIN + (STEP_LENGTH_MAX - STEP_LENGTH_MIN) * Math.min(1, speed / SPEED_FAST)
}

function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t))
  return c * c * (3 - 2 * c)
}

// CSS-style cubic-bezier easing. Solved with a few Newton iterations, which
// only ever runs for feet currently mid-lift (at most one per duck).
function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x
  const bx = 3 * (p2x - p1x) - cx
  const ax = 1 - cx - bx
  const cy = 3 * p1y
  const by = 3 * (p2y - p1y) - cy
  const ay = 1 - cy - by
  return (x: number) => {
    let t = x
    for (let i = 0; i < 5; i++) {
      const err = ((ax * t + bx) * t + cx) * t - x
      const slope = (3 * ax * t + 2 * bx) * t + cx
      if (Math.abs(err) < 1e-4 || slope === 0) break
      t -= err / slope
    }
    t = Math.max(0, Math.min(1, t))
    return ((ay * t + by) * t + cy) * t
  }
}

// Swing-phase eases: the foot leaves the glass with a quick push-off, covers
// most ground mid-swing, and decelerates into the plant. Position follows this
// curve raw for a snappy step; the foot's own fade/blur/shrink (paintFootPose)
// instead follows footPose's separate `fade` envelope, which is spread over
// the whole swing so leaving/touching the glass reads as a gradual fade
// rather than an instant pop.
const LIFT_TRANSLATE_EASE = cubicBezier(0.4, 0, 0.1, 1)
const LIFT_RISE_EASE = cubicBezier(0.2, 0.8, 0.35, 1)
const LIFT_FALL_EASE = cubicBezier(0.55, 0, 0.85, 0.4)

// Same curve as the site's 0.5s theme color transition in globals.scss.
const THEME_EASE = cubicBezier(0.22, 1, 0.36, 1)

const canvasEl = ref<HTMLCanvasElement | null>(null)
const isMobile = ref(false)
const edgeMargin = computed(() => (isMobile.value ? EDGE_MARGIN_MOBILE : EDGE_MARGIN_DESKTOP))

watchWindowResize(({ width }) => (isMobile.value = width <= MOBILE_BREAKPOINT))

// getBoundingClientRect forces layout, so [data-duck-mask]'s rect is only
// re-measured on scroll/resize plus a slow fallback poll, never per-frame.
// The element itself is cached and re-queried only when it leaves the DOM
// (route changes swap the page that carries the attribute).
let maskEl: HTMLElement | null = null
let maskRect: DOMRect | null = null
let maskRectCheckedAt = 0

function updateMaskRect() {
  if (!maskEl || !maskEl.isConnected) {
    maskEl = document.querySelector<HTMLElement>('[data-duck-mask]')
  }
  maskRect = maskEl ? maskEl.getBoundingClientRect() : null
}

// The mask element scrolls with the page while the canvas stays fixed, so
// its viewport rect must be refreshed on scroll (batched to one per frame,
// and not at all while reduced motion keeps the canvas blank).
watchScroll(updateMaskRect, { defer: true, enabled: computed(() => !isReducedMotion.value) })

// Smooth 0..1 "how behind the glass" amount instead of a hard in/out test, so
// callers can crossfade a duck's look as it crosses the mask edge rather than
// snapping between appearances. 0 = fully in front, 1 = fully behind; distance
// is measured to the nearest edge of the mask rect (negative once outside),
// smoothstepped over a band MASK_FADE_MARGIN_PX wide centered on that edge.
function maskFactor(x: number, y: number): number {
  if (!maskRect) return 0
  const dx = Math.min(x - maskRect.left, maskRect.right - x)
  const dy = Math.min(y - maskRect.top, maskRect.bottom - y)
  const d = Math.min(dx, dy)
  return smoothstep((d + MASK_FADE_MARGIN_PX) / (MASK_FADE_MARGIN_PX * 2))
}

let ctx: CanvasRenderingContext2D | null = null
let footPath: Path2D | null = null
const ducks: Duck[] = []
let raf = 0
let lastTime = 0
const mouse = { x: -9999, y: -9999 }

// Viewport size and device-pixel ratio are cached on resize so the frame
// loop never touches window.* or triggers style/layout reads.
let dpr = 1
let cssW = 0
let cssH = 0

// Mobile address-bar show/hide and desktop drag-resize can fire many
// 'resize' events for the same effective device-pixel size, so the backing
// store is only reallocated when that size actually changes.
let lastCanvasW = 0
let lastCanvasH = 0
let resizeRaf = 0

// Current paint color. Stays a plain cached string except during a theme
// fade, where it is lerped per frame (getComputedStyle is only ever called
// on mount and when data-theme actually mutates).
let themeColor = '#2B2B2B'
let drawColor = themeColor
let drawRgb: [number, number, number] = [43, 43, 43]
let themeFade: ThemeFade | null = null
let themeObserver: MutationObserver | null = null

function readColor(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#2B2B2B'
}

function parseColor(value: string): [number, number, number] | null {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value)?.[1]
  if (hex) {
    const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16)
    ]
  }
  const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(value)
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])]
  return null
}

function handleThemeChange() {
  const next = readColor()
  if (next === themeColor) return
  const target = parseColor(next)
  themeColor = next
  // Old sprites are kept and cross-faded out; new ones bake lazily in draw().
  oldBodySprites = bodySprites
  bodySprites = []
  if (!target) {
    themeFade = null
    oldBodySprites = []
    drawColor = next
    return
  }
  themeFade = { from: [drawRgb[0], drawRgb[1], drawRgb[2]], to: target, start: performance.now() }
}

function resize() {
  const canvas = canvasEl.value
  if (!canvas || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  cssW = window.innerWidth
  cssH = window.innerHeight
  const w = Math.floor(cssW * dpr)
  const h = Math.floor(cssH * dpr)
  if (w === lastCanvasW && h === lastCanvasH) return
  lastCanvasW = w
  lastCanvasH = h
  canvas.width = w
  canvas.height = h
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function handleResize() {
  if (resizeRaf) return
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0
    resize()
    updateMaskRect()
  })
}

function handlePointerMove(e: PointerEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

function handlePointerLeave() {
  mouse.x = -9999
  mouse.y = -9999
}

// Touch has no hover: when the finger lifts (or the gesture is cancelled,
// e.g. the scroll takes over), clear the pointer so the ducks stop fleeing
// a phantom touch point.
function handlePointerEnd(e: PointerEvent) {
  if (e.pointerType !== 'mouse') handlePointerLeave()
}

function pickGait(d: Duck) {
  if (d.gait === 'stop') {
    d.gait = Math.random() < GAIT_RESUME_SLOW_CHANCE ? 'slow' : 'fast'
  } else {
    const r = Math.random()
    d.gait = r < GAIT_STOP_CHANCE ? 'stop' : r < GAIT_STOP_CHANCE + GAIT_SLOW_CHANCE ? 'slow' : 'fast'
  }
  if (d.gait === 'stop') d.gaitTimer = STOP_MIN_S + Math.random() * STOP_RANGE_S
  else if (d.gait === 'slow') d.gaitTimer = SLOW_MIN_S + Math.random() * SLOW_RANGE_S
  else d.gaitTimer = FAST_MIN_S + Math.random() * FAST_RANGE_S
}

function plantStep(d: Duck, now: number, stride: number) {
  d.distSinceStep -= stride
  const foot = d.feet[d.side > 0 ? 1 : 0]

  const stance = STANCE_WIDTH * (1 - STANCE_JITTER / 2 + Math.random() * STANCE_JITTER)
  const lead = stride * STEP_LEAD_FACTOR * (0.9 + Math.random() * 0.2)
  // Feet point slightly into the upcoming turn instead of along the current
  // heading, so direction changes read as intentional rather than sliding.
  const turn = normalizeAngle(d.wanderTarget - d.heading)
  const anticipation =
    Math.max(-TURN_ANTICIPATION_MAX, Math.min(TURN_ANTICIPATION_MAX, turn)) * TURN_ANTICIPATION_FACTOR

  foot.fromX = foot.x
  foot.fromY = foot.y
  foot.fromHeading = foot.heading
  foot.x = d.x + Math.cos(d.heading + Math.PI / 2) * stance * foot.side + Math.cos(d.heading) * lead
  foot.y = d.y + Math.sin(d.heading + Math.PI / 2) * stance * foot.side + Math.sin(d.heading) * lead
  foot.heading = d.heading + anticipation + (Math.random() * 2 - 1) * FOOTFALL_JITTER
  foot.liftStart = now
  // Swing takes ~65% of the step interval, keeping each foot planted for
  // most of the cycle like a real gait.
  foot.liftDur = Math.max(LIFT_DUR_MIN_MS, Math.min(LIFT_DUR_MAX_MS, (stride / Math.max(d.speed, 1)) * 650))
  d.side *= -1
  d.stepParity *= -1
}

function shuffleFoot(d: Duck, now: number) {
  const foot = d.feet[d.restSide > 0 ? 0 : 1]
  foot.fromX = foot.x
  foot.fromY = foot.y
  foot.fromHeading = foot.heading
  foot.x += (Math.random() * 2 - 1) * SHUFFLE_DIST_PX
  foot.y += (Math.random() * 2 - 1) * SHUFFLE_DIST_PX
  foot.heading += (Math.random() * 2 - 1) * FOOTFALL_JITTER * 2
  foot.liftStart = now
  foot.liftDur = SHUFFLE_DUR_MS
  d.side = -foot.side
}

// While lifted the foot arcs between its old and new plant: `arc` rises to 1
// and back to 0, driving the body's bob/squash. The arc peaks early (quick
// pick-up) and descends on a bezier whose slope is steepest at contact, so
// the plant lands firm instead of floating in — but that fast rise happens
// within the first ~5-15ms of a swing, too quick for a fade to read on
// screen. `fade` drives the foot's own alpha/blur/shrink instead: a
// symmetric envelope spread over the *entire* swing (not just the pick-up
// window), so leaving and touching the glass reads as a visible fade rather
// than a pop. `settle` pulses 1 → 0 just after contact for the toe-spread
// press.
function footPose(foot: Foot, now: number) {
  if (!foot.liftStart) {
    const settle = foot.landAt ? Math.max(0, 1 - (now - foot.landAt) / LAND_SETTLE_MS) : 0
    return { x: foot.x, y: foot.y, heading: foot.heading, arc: 0, fade: 0, settle }
  }
  const t = (now - foot.liftStart) / foot.liftDur
  if (t >= 1) {
    foot.landAt = foot.liftStart + foot.liftDur
    foot.liftStart = 0
    return {
      x: foot.x,
      y: foot.y,
      heading: foot.heading,
      arc: 0,
      fade: 0,
      settle: Math.max(0, 1 - (now - foot.landAt) / LAND_SETTLE_MS)
    }
  }
  const e = LIFT_TRANSLATE_EASE(t)
  const arc =
    t < LIFT_PEAK
      ? LIFT_RISE_EASE(t / LIFT_PEAK)
      : 1 - LIFT_FALL_EASE((t - LIFT_PEAK) / (1 - LIFT_PEAK))
  const fade = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI)
  return {
    x: foot.fromX + (foot.x - foot.fromX) * e,
    y: foot.fromY + (foot.y - foot.fromY) * e,
    heading: foot.fromHeading + normalizeAngle(foot.heading - foot.fromHeading) * e,
    arc,
    fade,
    settle: 0
  }
}

type FootPose = ReturnType<typeof footPose>

function step(d: Duck, dt: number, now: number, W: number, H: number) {
  const dxm = d.x - mouse.x
  const dym = d.y - mouse.y
  const distm = Math.hypot(dxm, dym)

  d.gaitTimer -= dt
  if (d.gaitTimer <= 0) pickGait(d)
  const targetSpeed = d.gait === 'stop' ? 0 : (d.gait === 'slow' ? SPEED_SLOW : SPEED_FAST) * d.speedMultiplier
  d.speed += (targetSpeed - d.speed) * Math.min(1, GAIT_ACCEL * dt)
  if (targetSpeed === 0 && d.speed < 1.5) d.speed = 0

  if (d.speed > 0) {
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
  }

  if (distm < FLEE_RADIUS) {
    const desired = Math.atan2(dym, dxm)
    const strength = 1 - distm / FLEE_RADIUS
    const diff = normalizeAngle(desired - d.heading)
    d.heading += diff * Math.min(1, strength * 6 * dt)
    d.speed = Math.max(d.speed, SPEED_FAST * d.speedMultiplier + (FLEE_MAX_SPEED - SPEED_FAST) * strength)
    d.gait = 'fast'
    d.gaitTimer = FLEE_SETTLE_S
    d.wanderTarget = d.heading
    d.wanderTimer = FLEE_SETTLE_S
    d.headTarget = 0
    d.headTimer = FLEE_SETTLE_S
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

  // Headings drift as an unbounded random walk; keep the stored angle in
  // (-π, π] so downstream normalizeAngle calls stay O(1) over long sessions.
  d.heading = normalizeAngle(d.heading)
  d.wanderTarget = d.heading + normalizeAngle(d.wanderTarget - d.heading)

  const stride = strideFor(d.speed)

  // Waddle: the path weaves side to side in sync with the step cycle, fading
  // out as the duck slows so it never wobbles in place.
  const waddle =
    d.speed > 0
      ? WADDLE_YAW * Math.sin((d.distSinceStep / stride) * Math.PI) * d.stepParity * Math.min(1, d.speed / SPEED_SLOW)
      : 0
  d.x += Math.cos(d.heading + waddle) * d.speed * dt
  d.y += Math.sin(d.heading + waddle) * d.speed * dt
  d.x = Math.max(8, Math.min(W - 8, d.x))
  d.y = Math.max(8, Math.min(H - 8, d.y))

  d.distSinceStep += d.speed * dt
  if (d.distSinceStep >= stride) plantStep(d, now, stride)

  // Weight flows toward the foot that just planted (or, when idle, toward the
  // resting side), so the loaded foot presses dark and spread while the foot
  // about to lift lightens first.
  const weightTarget = d.speed > 0 ? -d.side : d.restSide
  const weightRate = d.speed > 0 ? Math.min(9, Math.max(2, (d.speed / stride) * 3)) : WEIGHT_RATE_IDLE
  d.weight += (weightTarget - d.weight) * Math.min(1, weightRate * dt)

  if (d.speed === 0) {
    d.idleTimer -= dt
    if (d.idleTimer <= 0) {
      d.restSide *= -1
      d.idleTimer = IDLE_SHIFT_MIN_S + Math.random() * IDLE_SHIFT_RANGE_S
      if (Math.random() < IDLE_SHUFFLE_CHANCE) shuffleFoot(d, now)
      if (Math.random() < SHIMMY_CHANCE) d.shimmyStart = now
    }
  } else {
    d.restSide = -d.side
    d.idleTimer = IDLE_SHIFT_MIN_S
  }

  // Curious lean: a stopped duck notices a cursor hovering nearby — outside
  // flee range — and tilts its body a few degrees toward it.
  const leanTarget =
    d.speed === 0 && distm > FLEE_RADIUS && distm < CURIOUS_RADIUS
      ? Math.max(-CURIOUS_LEAN_MAX, Math.min(CURIOUS_LEAN_MAX, normalizeAngle(Math.atan2(-dym, -dxm) - d.heading)))
      : 0
  d.lean += (leanTarget - d.lean) * Math.min(1, CURIOUS_EASE * dt)

  // Head glances: quick look-arounds on a random timer, often returning to
  // centre. The head also turns into a curious lean further than the body.
  d.headTimer -= dt
  if (d.headTimer <= 0) {
    d.headTarget =
      Math.random() < HEAD_GLANCE_CENTER_CHANCE ? 0 : (Math.random() * 2 - 1) * HEAD_YAW_MAX * 0.9
    d.headTimer = HEAD_GLANCE_MIN_S + Math.random() * HEAD_GLANCE_RANGE_S
  }
  const headGoal = Math.max(
    -HEAD_YAW_MAX,
    Math.min(HEAD_YAW_MAX, d.headTarget + d.lean * HEAD_LEAN_FACTOR)
  )
  d.headAngle += (headGoal - d.headAngle) * Math.min(1, HEAD_TURN_RATE * dt)
}

// All blur in this component uses the canvas shadow API instead of
// ctx.filter: the shape is drawn a full viewport off-screen and only its
// blurred shadow (offset back into view) is visible. shadowBlur is supported
// and GPU-friendly everywhere, while ctx.filter is missing on Safari < 18
// and forces CPU rasterization in some engines. Shadow offsets and blur
// ignore the current transform, so they are set in device pixels.
function paintFoot(
  x: number,
  y: number,
  heading: number,
  side: number,
  alpha: number,
  scale: number,
  blur: number
) {
  const c = ctx!
  c.save()
  c.globalAlpha = alpha
  c.fillStyle = drawColor
  if (blur > 0) {
    const shift = cssW + SHADOW_SHIFT_MARGIN_PX
    c.shadowColor = drawColor
    c.shadowBlur = blur * 2 * dpr // shadowBlur ≈ 2σ; blur(σpx) equivalent
    c.shadowOffsetX = -shift * dpr
    c.translate(x + shift, y)
  } else {
    c.translate(x, y)
  }
  // Mirroring the shape (scale.x = -1) for the opposite foot also reflects
  // its own "forward" direction, so each side needs a different base rotation
  // to still point along heading.
  const base = side > 0 ? heading + FORWARD_OFFSET : heading - Math.PI - FORWARD_OFFSET
  c.rotate(base + (side > 0 ? TOE_OUT_ANGLE : -TOE_OUT_ANGLE))
  c.scale(scale * (side > 0 ? 1 : -1), scale)
  c.translate(-PIVOT_X, -PIVOT_Y)
  c.transform(FOOT_ROT_A, FOOT_ROT_B, FOOT_ROT_C, FOOT_ROT_D, 0, 0)
  c.fill(footPath!)
  c.restore()
}

// The duck's body shadow, seen through the glass, is pre-rendered into
// sprites: flat opaque silhouettes blurred once at bake time — frosted
// edges without any per-frame blur cost. One sprite per head pose; draw()
// cross-fades between adjacent poses to animate the head. During a theme
// fade the previous set is kept and cross-faded out.
let bodySprites: HTMLCanvasElement[] = []
let oldBodySprites: HTMLCanvasElement[] = []
let shadowSpriteColor = ''

function renderShadowSprites(color: string) {
  if (shadowSpriteColor === color && bodySprites.length) return
  shadowSpriteColor = color
  const S = SHADOW_SPRITE_SCALE
  const L = BODY_LENGTH_PX
  const Wd = BODY_WIDTH_PX
  // Padding keeps the blur from clipping at the sprite edges; it is
  // symmetric, so the belly stays at the canvas centre (the draw anchor).
  const pad = BODY_BLUR_PX * 2 * S
  const w = Math.ceil(1.7 * L * S) + pad * 2
  const h = Math.ceil(Wd * S) + pad * 2
  const sprites: HTMLCanvasElement[] = []

  // One continuous silhouette — tail taper, body, neck bridge, round head —
  // filled at a single flat alpha per tier, then blurred once. Flat
  // interiors matter: stacked radial gradients leave a hotspot at every
  // blob centre, and a light shadow on a dark background exposes each one
  // as a separate oval. Each tier is one path (self-overlaps fill once) and
  // tiers merge behind each other via 'destination-over', so nothing stacks.
  // The neck and head sit higher off the glass, hence the fainter tiers.
  for (let i = 0; i < HEAD_POSES; i++) {
    const headYaw = ((i / (HEAD_POSES - 1)) * 2 - 1) * HEAD_YAW_MAX

    const solid = document.createElement('canvas')
    solid.width = w
    solid.height = h
    const sctx = solid.getContext('2d')!
    sctx.fillStyle = color
    const cx = w / 2
    const cy = h / 2
    const ell = (path: Path2D, x: number, y: number, rx: number, ry: number, rot = 0) => {
      path.moveTo(cx + x + rx * Math.cos(rot), cy + y + rx * Math.sin(rot))
      path.ellipse(cx + x, cy + y, rx, ry, rot, 0, Math.PI * 2)
    }

    // body: broad at the breast, tapering to a pointed tail
    const body = new Path2D()
    ell(body, 0, 0, 0.32 * L * S, 0.44 * Wd * S)
    ell(body, 0.18 * L * S, 0, 0.27 * L * S, 0.38 * Wd * S)
    ell(body, -0.2 * L * S, 0, 0.25 * L * S, 0.34 * Wd * S)
    ell(body, -0.42 * L * S, 0, 0.1 * L * S, 0.16 * Wd * S)
    ell(body, -0.5 * L * S, 0, 0.05 * L * S, 0.08 * Wd * S)

    // Neck and head swing together around the neck root at the breast; the
    // root barely moves between poses, so cross-fading adjacent sprites
    // only ever ghosts the fast-moving head, not the seam.
    const rootX = 0.34 * L * S
    const cos = Math.cos(headYaw)
    const sin = Math.sin(headYaw)
    // head: small and round (equal radii in px, not proportional to the body)
    const head = new Path2D()
    const headR = 0.13 * L * S
    ell(head, rootX + cos * 0.34 * L * S, sin * 0.34 * L * S, headR, headR)
    // neck: thin and faint, bridging breast to head
    const neck = new Path2D()
    ell(neck, rootX + cos * 0.08 * L * S, sin * 0.08 * L * S, 0.09 * L * S, 0.13 * Wd * S, headYaw)
    ell(neck, rootX + cos * 0.19 * L * S, sin * 0.19 * L * S, 0.08 * L * S, 0.11 * Wd * S, headYaw)

    sctx.globalAlpha = 0.95
    sctx.fill(body)
    sctx.globalCompositeOperation = 'destination-over'
    sctx.globalAlpha = 0.7
    sctx.fill(head)
    sctx.globalAlpha = 0.5
    sctx.fill(neck)

    // Blur via the shadow trick (see paintFoot): draw the solid silhouette
    // one canvas-width to the right, keep only its blurred shadow.
    const sprite = document.createElement('canvas')
    sprite.width = w
    sprite.height = h
    const bctx = sprite.getContext('2d')!
    bctx.shadowColor = color
    bctx.shadowBlur = BODY_BLUR_PX * S * 2
    bctx.shadowOffsetX = -w
    bctx.drawImage(solid, w, 0)
    sprites.push(sprite)
  }
  bodySprites = sprites
}

function paintSprite(sprite: HTMLCanvasElement, x: number, y: number, rot: number, alpha: number, scale: number) {
  const c = ctx!
  const w = (sprite.width / SHADOW_SPRITE_SCALE) * scale
  const h = (sprite.height / SHADOW_SPRITE_SCALE) * scale
  // Crossfade the on-glass and behind-glass looks across the mask edge
  // rather than switching between them, by drawing both at complementary
  // alphas and letting the near-zero one disappear.
  const behind = maskFactor(x, y)

  if (behind < 1) {
    c.save()
    c.globalAlpha = alpha * (1 - behind)
    c.translate(x, y)
    c.rotate(rot)
    c.drawImage(sprite, -w / 2, -h / 2, w, h)
    c.restore()
  }

  if (behind > 0) {
    // Behind the content column the shadow reads through frosted glass:
    // fainter, extra blur, and recolored to the live theme color via the
    // shadow (only the sprite's alpha channel matters here).
    c.save()
    const shift = cssW + w + SHADOW_SHIFT_MARGIN_PX
    c.globalAlpha = alpha * MASK_OPACITY_FACTOR * behind
    c.shadowColor = drawColor
    c.shadowBlur = MASK_BLUR_PX * 2 * dpr
    c.shadowOffsetX = -shift * dpr
    c.translate(x + shift, y)
    c.rotate(rot)
    c.drawImage(sprite, -w / 2, -h / 2, w, h)
    c.restore()
  }
}

function paintFootPose(duck: Duck, foot: Foot, pose: FootPose, spawnFade: number) {
  const weightOn = 0.5 + 0.5 * duck.weight * foot.side
  const plantedAlpha = PLANT_ALPHA_MIN + (1 - PLANT_ALPHA_MIN) * weightOn
  const alpha = (plantedAlpha + (LIFT_MIN_ALPHA - plantedAlpha) * pose.fade) * spawnFade
  const scale =
    FOOT_SCALE * (1 + PRESS_SCALE * weightOn + LAND_PULSE * pose.settle) * (1 - LIFT_SCALE_DROP * pose.fade)
  const blur = pose.fade > 0 ? LIFT_BLUR_PX * pose.fade : 0
  // Crossfade the on-glass and behind-glass looks across the mask edge
  // rather than switching between them.
  const behind = maskFactor(pose.x, pose.y)
  if (behind > 0) {
    // Feet under the content read as prints on frosted glass: fainter, and
    // always at least the glass blur (a lifted foot keeps its extra blur).
    paintFoot(pose.x, pose.y, pose.heading, foot.side, alpha * MASK_OPACITY_FACTOR * behind, scale, Math.max(MASK_BLUR_PX, blur))
  }
  if (behind < 1) {
    paintFoot(pose.x, pose.y, pose.heading, foot.side, alpha * (1 - behind), scale, blur)
  }
}

function draw(now: number, dt: number) {
  if (!ctx || !footPath) return
  ctx.clearRect(0, 0, cssW, cssH)

  // Theme fade: lerp the paint color along the site's transition curve and
  // cross-fade the old sprite set into the freshly baked one.
  let spriteFade = 1
  if (themeFade) {
    const t = Math.min(1, (now - themeFade.start) / THEME_TRANSITION_MS)
    spriteFade = THEME_EASE(t)
    const { from, to } = themeFade
    drawRgb[0] = Math.round(from[0] + (to[0] - from[0]) * spriteFade)
    drawRgb[1] = Math.round(from[1] + (to[1] - from[1]) * spriteFade)
    drawRgb[2] = Math.round(from[2] + (to[2] - from[2]) * spriteFade)
    drawColor = `rgb(${drawRgb[0]}, ${drawRgb[1]}, ${drawRgb[2]})`
    if (t >= 1) {
      themeFade = null
      oldBodySprites = []
      drawColor = themeColor
      spriteFade = 1
    }
  }
  renderShadowSprites(themeColor)

  for (const duck of ducks) {
    const spawnFade = Math.min(1, (now - duck.birth) / SPAWN_FADE_MS)
    const shadowAlpha = BODY_ALPHA * spawnFade
    const poseA = footPose(duck.feet[0], now)
    const poseB = footPose(duck.feet[1], now)

    // The body is a heavy mass on an underdamped spring chasing the feet
    // (anchored over them, swaying toward the weighted side): it lags turns,
    // overshoots stops with a small jiggle, and lets the feet visibly lead.
    const sway = duck.weight * STANCE_WIDTH * BODY_SWAY_FACTOR
    const tx =
      (poseA.x + poseB.x) / 2 + Math.cos(duck.heading) * BODY_SETBACK_PX + Math.cos(duck.heading + Math.PI / 2) * sway
    const ty =
      (poseA.y + poseB.y) / 2 + Math.sin(duck.heading) * BODY_SETBACK_PX + Math.sin(duck.heading + Math.PI / 2) * sway
    duck.bodyVX += (BODY_SPRING_K * (tx - duck.bodyX) - BODY_SPRING_DAMP * duck.bodyVX) * dt
    duck.bodyVY += (BODY_SPRING_K * (ty - duck.bodyY) - BODY_SPRING_DAMP * duck.bodyVY) * dt
    duck.bodyX += duck.bodyVX * dt
    duck.bodyY += duck.bodyVY * dt
    const yawDiff = normalizeAngle(duck.heading - duck.bodyYaw)
    duck.bodyYawV += (BODY_YAW_K * yawDiff - BODY_YAW_DAMP * duck.bodyYawV) * dt
    duck.bodyYaw = normalizeAngle(duck.bodyYaw + duck.bodyYawV * dt)

    // Waddle counter-yaw: the rear swings opposite the stepping foot,
    // exaggerated at a slow toddle and damped to a scurry when fleeing.
    const slowGain = Math.min(1, duck.speed / SPEED_SLOW)
    const wobble =
      BODY_WOBBLE_YAW *
      slowGain *
      (1.2 - 0.8 * Math.min(1, duck.speed / SPEED_FAST)) *
      Math.sin((duck.distSinceStep / strideFor(duck.speed)) * Math.PI) *
      duck.stepParity

    // Tail shimmy: a brief decaying yaw oscillation, like ruffling feathers.
    const shimmyT = duck.shimmyStart ? (now - duck.shimmyStart) / SHIMMY_DUR_MS : 1
    const shimmy =
      shimmyT < 1 ? SHIMMY_AMP * Math.sin(shimmyT * Math.PI * 2 * SHIMMY_CYCLES) * (1 - shimmyT) : 0

    // Seen from below, bobbing reads as scale: the body recedes (smaller)
    // mid-swing, presses closer (bigger) on each plant, and breathes at rest.
    const arcMax = Math.max(poseA.arc, poseB.arc)
    const settleMax = Math.max(poseA.settle, poseB.settle)
    const breathe = BREATH_SCALE * (1 - slowGain) * Math.sin((now / 1000) * Math.PI * 2 * BREATH_HZ)
    const bodyScale = 1 + BODY_SQUASH_SCALE * settleMax - BODY_BOB_SCALE * arcMax + breathe

    // Head pose: cross-fade the two nearest baked silhouettes. At this
    // shadow alpha the double-draw compositing error is ~α²/4, invisible.
    // A touch of stabilization counters the body's yaw swing, so the head
    // appears to hold its line while the body waddles under it.
    const headRel = Math.max(
      -HEAD_YAW_MAX,
      Math.min(HEAD_YAW_MAX, duck.headAngle - duck.bodyYawV * HEAD_STABILIZE)
    )
    const poseIdx = (headRel / HEAD_YAW_MAX + 1) * 0.5 * (HEAD_POSES - 1)
    const i0 = Math.floor(poseIdx)
    const i1 = Math.min(HEAD_POSES - 1, i0 + 1)
    const f = poseIdx - i0
    const bodyRot = duck.bodyYaw + wobble + shimmy + duck.lean
    const newAlpha = shadowAlpha * spriteFade
    if (f < 1) paintSprite(bodySprites[i0]!, duck.bodyX, duck.bodyY, bodyRot, newAlpha * (1 - f), bodyScale)
    if (f > 0) paintSprite(bodySprites[i1]!, duck.bodyX, duck.bodyY, bodyRot, newAlpha * f, bodyScale)
    if (spriteFade < 1 && oldBodySprites.length) {
      const oldAlpha = shadowAlpha * (1 - spriteFade)
      if (f < 1) paintSprite(oldBodySprites[i0]!, duck.bodyX, duck.bodyY, bodyRot, oldAlpha * (1 - f), bodyScale)
      if (f > 0) paintSprite(oldBodySprites[i1]!, duck.bodyX, duck.bodyY, bodyRot, oldAlpha * f, bodyScale)
    }

    paintFootPose(duck, duck.feet[0], poseA, spawnFade)
    paintFootPose(duck, duck.feet[1], poseB, spawnFade)
  }
}

function createDuck(x: number, y: number): Duck {
  const heading = Math.random() * Math.PI * 2
  const makeFoot = (side: number): Foot => ({
    side,
    x: x + Math.cos(heading + Math.PI / 2) * STANCE_WIDTH * side + (side > 0 ? Math.cos(heading) * STEP_LENGTH_MIN * 0.5 : 0),
    y: y + Math.sin(heading + Math.PI / 2) * STANCE_WIDTH * side + (side > 0 ? Math.sin(heading) * STEP_LENGTH_MIN * 0.5 : 0),
    heading,
    fromX: 0,
    fromY: 0,
    fromHeading: heading,
    liftStart: 0,
    liftDur: 0,
    landAt: 0
  })
  const feet: [Foot, Foot] = [makeFoot(-1), makeFoot(1)]
  return {
    x,
    y,
    heading,
    wanderTarget: heading,
    wanderTimer: 0,
    gait: 'slow',
    gaitTimer: 0.8 + Math.random() * 1.5,
    speed: 0,
    speedMultiplier: DUCK_SPEED_MULTIPLIER_MIN + Math.random() * (DUCK_SPEED_MULTIPLIER_MAX - DUCK_SPEED_MULTIPLIER_MIN),
    distSinceStep: 0,
    side: -1,
    stepParity: 1,
    weight: 0,
    restSide: 1,
    idleTimer: IDLE_SHIFT_MIN_S,
    bodyX: x + Math.cos(heading) * BODY_SETBACK_PX,
    bodyY: y + Math.sin(heading) * BODY_SETBACK_PX,
    bodyVX: 0,
    bodyVY: 0,
    bodyYaw: heading,
    bodyYawV: 0,
    lean: 0,
    headAngle: 0,
    headTarget: 0,
    headTimer: 0.5 + Math.random() * 2,
    shimmyStart: 0,
    birth: performance.now(),
    feet
  }
}

function tick(now: number) {
  const dt = Math.min((now - lastTime) / 1000, 0.05)
  lastTime = now

  if (now - maskRectCheckedAt > MASK_RECT_REFRESH_MS) {
    maskRectCheckedAt = now
    updateMaskRect()
  }

  for (const d of ducks) step(d, dt, now, cssW, cssH)
  draw(now, dt)
  raf = requestAnimationFrame(tick)
}

function spawnDucks() {
  const margin = edgeMargin.value
  // One duck per horizontal half so the pair never fades in overlapping.
  const halfW = (cssW - margin * 2) / DUCK_COUNT
  for (let i = 0; i < DUCK_COUNT; i++) {
    const x = margin + halfW * i + Math.random() * halfW
    const y = margin + Math.random() * (cssH - margin * 2)
    ducks.push(createDuck(x, y))
  }
}

// Ducks spawn on their own once the browser goes idle after landing, so
// initial render and hydration never compete with the animation loop.
let idleCallbackId = 0
let idleTimeoutId: ReturnType<typeof setTimeout> | undefined

function startMotion() {
  if (!ctx) return
  if (!ducks.length) spawnDucks()
  if (!raf) {
    lastTime = performance.now()
    raf = requestAnimationFrame(tick)
  }
}

// Stops the loop and blanks the canvas; duck state is kept so a later
// start resumes them in place.
function stopMotion() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  if (idleCallbackId) window.cancelIdleCallback(idleCallbackId)
  idleCallbackId = 0
  if (idleTimeoutId) clearTimeout(idleTimeoutId)
  idleTimeoutId = undefined
  ctx?.clearRect(0, 0, cssW, cssH)
}

function scheduleIdleSpawn() {
  resize()
  updateMaskRect()
  if (ducks.length) {
    startMotion()
    return
  }
  if (typeof window.requestIdleCallback === 'function') {
    idleCallbackId = window.requestIdleCallback(() => {
      idleCallbackId = 0
      startMotion()
    }, { timeout: IDLE_SPAWN_TIMEOUT_MS })
    return
  }
  // Safari has no requestIdleCallback; a short delay clears first paint.
  idleTimeoutId = setTimeout(() => {
    idleTimeoutId = undefined
    startMotion()
  }, IDLE_SPAWN_FALLBACK_MS)
}

// Reduced motion can be toggled at runtime (OS setting); stop or resume the
// whole simulation accordingly instead of only gating it at mount.
watch(isReducedMotion, (reduced) => (reduced ? stopMotion() : scheduleIdleSpawn()))

onMounted(() => {
  if (!canvasEl.value) return
  ctx = canvasEl.value.getContext('2d')
  if (!ctx) return
  footPath = new Path2D(FOOT_D)

  themeColor = readColor()
  drawColor = themeColor
  drawRgb = parseColor(themeColor) ?? drawRgb

  themeObserver = new MutationObserver(handleThemeChange)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
  window.addEventListener('pointerup', handlePointerEnd, { passive: true })
  window.addEventListener('pointercancel', handlePointerEnd, { passive: true })

  if (!isReducedMotion.value) scheduleIdleSpawn()
})

onUnmounted(() => {
  stopMotion()
  if (resizeRaf) cancelAnimationFrame(resizeRaf)
  themeObserver?.disconnect()
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerleave', handlePointerLeave)
  window.removeEventListener('pointerup', handlePointerEnd)
  window.removeEventListener('pointercancel', handlePointerEnd)
})
</script>

<template>
  <!-- Always rendered (never v-if'd on the client-only media query) so SSR
       markup matches on hydration; reduced motion just leaves it blank. -->
  <canvas ref="canvasEl" class="DuckFeet" aria-hidden="true" />
</template>

<style scoped lang="scss">
.DuckFeet {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  // Track the visible viewport on mobile (URL bar show/hide) so the CSS box
  // matches the innerHeight-sized backing store without stretching.
  height: 100dvh;
  pointer-events: none;
  z-index: 0;
  display: block;
}
</style>
