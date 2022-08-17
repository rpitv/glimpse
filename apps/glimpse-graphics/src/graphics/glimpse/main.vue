<template>
	<div class="scoreboard">
		<div class="time">{{ formattedClockTime }}</div>
	</div>
</template>

<script setup lang="ts">
import {useReplicant} from 'nodecg-vue-composable';
import {computed} from "vue";

const clockTimeRep = useReplicant<number>(
	'clockTime',
	'glimpse-graphics_scoreboard_clock'
);

const formattedClockTime = computed(() => {
	const clockTime = clockTimeRep?.data;
	if (clockTime === undefined) {
		return '0:00.0';
	}

	const minutes = Math.floor((clockTimeRep?.data ?? 0) / 60000).toString();
	let seconds = Math.floor(((clockTimeRep?.data ?? 0) % 60000) / 1000).toString();
	const millis = Math.floor(((clockTimeRep?.data ?? 0) % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
})
</script>


<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Biryani:wght@400;700;900&display=swap');
</style>

