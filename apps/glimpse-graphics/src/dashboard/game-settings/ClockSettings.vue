<template>
	<h1>Clock</h1>
	<SyncableToggle name="Clock" class="mt-10"
					v-model:enabled="replicants.gameSettings.clock.enabled.value"
					v-model:synced="replicants.sync.values.clock.value"/>

	<SyncableToggle name="Periods" class="mt-10"
					v-model:enabled="replicants.gameSettings.periods.enabled.value"
					v-model:synced="replicants.sync.values.period.value"/>

	<div v-if="arePeriodsEnabled && !arePeriodsSynced">
		<div class="mt-10">
			<label :for="periodLengthId">Period Length</label>
			<n-input :id="periodLengthId" placeholder="20:00.0" v-model="periodLength"/>
		</div>
		<div class="mt-10">
			<label :for="periodCountId">Period Count</label>
			<n-input-number :id="periodCountId" min="1" v-model:value="periodCount"/>
		</div>
		<div class="mt-10">
			<label :for="overtimeEnabledId">Overtime?</label>
			<n-switch class="ml-10" :id="overtimeEnabledId" v-model:value="isOvertimeEnabled"/>
		</div>
		<div v-if="isOvertimeEnabled">
			<div class="mt-10">
				<label :for="overtimeLengthId">Overtime Length</label>
				<n-input :id="overtimeLengthId" placeholder="5:00.0" v-model="overtimeLength"/>
			</div>
			<div class="mt-10">
				<label :for="overtimeCountId">Overtime Count (0 = infinite)</label>
				<n-input-number :id="overtimeCountId" min="0" v-model:value="overtimeCount"/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {NInput, NInputNumber, NSwitch} from "naive-ui";
import SyncableToggle from "./SyncableToggle.vue";
import {v4} from "uuid";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants();

// Generate unique IDs for each input element, so they can have a corresponding label.
const periodLengthId = v4();
const periodCountId = v4();
const overtimeEnabledId = v4();
const overtimeLengthId = v4();
const overtimeCountId = v4();

const arePeriodsEnabled = replicants.gameSettings.periods.enabled;
const arePeriodsSynced = replicants.sync.values.period.value;
const periodLength = replicants.gameSettings.periods.length;
const periodCount = replicants.gameSettings.periods.count;

const isOvertimeEnabled = replicants.gameSettings.periods.overtime.enabled;
const overtimeLength = replicants.gameSettings.periods.overtime.length;
const overtimeCount = replicants.gameSettings.periods.overtime.count;

</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}

.ml-10 {
	margin-left: 10px;
}
</style>
