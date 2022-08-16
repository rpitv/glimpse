<template>
	<div>Current time: {{scoreboardMinutes}}:{{scoreboardSeconds}}.{{scoreboardMillis}}</div>
	<button @click="toggleClock()">{{ isClockRunningRep?.data ? 'Stop' : 'Start' }} Clock</button>
</template>

<script setup lang="ts">
import {useReplicant} from 'nodecg-vue-composable';
import {computed} from "vue";

const clockTimeRep = useReplicant<number>(
	'clockTime',
	'glimpse-graphics_scoreboard_clock'
);

const isClockRunningRep = useReplicant<boolean>(
	'isClockRunning',
	'glimpse-graphics_scoreboard_clock'
);

function toggleClock() {
	if(isClockRunningRep?.data) {
		nodecg.sendMessage('glimpse-graphics_scoreboard_clock_stopClock');
	} else {
		nodecg.sendMessage('glimpse-graphics_scoreboard_clock_startClock');
	}
}

const scoreboardMinutes = computed(() => {
	return Math.floor((clockTimeRep?.data ?? 0) / 60000);
})

const scoreboardSeconds = computed(() => {
	return Math.floor(((clockTimeRep?.data ?? 0) % 60000) / 1000);
})

const scoreboardMillis = computed(() => {
	return Math.floor(((clockTimeRep?.data ?? 0) % 1000));
})
</script>

<style scoped lang="scss">
</style>
