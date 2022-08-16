<template>
	<div>Hello, world!</div>
</template>

<script setup lang="ts">
import {useReplicant} from 'nodecg-vue-composable';

const clockTimeRep = useReplicant<number>(
	'clockTime',
	'glimpse-graphics_scoreboard_clock'
);
</script>


<style scoped lang="scss">
div {
	color: red;
	width: 50px;
	height: 50px;
}
</style>

