import type { Ref } from 'vue'

export type ResizeState = {
  width: number
  height: number
}

const state: ResizeState = {
  width: 0,
  height: 0
}

const listeners: (() => void)[] = []
let listener = () => {}

export type WatchWindowResizeCallback = (state: ResizeState) => void

export interface UseOnWindowResizeParameters {
  enabled?: Ref<boolean>
}

export interface WatchWindowResizeParameters extends UseOnWindowResizeParameters {
  deferred?: boolean
}

export interface UseScreenParameters {
  enabled?: Ref<boolean>
}

export function useOnWindowResize({ enabled = undefined }: UseOnWindowResizeParameters = {}): {
  width: Ref<number>
  height: Ref<number>
} {
  const proxy = {
    width: ref(state.width),
    height: ref(state.height)
  }

  watchWindowResize(
    (state: ResizeState) => {
      proxy.width.value = state.width
      proxy.height.value = state.height
    },
    { enabled }
  )

  return proxy
}

export function watchWindowResize(
  listener: WatchWindowResizeCallback,
  { enabled = undefined, deferred = false }: WatchWindowResizeParameters = {}
): void {
  let unwatch: (() => void) | undefined
  enabled = enabled || ref(true)

  let wrappedListener: () => void

  if (deferred) {
    let pending: boolean = false

    const deferredListener = () => {
      listener(state)
      pending = false
    }

    wrappedListener = () => {
      !pending && (pending = true) && requestAnimationFrame(deferredListener)
    }
  } else {
    wrappedListener = () => listener(state)
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
    addEventListener('resize', update, { passive: true })
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
    removeEventListener('resize', update, { passive: true } as EventListenerOptions)
  }
}

function update(): void {
  state.width = window.innerWidth
  state.height = window.innerHeight

  for (listener of listeners) {
    listener()
  }
}
