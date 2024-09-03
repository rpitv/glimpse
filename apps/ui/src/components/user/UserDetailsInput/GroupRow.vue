<template>
  <div class="flex mt-2" v-if="groups.length">
    <h2>Roles: </h2>
    <div class="chip-group">
      <v-chip class="ml-1" closable v-for="(group, i) in groups" :key="group.id"
              @click:close="groups.splice(i, 1)" v-tooltip="group.name">
        Group ID: {{ group.id }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type {Group} from "@/graphql/types";

defineProps({
  groups: {
    type: Object as PropType<Partial<Group>[]>,
    required: true
  }
});

</script>

<style scoped lang="scss">
.flex {
  display: flex;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

</style>
