<template>
  <div class="flex-container mt-2" v-if="productionThumbnail.id">
    <h2>Thumbnail: </h2>
    <v-dialog width="400" scrim="black">
      <template v-slot:activator="{ props }" >
        <v-chip v-tooltip="'Click to view image'" v-bind="props" class="ml-3" closable
                @click:close="emit('close')">
          Image ID: {{ productionThumbnail.id }}
        </v-chip>
      </template>
      <template v-slot:default>
        <img :src="productionThumbnail.path" :alt="productionThumbnail.name">
      </template>
    </v-dialog>
  </div>
  <div class="flex-container mt-2" v-if="productionImages.length">
    <h2>Production Images: </h2>
    <div class="chip-group">
      <v-dialog v-for="(image, i) in productionImages" :key="image.image?.id" width="400" scrim="black">
        <template v-slot:activator="{ props }">
          <v-chip v-tooltip="'Click to view image'" class="ml-1" closable v-bind="props"
                  @click:close="productionImages.splice(i, 1)" >
            Image ID: {{ image.image?.id }}
          </v-chip>
        </template>
        <template v-slot:default>
          <img :src="image.image?.path" :alt="image.image?.name">
        </template>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { ProductionImage, Image } from "@/graphql/types";

const emit = defineEmits(["close"]);

defineProps({
  productionThumbnail: {
    type: Object as PropType<Image>,
    required: true
  },
  productionImages: {
    type: Object as PropType<ProductionImage[]>,
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
