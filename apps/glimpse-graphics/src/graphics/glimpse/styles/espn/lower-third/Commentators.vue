<template>
	<img :src="commentators">
	<div id="leftPerson">{{replicants.lowerThird.commentators.leftPerson.value}}</div>
	<div id="rightPerson">{{replicants.lowerThird.commentators.rightPerson.value}}</div>
</template>

<script setup lang="ts">
import commentators from "../../../../../assets/espn/Commentators.png"
import { loadReplicants } from "../../../../../browser-common/replicants";

const replicants = await loadReplicants();
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
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	transition: opacity 1s;
}
#leftPerson {
	left: 0;
	width: 55.6vw;
	text-align: center;
	bottom: 17.5vh;
	font-size: 3.5vh;
}
#rightPerson {
	left: 0;
	width: 144.3vw;
	text-align: center;
	bottom: 17.5vh;
	font-size: 3.5vh;
}
</style>
