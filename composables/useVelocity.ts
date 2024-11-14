export function useVelocity(): {
  velocity: Ref<number>
  updateVelocity: (startValue: number, endValue: number, max?: number) => void
} {
  const computedVelocity = ref<number>(0)
  let lastTimestamp = 0

  function updateVelocity(startValue: number, endValue: number, max = Number.POSITIVE_INFINITY) {
    const currentTimestamp = Date.now()
    const deltaTime = currentTimestamp - lastTimestamp

    const velocity = clamp((endValue - startValue) / deltaTime, -max, max)

    computedVelocity.value = velocity

    lastTimestamp = currentTimestamp
  }

  return { velocity: computedVelocity, updateVelocity }
}