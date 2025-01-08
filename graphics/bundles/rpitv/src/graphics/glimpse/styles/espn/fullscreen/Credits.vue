<template>
	<img class="credits" :src="FullScreen">
	<div :style="header">
		<p>Produced By</p>
		<img class="rpitvlogo" :src="RPITVLogo">
	</div>
	<div :style="creditsContainer">
		<div class="credit" v-for="(credit, i) in fullscreenCredits.credit.value">
			<p :style="title[i]">{{ credit.title }}</p>
			<p :style="people[i]" class="person" v-for="person in credit.people">{{ person }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import FullScreen from "../../../../../assets/espn/FullScreen.png";
import RPITVLogo from "../../../../../assets/rpitv-modern/rpitv_logo.svg";
import { loadReplicants } from "../../../../../browser-common/replicants";
import type { CSSProperties } from "vue";
import { computed } from "vue";

const replicants = await loadReplicants();
const fullscreenCredits = replicants.fullscreen.credits;

const header = computed((): CSSProperties => {
	return {
		bottom: "68vh",
		display: "flex",
		fontSize: "5vh",
		justifyContent: "space-between",
		left: "11vw",
		position: "absolute",
		width: "79vw"
	}
});
const creditsContainer = computed((): CSSProperties => {
	return {
		bottom: "20.9vh",
		display: "flex",
		height: "55vh",
		flexDirection: "column",
		flexWrap: "wrap",
		left: "13vw",
		width: "74.3vw",
	}
});

const people = computed((): CSSProperties[] => {
	const styles: CSSProperties[] = [];
	for (const credit of replicants.fullscreen.credits.credit.value) {
		styles.push({
			color: credit.peopleColor,
			fontSize: credit.peopleSize + 2.4 + "vh",
		});
	}
	return styles;
});

const title = computed((): CSSProperties[] => {
	const styles: CSSProperties[] = [];
	for (const credit of replicants.fullscreen.credits.credit.value) {
		styles.push({
			color: credit.titleColor,
			fontSize: credit.titleSize + 3.3 + "vh",
		});
	}
	return styles;
});

</script>

<style scoped lang="scss">
@font-face {
	font-family: "swiss721_heavy";
	src: url('../../../../../assets/espn/Swiss721Heavy.ttf');
}
@font-face {
	font-family: "swiss721_med";
	src: url('../../../../../assets/espn/Swiss721Medium.ttf');
}
div {
	position: absolute;
	font-family: "swiss721_heavy";
	color: #2d2c2c;
}

.credits {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}

.logo {
	position: absolute;
	width: 12vw;
	top: 8vh;
	left: 78vw;
}

.credit {
	position: relative;
}

.person {
	font-family: "swiss721_med";
}

.rpitvlogo {
	float: right;
	position: relative;
	width: 13vw;
	bottom: 5vh;
}
</style>
