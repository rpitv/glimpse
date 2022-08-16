<template>
	<div>Yelloq!</div>
</template>

<script setup lang="ts">
import {useReplicant} from 'nodecg-vue-composable';
import {ref} from 'vue';

const text = ref('Example');

// Helper composable to make accessing/modifying replicants easier.
// For more information see https://github.com/Dan-Shields/nodecg-vue-composable
const exampleReplicant = useReplicant(
	'exampleReplicant',
	'nodecg-vue-ts-template',
);
</script>

<style scoped lang="scss">
div {
	background-color: blue;
	width: 50px;
	height: 50px;
}
</style>
