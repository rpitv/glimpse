<template>
	<img :src="Commentators">
	<div class="main-names">
		<p v-if="replicants.lowerThird.commentators.leftPerson.name.value">
			{{ replicants.lowerThird.commentators.leftPerson.name.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.centerPerson.name.value">
			{{ replicants.lowerThird.commentators.centerPerson.name.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.rightPerson.name.value">
			{{ replicants.lowerThird.commentators.rightPerson.name.value }}
		</p>
	</div>
	<div class="descriptions">
		<p v-if="replicants.lowerThird.commentators.leftPerson.name.value">
			{{ replicants.lowerThird.commentators.leftPerson.description.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.centerPerson.name.value">
			{{ replicants.lowerThird.commentators.centerPerson.description.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.rightPerson.name.value">
			{{ replicants.lowerThird.commentators.rightPerson.description.value }}
		</p>
	</div>
</template>

<script setup lang="ts">
import Commentators from "../../../../../assets/rpitv-modern/RPITVCommentator.png"
import { loadReplicants } from "../../../../../browser-common/replicants";

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
@font-face {
	font-family: "segoe-ui";
	src: url('../../../../../assets/rpitv-modern/segoe-ui.ttf')
}

img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

.main-names {
	position: absolute;
	top: 88.7vh;
	left: 10vw;
	height: 3.1vh;
	width: 78.83vw;
	display: flex;
	justify-content: space-around;
	align-items: center;
	font-family: "segoe-ui";
	font-weight: bold;
	font-size: 2.8vh;
	text-shadow: 0.2vh 0.2vh 0.2vh black;
	letter-spacing: 0.05vw;
	color: #e63636;
}
.descriptions {
	position: absolute;
	top: 92vh;
	left: 10vw;
	height: 2.4vh;
	width: 78.83vw;
	display: flex;
	justify-content: space-around;
	align-items: center;
	font-family: "segoe-ui";
	font-weight: lighter;
	font-size: 1.7vh;
	color: white;
	text-shadow: 0.2vh 0.2vh 0.3vh black
}
</style>
