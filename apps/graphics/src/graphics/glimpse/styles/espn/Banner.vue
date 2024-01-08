<template>
	<div class="banner" :class="{show: replicants.sync.values.sogs.value && replicants.scoreboard.visible.value, hide: !replicants.sync.values.sogs.value || !replicants.scoreboard.visible.value}">
		<div class="title">SHOTS ON GOAL</div>
		<div class="bottom"></div>
		<div class="upward-line"></div>
		<div class="left-team-name" :style="{color: replicants.teams[1].primaryColor.value}">
			{{ replicants.teams[1].schoolName.value }}
		</div>
		<div class="right-team-name" :style="{color: replicants.teams[0].primaryColor.value}">
			{{ replicants.teams[0].schoolName.value }}
		</div>
		<div class="right-team-sogs"> {{ replicants.teams[0].shots.value }}</div>
		<div class="left-team-sogs"> {{ replicants.teams[1].shots.value }}</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../browser-common/replicants";
const replicants = await loadReplicants();
</script>

<style scoped>
.show {
	opacity: 1;
	transition: 1s;
}

.hide {
	opacity: 0;
	transition: 1s;
}


div {
	top: 0;
	left: 0;
	position: absolute;
	font-family: Roboto, sans-serif;
	font-size: 2.2vh;
}

.title {
	left: 0.3vw;
}

.banner {
	font-weight: 700;
	color: #424743;
	top: 11vh;
	left: 23.2vw;
	background-color: #d6d6d6;
	height: 6vh;
	width: 25.3vw;
}

.bottom {
	top: 2.5vh;
	background-color: #eff0e6;
	height: 3.5vh;
	width: 25.3vw;
	box-shadow: 0 0 0 0.3vh #b0b2ad inset;
}
.upward-line {
	background-color: #b0b2ad;
	height: 2vh;
	left: 12.6vw;
	top: 4vh;
	width: 0.3vh;
}
.left-team-name {
	top: 3vh;
	left: 0.3vw;
}
.right-team-name {
	top: 3vh;
	left: 13.2vw;
}
.left-team-sogs {
	top: 3vh;
	width: 12.1vw;
	text-align: right;
}
.right-team-sogs {
	top: 3vh;
	width: 48.4vw;
	text-align: center;
}
</style>
