<template>
  <div class="flex-container mt-2" v-if="productionThumbnail.id">
    <h2>Thumbnail: </h2>
    <v-dialog width="400" scrim="black">
      <template v-slot:activator="{ props }" >
        <v-chip v-tooltip="'Click to view image'" v-bind="props" class="ml-3" closable
                @click:close="() => { productionThumbnail.url = ''; productionThumbnail.id = 0}">
          Image ID: {{ productionThumbnail.id }}
        </v-chip>
      </template>
      <template v-slot:default>
        <img :src="productionThumbnail.url">
      </template>
    </v-dialog>
  </div>
  <div class="flex-container mt-2" v-if="productionImages.length">
    <h2>Production Images: </h2>
    <div class="chip-group">
      <v-dialog v-for="(image, i) in productionImages" :key="image.id" width="400" scrim="black">
        <template v-slot:activator="{ props }">
          <v-chip v-tooltip="'Click to view image'" class="ml-1" closable v-bind="props"
                  @click:close="productionImages.splice(i, 1)" >
            Image ID: {{ image.id }}
          </v-chip>
        </template>
        <template v-slot:default>
          <img :src="image.url">
        </template>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  productionThumbnail: {
    type: Object as PropType<{id: number, url: string, priority?: number}>,
    required: true
  },
  productionImages: {
    type: Object as PropType<{id: number, url: string, priority?: number}[]>,
    required: true
  }
})

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
