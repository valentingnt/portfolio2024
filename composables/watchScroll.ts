export interface WatchScrollParameters {
  enabled?: Readonly<Ref<boolean>>
  defer?: boolean
}

const scroll = ref(0)
const listeners: (() => void)[] = []

export function watchScroll(
  listener: (scroll: number) => void,
  { enabled, defer = false }: WatchScrollParameters = {}
): void {
  const isEnabled = enabled ?? ref(true)

  let wrappedListener: () => void

  if (defer) {
    let pending = false

    const deferredListener = () => {
      listener(scroll.value)
      pending = false
    }

    // Batch updates to one per animation frame
    wrappedListener = () => {
      if (pending) return
      pending = true
      requestAnimationFrame(deferredListener)
    }
  } else {
    wrappedListener = () => listener(scroll.value)
  }

  let unwatch: (() => void) | undefined

  onMounted(() => {
    unwatch = watch(
      isEnabled,
      (value) => (value ? bind(wrappedListener) : unbind(wrappedListener)),
      { immediate: true }
    )
  })

  onUnmounted(() => {
    unwatch?.()
    unbind(wrappedListener)
  })
}

function bind(listener: () => void): void {
  if (listeners.includes(listener)) return

  if (!listeners.length) {
    window.addEventListener('scroll', update, { passive: true })
    update()
  }

  listeners.push(listener)
  listener()
}

function unbind(listener: () => void): void {
  const index = listeners.indexOf(listener)

  if (index === -1) return

  listeners.splice(index, 1)

  if (!listeners.length) {
    window.removeEventListener('scroll', update)
  }
}

function update(): void {
  scroll.value = document.documentElement.scrollTop

  for (const listener of listeners) {
    listener()
  }
}
