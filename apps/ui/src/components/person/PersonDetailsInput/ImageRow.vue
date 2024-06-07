<template>
  <div class="flex-container mt-2" v-if="profile.id">
    <h2>Profile Picture: </h2>
    <v-dialog width="400" >
      <template v-slot:activator="{ props }" >
        <v-chip v-bind="props" class="ml-1" closable
                @click:close="() => { profile.url = ''; profile.id = null}">
          Image ID: {{ profile.id }}
        </v-chip>
      </template>
      <template v-slot:default>
        <img :src="profile.url">
      </template>
    </v-dialog>
  </div>
  <div class="flex-container mt-2" v-if="images.length">
    <h2>Images: </h2>
    <v-chip-group column>
      <v-dialog v-for="(image, i) in images" :key="image.id" width="400" >
        <template v-slot:activator="{ props }">
          <v-chip class="ml-1" closable v-bind="props"
                  @click:close="images.splice(i, 1)" >
            Image ID: {{ image.id }}
          </v-chip>
        </template>
        <template v-slot:default>
          <img :src="image.url">
        </template>
      </v-dialog>
    </v-chip-group>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  profile: {
    type: Object as PropType<urlInterface>,
    required: true
  },
  images: {
    type: Object as PropType<urlInterface[]>,
    required: true
  }
})

interface urlInterface {
  id: number | null,
  url: string,
  priority?: number
}

</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
  align-items: center;
}
</style>
