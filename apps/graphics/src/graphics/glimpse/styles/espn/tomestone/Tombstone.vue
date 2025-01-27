<template>
    <StandingsTombstone :class="replicants.fullscreen.standings.show.value ? 'show' : 'hide'" />
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import StandingsTombstone from "./StandingsTombstone.vue";

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">

</style>
