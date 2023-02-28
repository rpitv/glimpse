<template>
  <div class="table-card-wrapper">
    <n-card class="table-card">
      <DashboardBreadcrumb :route="breadcrumbRoute"/>

      <div v-if="ability.can(AbilityActions.Create, AbilitySubjects.Stream)">
        <n-input-group>
          <n-input v-model:value="fromValue" placeholder="From"/>
          <n-input v-model:value="toValue" placeholder="To"/>
          <n-button :disabled="!fromValue || !toValue" @click="startStream({from: fromValue, to: toValue})">Start</n-button>
        </n-input-group>
      </div>

      <n-table class="streams" v-if="streams !== null">
        <thead>
        <tr>
          <th>ID</th>
          <th>From</th>
          <th>To</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stream of streams.result.value?.findManyStream">
          <td>{{ stream.id }}</td>
          <td>{{ stream.from }}</td>
          <td>{{ stream.to }}</td>
          <td>{{ stream.message }}</td>
          <td>
            <n-button :disabled="!ability.can(AbilityActions.Delete, AbilitySubjects.Stream)" @click="stopStream({id: stream.id})">Stop</n-button>
          </td>
        </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {NCard, NButton, NInputGroup, NInput, NTable} from "naive-ui";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import {AbilityActions, useGlimpseAbility} from "@/casl";
import {
  AbilitySubjects,
  ListStreamsDocument,
  StartStreamDocument,
  StopStreamDocument
} from "@/graphql/types";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {ref} from "vue";

const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Stream', route: '/dashboard/stream'}
];

const ability = useGlimpseAbility();

const fromValue = ref<string>('');
const toValue = ref<string>('');

let streams = null;
if (ability.can(AbilityActions.Read, AbilitySubjects.Stream)) {
  streams = useQuery(ListStreamsDocument, null, {
    pollInterval: 1000
  });
}

const {mutate: startStream} = useMutation(StartStreamDocument);
const {mutate: stopStream} = useMutation(StopStreamDocument);


</script>

<style scoped lang="scss">

.table-card {
  width: 80%;
  margin-top: 6em;

}

.table-card-wrapper {
  display: flex;
  justify-content: center;
}

.streams {
  margin-top: 1em;
}
</style>
