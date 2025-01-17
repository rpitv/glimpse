<template>
	<img :src="PlayerBio">
	<div :style="imageBackground">
		<div class="image-container">
			<img class="player-img" :src="playerBio.image.url.value ?? ''">
		</div>
	</div>
	<div :style="action">
		{{ playerBio.action.description.value ? playerBio.action.description.value : "" }}
		{{ playerBio.action.player.number.value ? "#" + playerBio.action.player.number.value: "" }}
		{{ playerBio.action.player.name.value ?? "" }}
	</div>
	<div :style="info" class="info">
		<span v-for="(item, i) in infoItemsFiltered" :class="{
			'info-item': true,
			'border': (i < (infoItemsFiltered.length - 1)),
			'padding-left': i !== 0,
		}">
			{{ item }}
		</span>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import PlayerBio from "../../../../../assets/espn/playerBio.png";
import { computed, CSSProperties } from "vue";

const replicants = await loadReplicants();
const playerBio = replicants.lowerThird.playerBio;


const imageBackground = computed((): CSSProperties => {
	let color = ""
	if (!playerBio.image.syncTeamColor.value ) {
		// sync team colors disabled, check for override before default
		if (playerBio.image.defaultTeamColor.value !== "" && playerBio.image.defaultTeamColor.value !== null) {
			color = playerBio.image.defaultTeamColor.value
		} else {
			if (playerBio.action.player.teamSide.value === "leftTeam") {
				color = playerBio.image.leftTeamColor.value
			} else if (playerBio.action.player.teamSide.value === "rightTeam") {
				color = playerBio.image.rightTeamColor.value
			}
		}
	} else {
		// team colors synced
		if (playerBio.action.player.teamSide.value === "leftTeam") {
			color = replicants.teams[1].primaryColor.value
		} else if (playerBio.action.player.teamSide.value === "rightTeam") {
			color = replicants.teams[0].primaryColor.value
		}
	}

	return {
		position: "absolute",
		backgroundColor: color,
		bottom: playerBio.offset.value + 9.45 + "vh",
		display: "flex",
		justifyContent: "center",
		height: "10.7vh",
		left: "14.7vw",
		overflow: "hidden",
		width: "11.3vw",
	}
});

const action = computed((): CSSProperties => {
	return {
		color: "#3F3F3F",
		display: "flex",
		alignItems: "center",
		position: "absolute",
		bottom: playerBio.offset.value + (replicants.lowerThird.playerBio.info.show.value ? 12 : 10) + "vh",
		height: "9.7vh",
		left: "26.5vw",
		marginLeft: "1vw",
		width: "58.5vw",
		fontSize: playerBio.action.fontSize.value + (replicants.lowerThird.playerBio.info.show.value ? 3 : 5) + "vh",
	}
});


const info = computed((): CSSProperties => {
	return {
		opacity: playerBio.info.show.value ? 100 : 0,
		color: "#3F3F3F",
		display: "flex",
		alignItems: "center",
		position: "absolute",
		bottom: "7.4vh",
		height: "8.9vh",
		left: "26.5vw",
		marginLeft: "1vw",
		width: "58.5vw",
		fontSize: "3vh",
	}
});


const infoItemsFiltered = computed(() => {
	return [
		playerBio.info.height,
		playerBio.info.year,
		playerBio.info.weight,
		playerBio.info.hometown
	].filter(item => item.value !== "")
})
</script>

<style scoped lang="scss">
img {
	height: 100vh;
	width: 100vw;
}

@font-face {
	font-family: "swiss721_heavy";
	src: url('../../../../../assets/espn/Swiss721Heavy.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_heavy";
}
.player-img {
	position: relative;
	top: 2vh;
	height: 100%;
	width: auto;
	scale: 1.5;
	left: 2.7vw;
}

.image-container {
	display: flex;
	justify-content: center;
	height: 100%;
}

.info-item {
	font-family: "swiss721_med";
	display: flex;
	flex-direction: column;
	padding-bottom: 0.08vh;
	padding-right: 0.5vw;
}

.info-item.border {
	box-shadow: 0 0 0 0 #b9b9b9, 0.2vw 0 0 0 #b9b9b9;
}

.info-item.padding-left {
	padding-left: 0.5vw;
}
</style>
