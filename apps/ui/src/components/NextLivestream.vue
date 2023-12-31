<template>
  <div style="display: flex; flex-direction: column">
    <v-card v-for="(production, i) in productions" style="width: 100%;" class="mt-5">
      <iframe v-if="production?.videos[0]?.video.metadata.url" :src="production?.videos[0].video.metadata.url + `?rel=0;&autoplay=${i == 0 ? '1' : '0'}&mute=1&enablejsapi=1`"
          class="player" allowfullscreen allow="autoplay"
      ></iframe>
      <img v-else :src="production.thumbnail?.path ? production.thumbnail?.path : '/default_thumbnail_1200.png'" style="width: 100%" >
      <v-card-title>
        {{ production.name }}
      </v-card-title>
      <v-card-text>
        <p>{{ production.description }}</p>
        <br>
        <small>{{ moment(production.startTime).format("llll") }} to {{ moment(production.endTime).format("llll")}}</small>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { Production } from "@/graphql/types";
import type { PropType } from "vue";
import {computed} from "vue";
import moment from "moment/moment";

defineProps({
  productions: {
    type: Object as PropType<Production[]>,
    required: true
  }
});

</script>

<style scoped lang="scss">
.player {
  border: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: black;
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
