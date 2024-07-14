<template>
  <div class="flex-container mt-2" v-if="creditPeople.length" >
    <h2>People: </h2>
    <div class="chip-group">
      <v-dialog v-for="(person, i) in creditPeople" :key="person.personId" >
        <template #activator="{ props }">
          <v-chip class="ml-1"  closable v-tooltip="person.person?.name" v-bind="props"
                  @click:close="creditPeople.splice(i, 1)" :key="person.personId">
            <v-icon icon="fa:fas fa-pen-to-square" />&nbsp;Person ID: {{ person.personId }}
          </v-chip>
        </template>
        <div class="dialog-card">
          <v-card :title="`Title for ${person.person?.name} (Optional)`" min-width="350" >
            <v-card-text>
              <v-combobox :items="titles" v-model.trim="creditPeople[i].title" label="Title" clearable />
            </v-card-text>
          </v-card>
        </div>
      </v-dialog>
    </div>
  </div>
  <footer v-if="creditPeople.length">Note: Click on the chip(s) to give people titles</footer>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Credit } from "@/graphql/types";

const titles = ["Cameraman", "Director", "Graphics Operator", "Producer"];

defineProps({
  creditPeople: {
    type: Object as PropType<Partial<Credit>[]>,
    required: true
  }
})

const emit = defineEmits(["assignTitle"]);

</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
  align-items: center;
}

.dialog-card {
  display: flex;
  justify-content: center;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

</style>
