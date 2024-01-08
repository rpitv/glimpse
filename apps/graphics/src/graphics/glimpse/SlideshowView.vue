<template>
	<div :class="{show: replicants.slideshow.enabled.value, hide: !replicants.slideshow.enabled.value}" >
		<img :class="{show: firstImgLoaded, hide: !firstImgLoaded}" :src="firstImgSrc?.url" :alt="firstImgSrc?.base">
		<img :class="{show: !firstImgLoaded, hide: firstImgLoaded}" :src="secondImgSrc?.url" :alt="secondImgSrc?.base">
	</div>
</template>

<script setup lang="ts">
import {replicant} from "../../browser-common/replicant";
import {loadReplicants} from "../../browser-common/replicants";
import {ref, watch} from "vue";

const images = await replicant('assets:slideshow-images');
const replicants = await loadReplicants();

let intervalId: NodeJS.Timer;
const firstImgSrc = ref<any>(null);
const secondImgSrc = ref<any>(null);
const firstImgLoaded = ref<boolean>(true);

watch(replicants.slideshow.enabled, (value, oldValue) => {
	if (value) {
		let index = 0;
		// We want to immediately show the first image
		firstImgLoaded.value = true;
		firstImgSrc.value = images.value[index];
		index++;
		if (index >= images.value.length)
			index = 0;
		secondImgSrc.value = images.value[index];
		intervalId = setInterval(() => {
			index++;
			if (index >= images.value.length)
				index = 0;
			if (firstImgLoaded.value) {
				setTimeout(firstImgSrc.value = images.value[index], 1200);
				firstImgLoaded.value = false;
			} else {
				setTimeout(secondImgSrc.value = images.value[index], 1200);
				firstImgLoaded.value = true;
			}
		}, replicants.slideshow.interval.value * 1000);
	} else {
		clearInterval(intervalId);
		setTimeout(() => {
			firstImgLoaded.value = true;
		}, 1500);
	}
})

</script>

<style scoped>

img {
	top: 0;
	left: 0;
	position: absolute;
	width: 100%;
	height: 100%;
}

.hide {
	opacity: 0;
	transition: 1s;
}
.show {
	opacity: 1;
	transition: 1s;
}

</style>
