<template>
  <canvas ref="canvas" :width="960" :height="540" class="static"></canvas>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
const canvas: Ref<HTMLCanvasElement|null> = ref(null);

function generateNoise() {
  if(!canvas.value) {
    return;
  }
  const context = canvas.value.getContext('2d');
  if(!context) {
    return;
  }

  const canvasWidth = canvas.value.width;
  const canvasHeight = canvas.value.height;
  const imgData = context.createImageData(canvasWidth, canvasHeight);
  const buf = new Uint32Array(imgData.data.buffer);

  for(let i = 0; i < buf.length; i++) {
    const grey = 0x44 * Math.random();
    buf[i] = 0xff000000 | grey << 16 | grey << 8 | grey;
  }

  context.putImageData(imgData, 0, 0);
}

const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
if(mediaQuery && mediaQuery.matches) {
  // If user has animations disabled then just render a single frame of static
  onMounted(() => {
    generateNoise();
  })
} else {
  // If user has animations enabled then render static at 30fps
  let interval: number|undefined;
  onMounted(() => {
    interval = setInterval(() => {
      generateNoise();
    }, 1000 / 20);
  })
  onBeforeUnmount(() => {
    if(!interval) {
      return;
    }
    clearInterval(interval);
  })
}
</script>

<style scoped lang="scss">
.static {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
