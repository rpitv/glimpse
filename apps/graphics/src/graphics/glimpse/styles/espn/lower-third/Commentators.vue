<template>
	<img :src="commentators" :style="{'bottom': `${offset}vh`}">
	<div class="commentators-container">
		<p v-if="replicants.lowerThird.commentators.leftPerson.value" :style="{'bottom': `${offset}vh`}">
			{{ replicants.lowerThird.commentators.leftPerson.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.centerPerson.value" :style="{'bottom': `${offset}vh`}">
			{{ replicants.lowerThird.commentators.centerPerson.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.rightPerson.value" :style="{'bottom': `${offset}vh`}">
			{{ replicants.lowerThird.commentators.rightPerson.value }}
		</p>
	</div>
</template>

<script setup lang="ts">
import commentators from "../../../../../assets/espn/Commentators.png"
import { loadReplicants } from "../../../../../browser-common/replicants";
import {computed, ref, watch} from "vue";

const replicants = await loadReplicants();

const offset = computed(() => {
	if (replicants.lowerThird.commentators.offset.enabled.value)
		return replicants.lowerThird.commentators.offset.number.value;
	else
		return 0;
})

</script>

<style scoped>
@font-face {
	font-family: "swiss721_med";
	src: url('../../../../../assets/espn/Swiss721Medium.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_med";
	color: rgb(63, 64, 59);
}
img {
	position: absolute;
	left: 0;
	width: 100vw;
	height: 100vh;
	transition: opacity 1s;
}

.commentators-container {
	position: absolute;
	left: 14vw;
	bottom: 20vh;
	width: 72vw;
	height: 5vh;
	display: flex;
	justify-content: space-around;
	font-size: 3.5vh;
}
</style>
