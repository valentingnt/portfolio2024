// Cursor ripples through the text one glyph at a time. Moving the mouse drops
// soft rings that spread from the pointer path: a heavier crest with a lighter
// halo either side. Rings swell in, lose energy as they spread and fade out;
// each glyph rises toward the weight the rings ask for and then glides back
// more slowly, so the text breathes rather than flickers. Faster movement makes
// stronger rings; they keep spreading after the pointer stops (the momentum),
// then everything settles back to its resting weight.
//
// Tuning intent: an accent, not a show. The swing is asymmetric (thickening
// reads as emphasis, thinning hurts legibility) and stays local to the cursor.
// Desktop only: no hover on touch, and phones get no listeners at all.
//
// Cost model:
// - Glyph centres are measured once, in document coordinates (scrolling never
//   invalidates them), on idle after the entrance animation, and again only
//   after layout really changes.
// - Per frame, ring values (radius, envelope) are computed once per ring, and
//   only glyphs in the vertical band the rings cover (clipped to the viewport)
//   are visited; glyphs are sorted by y so the band is a binary search away.
// - Writes are stepped, skipped when unchanged and capped per frame. Paper
//   Mono's advances are identical at every weight, so they never reflow a line.
// - The rAF loop exists only while rings are alive or glyphs are still easing.

interface Glyph {
  el: HTMLElement
  x: number
  y: number
  base: number
  /** Eased weight, continuous */
  current: number
  /** Weight last written to the DOM, stepped */
  applied: number
  /** Stepped weight queued for this frame's write pass */
  next: number
  seenFrame: number
}

interface Ripple {
  x: number
  y: number
  born: number
  amp: number
  // Recomputed once per frame
  radius: number
  reach: number
  gain: number
}

const GLYPH_SELECTOR = '.ch'
const MOBILE_BREAKPOINT = 640
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

// Target swing at full strength: +440 at a crest, -100 in a halo. Rings swell
// in and glyphs ease toward them, so what actually shows on 400-weight text
// peaks around ~560 for a slow move, ~620 normal, ~660 fast and ~340 in halos
// (measured in Chromium; tuned with an offline model of this loop). Paper Mono
// barely changes between 400 and 500, which is why the gain looks large. The
// font keeps 100–800.
const CREST_GAIN = 440
const HALO_DEPTH = 100
const WEIGHT_MIN = 100
const WEIGHT_MAX = 800

// A slow, wide ring lingers on each glyph long enough for the easing to
// follow it, which is what makes the motion read as smooth
const RING_SPEED = 0.17 // px/ms the ring radius grows
const RING_WIDTH = 24 // px; Ricker scale, crest ≈ ±24px, halo ≈ 42px either side
const RIPPLE_LIFE_MS = 1100 // ~185px max radius, so the effect stays around the cursor
const RIPPLE_FADE_IN_MS = 90 // a new ring swells in instead of popping on
// Energy spreading out: amplitude × e^(-radius / RADIAL_FALLOFF). A ring is
// at ~45% by the time it's 100px out, which keeps distant text calm.
const RADIAL_FALLOFF = 125
const EMIT_SPACING = 32 // px of pointer travel between rings
const MAX_RIPPLES = 10
// Smoothed pointer speed (px/ms) that drops a full-strength ring; amplitude
// follows √(speed) so gentle moves still read, without a hard on/off feel
const FULL_SPEED = 1
const SPEED_SMOOTHING = 0.2
// A longer gap between moves means the pointer stopped and started again
const MAX_SAMPLE_GAP_MS = 100
// Rings too weak to move any glyph a single step are dropped from the frame
const MIN_RING_GAIN = 0.02

// Glyph easing time constants. Rising has to keep up with a passing crest
// (much past ~70ms the crest is gone before the glyph gets there); settling
// back is where the softness lives, so it takes its time.
const GLYPH_ATTACK_MS = 65
const GLYPH_RELEASE_MS = 240

// A crest this strong overrides any halo on the same glyph
const CREST_WINS_ABOVE = 0.03
const PROFILE_EXTENT = 4 // in RING_WIDTH units; the profile is windowed to 0 beyond
const VIEW_MARGIN = 80 // px above/below the viewport still animated
// Written weights snap to this grid. Each write costs a style recalc and a
// re-shape of the glyph's line; with the easing, 20-unit steps read as
// continuous at 12px.
const WEIGHT_STEP = 20
// Hard cap on glyph writes per frame, biggest jumps first; the rest catch up
// next frame. Keeps the worst case inside budget instead of letting a frame balloon.
const MAX_WRITES_PER_FRAME = 200
// Below this distance (in weight units) an easing glyph is considered arrived
const SETTLE_DISTANCE = 1
const FRAME_MS_CAP = 64 // a backgrounded tab mustn't jump when it comes back
// Measure ahead of the first move once the entrance animation (≤1.8s) is done,
// so the first pointer move doesn't pay for ~1700 getBoundingClientRect calls
const PREMEASURE_DELAY_MS = 2000

// Ricker ("Mexican hat") wavelet windowed to zero at ±PROFILE_EXTENT so rings
// fade out instead of popping. Negative lobes are normalised to -1 so
// HALO_DEPTH is reached exactly at full strength.
function rawProfile(u: number): number {
  const u2 = u * u
  const window = 1 - u2 / (PROFILE_EXTENT * PROFILE_EXTENT)
  return (1 - u2) * Math.exp(-u2 / 2) * window * window
}

const TROUGH = (() => {
  let min = 0
  for (let u = 0; u <= PROFILE_EXTENT; u += 0.01) min = Math.min(min, rawProfile(u))
  return -min
})()

function profile(u: number): number {
  if (u <= -PROFILE_EXTENT || u >= PROFILE_EXTENT) return 0
  const value = rawProfile(u)
  return value < 0 ? value / TROUGH : value
}

function smoothstep(t: number): number {
  return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t)
}

export function useCharRipple(rootRef: Ref<HTMLElement | null>): void {
  const reducedMotion = useReducedMotion()
  const isMobile = ref(true)
  const hasFinePointer = ref(false)
  const isEnabled = computed(() => !reducedMotion.value && !isMobile.value && hasFinePointer.value)

  const glyphByEl = new WeakMap<HTMLElement, Glyph>()
  // Glyphs whose eased weight isn't at rest yet
  const moving = new Set<Glyph>()
  let glyphs: Glyph[] = [] // sorted by y
  let ripples: Ripple[] = []
  let isMeasured = false
  let rafId: number | undefined
  let frameId = 0
  let lastFrameAt = 0
  let viewportHeight = 0
  const pending: Glyph[] = [] // reused across frames

  let lastX = 0
  let lastY = 0
  let lastMoveAt = 0
  let speed = 0
  let travelled = 0

  let resizeObserver: ResizeObserver | null = null
  let mutationObserver: MutationObserver | null = null
  let pointerQuery: MediaQueryList | null = null
  let premeasureTimeout: ReturnType<typeof setTimeout> | undefined
  let premeasureIdle: number | undefined

  function write(glyph: Glyph, weight: number) {
    glyph.applied = weight

    if (weight === glyph.base) {
      // Drop the attribute entirely rather than leave style="" behind
      glyph.el.removeAttribute('style')
    } else {
      glyph.el.style.fontWeight = String(weight)
    }
  }

  function snapHome(glyph: Glyph) {
    glyph.current = glyph.base
    moving.delete(glyph)
    if (glyph.applied !== glyph.base) write(glyph, glyph.base)
  }

  function measure(root: HTMLElement) {
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    // Resting weight comes from the parent (a glyph only ever carries our inline style)
    const baseByParent = new Map<Element, number>()
    const next: Glyph[] = []

    for (const el of root.querySelectorAll<HTMLElement>(GLYPH_SELECTOR)) {
      const rect = el.getBoundingClientRect()
      if (!rect.width) continue

      const parent = el.parentElement
      let base = parent ? baseByParent.get(parent) : undefined
      if (base === undefined) {
        base = parent ? Number.parseFloat(getComputedStyle(parent).fontWeight) || 400 : 400
        if (parent) baseByParent.set(parent, base)
      }

      const x = rect.left + rect.width / 2 + scrollX
      const y = rect.top + rect.height / 2 + scrollY
      const glyph = glyphByEl.get(el)

      if (glyph) {
        glyph.x = x
        glyph.y = y
        glyph.base = base
        next.push(glyph)
      } else {
        const fresh: Glyph = { el, x, y, base, current: base, applied: base, next: base, seenFrame: 0 }
        glyphByEl.set(el, fresh)
        next.push(fresh)
      }
    }

    next.sort((a, b) => a.y - b.y)
    glyphs = next
    isMeasured = true

    // Glyphs that left the DOM (language switch, copied! label) can't be seen
    for (const glyph of moving) if (!glyph.el.isConnected) moving.delete(glyph)
  }

  function invalidate() {
    isMeasured = false
  }

  function firstIndexAtOrBelow(y: number): number {
    let low = 0
    let high = glyphs.length
    while (low < high) {
      const mid = (low + high) >> 1
      if ((glyphs[mid]?.y ?? 0) < y) low = mid + 1
      else high = mid
    }
    return low
  }

  // Rings don't add up: a glyph takes the strongest crest reaching it, and a
  // halo only where no crest is. Summing made a ring's halo cancel the next
  // ring's crest, so faster moves (denser rings) looked weaker.
  function fieldAt(glyph: Glyph): number {
    let crest = 0
    let halo = 0

    for (const ripple of ripples) {
      const dx = glyph.x - ripple.x
      if (dx > ripple.reach || dx < -ripple.reach) continue
      const dy = glyph.y - ripple.y
      if (dy > ripple.reach || dy < -ripple.reach) continue

      const value = ripple.gain * profile((Math.sqrt(dx * dx + dy * dy) - ripple.radius) / RING_WIDTH)
      if (value > crest) crest = value
      else if (value < halo) halo = value
    }

    return crest > CREST_WINS_ABOVE ? crest : halo
  }

  function targetWeight(glyph: Glyph, field: number): number {
    const weight = field >= 0 ? glyph.base + field * CREST_GAIN : glyph.base + field * HALO_DEPTH
    return weight > WEIGHT_MAX ? WEIGHT_MAX : weight < WEIGHT_MIN ? WEIGHT_MIN : weight
  }

  function step(glyph: Glyph, target: number, attack: number, release: number) {
    glyph.seenFrame = frameId
    // Moving away from rest uses the attack, heading back uses the release
    const rate = Math.abs(target - glyph.base) > Math.abs(glyph.current - glyph.base) ? attack : release
    glyph.current += (target - glyph.current) * rate
    if (Math.abs(target - glyph.current) < SETTLE_DISTANCE) glyph.current = target

    if (glyph.current === glyph.base) moving.delete(glyph)
    else moving.add(glyph)

    // Snap relative to the resting weight so "at rest" is exactly base
    const stepped = glyph.base + Math.round((glyph.current - glyph.base) / WEIGHT_STEP) * WEIGHT_STEP
    if (stepped !== glyph.applied) {
      glyph.next = stepped
      pending.push(glyph)
    }
  }

  function updateRipples(now: number) {
    let kept = 0

    for (const ripple of ripples) {
      const age = now - ripple.born
      if (age >= RIPPLE_LIFE_MS) continue

      ripple.radius = Math.max(age, 0) * RING_SPEED
      ripple.reach = ripple.radius + RING_WIDTH * PROFILE_EXTENT
      ripple.gain = ripple.amp
        * smoothstep(age / RIPPLE_FADE_IN_MS)
        * (1 - smoothstep(age / RIPPLE_LIFE_MS))
        * Math.exp(-ripple.radius / RADIAL_FALLOFF)

      // Still alive but too faint to matter this frame (or not swelled in yet)
      if (ripple.gain < MIN_RING_GAIN && age > RIPPLE_FADE_IN_MS) continue
      ripples[kept++] = ripple
    }

    ripples.length = kept
  }

  function frame(now: number) {
    frameId++
    const dt = Math.min(now - lastFrameAt, FRAME_MS_CAP)
    lastFrameAt = now
    const attack = 1 - Math.exp(-dt / GLYPH_ATTACK_MS)
    const release = 1 - Math.exp(-dt / GLYPH_RELEASE_MS)

    updateRipples(now)

    const viewTop = window.scrollY - VIEW_MARGIN
    const viewBottom = window.scrollY + viewportHeight + VIEW_MARGIN

    if (ripples.length) {
      // Only the horizontal band the rings can reach, clipped to the viewport
      let bandTop = Number.POSITIVE_INFINITY
      let bandBottom = Number.NEGATIVE_INFINITY
      for (const ripple of ripples) {
        bandTop = Math.min(bandTop, ripple.y - ripple.reach)
        bandBottom = Math.max(bandBottom, ripple.y + ripple.reach)
      }
      bandTop = Math.max(bandTop, viewTop)
      bandBottom = Math.min(bandBottom, viewBottom)

      for (let i = firstIndexAtOrBelow(bandTop); i < glyphs.length; i++) {
        const glyph = glyphs[i]
        if (!glyph || glyph.y > bandBottom) break

        const target = targetWeight(glyph, fieldAt(glyph))
        // Untouched glyphs at rest: nothing to do, keep the loop tight
        if (target === glyph.base && glyph.current === glyph.base) continue
        step(glyph, target, attack, release)
      }
    }

    // Glyphs left mid-ease (rings gone or passed): glide home; off-screen ones snap
    for (const glyph of moving) {
      if (glyph.seenFrame === frameId) continue
      if (glyph.y < viewTop || glyph.y > viewBottom) snapHome(glyph)
      else step(glyph, glyph.base, attack, release)
    }

    if (pending.length > MAX_WRITES_PER_FRAME) {
      pending.sort((a, b) => Math.abs(b.next - b.applied) - Math.abs(a.next - a.applied))
    }
    const writes = Math.min(pending.length, MAX_WRITES_PER_FRAME)
    for (let i = 0; i < writes; i++) {
      const glyph = pending[i]
      if (glyph) write(glyph, glyph.next)
    }
    const deferred = pending.length > writes
    pending.length = 0

    if (ripples.length || moving.size || deferred) {
      rafId = requestAnimationFrame(frame)
    } else {
      rafId = undefined
    }
  }

  function start(now: number) {
    if (rafId) return
    lastFrameAt = now
    rafId = requestAnimationFrame(frame)
  }

  function onPointerMove(event: PointerEvent) {
    if (event.pointerType !== 'mouse') return

    const root = rootRef.value
    if (!root) return
    if (!isMeasured) measure(root)

    const now = performance.now()
    const x = event.clientX + window.scrollX
    const y = event.clientY + window.scrollY
    const gap = now - lastMoveAt
    const distance = Math.hypot(x - lastX, y - lastY)

    if (gap > 0 && gap < MAX_SAMPLE_GAP_MS) {
      speed += (distance / gap - speed) * SPEED_SMOOTHING
      travelled += distance
    } else {
      speed = 0
      travelled = 0
    }

    lastX = x
    lastY = y
    lastMoveAt = now

    if (travelled < EMIT_SPACING) return
    travelled = 0

    ripples.push({ x, y, born: now, amp: Math.sqrt(clamp(speed / FULL_SPEED, 0, 1)), radius: 0, reach: 0, gain: 0 })
    if (ripples.length > MAX_RIPPLES) ripples.shift()
    start(now)
  }

  // The entrance animation slides blocks up by 15px; re-measure once it lands
  // (other transforms, like the footer link nudge, also land here — cheap)
  function onTransitionEnd(event: TransitionEvent) {
    if (event.propertyName === 'transform') invalidate()
  }

  function premeasure() {
    const run = () => {
      premeasureIdle = undefined
      const root = rootRef.value
      if (root && isEnabled.value && !isMeasured) measure(root)
    }
    premeasureTimeout = setTimeout(() => {
      premeasureTimeout = undefined
      // Safari has no requestIdleCallback
      if ('requestIdleCallback' in window) premeasureIdle = window.requestIdleCallback(run, { timeout: 1000 })
      else run()
    }, PREMEASURE_DELAY_MS)
  }

  function cancelPremeasure() {
    clearTimeout(premeasureTimeout)
    premeasureTimeout = undefined
    if (premeasureIdle !== undefined) window.cancelIdleCallback(premeasureIdle)
    premeasureIdle = undefined
  }

  function attach() {
    const root = rootRef.value
    if (!root || resizeObserver) return

    // Size changes cover fonts/images loading and viewport resizes; mutations
    // cover new text (language switch, mail label). Attribute changes are
    // ignored on purpose: our own inline weights are attribute changes.
    resizeObserver = new ResizeObserver(invalidate)
    resizeObserver.observe(root)
    mutationObserver = new MutationObserver(invalidate)
    mutationObserver.observe(root, { childList: true, subtree: true, characterData: true })

    root.addEventListener('transitionend', onTransitionEnd, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    premeasure()
  }

  function detach() {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = undefined
    ripples = []
    for (const glyph of moving) snapHome(glyph)

    cancelPremeasure()
    resizeObserver?.disconnect()
    resizeObserver = null
    mutationObserver?.disconnect()
    mutationObserver = null
    rootRef.value?.removeEventListener('transitionend', onTransitionEnd)
    window.removeEventListener('pointermove', onPointerMove)

    // Positions may be stale by the time it's re-enabled (rotation, resize)
    glyphs = []
    isMeasured = false
  }

  function onPointerQueryChange() {
    hasFinePointer.value = pointerQuery?.matches ?? false
  }

  watchWindowResize(({ width, height }) => {
    isMobile.value = width <= MOBILE_BREAKPOINT
    viewportHeight = height
  })

  watch(isEnabled, (value) => (value ? attach() : detach()))

  onMounted(() => {
    // Hybrid laptops can gain or lose a mouse at runtime
    pointerQuery = window.matchMedia(FINE_POINTER_QUERY)
    pointerQuery.addEventListener('change', onPointerQueryChange)
    onPointerQueryChange()
    if (isEnabled.value) attach()
  })

  onUnmounted(() => {
    detach()
    pointerQuery?.removeEventListener('change', onPointerQueryChange)
    pointerQuery = null
  })
}
