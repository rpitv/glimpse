<template>
  <div v-if="items.length > 0">
    <n-carousel ref="carousel" class="aspect-ratio">
      <div v-for="item of items" class="carousel-contents extend-height">
        <div v-if="item.__typename === 'Image'">
          <img :src="item.path" :alt="item.name" />
        </div>
        <div v-else-if="!item.metadata || !item.metadata.url" class="unsupported-format">
          Video currently doesn't have any metadata or a url to link to.
        </div>
        <div v-else class="extend-height">
          <iframe v-if="item.format === 'EMBED'" class="videoplayer" :src="item.metadata.url" title="YouTube video player" frameborder="0"  allowfullscreen></iframe>
          <div v-else class="unsupported-format">
            <p>Sorry, videos in this format currently cannot be played.</p>
            <p>Contact us to download a copy of this video.</p>
        </div>
      </div>
     </div>
    </n-carousel>
    <n-space justify="space-between" v-if="items.length > 1">
      <n-button text class="carousel-btns" @click="prev">
        <FontAwesomeIcon icon="fas fa-arrow-left" />
      </n-button>
      <n-button text class="carousel-btns" @click="next">
        <FontAwesomeIcon icon="fas fa-arrow-right" />
      </n-button>
    </n-space>
  </div>
  <div v-else>
    <p class="no-media">No images or videos available.</p>
  </div>
</template>

<script setup lang="ts">
import type {Image, Video} from "@/graphql/types";
import type {PropType} from "vue";
import { ref } from "vue";
import {NCarousel, NSpace, NButton} from "naive-ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const props = defineProps({
  items: {
    type: Array as PropType<
      (
        Pick<Video, "__typename" | "name" | "format" | "metadata"> |
        Pick<Image, "__typename" | "name" | "description" | "path">
        )[]>,
    required: true
  }
});

const carousel = ref<InstanceType<typeof NCarousel> | null>(null);

// Components don't load in fast enough for refs so we need to use functions instead of just calling their methods
function prev() {
  carousel.value?.prev();
}
function next() {
  carousel.value?.next();
}
</script>

<style scoped>
.aspect-ratio {
  position: relative;
  aspect-ratio: 16 / 9;
  background-color: black;
  height: 100%;
  width: 100%;
}
img {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: 100%;
}
.videoplayer {
  aspect-ratio: 16 / 9;
  height: 100%;
  width: 100%;
  border: 0px;
}
.carousel-btns {
  margin-top: 5px;
  font-size: 28px;
}
.no-media {
  text-align: center;
  font-style: italic;
}
.unsupported-format {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  font-style: italic;
}
.extend-height {
  position: relative;
  height: 100%;
}
</style>
