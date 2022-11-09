<template>
	<div class="clock-section">
		<div style="display:flex; flex-direction: column; justify-content: center; align-items: center;">
			<n-checkbox v-model:checked="isClockSynced">Sync Clock</n-checkbox>
			<n-checkbox :disabled="isClockSynced" v-model:checked="isClockEnabled">Enable Clock</n-checkbox>
		</div>

		<div class="clock-time">
			{{ formattedCurrentTime }}
		</div>

		<div v-if="!isClockSynced">
			<div v-if="isClockEnabled" class="clock-controls">
				<div class="clock-start-stop-control">
					<n-button :disabled="isClockSynced"
							  @click="isClockRunning = !isClockRunning"
							  :type="isClockRunning ? 'error' : 'primary'"
							  large
					>
						{{ isClockRunning ? "Stop" : "Start" }} Clock
					</n-button>
				</div>

				<n-input-group class="clock-set-controls">
					<n-input placeholder="00:00.0" type="text" v-model:value="setClockInput"
							 @keydown="setClockInputKeypressed"/>
					<n-button @click="setClock(setClockInput)">Set Clock</n-button>
				</n-input-group>

				<div class="clock-offset-buttons">
					<n-button type="info" @click="setClock(currentTime - 5000)">-5s</n-button>
					<n-button type="info" @click="setClock(currentTime - 1000)">-1s</n-button>
					<n-button type="info" @click="setClock(currentTime - 100)">-0.1s</n-button>
					<n-button type="info" @click="setClock(currentTime + 100)">+0.1s</n-button>
					<n-button type="info" @click="setClock(currentTime + 1000)">+1s</n-button>
					<n-button type="info" @click="setClock(currentTime + 5000)">+5s</n-button>
				</div>
			</div>
		</div>
		<div v-else>
			<p class="clock-disabled-message">Clock controls are disabled while Daktronics RTD sync is enabled.</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {NButton, NInput, NInputGroup, NCheckbox} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {millisToString, parseTimeString} from "../util";

const replicants = await loadReplicants();

const setClockInput = ref('');

const isClockEnabled = replicants.gameSettings.clock.enabled;
const isClockSynced = replicants.sync.values.clock;
const isClockRunning = replicants.scoreboard.clock.isRunning;
const currentTime = replicants.scoreboard.clock.time;

const formattedCurrentTime = computed<string>(() => {
	if (isClockEnabled.value) {
		return millisToString(currentTime.value);
	} else {
		return "Clock Disabled";
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

	* {
		margin-right: 0.5em;
	}
}

.clock-time {
	font-size: 3em;
	text-align: center;
}

.clock-disabled-message {
	text-align: center;
}
</style>
