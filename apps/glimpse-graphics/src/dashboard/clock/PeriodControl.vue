<template>

	<div class="period-section" v-if="arePeriodsEnabled">
		<div class="current-period">Current Period: {{ formattedCurrentPeriod }}</div>
		<n-input-group class="mt-10">
			<n-input-number v-model:value="setPeriodInput"
							@keydown="setPeriodInputKeypressed"
							:min="1"
							:max="maxPeriod"
			/>
			<n-button @click="currentPeriod = setPeriodInput">Set Period</n-button>
			<n-button :disabled="currentPeriod <= 1"
					  @click="currentPeriod--">
				Decrement Period
			</n-button>
			<n-button :disabled="currentPeriod >= maxPeriod"
					  @click="currentPeriod++">
				Increment Period
			</n-button>
		</n-input-group>
	</div>
</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import {NButton, NInput, NInputGroup, NCheckbox} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {millisToString, parseTimeString} from "../util";

const replicants = await loadReplicants();

const setClockInput = ref('');
const setPeriodInput = ref(1);

const arePeriodsEnabled = replicants.gameSettings.periods.enabled;
const arePeriodsSynced = replicants.sync.values.period.value; // TODO warn when modifying period manually
const periodCount = replicants.gameSettings.periods.count;

const isOvertimeEnabled = replicants.gameSettings.periods.overtime.enabled;
const overtimeCount = replicants.gameSettings.periods.overtime.count;

const isClockEnabled = replicants.gameSettings.clock.enabled;

const currentPeriod = replicants.scoreboard.period;
const isClockRunning = replicants.scoreboard.clock.isRunning;
const currentTime = replicants.scoreboard.clock.time;

const maxPeriod = computed<number>(() => {
	if (isOvertimeEnabled.value) {
		if (overtimeCount.value === 0) {
			return Number.MAX_VALUE;
		} else {
			return periodCount.value + overtimeCount.value;
		}
	} else {
		return periodCount.value;
	}
})

const formattedCurrentTime = computed<string>(() => {
	if(isClockEnabled.value) {
		return millisToString(currentTime.value);
	} else {
		return "Clock Disabled";
	}
});

const formattedCurrentPeriod = computed<string>(() => {
	if (currentPeriod.value <= periodCount.value) {
		return currentPeriod.value.toString();
	} else {
		const overtimePeriod = currentPeriod.value - periodCount.value;
		if (overtimePeriod === 1) {
			return "OT";
		} else {
			return "OT" + overtimePeriod.toString();
		}
	}
});

function setClock(newValue: string | number) {
	let newValueAsNumber;
	if (typeof newValue === 'string') {
		newValueAsNumber = parseTimeString(newValue);
	} else {
		newValueAsNumber = newValue;
	}

	currentTime.value = newValueAsNumber;
}

function setClockInputKeypressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		setClock(setClockInput.value);
	}
}

function setPeriodInputKeypressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		periodCount.value = setPeriodInput.value;
	}
}
</script>

<style scoped lang="scss">

.mt-10 {
	margin-top: 10px;
}

.clock-start-stop-control {
	display: flex;
	justify-content: center;
	margin-bottom: 10px;
}

.clock-set-controls {
	margin-bottom: 10px;
}

.clock-offset-buttons {
	display: flex;
	justify-content: center;
}


.clock-time {
	font-size: 3em;
	text-align: center;
}

.clock-offset-btn {
	margin-right: 0.5em;
}

.period-section {
	margin-top: 30px;
}

.current-period {
	text-align: center;
	font-size: 2em;
}

.clock-disabled-message {
	text-align: center;
}
</style>
