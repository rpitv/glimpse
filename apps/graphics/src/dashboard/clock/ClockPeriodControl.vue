<template>
	<div>
		<div class="clock-section" v-if="isClockEnabled && !isClockSynced">
			<h2>Clock Control</h2>
			<div class="clock-start-stop-control">
				<n-button :disabled="isClockSynced"
						  @click="isClockRunning = !isClockRunning"
						  :type="isClockRunning ? 'error' : 'primary'"
						  large
				>
					{{ isClockRunning ? "Stop" : "Start" }} Clock
				</n-button>
			</div>

			<div class="clock-offset-buttons">
				<n-button type="info" @click="setClock(currentTime - 5000)">-5s</n-button>
				<n-button type="info" @click="setClock(currentTime - 1000)">-1s</n-button>
				<n-button type="info" @click="setClock(currentTime - 100)">-0.1s</n-button>
				<n-button type="info" @click="setClock(currentTime + 100)">+0.1s</n-button>
				<n-button type="info" @click="setClock(currentTime + 1000)">+1s</n-button>
				<n-button type="info" @click="setClock(currentTime + 5000)">+5s</n-button>
			</div>
		</div>

		<div class="period-section" v-if="arePeriodsEnabled && !arePeriodsSynced">
			<h2>Period Control</h2>
			<div class="period-slider">
				<n-button
					:disabled="currentPeriod <= 1"
					@click="currentPeriod = ((currentPeriod > 1) ? currentPeriod - 1 : 1)"
				>
					-1
				</n-button>
				<n-slider
					:min="1"
					:max="sliderMaxValue"
					v-model:value="currentPeriod"
					:format-tooltip="(val) => formatPeriod(val, periodCount, overtimeCount, areShootoutsEnabled)"
					:marks="sliderMarks"
				/>
				<n-button
					:disabled="currentPeriod >= maxPeriod"
					@click="currentPeriod = ((currentPeriod < maxPeriod) ? currentPeriod + 1 : maxPeriod)"
				>
					+1
				</n-button>
			</div>
		</div>

		<v-alert v-if="!arePeriodsSynced && arePeriodsEnabled && (overtimeCount > 3 || isOvertimeInfinite)"
				 type="info"
				 class="control-alert"
		>
			The period slider is only capable of supporting up to 3 overtime periods.
		</v-alert>

		<n-input-group class="clock-period-text-input">
			<n-input v-if="isClockEnabled && !isClockSynced"
				placeholder="00:00.0"
				type="text"
				v-model:value="setClockInput"
				@keydown="setClockInputKeyPressed"/>
			<n-button v-if="isClockEnabled && !isClockSynced" @click="setClock(setClockInput)">Set Clock</n-button>

			<n-input-number v-if="arePeriodsEnabled && !arePeriodsSynced"
							v-model:value="setPeriodInput"
							@keydown="setPeriodInputKeypressed"
							:min="1"
							:max="maxPeriod"
							:format="formatPeriodNumberInput"
							:parse="parsePeriodNumberInput"
			/>
			<n-button v-if="arePeriodsEnabled && !arePeriodsSynced"
					  @click="currentPeriod = setPeriodInput">
				Set Period
			</n-button>
		</n-input-group>


		<v-alert v-if="syncedFeatures" type="info" class="control-alert">
			{{ syncedFeatures }} cannot be manually controlled while Daktronics RTD sync is enabled.
		</v-alert>
	</div>
</template>

<script setup lang="ts">
import {NButton, NInput, NInputGroup, NInputNumber, NSlider} from "naive-ui";
import {formatPeriod, formatPeriodShorthand, parseTimeString} from "../util";
import {loadReplicants} from "../../browser-common/replicants";
import {computed, ref} from "vue";

const setPeriodInput = ref(1);
const setClockInput = ref('');

const replicate = await loadReplicants();

const currentTime = replicate.scoreboard.clock.time;
const isClockEnabled = replicate.gameSettings.clock.enabled;
const isClockSynced = replicate.sync.values.clock;
const isClockRunning = replicate.scoreboard.clock.isRunning;

const currentPeriod = replicate.scoreboard.period;
const arePeriodsEnabled = replicate.gameSettings.periods.enabled;
const arePeriodsSynced = replicate.sync.values.period;
const periodCount = replicate.gameSettings.periods.count;
const overtimeCount = replicate.gameSettings.periods.overtime.count;
const isOvertimeInfinite = replicate.gameSettings.periods.overtime.isInfinite;
const areShootoutsEnabled = replicate.gameSettings.periods.shootouts;

function setClock(newValue: string | number) {
	let newValueAsNumber;
	if (typeof newValue === 'string') {
		newValueAsNumber = parseTimeString(newValue);
	} else {
		newValueAsNumber = newValue;
	}

	currentTime.value = newValueAsNumber;
}

const maxPeriod = computed<number>(() => {
	if (isOvertimeInfinite.value) {
		return Number.MAX_SAFE_INTEGER;
	} else {
		if (areShootoutsEnabled.value) {
			return periodCount.value + overtimeCount.value + 1;
		} else {
			return periodCount.value + overtimeCount.value;
		}
	}
})

const sliderMarks = computed(() => {
	const realOvertimeCount = isOvertimeInfinite.value ? Number.MAX_SAFE_INTEGER : overtimeCount.value;
	const marks: Record<number, string> = {};
	for (let i = 1; i <= maxPeriod.value; i++) {
		marks[i] = formatPeriodShorthand(i, periodCount.value, realOvertimeCount, areShootoutsEnabled.value);
		if(i >= periodCount.value + 3) {
			break
		}
	}
	return marks;
});

const sliderMaxValue = computed<number>(() => {
	let overtimesToDisplay = Math.min(overtimeCount.value, 3);
	if(isOvertimeInfinite.value) {
		overtimesToDisplay = 3;
	}
	if(areShootoutsEnabled.value && overtimesToDisplay < 3) {
		overtimesToDisplay++;
	}
	return periodCount.value + overtimesToDisplay;
});

const syncedFeatures = computed<string>(() => {
	if(isClockSynced.value && arePeriodsSynced.value) {
		return 'Clock and Period';
	} else if(isClockSynced.value) {
		return 'Clock';
	} else if(arePeriodsSynced.value) {
		return 'Period';
	} else {
		return '';
	}
});

function formatPeriodNumberInput(value: number|null): string {
	if(value === null) {
		return '';
	}
	const realOvertimeCount = isOvertimeInfinite.value ? Number.MAX_SAFE_INTEGER : overtimeCount.value;
	return formatPeriodShorthand(value, periodCount.value, realOvertimeCount, areShootoutsEnabled.value);
}

function parsePeriodNumberInput(value: string) {
	value = value.toUpperCase()
	if(value === "S/O" || value === "SO") {
		return periodCount.value + overtimeCount.value + 1;
	} else if(value.includes('OT')) {
		return parseInt(value) + periodCount.value;
	}
	return parseInt(value);
}

function setClockInputKeyPressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		setClock(setClockInput.value);
	}
}

function setPeriodInputKeypressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		currentPeriod.value = setPeriodInput.value;
	}
}


</script>

<style scoped lang="scss">
h2 {
	text-align: center;
}

.period-section, .clock-section {
	margin-top: 20px;
	margin-bottom: 20px;
}

.clock-start-stop-control {
	display: flex;
	justify-content: center;
	margin-bottom: 10px;
}

.clock-period-text-input {
	display: flex;
	justify-content: center;
	margin-top: 10px;
	margin-bottom: 20px;
}

.clock-offset-buttons {
	display: flex;
	justify-content: center;

	* {
		margin-right: 0.5em;
	}
}
.control-alert {
	margin-bottom: 20px;
}
.period-slider {
	display: flex;
	* {
		margin-right: 5px;
		margin-left: 5px;
	}
}
</style>
