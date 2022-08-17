<template>
	<div class="clock-section">
		<div class="clock-time">
			{{ scoreboardMinutes }}:{{ scoreboardSeconds }}.{{ scoreboardMillis }}
		</div>
		<div class="clock-start-stop-control">
			<n-button @click="toggleClock()" large :type="isClockRunningRep?.data ? 'error' : 'primary'">
				{{ isClockRunningRep?.data ? "Stop" : "Start" }} Clock
			</n-button>
		</div>
		<n-input-group class="clock-set-controls">
			<n-input placeholder="00:00.0" type="text" v-model:value="setClockInput" @keydown="setClockInputKeypressed"/>
			<n-button @click="setClock(setClockInput)">Set Clock</n-button>
		</n-input-group>

		<div class="clock-offset-buttons">
			<div>
				<n-button class="clock-offset-btn" type="info" @click="setClock((clockTimeRep?.data ?? 0) - 5000)">
					-5s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock((clockTimeRep?.data ?? 0) - 1000)">
					-1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock((clockTimeRep?.data ?? 0) - 100)">
					-0.1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock((clockTimeRep?.data ?? 0) + 100)">
					+0.1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock((clockTimeRep?.data ?? 0) + 1000)">
					+1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock((clockTimeRep?.data ?? 0) + 5000)">
					+5s
				</n-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {useReplicant} from 'nodecg-vue-composable';
import {computed, ref} from "vue";
import {NButton, NInput, NInputGroup} from "naive-ui";

const setClockInput = ref('');

const clockTimeRep = useReplicant<number>(
	'clockTime',
	'glimpse-graphics_scoreboard_clock'
);

const isClockRunningRep = useReplicant<boolean>(
	'isClockRunning',
	'glimpse-graphics_scoreboard_clock'
);

function toggleClock() {
	if (isClockRunningRep?.data) {
		nodecg.sendMessage('glimpse-graphics_scoreboard_clock_stopClock');
	} else {
		nodecg.sendMessage('glimpse-graphics_scoreboard_clock_startClock');
	}
}

function setClock(newValue: string | number) {
	let newValueAsNumber;
	if (typeof newValue === 'string') {
		const inputSplitAtColon = newValue.split(':');
		let inputSplitAtDot: string[];
		if (inputSplitAtColon[1] !== undefined) {
			inputSplitAtDot = inputSplitAtColon[1].split('.');
		} else {
			inputSplitAtDot = []; // TODO refactor
		}

		const minutes = parseInt(inputSplitAtColon[0]);
		let seconds = parseInt(inputSplitAtDot[0]);
		let millis = parseInt(inputSplitAtDot[1]);

		if (isNaN(seconds)) {
			seconds = 0;
		}
		if (isNaN(millis)) {
			millis = 0;
		}

		if (isNaN(minutes) || seconds < 0 || seconds > 59 || millis < 0 || millis > 9) {
			return; // TODO
		}

		newValueAsNumber = minutes * 60000 + seconds * 1000 + millis * 100
	} else {
		newValueAsNumber = newValue;
	}

	nodecg.sendMessage('glimpse-graphics_scoreboard_clock_setClock', newValueAsNumber);
}

function setClockInputKeypressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		setClock(setClockInput.value);
	}
}

const scoreboardMinutes = computed<string>(() => {
	// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
	return Math.floor((clockTimeRep?.data ?? 0) / 60000).toString().padStart(2, '0');
})

const scoreboardSeconds = computed<string>(() => {
	// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
	return Math.floor(((clockTimeRep?.data ?? 0) % 60000) / 1000).toString().padStart(2, '0');
})

const scoreboardMillis = computed<string>(() => {
	return Math.floor(((clockTimeRep?.data ?? 0) % 1000) / 100).toString();
})
</script>

<style scoped lang="scss">
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
</style>
