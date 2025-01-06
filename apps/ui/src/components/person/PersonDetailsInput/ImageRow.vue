<template>
  <div class="flex-container mt-2" v-if="profile.id">
    <h2>Profile Picture: </h2>
    <v-dialog width="400" >
      <template #activator="{ props }" >
        <v-chip v-tooltip="'Click to view image'" v-bind="props" class="ml-1" closable
                @click:close="emit('close')">
          Image ID: {{ profile.id }}
        </v-chip>
      </template>
      <template #default>
        <img :src="profile.path" :alt="profile.name" >
      </template>
    </v-dialog>
  </div>
  <div class="flex-container mt-2" v-if="images.length">
    <h2>Images: </h2>
    <div class="chip-group">
      <v-dialog v-for="(image, i) in images" :key="image.imageId" width="400" >
        <template #activator="{ props }">
          <v-chip v-tooltip="'Click to view image'" class="ml-1" closable v-bind="props"
                  @click:close="images.splice(i, 1)" >
            Image ID: {{ image.imageId }}
          </v-chip>
        </template>
        <template #default>
          <img :src="image.image?.path" :alt="image.image?.name">
        </template>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Image, PersonImage } from "@/graphql/types";

const emit = defineEmits(["close"]);

defineProps({
  profile: {
    type: Object as PropType<Image>,
    required: true
  },
  images: {
    type: Object as PropType<PersonImage[]>,
    required: true
  }
})

</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
  align-items: center;
}
.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
</style>
