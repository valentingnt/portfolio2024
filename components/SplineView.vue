<script setup lang="ts">
import { Application } from '@splinetool/runtime'

const canvas = ref<HTMLCanvasElement | null>(null)
let app: Application
const { width, height } = useOnWindowResize()

function onResize() {
  if (app) app.setSize(width.value, height.value)
}

function createSplineView() {
  if (canvas.value) {
    app = new Application(canvas.value)
    app.load('https://prod.spline.design/kz-R06edYbCwBzh0/scene.splinecode')
  }
}

function destroySplineView() {
  if (app) app.dispose()
}

watchWindowResize(onResize)
onMounted(createSplineView)
onUnmounted(destroySplineView)
</script>

<template>
  <dov class="canvas-container">
    <canvas
      id="canvas"
      ref="canvas"
    />
  </dov>
</template>

<style scoped lang="scss">
.canvas-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: auto; 

  #canvas {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>