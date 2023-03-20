<template>
  <n-card>
    <template #cover>
      <iframe v-if="production?.videos[0]?.video.metadata.url" :src="production?.videos[0].video.metadata.url" class="player" title="YouTube video player" allowfullscreen/>
      <h4 v-else class="no-video">Video does not have a url...</h4>
    </template>
      <div class="info">
        <h2 v-if="production?.name" class="filled">{{production?.name}}</h2>
        <h2 v-else class="empty">No title provided...</h2>
        <h4 v-if="production?.description" class="filled">{{production?.description}}</h4>
        <h4 v-else class="empty">No description provided...</h4>
      </div>
  </n-card>
</template>

<script setup lang="ts">
import { Production } from "@/graphql/types";
import type { PropType } from "vue";
import { NCard } from "naive-ui";

defineProps({
  production: {
    type: Object as PropType<Production>,
  }
})

</script>

<style scoped lang="scss">
.player {
  border: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: black;
}
.n-card{
  margin-bottom: 4%;
}
.filled {
  margin: 0 0;
}
.empty {
  margin: 1% 0;
  font-style: italic;
}
.no-video {
  margin: 1% 1%;
  font-style: italic;
}
</style>
