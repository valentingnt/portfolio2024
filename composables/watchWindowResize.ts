export type ResizeState = {
  width: number
  height: number
}

const state: ResizeState = {
  width: 0,
  height: 0
}

const listeners: (() => void)[] = []

export function watchWindowResize(listener: (state: ResizeState) => void): void {
  const wrappedListener = () => listener(state)

  onMounted(() => bind(wrappedListener))
  onUnmounted(() => unbind(wrappedListener))
}

function bind(listener: () => void): void {
  if (listeners.includes(listener)) return

  if (!listeners.length) {
    window.addEventListener('resize', update, { passive: true })
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
    window.removeEventListener('resize', update)
  }
}

function update(): void {
  state.width = window.innerWidth
  state.height = window.innerHeight

  for (const listener of listeners) {
    listener()
  }
}
