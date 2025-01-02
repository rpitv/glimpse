<template>
  <div class="flex-container mt-2" v-if="productionCategory?.id">
    <h2>Chosen Category: </h2>
    <div class="chip-group">
      <v-chip v-tooltip="productionCategory.name" class="ml-2" closable @click:close="emit('close')" >
        Category ID: {{ productionCategory.id }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Category } from "@/graphql/types";

const emit = defineEmits(["close"]);

defineProps({
  productionCategory: {
    type: Object as PropType<Category>,
    required: true
  }
});
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
