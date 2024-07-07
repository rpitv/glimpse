<template>
  <div>
    <h2>User Details</h2>
    <v-table height="500" class="table">
      <tbody>
        <tr>
          <td>Username</td>
          <td>{{ userData.username }}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{{ userData.mail }}</td>
        </tr>
        <tr>
          <td>Discord ID</td>
          <td>{{ userData.discord?.trim() ? userData.discord.trim() : "No discord ID provided."}}</td>
        </tr>
        <tr>
          <td>Groups</td>
          <td>
            <v-chip-group column v-if="groups.length" variant="outlined">
              <v-chip v-for="group in groups" :key="group.id" v-tooltip="group.name">
                Group ID: {{ group.id }}
              </v-chip>
            </v-chip-group>
            <p v-else>No groups provided.</p>
          </td>
        </tr>
        <tr>
          <td>Permissions</td>
          <td>{{ permissionsToAdd.length ? `${permissionsToAdd.length} permission${permissionsToAdd.length === 1 ? "" : "s"}` : "No permissions provided"}}</td>
        </tr>
        <tr>
          <td>Person</td>
          <td>
            <v-chip v-if="person.id" v-tooltip="person.name">
              Person ID: {{ person.id }}
            </v-chip>
            <p v-else>No person provided.</p>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type {Group, Person, User, UserPermission} from "@/graphql/types";

defineProps({
  userData: {
    type: Object as PropType<Partial<User>>,
    required: true
  },
  groups: {
    type: Object as PropType<Partial<Group>[]>,
    required: true
  },
  permissionsToAdd: {
    type: Object as PropType<Partial<UserPermission[]>>,
    required: true
  },
  person: {
    type: Object as PropType<Partial<Person>>,
    required: true
  }
});


</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
}

</style>
