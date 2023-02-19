<template>
  <iframe :src="production?.videos[0].video.metadata.url" class="player" title="YouTube video player" allowfullscreen/>
  <div class="info">
    <h2 v-if="production?.name" id="title">{{production?.name}}</h2>
    <h2 v-else class="empty">No title provided...</h2>
    <h4 v-if="production?.description" id="description">{{production?.description}}</h4>
    <h4 v-else class="empty">No description provided...</h4>
  </div>
</template>

<script setup lang="ts">
import { Production, ProductionVideo } from "@/graphql/types";
import type { PropType } from "vue";
import { onMounted, ref } from "vue";

const props = defineProps({
  production: {
    type: Object as PropType<Production>,
  }
})

</script>

<style scoped>
.player {
  border: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: black;
}
.info {
  top: -5px;
  height: 15%;
  background-color: #21292f;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  margin-bottom: 10vh;
}
#title {
  padding: 0 1%;
  margin: 0;
}
#description {

  padding: 0 1%;
  margin: 0;
}
.empty {
  padding: 0 1%;
  margin: 0;
  font-style: italic;
}
</style>
