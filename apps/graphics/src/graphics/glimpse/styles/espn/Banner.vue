<template>
	<div class="banner" :class="{show: replicants.sync.values.sogs.value && replicants.scoreboard.visible.value, hide: !replicants.sync.values.sogs.value || !replicants.scoreboard.visible.value}">
		<div class="title">SHOTS ON GOAL</div>
		<div class="bottom"></div>
		<div class="upward-line"></div>
		<div class="left-team-name" :style="{color: replicants.teams[1].primaryColor.value}">
			{{ replicants.teams[1].schoolName.value }}
		</div>
		<div class="right-team-name" :style="{color: '#d6001c'}">
			{{ replicants.teams[0].schoolName.value }}
		</div>
		<div class="right-team-sogs"> {{ replicants.teams[0].shots.value }}</div>
		<div class="left-team-sogs"> {{ replicants.teams[1].shots.value }}</div>
	</div>
	<div class="banner" :class="{show: replicants.sync.values.faceoffs.value && replicants.scoreboard.visible.value, hide: !replicants.sync.values.faceoffs.value || !replicants.scoreboard.visible.value}">
		<div class="title">Faceoffs</div>
		<div class="bottom"></div>
		<div class="upward-line"></div>
		<div class="left-team-name" :style="{color: replicants.teams[1].primaryColor.value}">
			{{ replicants.teams[1].schoolName.value }}
		</div>
		<div class="right-team-name" :style="{color: '#d6001c'}">
			{{ replicants.teams[0].schoolName.value }}
		</div>
		<div class="right-team-sogs">{{ replicants.http.sidearms.body.value.hkgame?.team[1].totals.misc.facewon }} </div>
		<div class="left-team-sogs">{{ replicants.http.sidearms.body.value.hkgame?.team[0].totals.misc.facewon }}</div>
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
	--banner-width: 25.1vw;
}

.title {
	left: 0.3vw;
}

.banner {
	font-weight: 700;
	color: #424743;
	top: 11.35vh;
	left: 23.4vw;
	background-color: #d6d6d6;
	height: 6vh;
	width: var(--banner-width);
}

.bottom {
	top: 2.5vh;
	background-color: #eff0e6;
	height: 3.5vh;
	box-shadow: 0 0 0 0.3vh #b0b2ad inset;
	width: var(--banner-width);
}
.upward-line {
	background-color: #b0b2ad;
	height: 2vh;
	left: 12.55vw;
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
