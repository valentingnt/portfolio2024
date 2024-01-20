export type ScrollState = number

const scroll = ref(0)
const listeners: (() => void)[] = []

export interface UseScrollParameters {
  enabled?: Ref<boolean>
}

export interface WatchScrollParameters extends UseScrollParameters {
  defer?: boolean
}

export function useScroll({ enabled = undefined }: UseScrollParameters = {}): Ref<ScrollState> {
  const proxy = ref(scroll.value)

  watchScroll(
    (value: ScrollState) => {
      proxy.value = value
    },
    { enabled }
  )

  return proxy
}

export function watchScroll(
  listener: (scroll: ScrollState) => void,
  { enabled = undefined, defer = false }: WatchScrollParameters = {}
): void {
  let unwatch: (() => void) | undefined
  enabled = enabled || ref(true)

  let wrappedListener: () => void

  if (defer) {
    let pending: boolean = false

    const deferListener = () => {
      listener(scroll.value)
      pending = false
    }

    wrappedListener = () => {
      !pending && (pending = true) && requestAnimationFrame(deferListener)
    }
  } else {
    wrappedListener = () => listener(scroll.value)
  }

  onMounted(() => {
    unwatch = watch(enabled!, (enabled) => (enabled ? bind(wrappedListener) : unbind(wrappedListener)), {
      immediate: true
    })
  })

  onUnmounted(() => {
    unwatch!()
    unbind(wrappedListener)
  })
}

function bind(listener: () => void): void {
  if (!listeners.length) {
    window.addEventListener('scroll', update, { passive: true })
    update()
  } else if (listeners.includes(listener)) {
    return
  }

  listeners.push(listener)
  listener()
}

function unbind(listener: () => void): void {
  const index = listeners.indexOf(listener)

  if (index === -1) {
    return
  }

  listeners.splice(index, 1)

  if (!listeners.length) {
    removeEventListener('scroll', update, { passive: true } as any)
  }
}

function update(): void {
  scroll.value = document.documentElement.scrollTop

  listeners.forEach((listener) => {
    listener()
  })
}
