<template>
	<h1>Clock</h1>
	<SyncableToggle class="mt-10" name="Clock" v-model:enabled="clockEnabledValue" v-model:synced="clockSyncedValue"/>
	<div v-if="clockEnabledValue && !clockSyncedValue">
		<div class="mt-10">
			<label :for="periodLengthId">Period Length</label>
			<n-input :id="periodLengthId" placeholder="20:00.0" v-model="periodLengthValue"/>
		</div>
		<div class="mt-10">
			<label :for="periodCountId">Period Count</label>
			<n-input-number :id="periodCountId" min="1" v-model="periodCountValue"/>
		</div>
		<div class="mt-10">
			<label :for="overtimeEnabledId">Overtime?</label>
			<n-switch class="ml-10" :id="overtimeEnabledId" v-model:value="overtimeEnabledValue"/>
		</div>
		<div v-if="overtimeEnabledValue">
			<div class="mt-10">
				<label :for="overtimeLengthId">Overtime Length</label>
				<n-input :id="overtimeLengthId" placeholder="5:00.0" v-model="overtimeLengthValue"/>
			</div>
			<div class="mt-10">
				<label :for="overtimeCountId">Overtime Count (0 = infinite)</label>
				<n-input-number :id="overtimeCountId" min="0" v-model="overtimeCountValue"/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {NInput, NInputNumber, NSwitch} from "naive-ui";
	import SyncableToggle from "./SyncableToggle.vue";
	import {v4} from "uuid";
	import {ref} from "vue";

	// Generate unique IDs for each input element, so they can have a corresponding label.
	const periodLengthId = v4();
	const periodCountId = v4();
	const overtimeEnabledId = v4();
	const overtimeLengthId = v4();
	const overtimeCountId = v4();

	const clockEnabledValue = ref<boolean>(false);
	const clockSyncedValue = ref<boolean>(false);
	const periodLengthValue = ref<string>('');
	const periodCountValue = ref<number>(1);
	const overtimeEnabledValue = ref<boolean>(false);
	const overtimeLengthValue = ref<string>('');
	const overtimeCountValue = ref<number>(0);
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}

.ml-10 {
	margin-left: 10px;
}
</style>
