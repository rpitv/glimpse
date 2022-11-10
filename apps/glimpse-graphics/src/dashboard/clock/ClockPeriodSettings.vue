<template>
	<div>
		<n-grid :cols="2">
			<n-grid-item>
				<n-checkbox v-model:checked="isClockSynced">Sync Clock</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox v-model:checked="arePeriodsSynced">Sync Periods</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox :disabled="isClockSynced" v-model:checked="isClockEnabled">Enable Clock</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox :disabled="arePeriodsSynced" v-model:checked="arePeriodsEnabled">Enable Periods</n-checkbox>
			</n-grid-item>
		</n-grid>

		<n-grid class="mt-10" :cols="2" :x-gap="12">
			<n-grid-item>
				<label>Period Count</label>
				<n-input-number :min="1" v-model:value="periodCount" />
			</n-grid-item>
			<n-grid-item>
				<label>Overtime Count</label>
				<n-input-number :min="0" v-model:value="overtimeCount" :disabled="isOvertimeInfinite" />

				<div class="overtime-checkboxes">
					<n-checkbox v-model:checked="isOvertimeInfinite">Infinite Overtime</n-checkbox>
					<n-checkbox v-model:checked="areShootoutsEnabled">Shootouts</n-checkbox>
				</div>
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">

import {NGrid, NGridItem, NCheckbox, NInputNumber} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants()

const isClockSynced = replicants.sync.values.clock;
const isClockEnabled = replicants.gameSettings.clock.enabled;
const arePeriodsSynced = replicants.sync.values.period;
const arePeriodsEnabled = replicants.gameSettings.periods.enabled;

const periodCount = replicants.gameSettings.periods.count;
const overtimeCount = replicants.gameSettings.periods.overtime.count;
const isOvertimeInfinite = replicants.gameSettings.periods.overtime.isInfinite;

const areShootoutsEnabled = replicants.gameSettings.periods.shootouts;

</script>

<style scoped lang="scss">
	.mt-10 {
		margin-top: 10px;
	}
	.overtime-checkboxes {
		text-align: center;
	}
</style>
