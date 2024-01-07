<template>
  <v-tabs v-model="tab" :grow="true">
    <v-tab value="1" style="font-size: 25px">
      <p style="font-weight: lighter">Ongoing Requests</p>
    </v-tab>
    <v-tab value="2" style="font-size: 25px">
      <p style="font-weight: lighter">Archive</p>
    </v-tab>
  </v-tabs>
  <div>
    <v-window v-model="tab">
      <v-window-item value="1">
        <SubmissionsTable :remoteRefresh="ongoingRefresh" @refresh="archiveRefresh = !archiveRefresh" :archived="false" />
      </v-window-item>
      <v-window-item value="2">
        <SubmissionsTable :remoteRefresh="archiveRefresh" @refresh="ongoingRefresh = !ongoingRefresh" :archived="true" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import SubmissionsTable from "@/components/contactsubmissions/SubmissionsTable.vue";

const tab = ref();
/*
 * When an admin commits a change, mainly going from an ongoing submission to an archived one,
 * we want to automatically refresh the opposite table. We do that by assigning a watcher to
 * the components that watches the below refs for changes, which will change when the opposing
 * component emits refresh.
 */
const archiveRefresh = ref(false);
const ongoingRefresh = ref(false);

</script>

<style scoped lang="scss">

</style>
