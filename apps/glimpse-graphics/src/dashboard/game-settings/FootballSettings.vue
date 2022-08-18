<template>
	<h1>Football Settings</h1>
	<SyncableToggle name="Play Clock" v-model:enabled="playClockEnabledValue"
					v-model:synced="playClockSyncedValue"/>
	<SyncableToggle class="mt-10" name="Downs" v-model:enabled="downsEnabledValue"
					v-model:synced="downsSyncedValue"/>
	<SyncableToggle class="mt-10" name="Possession" v-model:enabled="possessionEnabledValue"
					v-model:synced="possessionSyncedValue"/>
</template>

<script setup lang="ts">
	import SyncableToggle from "./SyncableToggle.vue";
	import {ref} from "vue";

	const playClockEnabledValue = ref<boolean>(false);
	const playClockSyncedValue = ref<boolean>(false);
	const downsEnabledValue = ref<boolean>(false);
	const downsSyncedValue = ref<boolean>(false);
	const possessionEnabledValue = ref<boolean>(false);
	const possessionSyncedValue = ref<boolean>(false);
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
</style>
