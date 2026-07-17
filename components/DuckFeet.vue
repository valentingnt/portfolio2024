<script setup lang="ts">
const isReducedMotion = useReducedMotion()

const MOBILE_BREAKPOINT = 640
const DUCK_COUNT = 2
const IDLE_SPAWN_TIMEOUT_MS = 3000
const IDLE_SPAWN_FALLBACK_MS = 1500
const DUCK_SPEED_MULTIPLIER_MIN = 0.75
const DUCK_SPEED_MULTIPLIER_MAX = 1.35

// Breeding: two adult ducks that linger near each other court for a moment,
// then summon a baby between them. When a birth pushes the flock past the
// cap, the oldest duck walks off-screen and despawns.
const POP_CAP = 14
const BREED_RADIUS = 70
const BREED_BREAK_RADIUS = BREED_RADIUS * 1.5
const COURT_STOP_DIST = 34
const COURT_MIN_S = 2.2
const COURT_RANGE_S = 1.8
const COURT_TURN_RATE = 3
const BREED_COOLDOWN_MIN_S = 18
const BREED_COOLDOWN_RANGE_S = 20
const FIRST_BREED_DELAY_MIN_S = 4
const FIRST_BREED_DELAY_RANGE_S = 6
// Past the viewport by this much (covers the spring-lagged body trailing the
// feet), a departing duck is removed.
const DESPAWN_MARGIN_PX = 150

// Babies grow in randomized spurts: the body holds a size, swells over a few
// seconds, holds again — while the feet stay adult-sized throughout.
const BABY_BODY_SCALE = 0.38
const GROW_TOTAL_MIN_S = 50
const GROW_TOTAL_RANGE_S = 70
const GROW_SPURTS_MIN = 3
const GROW_SPURTS_MAX = 5
const GROW_SPURT_DUR_MIN_S = 2
const GROW_SPURT_DUR_RANGE_S = 3

// Each generation of inbreeding raises the odds and severity of
// malformations: a third leg, a twin head, double beaks, lumpy bodies,
// dwarf/giant adult sizes.
const MUTATION_CHANCE_PER_GEN = 0.22
const MUTATION_MAX_CHANCE = 0.9
const MAX_TRAITS = 2
const TRAIT_INHERIT_CHANCE = 0.35
const SECOND_TRAIT_CHANCE_PER_GEN = 0.15
const SECOND_TRAIT_CHANCE_MAX = 0.65
const THIRD_FOOT_SETBACK_PX = 16
const THIRD_FOOT_JITTER_PX = 3
const REAR_LEG_SETBACK_PX = 18
const REAR_LEG_STANCE_FACTOR = 1.7
const ONE_FOOT_STANCE_FACTOR = 0.15
const CLUB_FOOT_LEAD_FACTOR = 0.35
const CLUB_FOOT_SWING_FACTOR = 2.2
const TREMOR_JITTER_MUL = 9
const TREMOR_SHIMMY_CHANCE = 0.9
const NARCOLEPSY_CHANCE = 0.25
const NARCOLEPSY_MIN_S = 5
const NARCOLEPSY_RANGE_S = 3
const TWITCH_GLANCE_FACTOR = 0.12
const FEARLESS_STOP_DIST_PX = 26

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

// Sleepy mode: while the dark theme is active the flock ambles slower, stops
// more, tucks its heads and drifts a faint "Zzz". Idle doze: after a spell
// with no pointer/scroll/key input the flock gathers into a loose ring and
// beds down; the first interaction wakes it.
const SLEEPY_SPEED_FACTOR = 0.55
const SLEEPY_STOP_CHANCE = 0.6 // replaces GAIT_STOP_CHANCE when sleepy
const SLEEPY_SLOW_CHANCE = 0.35 // replaces GAIT_SLOW_CHANCE when sleepy
const SLEEPY_STOP_DUR_MUL = 2.5 // stops linger longer when sleepy
const TUCK_HEAD_DIST = 0.12 // head sunk into the breast (same as the noNeck look)
const TUCK_RATE = 1.5 // per-second ease of a duck's tuck toward its target
const TUCK_SPRITE_INDEX = HEAD_POSES // tucked frame appended after the pose frames
const DOZE_IDLE_MS = 30000
const GATHER_ARRIVE_DIST = 16 // to the duck's own rally slot, not the centroid
const GATHER_TIMEOUT_MS = 15000 // circlers/limpers may never arrive; force doze
const GATHER_RING_R_MIN = 18 // rally slots ring outward so ducks don't stack
const GATHER_RING_R_STEP = 10
const ZZZ_MAX = 12
const ZZZ_SPAWN_MIN_S = 2
const ZZZ_SPAWN_RANGE_S = 1.5
const ZZZ_LIFE_MS = 2200
const ZZZ_RISE_PX = 26
const ZZZ_SWAY_PX = 4
const ZZZ_ALPHA = 0.28
const ZZZ_FONT = '11px "DM Mono", monospace'

// "quack" stampede: a hidden key sequence sends a transient herd thundering
// across the viewport, the resident flock scattering in brief panic.
const STAMPEDE_WORD = 'quack'
const STAMPEDE_COUNT_MIN = 12
const STAMPEDE_COUNT_RANGE = 4
const STAMPEDE_SPEED_MUL = 2.75
// Panic reads mechanical if the herd moves as one: each runner gets its own
// pace around the base multiplier, its own step phase, and a personal weave
// around its line (phase-offset sinusoid) so nobody strides in lockstep.
const STAMPEDE_SPEED_JITTER = 0.4
const STAMPEDE_LANE_JITTER_RAD = 0.12
const STAMPEDE_WEAVE_RAD = 0.09
const STAMPEDE_WEAVE_HZ = 0.7
const STAMPEDE_SPACING_PX = 42
const STAMPEDE_PANIC_S = 2

// Seasonal micro-touches. The season is sampled once at mount (sessions are
// short), so nothing pays a per-frame date cost.
const HAT_LENGTH_PX = 15
const HAT_BASE_PX = 11
const HAT_ALPHA_MAX = 0.45
const HAT_ALPHA_MUL = 3.5
const HAT_STRIPES = 2
// Hat geometry in unit-length space (scaled to HAT_LENGTH_PX at paint time).
const HAT_UNIT_HALF = HAT_BASE_PX / HAT_LENGTH_PX / 2
const SNOW_COUNT_DESKTOP = 40
const SNOW_COUNT_MOBILE = 24
const SNOW_SPEED_MIN = 12
const SNOW_SPEED_RANGE = 18
const SNOW_SWAY_PX = 14
const SNOW_SWAY_HZ = 0.15
const SNOW_R_MIN = 1
const SNOW_R_RANGE = 1.2
const SNOW_ALPHA = 0.18
const TRAIL_MAX = 130
const TRAIL_LIFE_MS = 6000
const TRAIL_ALPHA = 0.1
const LEAF_COUNT_MIN = 5
const LEAF_COUNT_RANGE = 4
const LEAF_ALPHA = 0.16
const LEAF_STUMBLE_DIST = 12
const LEAF_COOLDOWN_MS = 6000
const LEAF_KICK_YAW = 1.6
const LEAF_NUDGE_PX = 6
// A small leaf blade (two curved sides meeting at a point) plus a stub stem,
// hand-authored like FOOT_D; ~24 units tall, scaled down at paint time.
const LEAF_D = 'M12,0 C18,6 18,16 12,24 C6,16 6,6 12,0 Z M12,10 L12,24'
const LEAF_SCALE = 0.6

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
  side: number // -1 left, 1 right, 0 = mutant center leg (unmirrored, no toe-out)
  x: number
  y: number
  heading: number
  fromX: number
  fromY: number
  fromHeading: number
  liftStart: number
  liftDur: number
  landAt: number
  missing: boolean // 'oneFoot': never painted; the real foot pogo-hops instead
  backwards: boolean // 'backwardsFoot': painted rotated 180°
  scaleMul: number // 'mismatchedFeet': paint scale for this foot
}

type Gait = 'stop' | 'slow' | 'fast'

// Every way a duck can come out wrong. Rolled at birth (at most MAX_TRAITS
// per duck), sometimes inherited straight from a parent. Traits that
// contradict each other declare excludes; fusedTwins is dramatic enough to
// fill both slots on its own.
type TraitId =
  | 'extraLeg' | 'oneFoot' | 'fourLegs' | 'clubFoot' | 'backwardsFoot' | 'mismatchedFeet'
  | 'extraHead' | 'doubleBeak' | 'swollenHead' | 'vestigialHead' | 'owlNeck' | 'twitchyHead' | 'longNeck' | 'noNeck'
  | 'lumpy' | 'dwarfGiant' | 'fusedTwins' | 'tailHeavy' | 'asymmetric'
  | 'circler' | 'reverseWalker' | 'tremor' | 'fearless' | 'narcoleptic' | 'speedExtreme'

interface TraitDef {
  id: TraitId
  weight: number
  minGen?: number
  solo?: boolean
  excludes?: TraitId[]
}

const TRAIT_DEFS: TraitDef[] = [
  { id: 'extraLeg', weight: 1, excludes: ['oneFoot', 'fourLegs'] },
  { id: 'oneFoot', weight: 1, excludes: ['extraLeg', 'fourLegs', 'clubFoot', 'backwardsFoot', 'mismatchedFeet'] },
  { id: 'fourLegs', weight: 0.8, minGen: 3, excludes: ['extraLeg', 'oneFoot'] },
  { id: 'clubFoot', weight: 1 },
  { id: 'backwardsFoot', weight: 1 },
  { id: 'mismatchedFeet', weight: 1 },
  { id: 'extraHead', weight: 1 },
  { id: 'doubleBeak', weight: 1 },
  { id: 'swollenHead', weight: 1 },
  { id: 'vestigialHead', weight: 0.8 },
  { id: 'owlNeck', weight: 0.8 },
  { id: 'twitchyHead', weight: 1 },
  { id: 'longNeck', weight: 1, excludes: ['noNeck'] },
  { id: 'noNeck', weight: 1, excludes: ['longNeck'] },
  { id: 'lumpy', weight: 1 },
  { id: 'dwarfGiant', weight: 1 },
  { id: 'fusedTwins', weight: 0.35, minGen: 4, solo: true },
  { id: 'tailHeavy', weight: 1 },
  { id: 'asymmetric', weight: 1 },
  { id: 'circler', weight: 1 },
  { id: 'reverseWalker', weight: 0.8 },
  { id: 'tremor', weight: 1 },
  { id: 'fearless', weight: 1 },
  { id: 'narcoleptic', weight: 1 },
  { id: 'speedExtreme', weight: 1 }
]

interface Mutations {
  seed: number // drives the deterministic silhouette bake
  traits: TraitId[]
  lumpiness: number // 0..1 ('lumpy'), deforms the body silhouette
  sizeScale: number // adult body size multiplier ('dwarfGiant'; feet unaffected)
  headYawMax: number // head swing range ('owlNeck' widens it)
  turnBias: number // rad/s steering bias ('circler')
  oddFootSide: number // -1 | 1: foot hit by oneFoot/clubFoot/backwardsFoot/mismatchedFeet
  oddFootScale: number // paint scale of that foot ('mismatchedFeet')
  speedMul: number // 0 = normal random multiplier; 'speedExtreme' overrides
}

function hasTrait(m: Mutations | null, t: TraitId): boolean {
  return m !== null && m.traits.includes(t)
}

interface GrowthSpurt {
  at: number // seconds after birth
  dur: number
  from: number
  to: number
}

interface Growth {
  spurts: GrowthSpurt[]
  adultScale: number
}

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
  generation: number
  bodyScale: number // current body scale; grows toward mutations?.sizeScale ?? 1
  growth: Growth | null // null once adult
  breedReadyAt: number
  mate: Duck | null
  courtUntil: number
  departing: boolean
  stampeding: boolean // part of a "quack" herd: runs its line off-screen
  stampedeHeading: number // the runner's base line; it weaves around this
  stampedePhase: number // personal phase so no two runners weave in step
  tuck: number // 0..1 eased head-tuck; crossfades pose sprites → tucked sprite
  zzzAt: number // next Zzz emission time while dozing
  gatherX: number // per-duck rally slot so a dozing flock beds down in a ring
  gatherY: number
  mutations: Mutations | null // null = normal duck (shares the common sprite set)
  headYawMax: number // per-duck head swing range ('owlNeck')
  turnBias: number // rad/s steering bias ('circler')
  thirdFootIn: number // main-cycle steps until the mutant center leg replants
  feet: Foot[] // [left, right], then optional mutant feet (center leg or rear pair)
}

interface ThemeFade {
  from: [number, number, number]
  to: [number, number, number]
  start: number
}

// Deterministic PRNG: a mutant's silhouette must re-bake identically after a
// theme change, so its deformities are derived from a per-duck seed.
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
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
watchScroll(
  () => {
    updateMaskRect()
    noteInteraction()
  },
  { defer: true, enabled: computed(() => !isReducedMotion.value) }
)

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

// Alpha multiplier for small props (leaves, hats, Zzz) that just dim behind
// the glass with a single draw, instead of the bodies' two-pass frosted look.
function maskDim(x: number, y: number): number {
  return 1 - maskFactor(x, y) * (1 - MASK_OPACITY_FACTOR)
}

let ctx: CanvasRenderingContext2D | null = null
let footPath: Path2D | null = null
const ducks: Duck[] = []
let raf = 0
let lastTime = 0
const mouse = { x: -9999, y: -9999 }

// Sleepy/doze state. isSleepyTheme mirrors the dark theme; flockMode drives the
// idle gather→doze→wake cycle; lastInteractionAt is refreshed by any pointer,
// scroll or key input.
let isSleepyTheme = false
type FlockMode = 'active' | 'gathering' | 'dozing'
let flockMode: FlockMode = 'active'
let gatherStartedAt = 0
let lastInteractionAt = 0
interface Zzz {
  x: number
  y: number
  born: number
  phase: number
}
const zzzs: Zzz[] = []

// "quack" stampede state. A stampede is active while stampederCount > 0.
let keyBuffer = ''
let stampederCount = 0

// Seasonal flags, sampled once at mount.
let seasonParty = false // Aug 1: party hats
let seasonSnow = false // December: snowfall + frosted footprint trails
let seasonAutumn = false // Sep–Nov: fallen leaves ducks trip over
interface Flake {
  x: number
  y: number
  speed: number
  r: number
  phase: number
}
const flakes: Flake[] = []
interface TrailPrint {
  x: number
  y: number
  heading: number
  side: number
  scaleMul: number
  backwards: boolean
  at: number
}
const trail: TrailPrint[] = []
interface Leaf {
  x: number
  y: number
  rot: number
  cooldownUntil: number
}
const leaves: Leaf[] = []
let leafPath: Path2D | null = null
let hatConePath: Path2D | null = null
let hatStripesPath: Path2D | null = null

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
  oldSpriteCache = spriteCache
  spriteCache = new Map()
  if (!target) {
    themeFade = null
    oldSpriteCache = new Map()
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

  // Seasonal props were scattered for the old viewport; re-scatter so leaves
  // don't sit off-canvas (unreachable by clamped ducks) or clustered in one
  // corner, and snow covers the new area at the right density.
  if (flakes.length) {
    flakes.length = 0
    spawnFlakes()
  }
  if (leaves.length) {
    leaves.length = 0
    spawnLeaves()
  }
}

function handleResize() {
  if (resizeRaf) return
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0
    resize()
    updateMaskRect()
  })
}

// Any pointer/scroll/key input refreshes the doze timer, and wakes a dozing
// flock on the spot.
function noteInteraction() {
  lastInteractionAt = performance.now()
  if (flockMode !== 'active') wake(performance.now())
}

function wake(now: number) {
  if (flockMode === 'active') return
  flockMode = 'active'
  for (const d of ducks) {
    if (d.departing || d.stampeding) continue
    d.shimmyStart = now // a brief ruffle on waking
    d.gaitTimer = 0 // re-pick a gait immediately
  }
}

function handlePointerMove(e: PointerEvent) {
  noteInteraction()
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
  noteInteraction()
  if (e.pointerType !== 'mouse') handlePointerLeave()
}

// Rolling buffer over single-character keys; typing the secret word sends a
// herd stampeding. Ignores typing into form fields.
function handleKeydown(e: KeyboardEvent) {
  noteInteraction()
  const t = e.target as HTMLElement | null
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
  if (e.key.length !== 1) return
  keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-STAMPEDE_WORD.length)
  if (keyBuffer === STAMPEDE_WORD) {
    keyBuffer = ''
    triggerStampede()
  }
}

function pickGait(d: Duck) {
  // 'narcoleptic': a fair chance to simply shut down for a long beat.
  if (hasTrait(d.mutations, 'narcoleptic') && Math.random() < NARCOLEPSY_CHANCE) {
    d.gait = 'stop'
    d.gaitTimer = NARCOLEPSY_MIN_S + Math.random() * NARCOLEPSY_RANGE_S
    return
  }
  // Sleepy dark-theme ducks stop more and dawdle longer between moves.
  const stopChance = isSleepyTheme ? SLEEPY_STOP_CHANCE : GAIT_STOP_CHANCE
  const slowChance = isSleepyTheme ? SLEEPY_SLOW_CHANCE : GAIT_SLOW_CHANCE
  if (d.gait === 'stop') {
    d.gait = Math.random() < GAIT_RESUME_SLOW_CHANCE ? 'slow' : 'fast'
  } else {
    const r = Math.random()
    d.gait = r < stopChance ? 'stop' : r < stopChance + slowChance ? 'slow' : 'fast'
  }
  if (d.gait === 'stop') d.gaitTimer = (STOP_MIN_S + Math.random() * STOP_RANGE_S) * (isSleepyTheme ? SLEEPY_STOP_DUR_MUL : 1)
  else if (d.gait === 'slow') d.gaitTimer = SLOW_MIN_S + Math.random() * SLOW_RANGE_S
  else d.gaitTimer = FAST_MIN_S + Math.random() * FAST_RANGE_S
}

function plantStep(d: Duck, now: number, stride: number) {
  d.distSinceStep -= stride
  let foot = d.feet[d.side > 0 ? 1 : 0]!
  // 'oneFoot': the absent side's step lands on the only real foot instead,
  // so the duck pogo-hops on it at every half-cycle.
  if (foot.missing) foot = d.feet[foot.side > 0 ? 0 : 1]!

  const stance =
    STANCE_WIDTH *
    (hasTrait(d.mutations, 'oneFoot') ? ONE_FOOT_STANCE_FACTOR : 1) *
    d.bodyScale *
    (1 - STANCE_JITTER / 2 + Math.random() * STANCE_JITTER)
  const club = hasTrait(d.mutations, 'clubFoot') && foot.side === d.mutations!.oddFootSide
  const lead = stride * STEP_LEAD_FACTOR * (0.9 + Math.random() * 0.2) * (club ? CLUB_FOOT_LEAD_FACTOR : 1)
  // Feet point slightly into the upcoming turn instead of along the current
  // heading, so direction changes read as intentional rather than sliding.
  const turn = normalizeAngle(d.wanderTarget - d.heading)
  const anticipation =
    Math.max(-TURN_ANTICIPATION_MAX, Math.min(TURN_ANTICIPATION_MAX, turn)) * TURN_ANTICIPATION_FACTOR

  foot.fromX = foot.x
  foot.fromY = foot.y
  foot.fromHeading = foot.heading
  // December: leave a frosted print at the spot the foot just lifted from, to
  // slowly fade behind the flock. Main pair only, to bound the draw cost.
  if (seasonSnow) {
    if (trail.length >= TRAIL_MAX) trail.shift()
    trail.push({ x: foot.fromX, y: foot.fromY, heading: foot.fromHeading, side: foot.side, scaleMul: foot.scaleMul, backwards: foot.backwards, at: now })
  }
  foot.x = d.x + Math.cos(d.heading + Math.PI / 2) * stance * foot.side + Math.cos(d.heading) * lead
  foot.y = d.y + Math.sin(d.heading + Math.PI / 2) * stance * foot.side + Math.sin(d.heading) * lead
  foot.heading = d.heading + anticipation + (Math.random() * 2 - 1) * FOOTFALL_JITTER
  foot.liftStart = now
  // Swing takes ~65% of the step interval, keeping each foot planted for
  // most of the cycle like a real gait.
  foot.liftDur = Math.max(LIFT_DUR_MIN_MS, Math.min(LIFT_DUR_MAX_MS, (stride / Math.max(d.speed, 1)) * 650))
  // 'clubFoot': the bad side swings slow and short — an unmistakable limp.
  if (club) foot.liftDur *= CLUB_FOOT_SWING_FACTOR
  d.side *= -1
  d.stepParity *= -1

  // 'fourLegs': the rear pair steps half a cycle out of phase with the front
  // (front-left plants together with rear-right) for an insectoid scuttle.
  if (hasTrait(d.mutations, 'fourLegs')) {
    const rear = d.feet[foot.side > 0 ? 2 : 3]
    if (rear) {
      rear.fromX = rear.x
      rear.fromY = rear.y
      rear.fromHeading = rear.heading
      rear.x =
        d.x +
        Math.cos(d.heading + Math.PI / 2) * stance * REAR_LEG_STANCE_FACTOR * rear.side -
        Math.cos(d.heading) * (REAR_LEG_SETBACK_PX * d.bodyScale - lead * 0.5)
      rear.y =
        d.y +
        Math.sin(d.heading + Math.PI / 2) * stance * REAR_LEG_STANCE_FACTOR * rear.side -
        Math.sin(d.heading) * (REAR_LEG_SETBACK_PX * d.bodyScale - lead * 0.5)
      rear.heading = d.heading + (Math.random() * 2 - 1) * FOOTFALL_JITTER * 2
      rear.liftStart = now
      rear.liftDur = foot.liftDur
    }
  }

  // Mutant third leg: not part of the L/R alternation — it drags behind the
  // center-rear and hops forward every couple of main steps, a hitching gait.
  const third = hasTrait(d.mutations, 'extraLeg') ? d.feet[2] : undefined
  if (third && --d.thirdFootIn <= 0) {
    d.thirdFootIn = 2 + Math.floor(Math.random() * 2)
    third.fromX = third.x
    third.fromY = third.y
    third.fromHeading = third.heading
    third.x = d.x - Math.cos(d.heading) * THIRD_FOOT_SETBACK_PX * d.bodyScale + (Math.random() * 2 - 1) * THIRD_FOOT_JITTER_PX
    third.y = d.y - Math.sin(d.heading) * THIRD_FOOT_SETBACK_PX * d.bodyScale + (Math.random() * 2 - 1) * THIRD_FOOT_JITTER_PX
    third.heading = d.heading + (Math.random() * 2 - 1) * FOOTFALL_JITTER * 3
    third.liftStart = now
    third.liftDur = LIFT_DUR_MIN_MS + Math.random() * 80
  }
}

function shuffleFoot(d: Duck, now: number) {
  let foot = d.feet[d.restSide > 0 ? 0 : 1]!
  if (foot.missing) foot = d.feet[foot.side > 0 ? 0 : 1]!
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

// Feet never scale, but a small body walks on a narrower stance with shorter
// steps so the gait still reads right.
function duckStride(d: Duck) {
  return strideFor(d.speed) * Math.max(0.6, Math.min(1.25, 0.55 + 0.45 * d.bodyScale))
}

function traitAllowed(t: TraitId, existing: TraitId[], generation: number): boolean {
  const def = TRAIT_DEFS.find((d) => d.id === t)
  if (!def) return false
  if (existing.includes(t)) return false
  if (def.minGen && generation < def.minGen) return false
  if (def.solo && existing.length > 0) return false
  if (existing.some((e) => TRAIT_DEFS.find((d) => d.id === e)?.solo)) return false
  if (def.excludes?.some((e) => existing.includes(e))) return false
  if (existing.some((e) => TRAIT_DEFS.find((d) => d.id === e)?.excludes?.includes(t))) return false
  return true
}

function pickTrait(existing: TraitId[], generation: number): TraitId | null {
  const candidates = TRAIT_DEFS.filter((d) => traitAllowed(d.id, existing, generation))
  const total = candidates.reduce((sum, d) => sum + d.weight, 0)
  if (!total) return null
  let r = Math.random() * total
  for (const d of candidates) {
    r -= d.weight
    if (r <= 0) return d.id
  }
  return candidates[candidates.length - 1]!.id
}

function rollMutations(generation: number, pa: Mutations | null = null, pb: Mutations | null = null): Mutations | null {
  const traits: TraitId[] = []
  // Hereditary decay: each parent deformity may pass straight down before
  // any fresh roll happens, so malformations compound along a bloodline.
  for (const parent of [pa, pb]) {
    for (const t of parent?.traits ?? []) {
      if (traits.length >= MAX_TRAITS) break
      if (Math.random() < TRAIT_INHERIT_CHANCE && traitAllowed(t, traits, generation)) traits.push(t)
    }
  }
  const chance = Math.min(MUTATION_MAX_CHANCE, (generation - 1) * MUTATION_CHANCE_PER_GEN)
  if (!traits.length && Math.random() >= chance) return null
  const wantTwo =
    Math.random() < Math.min(SECOND_TRAIT_CHANCE_MAX, Math.max(0, generation - 2) * SECOND_TRAIT_CHANCE_PER_GEN)
  const target = Math.min(MAX_TRAITS, Math.max(traits.length, wantTwo ? 2 : 1))
  while (traits.length < target) {
    const t = pickTrait(traits, generation)
    if (!t) break
    traits.push(t)
  }
  if (!traits.length) return null

  const severity = Math.min(1, generation / 6)
  const m: Mutations = {
    seed: (Math.random() * 0xffffffff) >>> 0,
    traits,
    lumpiness: 0,
    sizeScale: 1,
    headYawMax: HEAD_YAW_MAX,
    turnBias: 0,
    oddFootSide: Math.random() < 0.5 ? -1 : 1,
    oddFootScale: 1,
    speedMul: 0
  }
  if (traits.includes('lumpy')) m.lumpiness = Math.min(1, 0.35 + Math.random() * 0.65 * (0.5 + severity))
  if (traits.includes('dwarfGiant')) {
    const spread = 0.15 + Math.random() * (0.1 + 0.25 * severity)
    m.sizeScale = Math.max(0.6, Math.min(1.45, Math.random() < 0.5 ? 1 - spread : 1 + spread * 1.4))
  }
  if (traits.includes('owlNeck')) m.headYawMax = HEAD_YAW_MAX * (1.9 + Math.random() * 0.4)
  if (traits.includes('circler')) m.turnBias = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.35)
  if (traits.includes('mismatchedFeet'))
    m.oddFootScale = Math.random() < 0.5 ? 1.5 + Math.random() * 0.4 : 0.5 + Math.random() * 0.15
  if (traits.includes('speedExtreme'))
    m.speedMul = Math.random() < 0.5 ? 0.3 + Math.random() * 0.15 : 1.8 + Math.random() * 0.4
  return m
}

// Heavily malformed ducks (both trait slots used) are sterile hybrids — a
// natural brake on late-generation chaos.
function isSterile(d: Duck): boolean {
  return d.mutations !== null && (d.mutations.traits.length >= MAX_TRAITS || hasTrait(d.mutations, 'fusedTwins'))
}

// Growth happens in a few discrete spurts at random moments: the body holds
// its size, swells over a few seconds, holds again — instead of a linear
// tween from baby to adult.
function makeGrowth(adultScale: number): Growth {
  const total = GROW_TOTAL_MIN_S + Math.random() * GROW_TOTAL_RANGE_S
  const count = GROW_SPURTS_MIN + Math.floor(Math.random() * (GROW_SPURTS_MAX - GROW_SPURTS_MIN + 1))
  const start = BABY_BODY_SCALE * adultScale
  const onsets = Array.from({ length: count }, () => total * (0.05 + Math.random() * 0.9)).sort((a, b) => a - b)
  const weights = Array.from({ length: count }, () => 0.4 + Math.random())
  const weightSum = weights.reduce((sum, v) => sum + v, 0)
  const spurts: GrowthSpurt[] = []
  let from = start
  let minAt = 0
  for (let i = 0; i < count; i++) {
    const dur = GROW_SPURT_DUR_MIN_S + Math.random() * GROW_SPURT_DUR_RANGE_S
    // Nudge overlapping onsets apart so the piecewise evaluation stays simple.
    const at = Math.max(onsets[i]!, minAt)
    const to = i === count - 1 ? adultScale : from + (adultScale - start) * (weights[i]! / weightSum)
    spurts.push({ at, dur, from, to })
    from = to
    minAt = at + dur + 0.5
  }
  return { spurts, adultScale }
}

function updateGrowth(d: Duck, now: number) {
  const g = d.growth!
  const age = (now - d.birth) / 1000
  const last = g.spurts[g.spurts.length - 1]!
  if (age >= last.at + last.dur) {
    d.bodyScale = g.adultScale
    d.growth = null
    // Freshly matured adults wait out a full cooldown before breeding.
    d.breedReadyAt = now + (BREED_COOLDOWN_MIN_S + Math.random() * BREED_COOLDOWN_RANGE_S) * 1000
    return
  }
  let scale = g.spurts[0]!.from
  for (const s of g.spurts) {
    if (age >= s.at + s.dur) {
      scale = s.to
      continue
    }
    if (age > s.at) scale = s.from + (s.to - s.from) * smoothstep((age - s.at) / s.dur)
    break
  }
  d.bodyScale = scale
}

function cancelCourtship(d: Duck, now: number) {
  const partner = d.mate
  d.mate = null
  d.courtUntil = 0
  // Short re-check delay so a broken-off pair doesn't instantly re-pair.
  d.breedReadyAt = Math.max(d.breedReadyAt, now + 2500)
  if (partner) {
    partner.mate = null
    partner.courtUntil = 0
    partner.breedReadyAt = Math.max(partner.breedReadyAt, now + 2500)
  }
}

function step(d: Duck, dt: number, now: number, W: number, H: number) {
  const dxm = d.x - mouse.x
  const dym = d.y - mouse.y
  const distm = Math.hypot(dxm, dym)

  if (d.growth) updateGrowth(d, now)

  if (d.stampeding) {
    // Stampeders own their steering every frame, so flee, wander, edges, the
    // sleepy bias and leaf stumbles can never turn them back mid-screen. They
    // aren't rails though: each weaves around its base line on its own phase
    // (the existing wander-ease smooths the turns into it).
    d.gait = 'fast'
    d.gaitTimer = 1
    const t = now / 1000 + d.stampedePhase
    d.wanderTarget = d.stampedeHeading + Math.sin(t * Math.PI * 2 * STAMPEDE_WEAVE_HZ) * STAMPEDE_WEAVE_RAD
    d.wanderTimer = 1
  } else if (d.departing) {
    // Elders leave: march straight for the nearest edge, deaf to the mouse,
    // wander whims and the edge-avoidance that would turn them back.
    const exit =
      Math.min(d.x, W - d.x) < Math.min(d.y, H - d.y)
        ? d.x < W - d.x ? Math.PI : 0
        : d.y < H - d.y ? -Math.PI / 2 : Math.PI / 2
    d.wanderTarget = exit
    d.wanderTimer = 1
    d.gait = 'fast'
    d.gaitTimer = 1
  } else if (flockMode !== 'active') {
    // Idle doze: amble to the assigned rally slot and bed down there.
    const toSlot = Math.atan2(d.gatherY - d.y, d.gatherX - d.x)
    const slotDist = Math.hypot(d.gatherX - d.x, d.gatherY - d.y)
    const arrived = slotDist < GATHER_ARRIVE_DIST || flockMode === 'dozing'
    d.gait = arrived ? 'stop' : 'slow'
    d.gaitTimer = 0.5
    d.wanderTarget = arrived ? d.heading : toSlot
    d.wanderTimer = 1
    if (!arrived) d.heading += normalizeAngle(toSlot - d.heading) * Math.min(1, COURT_TURN_RATE * dt)
  } else if (d.mate) {
    // Courtship: sidle up to the partner, stop close, face and watch them.
    const toMate = Math.atan2(d.mate.y - d.y, d.mate.x - d.x)
    const mateDist = Math.hypot(d.mate.x - d.x, d.mate.y - d.y)
    d.gait = mateDist > COURT_STOP_DIST ? 'slow' : 'stop'
    d.gaitTimer = 0.5
    d.wanderTarget = toMate
    d.wanderTimer = 1
    d.heading += normalizeAngle(toMate - d.heading) * Math.min(1, COURT_TURN_RATE * dt)
    d.headTarget = Math.max(-HEAD_YAW_MAX, Math.min(HEAD_YAW_MAX, normalizeAngle(toMate - d.heading)))
    d.headTimer = 0.8
  }

  d.gaitTimer -= dt
  if (d.gaitTimer <= 0) pickGait(d)
  // Sleepy dark-theme ambling is slower, but a startled flee (which sets speed
  // directly below) and stampeders are never slowed.
  const sleepyMul = isSleepyTheme && !d.departing && !d.stampeding ? SLEEPY_SPEED_FACTOR : 1
  const targetSpeed = d.gait === 'stop' ? 0 : (d.gait === 'slow' ? SPEED_SLOW : SPEED_FAST) * d.speedMultiplier * sleepyMul
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
    // 'circler': a permanent steering bias — this duck can only really turn
    // one way and lives its life in loops.
    if (d.turnBias) d.wanderTarget += d.turnBias * dt
    const wanderDiff = normalizeAngle(d.wanderTarget - d.heading)
    d.heading += wanderDiff * Math.min(1, WANDER_TURN_EASE * dt)
    // Stampeders keep a dead-straight panic line; everyone else gets jitter.
    if (!d.stampeding) {
      d.heading +=
        (Math.random() - 0.5) * WANDER_JITTER * (hasTrait(d.mutations, 'tremor') ? TREMOR_JITTER_MUL : 1) * dt
    }
  }

  // Flee/curiosity only while awake — a stale cursor position from before the
  // flock dozed must not spook a sleeping duck. Stampeders ignore the cursor.
  const canReactToMouse = flockMode === 'active' && !d.departing && !d.stampeding
  // 'fearless': the flee reflex is inverted — the cursor is fascinating,
  // walk right up to it and stop just short.
  if (hasTrait(d.mutations, 'fearless')) {
    if (canReactToMouse && !d.mate && distm < CURIOUS_RADIUS && distm > FEARLESS_STOP_DIST_PX) {
      d.wanderTarget = Math.atan2(-dym, -dxm)
      d.wanderTimer = 0.5
    }
  } else if (canReactToMouse && distm < FLEE_RADIUS) {
    if (d.mate) cancelCourtship(d, now)
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
  if (!d.departing && !d.stampeding && distToEdge < edgeMargin.value) {
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

  const stride = duckStride(d)

  // Waddle: the path weaves side to side in sync with the step cycle, fading
  // out as the duck slows so it never wobbles in place.
  const waddle =
    d.speed > 0
      ? WADDLE_YAW * Math.sin((d.distSinceStep / stride) * Math.PI) * d.stepParity * Math.min(1, d.speed / SPEED_SLOW)
      : 0
  d.x += Math.cos(d.heading + waddle) * d.speed * dt
  d.y += Math.sin(d.heading + waddle) * d.speed * dt
  // Departing elders and stampeders must be free to walk off the edge.
  if (!d.departing && !d.stampeding) {
    d.x = Math.max(8, Math.min(W - 8, d.x))
    d.y = Math.max(8, Math.min(H - 8, d.y))
  }

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
      if (Math.random() < (hasTrait(d.mutations, 'tremor') ? TREMOR_SHIMMY_CHANCE : SHIMMY_CHANCE)) d.shimmyStart = now
    }
  } else {
    d.restSide = -d.side
    d.idleTimer = IDLE_SHIFT_MIN_S
  }

  // Curious lean: a stopped duck notices a cursor hovering nearby — outside
  // flee range — and tilts its body a few degrees toward it. Gated like flee
  // so a duck dozing near a parked cursor doesn't twist toward it in its sleep.
  const leanTarget =
    canReactToMouse && d.speed === 0 && distm > FLEE_RADIUS && distm < CURIOUS_RADIUS
      ? Math.max(-CURIOUS_LEAN_MAX, Math.min(CURIOUS_LEAN_MAX, normalizeAngle(Math.atan2(-dym, -dxm) - d.heading)))
      : 0
  d.lean += (leanTarget - d.lean) * Math.min(1, CURIOUS_EASE * dt)

  // Head glances: quick look-arounds on a random timer, often returning to
  // centre. The head also turns into a curious lean further than the body.
  d.headTimer -= dt
  if (d.headTimer <= 0) {
    d.headTarget =
      Math.random() < HEAD_GLANCE_CENTER_CHANCE ? 0 : (Math.random() * 2 - 1) * d.headYawMax * 0.9
    // 'twitchyHead': glances land at a paranoid, near-constant rate.
    d.headTimer =
      (HEAD_GLANCE_MIN_S + Math.random() * HEAD_GLANCE_RANGE_S) *
      (hasTrait(d.mutations, 'twitchyHead') ? TWITCH_GLANCE_FACTOR : 1)
  }
  const headGoal = Math.max(
    -d.headYawMax,
    Math.min(d.headYawMax, d.headTarget + d.lean * HEAD_LEAN_FACTOR)
  )
  d.headAngle += (headGoal - d.headAngle) * Math.min(1, HEAD_TURN_RATE * dt)

  // Head tuck: full when dozing, partial when standing still in the dark
  // theme. Eased so it settles in and out over the theme fade rather than
  // snapping.
  const wantsTuck =
    (flockMode !== 'active' && d.gait === 'stop') ||
    (isSleepyTheme && d.speed === 0 && !d.mate && !d.departing && !d.stampeding)
  d.tuck += ((wantsTuck ? 1 : 0) - d.tuck) * Math.min(1, TUCK_RATE * dt)

  // Autumn: a duck at a decent clip that clips a fallen leaf trips — a forced
  // stop, a ruffle, and a yaw kick the underdamped body spring turns into a
  // stumble. Per-leaf cooldown keeps it from looping on the same leaf.
  if (seasonAutumn && !d.departing && !d.stampeding && d.speed > SPEED_SLOW * 0.5) {
    for (const leaf of leaves) {
      if (now < leaf.cooldownUntil) continue
      if (Math.hypot(d.x - leaf.x, d.y - leaf.y) > LEAF_STUMBLE_DIST) continue
      d.gait = 'stop'
      d.gaitTimer = 0.5 + Math.random() * 0.5
      d.shimmyStart = now
      d.bodyYawV += (Math.random() < 0.5 ? -1 : 1) * LEAF_KICK_YAW
      leaf.x += Math.cos(d.heading) * LEAF_NUDGE_PX
      leaf.y += Math.sin(d.heading) * LEAF_NUDGE_PX
      leaf.rot += (Math.random() - 0.5) * 1.2
      leaf.cooldownUntil = now + LEAF_COOLDOWN_MS
      break
    }
  }
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
  // to still point along heading. A mutant center leg (side 0) uses the
  // unmirrored shape pointing straight ahead, with no toe-out.
  const mirrored = side < 0
  const base = mirrored ? heading - Math.PI - FORWARD_OFFSET : heading + FORWARD_OFFSET
  c.rotate(base + (side === 0 ? 0 : mirrored ? -TOE_OUT_ANGLE : TOE_OUT_ANGLE))
  c.scale(scale * (mirrored ? -1 : 1), scale)
  c.translate(-PIVOT_X, -PIVOT_Y)
  c.transform(FOOT_ROT_A, FOOT_ROT_B, FOOT_ROT_C, FOOT_ROT_D, 0, 0)
  c.fill(footPath!)
  c.restore()
}

// The duck's body shadow, seen through the glass, is pre-rendered into
// sprites: flat opaque silhouettes blurred once at bake time — frosted
// edges without any per-frame blur cost. One sprite per head pose; draw()
// cross-fades between adjacent poses to animate the head. Normal ducks all
// share one set (key ''); each mutant bakes its own deformed set, keyed by
// its seed. During a theme fade the previous cache is kept and cross-faded
// out while the new one bakes lazily in draw().
let spriteCache = new Map<string, HTMLCanvasElement[]>()
let oldSpriteCache = new Map<string, HTMLCanvasElement[]>()

function spriteKey(m: Mutations | null) {
  return m ? String(m.seed) : ''
}

function getSpriteSet(d: Duck): HTMLCanvasElement[] {
  const key = spriteKey(d.mutations)
  let set = spriteCache.get(key)
  if (!set) {
    set = bakeSpriteSet(themeColor, d.mutations)
    spriteCache.set(key, set)
  }
  return set
}

function releaseSpriteSet(d: Duck) {
  if (!d.mutations) return
  const key = spriteKey(d.mutations)
  spriteCache.delete(key)
  oldSpriteCache.delete(key)
}

function bakeSpriteSet(color: string, m: Mutations | null): HTMLCanvasElement[] {
  const S = SHADOW_SPRITE_SCALE
  const L = BODY_LENGTH_PX
  const Wd = BODY_WIDTH_PX
  // Mutant deformities come from a PRNG seeded per duck, sampled once up
  // front so every head pose shares the same misshapen body and the set
  // re-bakes identically after a theme change.
  const rand = mulberry32(m ? m.seed : 1)
  const lump = m?.lumpiness ?? 0
  const fused = hasTrait(m, 'fusedTwins')
  const longNeck = hasTrait(m, 'longNeck')
  const noNeck = hasTrait(m, 'noNeck')
  // Padding keeps the blur from clipping at the sprite edges; it is
  // symmetric, so the belly stays at the canvas centre (the draw anchor).
  // Mutants get extra room for beaks, lumps, stretched necks and twins.
  const pad = BODY_BLUR_PX * 2 * S + (m ? Math.ceil(0.22 * L * S) : 0)
  const w = Math.ceil((longNeck ? 2.1 : 1.7) * L * S) + pad * 2
  const h = Math.ceil(Wd * S * (fused ? 1.8 : 1)) + pad * 2
  const sprites: HTMLCanvasElement[] = []

  // Body blobs as [x/L, y/Wd, rx/L, ry/Wd]: broad at the breast, tapering to
  // a pointed tail. Lumpiness jitters centres and radii and can graft an
  // extra blob or two onto the flank.
  const bodySpec: [number, number, number, number][] = (
    [
      [0, 0, 0.32, 0.44],
      [0.18, 0, 0.27, 0.38],
      [-0.2, 0, 0.25, 0.34],
      [-0.42, 0, 0.1, 0.16],
      [-0.5, 0, 0.05, 0.08]
    ] as [number, number, number, number][]
  ).map(([x, y, rx, ry]) => [
    x + (rand() * 2 - 1) * 0.06 * lump,
    y + (rand() * 2 - 1) * 0.14 * lump,
    rx * (1 + (rand() * 2 - 1) * 0.35 * lump),
    ry * (1 + (rand() * 2 - 1) * 0.35 * lump)
  ])
  const lumpCount = lump > 0 ? 1 + Math.round(rand() * (1 + lump)) : 0
  for (let i = 0; i < lumpCount; i++) {
    const r = 0.06 + rand() * 0.09
    bodySpec.push([-0.4 + rand() * 0.7, (rand() * 2 - 1) * 0.35, r, r * (L / Wd)])
  }
  // 'tailHeavy': the pointed taper is swallowed by a bulbous second rump.
  if (hasTrait(m, 'tailHeavy')) {
    bodySpec.push([-0.42, 0, 0.16, 0.16 * (L / Wd)], [-0.56, 0, 0.11, 0.11 * (L / Wd)])
  }
  // 'asymmetric': the whole silhouette drifts to one flank, a permanent lean.
  if (hasTrait(m, 'asymmetric')) {
    const shift = (rand() < 0.5 ? -1 : 1) * (0.12 + rand() * 0.1)
    for (const blob of bodySpec) blob[1] += shift
  }
  // A twin head branches from the same neck root at a fixed yaw skew and
  // swings (damped) with the same pose animation as the main head.
  const head2Skew = hasTrait(m, 'extraHead') ? (rand() < 0.5 ? -1 : 1) * (0.35 + rand() * 0.3) : 0
  // 'longNeck' periscopes the head far ahead; 'noNeck' sinks it into the
  // breast; 'swollenHead' balloons it; 'vestigialHead' grows a small fixed
  // bud that never joins the pose swing.
  const headDist = longNeck ? 0.55 : noNeck ? 0.12 : 0.34
  const headRFactor = hasTrait(m, 'swollenHead') ? 1.6 + rand() * 0.4 : 1
  const budYaw = hasTrait(m, 'vestigialHead') ? (rand() < 0.5 ? -1 : 1) * (0.5 + rand() * 0.35) : 0
  const yawMaxLocal = m?.headYawMax ?? HEAD_YAW_MAX
  // 'fusedTwins': two full bodies sharing the tail, offset to either flank.
  const twinOffs = fused ? [-0.42, 0.42] : [0]

  // One continuous silhouette — tail taper, body, neck bridge, round head —
  // filled at a single flat alpha per tier, then blurred once. Flat
  // interiors matter: stacked radial gradients leave a hotspot at every
  // blob centre, and a light shadow on a dark background exposes each one
  // as a separate oval. Each tier is one path (self-overlaps fill once) and
  // tiers merge behind each other via 'destination-over', so nothing stacks.
  // The neck and head sit higher off the glass, hence the fainter tiers.
  // One extra frame past the poses (index TUCK_SPRITE_INDEX): the head sunk
  // into the breast for a sleeping duck. draw() crossfades to it by tuck.
  for (let i = 0; i <= HEAD_POSES; i++) {
    const tucked = i === HEAD_POSES
    const headYaw = tucked ? 0 : ((i / (HEAD_POSES - 1)) * 2 - 1) * yawMaxLocal
    const dist = tucked ? TUCK_HEAD_DIST : headDist

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

    const body = new Path2D()
    const head = new Path2D()
    const neck = new Path2D()
    for (const off of twinOffs) {
      const oy = off * Wd * S
      for (const [bx, by, brx, bry] of bodySpec) ell(body, bx * L * S, by * Wd * S + oy, brx * L * S, bry * Wd * S)

      // Neck and head swing together around the neck root at the breast; the
      // root barely moves between poses, so cross-fading adjacent sprites
      // only ever ghosts the fast-moving head, not the seam.
      const rootX = 0.34 * L * S
      // head: small and round (equal radii in px, not proportional to the body)
      const headR = 0.13 * L * S * headRFactor
      const yaws = hasTrait(m, 'extraHead') ? [headYaw, headYaw * 0.75 + head2Skew] : [headYaw]
      for (const yaw of yaws) {
        const cos = Math.cos(yaw)
        const sin = Math.sin(yaw)
        const hx = rootX + cos * dist * L * S
        const hy = sin * dist * L * S + oy
        ell(head, hx, hy, headR, headR)
        // neck: thin and faint, bridging breast to head ('noNeck' has none, and
        // a tucked head sits sunk into the breast with no visible neck either)
        if (!noNeck && !tucked) {
          ell(neck, rootX + cos * dist * 0.24 * L * S, sin * dist * 0.24 * L * S + oy, 0.09 * L * S, 0.13 * Wd * S, yaw)
          ell(neck, rootX + cos * dist * 0.56 * L * S, sin * dist * 0.56 * L * S + oy, 0.08 * L * S, 0.11 * Wd * S, yaw)
          if (longNeck) ell(neck, rootX + cos * dist * 0.8 * L * S, sin * dist * 0.8 * L * S + oy, 0.075 * L * S, 0.1 * Wd * S, yaw)
        }
        // Beak wedges make "two beaks" legible on mutants; normal ducks keep
        // their plain round head.
        if (hasTrait(m, 'doubleBeak') || hasTrait(m, 'extraHead')) {
          const beakSkews = hasTrait(m, 'doubleBeak') ? [-0.45, 0.45] : [0]
          for (const skew of beakSkews) {
            const ba = yaw + skew
            ell(head, hx + Math.cos(ba) * headR * 1.25, hy + Math.sin(ba) * headR * 1.25, headR * 0.7, headR * 0.38, ba)
          }
        }
      }
      if (budYaw) {
        ell(head, rootX + Math.cos(budYaw) * 0.22 * L * S, Math.sin(budYaw) * 0.22 * L * S + oy, 0.055 * L * S, 0.055 * L * S)
      }
    }

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
  return sprites
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
  if (foot.missing) return
  const weightOn = 0.5 + 0.5 * duck.weight * foot.side
  const plantedAlpha = PLANT_ALPHA_MIN + (1 - PLANT_ALPHA_MIN) * weightOn
  const alpha = (plantedAlpha + (LIFT_MIN_ALPHA - plantedAlpha) * pose.fade) * spawnFade
  const scale =
    FOOT_SCALE * foot.scaleMul * (1 + PRESS_SCALE * weightOn + LAND_PULSE * pose.settle) * (1 - LIFT_SCALE_DROP * pose.fade)
  const blur = pose.fade > 0 ? LIFT_BLUR_PX * pose.fade : 0
  const heading = pose.heading + (foot.backwards ? Math.PI : 0)
  // Crossfade the on-glass and behind-glass looks across the mask edge
  // rather than switching between them.
  const behind = maskFactor(pose.x, pose.y)
  if (behind > 0) {
    // Feet under the content read as prints on frosted glass: fainter, and
    // always at least the glass blur (a lifted foot keeps its extra blur).
    paintFoot(pose.x, pose.y, heading, foot.side, alpha * MASK_OPACITY_FACTOR * behind, scale, Math.max(MASK_BLUR_PX, blur))
  }
  if (behind < 1) {
    paintFoot(pose.x, pose.y, heading, foot.side, alpha * (1 - behind), scale, blur)
  }
}

// Ground/atmosphere layer painted before the ducks: fallen leaves and fading
// frost trails sit under the flock; snow falls behind everything.
function drawSeasonBackground(now: number, dt: number) {
  const c = ctx!

  if (seasonAutumn && leafPath) {
    for (const leaf of leaves) {
      c.save()
      c.globalAlpha = LEAF_ALPHA * maskDim(leaf.x, leaf.y)
      c.fillStyle = drawColor
      c.translate(leaf.x, leaf.y)
      c.rotate(leaf.rot)
      c.scale(LEAF_SCALE, LEAF_SCALE)
      c.fill(leafPath)
      c.restore()
    }
  }

  if (seasonSnow && trail.length) {
    // Prints are pushed in time order, so expired ones are a contiguous prefix.
    let expired = 0
    while (expired < trail.length && now - trail[expired]!.at >= TRAIL_LIFE_MS) expired++
    if (expired) trail.splice(0, expired)
    for (const p of trail) {
      const age = (now - p.at) / TRAIL_LIFE_MS
      const behind = maskFactor(p.x, p.y)
      const alpha = TRAIL_ALPHA * (1 - age) * (1 - behind * (1 - MASK_OPACITY_FACTOR))
      // Prints under the glass keep the frosted blur the live foot had there,
      // so a plant doesn't snap sharp the instant the foot lifts off it.
      paintFoot(p.x, p.y, p.heading + (p.backwards ? Math.PI : 0), p.side, alpha, FOOT_SCALE * p.scaleMul, MASK_BLUR_PX * behind)
    }
  }

  if (seasonSnow && flakes.length) {
    // Two batched fills (front / behind the glass) rather than a save+fill per
    // flake; the hard bucket edge is invisible for 1-2px dots at α 0.18.
    c.fillStyle = drawColor
    const sway = Math.sin(now / 1000 * Math.PI * 2 * SNOW_SWAY_HZ)
    for (let pass = 0; pass < 2; pass++) {
      c.globalAlpha = pass === 0 ? SNOW_ALPHA : SNOW_ALPHA * MASK_OPACITY_FACTOR
      c.beginPath()
      for (const flake of flakes) {
        if (pass === 0) {
          flake.y += flake.speed * dt
          if (flake.y > cssH + 4) {
            flake.y = -4
            flake.x = Math.random() * cssW
          }
        }
        const fx = flake.x + Math.sin(sway + flake.phase) * SNOW_SWAY_PX
        const behind = maskFactor(fx, flake.y)
        if ((behind > 0.5) === (pass === 1)) {
          c.moveTo(fx + flake.r, flake.y)
          c.arc(fx, flake.y, flake.r, 0, Math.PI * 2)
        }
      }
      c.fill()
    }
    c.globalAlpha = 1
  }
}

function draw(now: number, dt: number) {
  if (!ctx || !footPath) return
  ctx.clearRect(0, 0, cssW, cssH)
  drawSeasonBackground(now, dt)

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
      oldSpriteCache = new Map()
      drawColor = themeColor
      spriteFade = 1
    }
  }

  for (const duck of ducks) {
    const spawnFade = Math.min(1, (now - duck.birth) / SPAWN_FADE_MS)
    const shadowAlpha = BODY_ALPHA * spawnFade
    // 'oneFoot': the missing side mirrors the real foot's pose so the body
    // anchors over the single leg (and its hop drives the bob).
    let poseA = footPose(duck.feet[0]!, now)
    let poseB = footPose(duck.feet[1]!, now)
    if (duck.feet[0]!.missing) poseA = poseB
    else if (duck.feet[1]!.missing) poseB = poseA

    // The body is a heavy mass on an underdamped spring chasing the feet
    // (anchored over them, swaying toward the weighted side): it lags turns,
    // overshoots stops with a small jiggle, and lets the feet visibly lead.
    const sway = duck.weight * STANCE_WIDTH * duck.bodyScale * BODY_SWAY_FACTOR
    const setback = BODY_SETBACK_PX * duck.bodyScale
    const tx =
      (poseA.x + poseB.x) / 2 + Math.cos(duck.heading) * setback + Math.cos(duck.heading + Math.PI / 2) * sway
    const ty =
      (poseA.y + poseB.y) / 2 + Math.sin(duck.heading) * setback + Math.sin(duck.heading + Math.PI / 2) * sway
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
      Math.sin((duck.distSinceStep / duckStride(duck)) * Math.PI) *
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
    // Bob/squash/breath modulate around the duck's own size — a growing baby
    // stays small, a mutant dwarf/giant keeps its odd proportions.
    const bodyScale = (1 + BODY_SQUASH_SCALE * settleMax - BODY_BOB_SCALE * arcMax + breathe) * duck.bodyScale

    // Head pose: cross-fade the two nearest baked silhouettes. At this
    // shadow alpha the double-draw compositing error is ~α²/4, invisible.
    // A touch of stabilization counters the body's yaw swing, so the head
    // appears to hold its line while the body waddles under it.
    const headRel = Math.max(
      -duck.headYawMax,
      Math.min(duck.headYawMax, duck.headAngle - duck.bodyYawV * HEAD_STABILIZE)
    )
    const poseIdx = (headRel / duck.headYawMax + 1) * 0.5 * (HEAD_POSES - 1)
    const i0 = Math.floor(poseIdx)
    const i1 = Math.min(HEAD_POSES - 1, i0 + 1)
    const f = poseIdx - i0
    // 'reverseWalker': the body rides rotated 180° — it walks tail-first.
    const bodyRot =
      duck.bodyYaw + wobble + shimmy + duck.lean + (hasTrait(duck.mutations, 'reverseWalker') ? Math.PI : 0)
    const newAlpha = shadowAlpha * spriteFade
    const sprites = getSpriteSet(duck)
    // Crossfade the animated head poses (weighted 1-tuck) against the tucked
    // sprite (weighted tuck), so a duck lowers its head as it dozes off.
    const tuck = duck.tuck
    paintPosePair(sprites, i0, i1, f, duck.bodyX, duck.bodyY, bodyRot, newAlpha, bodyScale, tuck)
    if (spriteFade < 1) {
      // A duck born mid-fade has no old-theme sprites; it just fades in new.
      const old = oldSpriteCache.get(spriteKey(duck.mutations))
      if (old) {
        const oldAlpha = shadowAlpha * (1 - spriteFade)
        paintPosePair(old, i0, i1, f, duck.bodyX, duck.bodyY, bodyRot, oldAlpha, bodyScale, tuck)
      }
    }

    paintFootPose(duck, duck.feet[0]!, poseA, spawnFade)
    paintFootPose(duck, duck.feet[1]!, poseB, spawnFade)
    for (let k = 2; k < duck.feet.length; k++) {
      const extra = duck.feet[k]!
      paintFootPose(duck, extra, footPose(extra, now), spawnFade)
    }

    // Head world position, needed by hats and Zzz only — skipped the rest of
    // the year so the hot loop pays no extra trig. Neck root 0.34·L forward of
    // the body centre, head another `dist` along the head yaw, sinking toward
    // the breast as the duck tucks. The yaw blends to 0 with tuck because the
    // tucked sprite is baked facing straight ahead — a hat that kept the pose
    // yaw would drift off the drawn head.
    const wantsZzz = tuck > 0.7 && duck.speed === 0
    if (seasonParty || wantsZzz) {
      const traitDist = hasTrait(duck.mutations, 'longNeck') ? 0.55 : hasTrait(duck.mutations, 'noNeck') ? 0.12 : 0.34
      const dist = traitDist + (TUCK_HEAD_DIST - traitDist) * tuck
      const headRot = bodyRot + headRel * (1 - tuck)
      const hx = duck.bodyX + Math.cos(bodyRot) * 0.34 * BODY_LENGTH_PX * duck.bodyScale + Math.cos(headRot) * dist * BODY_LENGTH_PX * duck.bodyScale
      const hy = duck.bodyY + Math.sin(bodyRot) * 0.34 * BODY_LENGTH_PX * duck.bodyScale + Math.sin(headRot) * dist * BODY_LENGTH_PX * duck.bodyScale

      if (seasonParty) {
        const hatAlpha = Math.min(HAT_ALPHA_MAX, shadowAlpha * HAT_ALPHA_MUL) * spriteFade
        paintHat(hx, hy, headRot, hatAlpha, duck.bodyScale)
      }

      // Emit a drifting "z" above a soundly-tucked, motionless duck.
      if (wantsZzz && now >= duck.zzzAt) {
        // A zzzAt left over from before this doze (or the initial 0) would
        // make every duck emit on the same frame; a duck that just fell
        // asleep only gets scheduled, so each sleeper finds its own phase.
        const justFellAsleep = now - duck.zzzAt > 500
        duck.zzzAt = now + (ZZZ_SPAWN_MIN_S + Math.random() * ZZZ_SPAWN_RANGE_S) * 1000
        if (!justFellAsleep && zzzs.length < ZZZ_MAX) {
          zzzs.push({ x: hx, y: hy - 6, born: now, phase: Math.random() * Math.PI * 2 })
        }
      }
    }
  }

  drawZzz(now)
}

// Paints the pose-pair crossfade plus the tucked-head sprite for one duck, from
// a given sprite set (live or the outgoing theme's). Kept in one place so the
// theme-fade branch and the normal branch can't drift apart.
function paintPosePair(
  set: HTMLCanvasElement[],
  i0: number,
  i1: number,
  f: number,
  x: number,
  y: number,
  rot: number,
  alpha: number,
  scale: number,
  tuck: number
) {
  const poseAlpha = alpha * (1 - tuck)
  if (tuck < 1) {
    if (f < 1) paintSprite(set[i0]!, x, y, rot, poseAlpha * (1 - f), scale)
    if (f > 0) paintSprite(set[i1]!, x, y, rot, poseAlpha * f, scale)
  }
  if (tuck > 0) paintSprite(set[TUCK_SPRITE_INDEX]!, x, y, rot, alpha * tuck, scale)
}

// A jaunty little party hat on the head, drawn as a monochrome cone (a triangle
// with a couple of alpha-stacked stripes) plus a pompom. No second colour, so
// it obeys the site's single-ink palette.
function paintHat(x: number, y: number, rot: number, alpha: number, scale: number) {
  if (alpha <= 0 || !hatConePath) return
  const c = ctx!
  const a = alpha * maskDim(x, y)
  c.save()
  c.globalAlpha = a
  c.fillStyle = drawColor
  c.translate(x, y)
  c.rotate(rot)
  c.scale(HAT_LENGTH_PX * scale, HAT_LENGTH_PX * scale)
  c.fill(hatConePath)
  // Stripes refill over the cone at the same alpha; the stacking is what
  // makes them read darker without a second ink.
  c.fill(hatStripesPath!)
  c.globalAlpha = Math.min(1, a * 1.4)
  c.beginPath()
  c.arc(1, 0, HAT_UNIT_HALF * 0.35, 0, Math.PI * 2)
  c.fill()
  c.restore()
}

// Drifting "Zzz" glyphs above dozing ducks: rise, sway, and fade over their
// life. One fillText per glyph with the mask dim premixed into the alpha — no
// blurred behind-pass, which would double text cost for an invisible gain.
function drawZzz(now: number) {
  if (!zzzs.length || !ctx) return
  const c = ctx
  c.save()
  c.font = ZZZ_FONT
  c.fillStyle = drawColor
  c.textAlign = 'center'
  for (let i = zzzs.length - 1; i >= 0; i--) {
    const z = zzzs[i]!
    const t = (now - z.born) / ZZZ_LIFE_MS
    if (t >= 1) {
      zzzs.splice(i, 1)
      continue
    }
    const x = z.x + Math.sin(t * Math.PI * 2 + z.phase) * ZZZ_SWAY_PX
    const y = z.y - t * ZZZ_RISE_PX
    c.globalAlpha = ZZZ_ALPHA * Math.sin(t * Math.PI) * maskDim(x, y)
    c.fillText('z', x, y)
  }
  c.restore()
}

function createDuck(x: number, y: number, generation = 0, mutations: Mutations | null = null, baby = false): Duck {
  const heading = Math.random() * Math.PI * 2
  const adultScale = mutations?.sizeScale ?? 1
  const bodyScale = baby ? BABY_BODY_SCALE * adultScale : adultScale
  const makeFoot = (side: number): Foot => ({
    side,
    x: x + Math.cos(heading + Math.PI / 2) * STANCE_WIDTH * bodyScale * side + (side > 0 ? Math.cos(heading) * STEP_LENGTH_MIN * 0.5 : 0),
    y: y + Math.sin(heading + Math.PI / 2) * STANCE_WIDTH * bodyScale * side + (side > 0 ? Math.sin(heading) * STEP_LENGTH_MIN * 0.5 : 0),
    heading,
    fromX: 0,
    fromY: 0,
    fromHeading: heading,
    liftStart: 0,
    liftDur: 0,
    landAt: 0,
    missing: false,
    backwards: false,
    scaleMul: 1
  })
  const feet: Foot[] = [makeFoot(-1), makeFoot(1)]
  const oddIdx = mutations && mutations.oddFootSide > 0 ? 1 : 0
  if (hasTrait(mutations, 'oneFoot')) feet[oddIdx]!.missing = true
  if (hasTrait(mutations, 'backwardsFoot')) feet[oddIdx]!.backwards = true
  if (hasTrait(mutations, 'mismatchedFeet')) feet[oddIdx]!.scaleMul = mutations!.oddFootScale
  if (hasTrait(mutations, 'extraLeg')) {
    const third = makeFoot(0)
    third.x = x - Math.cos(heading) * THIRD_FOOT_SETBACK_PX * bodyScale
    third.y = y - Math.sin(heading) * THIRD_FOOT_SETBACK_PX * bodyScale
    feet.push(third)
  }
  if (hasTrait(mutations, 'fourLegs')) {
    for (const side of [-1, 1]) {
      const rear = makeFoot(side)
      rear.x -= Math.cos(heading) * REAR_LEG_SETBACK_PX * bodyScale
      rear.y -= Math.sin(heading) * REAR_LEG_SETBACK_PX * bodyScale
      feet.push(rear)
    }
  }
  return {
    x,
    y,
    heading,
    wanderTarget: heading,
    wanderTimer: 0,
    gait: 'slow',
    gaitTimer: 0.8 + Math.random() * 1.5,
    speed: 0,
    speedMultiplier:
      mutations && mutations.speedMul > 0
        ? mutations.speedMul
        : DUCK_SPEED_MULTIPLIER_MIN + Math.random() * (DUCK_SPEED_MULTIPLIER_MAX - DUCK_SPEED_MULTIPLIER_MIN),
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
    generation,
    bodyScale,
    growth: baby ? makeGrowth(adultScale) : null,
    breedReadyAt: performance.now() + (FIRST_BREED_DELAY_MIN_S + Math.random() * FIRST_BREED_DELAY_RANGE_S) * 1000,
    mate: null,
    courtUntil: 0,
    departing: false,
    stampeding: false,
    stampedeHeading: 0,
    stampedePhase: 0,
    tuck: 0,
    zzzAt: 0,
    gatherX: 0,
    gatherY: 0,
    mutations,
    headYawMax: mutations?.headYawMax ?? HEAD_YAW_MAX,
    turnBias: mutations?.turnBias ?? 0,
    thirdFootIn: 2,
    feet
  }
}

function breedEligible(d: Duck, now: number) {
  return (
    !d.growth &&
    !d.departing &&
    !d.stampeding &&
    !d.mate &&
    !isSterile(d) &&
    now >= d.breedReadyAt &&
    Math.hypot(d.x - mouse.x, d.y - mouse.y) > FLEE_RADIUS
  )
}

function spawnBaby(p1: Duck, p2: Duck, now: number) {
  const generation = Math.max(p1.generation, p2.generation) + 1
  const x = (p1.x + p2.x) / 2 + (Math.random() * 2 - 1) * 12
  const y = (p1.y + p2.y) / 2 + (Math.random() * 2 - 1) * 12
  ducks.push(createDuck(x, y, generation, rollMutations(generation, p1.mutations, p2.mutations), true))

  // Over the cap, someone wanders off-screen to make room: the most
  // malformed bystander first (mutants are short-lived), oldest breaking
  // ties — never the new parents or a growing baby.
  if (ducks.length > POP_CAP) {
    let elder: Duck | null = null
    for (const d of ducks) {
      // Never send a stampeder off as the elder — it owns the departing/despawn
      // state already, and marking it departing would collide with that.
      if (d.departing || d.stampeding || d === p1 || d === p2 || d.growth) continue
      if (!elder) {
        elder = d
        continue
      }
      const dTraits = d.mutations?.traits.length ?? 0
      const eTraits = elder.mutations?.traits.length ?? 0
      if (dTraits > eTraits || (dTraits === eTraits && d.birth < elder.birth)) elder = d
    }
    if (elder) {
      if (elder.mate) cancelCourtship(elder, now)
      elder.departing = true
    }
  }
}

// O(n²) pairing over a flock capped at ~POP_CAP ducks.
function updateBreeding(now: number) {
  // Resolve active courtships: break off if the pair drifted apart, birth if
  // the lingering timer ran out.
  for (let i = 0; i < ducks.length; i++) {
    const a = ducks[i]!
    const b = a.mate
    if (!b || ducks.indexOf(b) < i) continue
    if (Math.hypot(a.x - b.x, a.y - b.y) > BREED_BREAK_RADIUS) {
      cancelCourtship(a, now)
      continue
    }
    if (now >= a.courtUntil) {
      spawnBaby(a, b, now)
      a.breedReadyAt = now + (BREED_COOLDOWN_MIN_S + Math.random() * BREED_COOLDOWN_RANGE_S) * 1000
      b.breedReadyAt = now + (BREED_COOLDOWN_MIN_S + Math.random() * BREED_COOLDOWN_RANGE_S) * 1000
      a.mate = null
      b.mate = null
      a.courtUntil = 0
      b.courtUntil = 0
      // A celebratory tail shimmy for both parents.
      a.shimmyStart = now
      b.shimmyStart = now
    }
  }

  // No new pairings while the flock is dozing or a stampede has inflated the
  // headcount past the cap. (Active courtships above still resolve/break.)
  if (flockMode !== 'active' || stampederCount > 0) return
  // Breeding continues at the cap (a birth sends an elder off-screen); only
  // pause new pairings while a departure is still in progress.
  if (ducks.length > POP_CAP) return
  for (let i = 0; i < ducks.length; i++) {
    const a = ducks[i]!
    if (!breedEligible(a, now)) continue
    for (let j = i + 1; j < ducks.length; j++) {
      const b = ducks[j]!
      if (!breedEligible(b, now)) continue
      if (Math.hypot(a.x - b.x, a.y - b.y) > BREED_RADIUS) continue
      a.mate = b
      b.mate = a
      a.courtUntil = b.courtUntil = now + (COURT_MIN_S + Math.random() * COURT_RANGE_S) * 1000
      break
    }
  }
}

// The flock has been idle long enough to bed down: pick a rally point (the
// clamped flock centroid) and hand each duck a slot on a loose ring around it.
function enterGathering(now: number) {
  flockMode = 'gathering'
  gatherStartedAt = now
  const settlers = ducks.filter((d) => !d.departing && !d.stampeding)
  if (!settlers.length) return
  let cx = 0
  let cy = 0
  for (const d of settlers) {
    cx += d.x
    cy += d.y
  }
  cx /= settlers.length
  cy /= settlers.length
  // Don't rally the flock onto a parked cursor: sleeping inside flee range
  // would make the whole pile bolt in unison at the first pixel of movement.
  const toCursor = Math.hypot(cx - mouse.x, cy - mouse.y)
  if (toCursor < FLEE_RADIUS) {
    const away = Math.atan2(cy - mouse.y, cx - mouse.x)
    cx = mouse.x + Math.cos(away) * (FLEE_RADIUS + GATHER_RING_R_MIN * 2)
    cy = mouse.y + Math.sin(away) * (FLEE_RADIUS + GATHER_RING_R_MIN * 2)
  }
  const margin = edgeMargin.value
  cx = Math.max(margin, Math.min(cssW - margin, cx))
  cy = Math.max(margin, Math.min(cssH - margin, cy))
  settlers.forEach((d, i) => {
    if (d.mate) cancelCourtship(d, now)
    const angle = (i / settlers.length) * Math.PI * 2
    const r = GATHER_RING_R_MIN + (i % 3) * GATHER_RING_R_STEP
    d.gatherX = cx + Math.cos(angle) * r
    d.gatherY = cy + Math.sin(angle) * r
  })
}

function tick(now: number) {
  const gap = now - lastTime
  const dt = Math.min(gap / 1000, 0.05)
  lastTime = now

  // A long rAF gap means the tab was hidden — that time wasn't idling on the
  // page, so don't let it bed the flock down the instant the user returns.
  if (gap > 2000) lastInteractionAt = now

  if (now - maskRectCheckedAt > MASK_RECT_REFRESH_MS) {
    maskRectCheckedAt = now
    updateMaskRect()
  }

  // Idle doze cycle: gather after a quiet spell, promote to dozing once
  // everyone has arrived (or a timeout for ducks that can't settle).
  if (flockMode === 'active') {
    if (!stampederCount && ducks.length && now - lastInteractionAt > DOZE_IDLE_MS) enterGathering(now)
  } else if (flockMode === 'gathering') {
    let allArrived = true
    for (const d of ducks) {
      if (d.departing || d.stampeding) continue
      if (Math.hypot(d.gatherX - d.x, d.gatherY - d.y) >= GATHER_ARRIVE_DIST) {
        allArrived = false
        break
      }
    }
    if (allArrived || now - gatherStartedAt > GATHER_TIMEOUT_MS) flockMode = 'dozing'
  }

  for (const d of ducks) step(d, dt, now, cssW, cssH)
  updateBreeding(now)

  // Remove ducks once fully out of view: departing elders past any edge, and
  // stampeders past the far edge they're running toward (a symmetric test
  // would instantly cull the entry queue waiting off the near edge).
  for (let i = ducks.length - 1; i >= 0; i--) {
    const d = ducks[i]!
    const gone = d.stampeding
      ? Math.cos(d.stampedeHeading) > 0
        ? d.x > cssW + DESPAWN_MARGIN_PX
        : d.x < -DESPAWN_MARGIN_PX
      : d.departing &&
      (d.x < -DESPAWN_MARGIN_PX || d.x > cssW + DESPAWN_MARGIN_PX || d.y < -DESPAWN_MARGIN_PX || d.y > cssH + DESPAWN_MARGIN_PX)
    if (gone) {
      if (d.stampeding) stampederCount = Math.max(0, stampederCount - 1)
      releaseSpriteSet(d)
      ducks.splice(i, 1)
    }
  }

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

// The "quack" payoff: a transient herd enters from one edge in a staggered
// queue and thunders straight across, the resident flock scattering in panic.
// The herd despawns off the far edge, restoring the normal population.
function triggerStampede() {
  if (stampederCount > 0 || isReducedMotion.value || !raf || !ctx) return
  const now = performance.now()
  wake(now)

  const fromLeft = Math.random() < 0.5
  const heading = fromLeft ? 0 : Math.PI
  const edge = fromLeft ? -40 : cssW + 40
  const margin = edgeMargin.value
  const count = STAMPEDE_COUNT_MIN + Math.floor(Math.random() * (STAMPEDE_COUNT_RANGE + 1))
  for (let i = 0; i < count; i++) {
    // Spatial stagger (queued off the entry edge) rather than timed spawns, so
    // there are no timers to clean up on unmount.
    const back = 30 + i * STAMPEDE_SPACING_PX * (0.7 + Math.random() * 0.6)
    const x = fromLeft ? edge - back : edge + back
    const y = margin + Math.random() * (cssH - margin * 2)
    const d = createDuck(x, y)
    d.stampeding = true
    // Every runner is an individual: its own lane angle, pace, weave phase,
    // entry speed and step-cycle offset — a herd of clones striding in sync
    // is what makes a stampede read mechanical.
    d.stampedeHeading = heading + (Math.random() - 0.5) * STAMPEDE_LANE_JITTER_RAD
    d.stampedePhase = Math.random() * 10
    d.heading = d.stampedeHeading
    d.wanderTarget = d.heading
    d.bodyYaw = d.heading
    d.speedMultiplier = STAMPEDE_SPEED_MUL * (1 - STAMPEDE_SPEED_JITTER / 2 + Math.random() * STAMPEDE_SPEED_JITTER)
    d.gait = 'fast'
    d.speed = SPEED_FAST * (0.5 + Math.random()) // ragged, not uniform, entry pace
    d.side = Math.random() < 0.5 ? -1 : 1
    d.stepParity = Math.random() < 0.5 ? -1 : 1
    d.distSinceStep = Math.random() * STEP_LENGTH_MAX
    // createDuck laid the feet and body along its own random heading; realign
    // them to the stampede line so the first on-screen steps read straight.
    for (const foot of d.feet) {
      foot.x = x + Math.cos(d.heading + Math.PI / 2) * STANCE_WIDTH * foot.side + (foot.side > 0 ? Math.cos(d.heading) * STEP_LENGTH_MIN * 0.5 : 0)
      foot.y = y + Math.sin(d.heading + Math.PI / 2) * STANCE_WIDTH * foot.side + (foot.side > 0 ? Math.sin(d.heading) * STEP_LENGTH_MIN * 0.5 : 0)
      foot.heading = d.heading
      foot.fromHeading = d.heading
    }
    d.bodyX = x + Math.cos(d.heading) * BODY_SETBACK_PX
    d.bodyY = y + Math.sin(d.heading) * BODY_SETBACK_PX
    ducks.push(d)
    stampederCount++
  }

  // Residents bolt in a brief panic, then settle back to normal life.
  for (const d of ducks) {
    if (d.stampeding || d.departing) continue
    if (d.mate) cancelCourtship(d, now)
    d.gait = 'fast'
    d.gaitTimer = STAMPEDE_PANIC_S
    d.wanderTarget = d.heading + (Math.random() - 0.5) * Math.PI
    d.wanderTimer = STAMPEDE_PANIC_S
    d.shimmyStart = now
  }

  trackEvent('quack_stampede')
}

// Ducks spawn on their own once the browser goes idle after landing, so
// initial render and hydration never compete with the animation loop.
let idleCallbackId = 0
let idleTimeoutId: ReturnType<typeof setTimeout> | undefined

function spawnFlakes() {
  const count = isMobile.value ? SNOW_COUNT_MOBILE : SNOW_COUNT_DESKTOP
  for (let i = 0; i < count; i++) {
    flakes.push({
      x: Math.random() * cssW,
      y: Math.random() * cssH,
      speed: SNOW_SPEED_MIN + Math.random() * SNOW_SPEED_RANGE,
      r: SNOW_R_MIN + Math.random() * SNOW_R_RANGE,
      phase: Math.random() * Math.PI * 2
    })
  }
}

function spawnLeaves() {
  const margin = edgeMargin.value
  const count = LEAF_COUNT_MIN + Math.floor(Math.random() * (LEAF_COUNT_RANGE + 1))
  for (let i = 0; i < count; i++) {
    leaves.push({
      x: margin + Math.random() * (cssW - margin * 2),
      y: margin + Math.random() * (cssH - margin * 2),
      rot: Math.random() * Math.PI * 2,
      cooldownUntil: 0
    })
  }
}

function startMotion() {
  if (!ctx) return
  if (!ducks.length) spawnDucks()
  if (seasonSnow && !flakes.length) spawnFlakes()
  if (seasonAutumn && !leaves.length) spawnLeaves()
  // Reset the doze cycle so a resume (reduced-motion toggle) never restarts
  // asleep off a stale timestamp or a stale gathering/dozing mode.
  lastInteractionAt = performance.now()
  flockMode = 'active'
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
  zzzs.length = 0 // don't pop stale glyphs on resume
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
  isSleepyTheme = document.documentElement.getAttribute('data-theme') === 'dark'

  const m = new Date()
  seasonParty = m.getMonth() === 7 && m.getDate() === 1
  seasonSnow = m.getMonth() === 11
  seasonAutumn = m.getMonth() >= 8 && m.getMonth() <= 10

  leafPath = new Path2D(LEAF_D)

  // Hat geometry is static; bake the cone and its stripes once at unit length
  // (scaled at paint time) instead of allocating Path2Ds per duck per frame.
  hatConePath = new Path2D()
  hatConePath.moveTo(1, 0)
  hatConePath.lineTo(0, -HAT_UNIT_HALF)
  hatConePath.lineTo(0, HAT_UNIT_HALF)
  hatConePath.closePath()
  hatStripesPath = new Path2D()
  for (let s = 1; s <= HAT_STRIPES; s++) {
    const t = s / (HAT_STRIPES + 1)
    const bh = HAT_UNIT_HALF * (1 - t)
    hatStripesPath.moveTo(t, -bh)
    hatStripesPath.lineTo(t + 0.14, -bh * 0.6)
    hatStripesPath.lineTo(t + 0.14, bh * 0.6)
    hatStripesPath.lineTo(t, bh)
    hatStripesPath.closePath()
  }

  // The flag is refreshed in the observer wrapper rather than in
  // handleThemeChange, whose next===themeColor early-return would skip it.
  themeObserver = new MutationObserver(() => {
    isSleepyTheme = document.documentElement.getAttribute('data-theme') === 'dark'
    handleThemeChange()
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
  window.addEventListener('pointerup', handlePointerEnd, { passive: true })
  window.addEventListener('pointercancel', handlePointerEnd, { passive: true })
  window.addEventListener('keydown', handleKeydown, { passive: true })

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
  window.removeEventListener('keydown', handleKeydown)
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
