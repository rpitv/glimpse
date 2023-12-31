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
        <td>Image ID: {{ image.id }}</td>
        <td>
          <v-text-field class="mt-3" v-model="image.priority"
              type="number" density="compact" variant="outlined"/>
        </td>
      </tr>
      <tr v-for="video in productionVideos" :key="video.id">
        <td>Video ID: {{ video.id }}</td>
        <td>
          <v-text-field class="mt-3" v-model="video.priority"
              type="number" density="compact" variant="outlined"/>
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
    type: Object as PropType<Array<{id: string, url: string, priority: number}>>,
    required: true,
  },
  productionVideos: {
    type: Object as PropType<Array<{id: string, url: string, priority: number}>>,
    required: true,
  }
});

</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
  border-radius: 5px;
}
</style>
