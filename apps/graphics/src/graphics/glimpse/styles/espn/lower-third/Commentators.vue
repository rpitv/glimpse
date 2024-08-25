<template>
	<img :style="commentatorsImage" :src="commentators" >
	<div :style="commentatorsContainer">
		<p v-if="replicants.lowerThird.commentators.leftPerson.name.value" :style="leftCommentator">
			{{ replicants.lowerThird.commentators.leftPerson.name.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.centerPerson.name.value" :style="centerCommentator">
			{{ replicants.lowerThird.commentators.centerPerson.name.value }}
		</p>
		<p v-if="replicants.lowerThird.commentators.rightPerson.name.value" :style="rightCommentator">
			{{ replicants.lowerThird.commentators.rightPerson.name.value }}
		</p>
	</div>
</template>

<script setup lang="ts">
import commentators from "../../../../../assets/espn/Commentators.png"
import { loadReplicants } from "../../../../../browser-common/replicants";
import type { CSSProperties } from "vue";
import { computed } from "vue";

const replicants = await loadReplicants();
const replicantCommentators = replicants.lowerThird.commentators;
const commentatorsImage = computed((): CSSProperties => {
	return {
		bottom: replicantCommentators.offsetY.value + "vh",
	}
});
const commentatorsContainer = computed((): CSSProperties => {
	return {
		alignItems: "center",
		bottom: replicantCommentators.offsetY.value + 17 + "vh",
		display: "flex",
		height: "5vh",
		justifyContent: "space-around",
		left: "14vw",
		position: "absolute",
		width: "72vw",
	}
});
const leftCommentator = computed((): CSSProperties => {
	return {
		color: replicantCommentators.leftPerson.nameColor.value || "rgb(63, 64, 59)",
		fontSize: replicantCommentators.leftPerson.nameSize.value + 3.5 + "vh",
	}
});
const centerCommentator = computed((): CSSProperties => {
	return {
		color: replicantCommentators.centerPerson.nameColor.value || "rgb(63, 64, 59)",
		fontSize: replicantCommentators.centerPerson.nameSize.value + 3.5 + "vh",
	}
});
const rightCommentator = computed((): CSSProperties => {
	return {
		color: replicantCommentators.rightPerson.nameColor.value || "rgb(63, 64, 59)",
		fontSize: replicantCommentators.rightPerson.nameSize.value + 3.5 + "vh",
	}
});
</script>

<style scoped>
@font-face {
	font-family: "swiss721_med";
	src: url('../../../../../assets/espn/Swiss721Medium.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_med";
}
img {
	position: absolute;
	left: 0;
	width: 100vw;
	height: 100vh;
	transition: opacity 1s;
}
</style>
