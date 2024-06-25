<template>
  <div class="flex-container mt-2" v-if="productionVideos.length" >
    <h2>Production Videos: </h2>
    <div class="chip-group">
      <v-chip v-tooltip="'Click to open video link'" class="ml-1" v-for="(video, i) in productionVideos" closable @click="openURL(video.url)"
              @click:close="productionVideos.splice(i, 1)" :key="video.id">
        Video ID: {{ video.id }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  productionVideos: {
    type: Object as PropType<{id: number, url: string, priority: number}[]>,
    required: true
  }
});

function openURL(url: string) {
  window.open(url.replace("embed/", "watch?v="), '_blank', 'noreferrer')
}
</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>
