<template>
  <div v-if="items.length > 0">
    <v-carousel show-arrows="hover" hide-delimiters class="carousel" :height="height">
      <template v-slot:prev="{ props }">
        <v-btn
            variant="elevated"
            @click="props.onClick"
            icon=""
        >
          <font-awesome-icon icon="fa-sold fa-angle-left" />
        </v-btn>
      </template>
      <template v-slot:next="{ props }">
        <v-btn
            variant="elevated"
            @click="props.onClick"
            icon=""
        >
          <font-awesome-icon icon="fa-sold fa-angle-right" />
        </v-btn>
      </template>
      <v-carousel-item v-for="item of items">
        <div class="img-container" v-if="item.__typename === 'Image'">
          <img :src="item.path as string" :alt="item.name">
        </div>
        <div v-else-if="!item.metadata || !item.metadata.url" class="unsupported-format">
          Video currently doesn't have any metadata or a url to link to.
        </div>
        <div v-else style="width: 100%; height: 100%">
          <iframe v-if="item.format === 'EMBED'" :src="checkForEmbed(item.metadata.url)"
                  title="YouTube video player" allowfullscreen class="video-player" allow="autoplay"
          ></iframe>
          <div v-else class="unsupported-format">
            <p>Sorry, videos in this format currently cannot be played</p>
            <p>Contact us to download a copy of this video</p>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
  </div>
  <div v-else>
    <p class="no-media">No images or videos available</p>
  </div>
</template>

<script setup lang="ts">
import type {Image, Video} from "@/graphql/types";
import type {PropType} from "vue";
import { useDisplay } from "vuetify";
import { computed } from "vue";

const display = useDisplay();
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

const height = computed(() => {
  return display.width.value * 0.45;
})

/*
 * Reducing the constraints on what the officer has to put
 * as a link for the yt video.
 */
function checkForEmbed(url: string) {
  let position = url.indexOf("watch");
  if (position)
    return url.replace('/watch?v=', '/embed/')
  return url;
}

</script>

<style scoped lang="scss">

img {
  height: 100%;
  max-width: 100%;
}

.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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

.video-player {
  width: 100%;
  height: 100%;
  border: 0;
  aspect-ratio: 16 / 9;
}

</style>
