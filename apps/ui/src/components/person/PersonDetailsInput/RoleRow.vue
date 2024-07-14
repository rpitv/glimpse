<template>
  <div class="flex mt-2" v-if="roles.length">
    <h2>Roles: </h2>
    <div class="chip-group">
      <v-dialog v-for="(role, i) in roles" :key="role.id" max-width="500">
        <template #activator="{ props }">
          <v-chip class="ml-1" closable v-bind="props"
                  @click:close="roles.splice(i, 1)" >
            <v-icon icon="fa:fas fa-pen-to-square" />&nbsp;Role ID: {{ role.role?.id }}
          </v-chip>
        </template>
        <template #default>
          <v-card :title="`Start and End Dates as ${role.role?.name} (Optional)`" min-width="350" >
            <v-card-text>
              <v-date-input v-model="role.startTime" label="Start Date" clearable />
              <v-date-input v-model="role.endTime" label="End Date" clearable  />
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </div>
  </div>
  <footer v-if="roles.length">Note: Click on the chip(s) to edit the start and end times</footer>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { PersonRole } from "@/graphql/types";

defineProps({
  roles: {
    type: Object as PropType<PersonRole[]>,
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
