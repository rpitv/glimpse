<template>
	<h1>Baseball Settings</h1>
	<SyncableToggle name="Bases" v-model:enabled="basesEnabledValue" v-model:synced="basesSyncedValue"/>
	<SyncableToggle class="mt-10" name="Bottom/Top" v-model:enabled="bottomTopEnabledValue"
					v-model:synced="bottomTopSyncedValue"/>
	<SyncableToggle class="mt-10" name="Outs/Strikes/Balls" v-model:enabled="outsStrikesBallsEnabledValue"
					v-model:synced="outsStrikesBallsSyncedValue"/>
</template>

<script setup lang="ts">
import SyncableToggle from "./SyncableToggle.vue";
import {ref} from "vue";

const basesEnabledValue = ref<boolean>(false);
const basesSyncedValue = ref<boolean>(false);
const bottomTopEnabledValue = ref<boolean>(false);
const bottomTopSyncedValue = ref<boolean>(false);
const outsStrikesBallsEnabledValue = ref<boolean>(false);
const outsStrikesBallsSyncedValue = ref<boolean>(false);
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
</style>
