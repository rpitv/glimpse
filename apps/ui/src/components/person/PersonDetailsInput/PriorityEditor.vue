<template>
  <div v-if="images.length">
    <h2>Priority (Larger Numbers = Higher Priority)</h2>
    <v-table height="500" class="table">
      <thead>
      <tr>
        <th>Image Id</th>
        <th>Priority</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="image in images" :key="image.id">
        <td class="align-center">
          <div >Image ID: {{ image.id }}</div>
        </td>
        <td>
          <v-number-input label="Priority" :inset="true" v-model="image.priority" />
        </td>
      </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  images: {
    type: Object as PropType<Array<{id: number | null, url: string, priority?: number}>>,
    required: true,
  },
});

</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
  border-left: none;
}

.align-center {
  display: flex;
  align-items: center;
}
</style>
