<template>
	<div class="body" v-if="replicants.lowerThird.endGraphics.type.value === 'scroll'">
		<div class="fade"></div>
		<section class="scroll-text">
			<div :class="{crawl: showCrawl}"
				 :style="{animationDuration: `${replicants.lowerThird.endGraphics.length.value}s`}">
				<h1 class="title">{{ replicants.lowerThird.endGraphics.title.value }}</h1>
				<h2>{{ replicants.lowerThird.endGraphics.message.value }}</h2>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import {ref, watch} from "vue";

const replicants = await loadReplicants()

const showCrawl = ref<boolean>(false);

watch(replicants.lowerThird.endGraphics.show, (newValue, oldValue) => {
	if (oldValue) {
		replicants.lowerThird.endGraphics.disabled.value = true;
		setTimeout(() => {
			replicants.lowerThird.endGraphics.disabled.value = false;
			replicants.lowerThird.endGraphics.show.value = false;
			showCrawl.value = false;
		}, 1000)
	} else
		showCrawl.value = true;
})

</script>

<style scoped>
/* modified from https://css-tricks.com/snippets/css/star-wars-crawl-text */
.body {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	white-space: pre-line;
	text-align: center;
	z-index: 3000;
}

.fade {
	position: relative;
	width: 100%;
	min-height: 75vh;
	top: -25px;
}

.scroll-text {
	display: flex;
	justify-content: center;
	position: relative;
	height: 800px;
	color: #feda4a;
	font-family: 'Pathway Gothic One', sans-serif;
	font-size: 500%;
	font-weight: 600;
	letter-spacing: 6px;
	line-height: 150%;
	perspective: 800px;
	text-align: center;
	-webkit-text-stroke: 7px black;
}

.crawl {
	position: relative;
	top: 99999px;
	transform-origin: 50% 100%;
	animation: crawl linear 30s infinite;
}

.crawl > .title {
	font-size: 200%;
	text-align: center;
}

.crawl > .title h1 {
	margin: 0 0 100px;
	text-transform: uppercase;
}

@keyframes crawl {
	0% {
		top: -100px;
		transform: rotateX(20deg) translateZ(0);
	}
	100% {
		top: -6000px;
		transform: rotateX(25deg) translateZ(-2500px);
	}
}
</style>
