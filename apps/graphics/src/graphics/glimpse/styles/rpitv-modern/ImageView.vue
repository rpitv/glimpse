<template>
	<div>
		<div v-for="img in images">
			<img :src="img.url" alt="" :class="img.visible ? '' : 'hidden'" />
		</div>
	</div>
</template>

<script setup lang="ts">

import {replicant} from "../../../../browser-common/replicant";

const images = await replicant('assets:images');
</script>

<style scoped lang="scss">
div {
	position: absolute;
}
img {
	position: absolute;
	top: 0;
	left: 0;

	width: 100vw;
	height: 100vh;

	transition: opacity 1s;
}
.hidden {
	opacity: 0;
}
</style>
