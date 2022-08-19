<template>
	<div class="clock-section" v-if="clockEnabledRep">
		<div class="clock-time">
			{{ scoreboardMinutes }}:{{ scoreboardSeconds }}.{{ scoreboardMillis }}
		</div>
		<div class="clock-start-stop-control">
			<n-button @click="toggleClock()" large :type="isClockRunningRep ? 'error' : 'primary'">
				{{ isClockRunningRep ? "Stop" : "Start" }} Clock
			</n-button>
		</div>
		<n-input-group class="clock-set-controls">
			<n-input placeholder="00:00.0" type="text" v-model:value="setClockInput" @keydown="setClockInputKeypressed"/>
			<n-button @click="setClock(setClockInput)">Set Clock</n-button>
		</n-input-group>

		<div class="clock-offset-buttons">
			<div>
				<n-button class="clock-offset-btn" type="info" @click="setClock(clockTimeRep - 5000)">
					-5s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock(clockTimeRep - 1000)">
					-1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock(clockTimeRep - 100)">
					-0.1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock(clockTimeRep + 100)">
					+0.1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock(clockTimeRep + 1000)">
					+1s
				</n-button>
				<n-button class="clock-offset-btn" type="info" @click="setClock(clockTimeRep + 5000)">
					+5s
				</n-button>
			</div>
		</div>

		<div class="period-section">
			<div class="current-period">Current Period: {{formattedCurrentPeriod}}</div>
			<n-input-group class="mt-10">
				<n-input-number v-model:value="setPeriodInput"
								@keydown="setPeriodInputKeypressed"
								:min="1"
								:max="maxPeriod"
				/>
				<n-button @click="currentPeriodRep = setPeriodInput">Set Period</n-button>
				<n-button :disabled="currentPeriodRep <= 1" @click="currentPeriodRep--">Decrement Period</n-button>
				<n-button :disabled="currentPeriodRep >= maxPeriod" @click="currentPeriodRep++">Increment Period</n-button>
			</n-input-group>
		</div>
	</div>
	<div v-else>
		<p class="clock-disabled-message">Clock is currently disabled.</p>
	</div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {NButton, NInput, NInputGroup, NInputNumber} from "naive-ui";
import {replicant} from "../../browser-common/replicant";
import {MessageComposable} from "../../common/MessageComposable";

const setClockInput = ref('');
const setPeriodInput = ref(1);

const clockEnabledRep = await replicant("enabled", "glimpse-graphics.game-settings.clock");

const clockTimeRep = await replicant<number>(
	'clockTime',
	'glimpse-graphics.scoreboard.clock',
	1200 * 1000
);

const isClockRunningRep = await replicant<boolean>(
	'isClockRunning',
	'glimpse-graphics.scoreboard.clock',
	false
);

const currentPeriodRep = await replicant<number>(
	'currentPeriod',
	'glimpse-graphics.scoreboard.clock',
	1
);

const periodCountRep = await replicant<number>('periodCount', 'glimpse-graphics.game-settings.clock');
const periodLengthRep = await replicant<number>('periodLength', 'glimpse-graphics.game-settings.clock');
const overtimeEnabledRep = await replicant<boolean>('overtimeEnabled', 'glimpse-graphics.game-settings.clock');
const overtimeLengthRep = await replicant<string>('overtimeLength', 'glimpse-graphics.game-settings.clock');
const overtimeCountRep = await replicant<number>('overtimeCount', 'glimpse-graphics.game-settings.clock');

const maxPeriod = computed<number>(() => {
	return overtimeEnabledRep ? periodCountRep.value + overtimeCountRep.value : periodCountRep.value;
})


const formattedCurrentPeriod = computed<string>(() => {
	if(currentPeriodRep.value <= periodCountRep.value) {
		return currentPeriodRep.value.toString();
	} else {
		const overtimePeriod = currentPeriodRep.value - periodCountRep.value;
		if(overtimePeriod === 1) {
			return "OT";
		} else {
			return "OT" + overtimePeriod.toString();
		}
	}
});

function toggleClock() {
	if (isClockRunningRep.value) {
		new MessageComposable('stopClock', 'glimpse-graphics.scoreboard.clock').send();
	} else {
		new MessageComposable('startClock', 'glimpse-graphics.scoreboard.clock').send();
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

	clockTimeRep.value = newValueAsNumber;
}

function setClockInputKeypressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		setClock(setClockInput.value);
	}
}
function setPeriodInputKeypressed(event: KeyboardEvent) {
	if (event.key === 'Enter') {
		currentPeriodRep.value = setPeriodInput.value;
	}
}

const scoreboardMinutes = computed<string>(() => {
	// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
	return Math.floor(clockTimeRep.value / 60000).toString().padStart(2, '0');
})

const scoreboardSeconds = computed<string>(() => {
	// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
	return Math.floor((clockTimeRep.value % 60000) / 1000).toString().padStart(2, '0');
})

const scoreboardMillis = computed<string>(() => {
	return Math.floor((clockTimeRep.value % 1000) / 100).toString();
})
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
