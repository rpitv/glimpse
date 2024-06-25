<template>
  <div>
    <h2>Priority (Larger Numbers = Higher Priority)</h2>
    <v-table height="500" class="table">
      <thead>
      <tr>
        <th>Media Id</th>
        <th>Priority</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="image in productionImages" :key="image.id">
        <td>
          <v-dialog width="400">
            <template #activator="{ props }">
              <v-chip v-bind="props" v-tooltip="'Click to view image'">Image ID: {{ image.id }}</v-chip>
            </template>
            <template #default>
              <img :src="image.url">
            </template>
          </v-dialog>
        </td>
        <td>
          <v-number-input class="mt-3" v-model="image.priority"
              :inset="true" density="compact" />
        </td>
      </tr>
      <tr v-for="video in productionVideos" :key="video.id">
        <td><v-chip @click="openURL(video.url)" v-tooltip="'Click to open video link'">Video ID: {{ video.id }}</v-chip></td>
        <td>
          <v-number-input class="mt-3" v-model="video.priority"
              :inset="true" density="compact" />
        </td>
      </tr>
      <tr v-for="credit in creditPeople" :key="credit.personId">
        <td><v-chip v-tooltip="credit.name">Credit ID: {{ credit.personId }}</v-chip></td>
        <td>
          <v-number-input class="mt-3" v-model="credit.priority"
              :inset="true" density="compact" />
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  productionImages: {
    type: Object as PropType<Array<{id: number, url: string, priority: number}>>,
    required: true,
  },
  productionVideos: {
    type: Object as PropType<Array<{id: number, url: string, priority: number}>>,
    required: true,
  },
  creditPeople: {
    type: Object as PropType<{personId: number, name: string, title?: string, priority?: number}[]>,
    required: true
  }
});

function openURL(url: string) {
  window.open(url.replace("embed/", "watch?v="), '_blank', 'noreferrer')
}

</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
  border-left: none;
}
</style>
