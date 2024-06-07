<template>
  <div class="flex mt-2" v-if="roles.length">
    <h2>Roles: </h2>
    <v-chip-group column>
      <v-dialog v-for="(role, i) in roles" :key="role.id" >
        <template #activator="{ props }">
          <v-chip class="ml-1" closable v-bind="props"
                  @click:close="roles.splice(i, 1)" >
            Role ID: {{ role.id }}
          </v-chip>
        </template>
        <template #default>
          <div class="dialog-card">
            <v-card :title="`Start and End Dates as ${role.name} (Optional)`" min-width="350" >
              <v-card-text>
                <v-date-input v-model="role.startDate" label="Start Date" clearable />
                <v-date-input v-model="role.endDate" label="End Date" clearable  />
              </v-card-text>
            </v-card>
          </div>
        </template>
      </v-dialog>
    </v-chip-group>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  roles: {
    type: Object as PropType<roleInterface[]>,
    required: true
  }
});

interface roleInterface {
  id: number | null,
  name: string,
  startDate?: Date,
  endDate?: Date
}

</script>

<style scoped lang="scss">
.flex {
  display: flex;
}

.dialog-card {
  display: flex;
  justify-content: center;
}

</style>
