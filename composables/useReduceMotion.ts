export type ReducedMotion = boolean
const MATCH_MEDIA_QUERY = '(prefers-reduced-motion: reduce)'

const isReducedMotionInitialValue = typeof window !== 'undefined' ? window.matchMedia(MATCH_MEDIA_QUERY).matches : false

const isReducedMotion = ref(isReducedMotionInitialValue)
const matchMediaResult = ref<MediaQueryList | undefined>(undefined)
const listeners: (() => void)[] = []

export interface UseReducedMotionParameters {}

export interface WatchReducedMotionParameters extends UseReducedMotionParameters {
  defer?: boolean
}

// eslint-disable-next-line no-empty-pattern
export function useReducedMotion({}: UseReducedMotionParameters = {}): Ref<ReducedMotion> {
  const proxy = ref(isReducedMotion.value)

  watchReducedMotion((reducedMotion: ReducedMotion) => {
    proxy.value = reducedMotion
  }, {})

  return proxy
}

export function watchReducedMotion(
  listener: (reducedMotion: ReducedMotion) => void,
  { defer = false }: WatchReducedMotionParameters = {}
): void {
  let wrappedListener: () => void

  if (defer) {
    let pending: boolean = false

    const deferListener = () => {
      listener(isReducedMotion.value)
      pending = false
    }

    wrappedListener = () => {
      !pending && (pending = true) && requestAnimationFrame(deferListener)
    }
  } else {
    wrappedListener = () => listener(isReducedMotion.value)
  }

  onMounted(() => {
    bind(wrappedListener)
  })

  onUnmounted(() => {
    unbind(wrappedListener)
  })
}

function bind(listener: () => void): void {
  if (!listeners.length) {
    matchMediaResult.value = window.matchMedia(MATCH_MEDIA_QUERY)
    matchMediaResult.value.addEventListener('change', update, { passive: true })
    update()
  } else if (listeners.includes(listener)) {
    return
  }

  listeners.push(listener)
  listener()
}

function unbind(listener: () => void): void {
  const index = listeners.indexOf(listener)

  if (index > -1) {
    listeners.splice(index, 1)
  }

  if (!listeners.length) {
    matchMediaResult.value?.removeEventListener('change', update)
  }
}

function update(): void {
  isReducedMotion.value = window.matchMedia(MATCH_MEDIA_QUERY).matches

  listeners.forEach((listener) => {
    listener()
  })
}