<template>
  <div class="flex-container mt-2" v-if="person.id" >
    <h2>People: </h2>
    <div class="chip-group">
      <v-chip class="ml-1" v-if="person.id" closable v-tooltip="person.name"
          @click:close="() => emit('close')" :key="person.id">
        Person ID: {{ person.id }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Person } from "@/graphql/types";

const emit = defineEmits(["close"])

defineProps({
  person: {
    type: Object as PropType<Partial<Person>>,
    required: true
  }
});



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
