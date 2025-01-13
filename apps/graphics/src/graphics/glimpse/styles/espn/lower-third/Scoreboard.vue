<template>
	<img :src="scoreboard" alt="lower_third">
	<div :style="leftTeamName">
		<p>{{ replicantScoreboard.leftTeam.name.value || replicants.teams[1].schoolName}}</p>
	</div>
	<div :style="leftTeamScore">
		{{ replicantScoreboard.leftTeam.score.value || replicants.teams[1].score }}
	</div>
	<div :style="rightTeamName">
		<p>{{ replicantScoreboard.rightTeam.name.value || replicants.teams[0].schoolName }}</p>
	</div>
	<div :style="rightTeamScore">
		{{ replicantScoreboard.rightTeam.score.value || replicants.teams[0].score }}
	</div>
	<div :style="description" ref="scalingDiv">
		<span ref="scalingText" class="scaling-text">
		{{ replicantScoreboard.description.text.value }}
		{{ replicantScoreboard.description.timer.value && replicants.scoreboard.clock.time.value ? `(${formattedClockTime})` : ''}}
		</span>
	</div>
	<div class="colors" :style="leftTeamPrimaryColor">
		<img :style="leftTeamLogo" :src="replicants.lowerThird.scoreboard.leftTeam.logo.value || replicants.teams[1].logo.value">
	</div>
	<div class="colors" :style="leftTeamSecondaryColor"></div>
	<div class="colors" :style="rightTeamPrimaryColor">
		<img :style="rightTeamLogo" :src="replicants.lowerThird.scoreboard.rightTeam.logo.value || replicants.teams[0].logo.value">
	</div>
	<div class="colors" :style="rightTeamSecondaryColor"></div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../../../browser-common/replicants";
import { computed, watch, ref, nextTick, onMounted, onBeforeUnmount } from "vue";
import type { CSSProperties } from "vue";
import scoreboard from "../../../../../assets/espn/Scoreboard.png";

const replicants = await loadReplicants();

const replicantScoreboard = replicants.lowerThird.scoreboard;
const scalingDiv = ref<HTMLDivElement>();
const scalingText = ref<HTMLSpanElement>();

const leftTeamName = computed((): CSSProperties => { return {
	alignItems: "center",
	color: replicantScoreboard.leftTeam.nameColor.value,
	display: "flex",
	flexWrap: "nowrap",
	fontSize: replicantScoreboard.leftTeam.nameSize.value + 3.7 + "vh",
	height: "5.55vh",
	justifyContent: "center",
	left: "30.84vw",
	textAlign: "center",
	top: "79.26vh",
	width: "14vw",
}});
const leftTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "21.7vh",
	color: replicantScoreboard.leftTeam.scoreColor.value,
	display: "flex",
	fontSize: replicantScoreboard.leftTeam.scoreSize.value +  5.7 + "vh",
	height: "8.3vh",
	justifyContent: "center",
	left: "39.1vw",
	width: "6.2vw",
}});
const rightTeamName = computed((): CSSProperties => { return {
	alignItems: "center",
	color: replicantScoreboard.rightTeam.nameColor.value,
	display: "flex",
	flexWrap: "nowrap",
	fontSize: replicantScoreboard.rightTeam.nameSize.value + 3.7 + "vh",
	height: "5.55vh",
	justifyContent: "center",
	left: "54.75vw",
	textAlign: "center",
	top: "79.26vh",
	width: "14vw",
}});
const rightTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "21.7vh",
	color: replicantScoreboard.rightTeam.scoreColor.value,
	display: "flex",
	fontSize: replicantScoreboard.rightTeam.scoreSize.value + 5.7 + "vh",
	height: "8.3vh",
	justifyContent: "center",
	left: "54.5vw",
	width: "6.2vw",
}});
const description = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "11.5vh",
	color: replicantScoreboard.description.fontColor.value,
	display: "flex",
	fontSize: replicantScoreboard.description.fontSize.value + 2.36 + "vh",
	fontStyle: "italic",
	height: "4vh",
	justifyContent: "center",
	left: "44.5vw",
	width: "11vw",
}})
const leftTeamSecondaryColor = computed((): CSSProperties => { return {
	backgroundColor: replicantScoreboard.leftTeam.secondaryColor.value || replicants.teams[1].secondaryColor.value,
	left: "28.6vw",
	width: "1.84vw"
}});
const leftTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: replicantScoreboard.leftTeam.primaryColor.value || replicants.teams[1].primaryColor.value,
	display: "flex",
	justifyContent: "center",
	left: "30.7vw",
	width: "8vw",
}});
const rightTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: replicantScoreboard.rightTeam.primaryColor.value || replicants.teams[0].primaryColor.value,
	display: "flex",
	justifyContent: "center",
	left: "61.1vw",
	width: "8.1vw"
}});
const rightTeamSecondaryColor = computed((): CSSProperties => { return {
	backgroundColor: replicantScoreboard.rightTeam.secondaryColor.value || replicants.teams[0].secondaryColor.value,
	left: "69.3vw",
	width: "1.93vw",
}});
const leftTeamLogo = computed((): CSSProperties => { return {
	height: replicantScoreboard.leftTeam.logoSize.value + "%",
	maxHeight: "9.6vh",
	position: "relative",
	width: "auto",
}});
const rightTeamLogo = computed((): CSSProperties => { return {
	height: replicantScoreboard.rightTeam.logoSize.value + "%",
	maxHeight: "9.6vh",
	position: "relative",
	width: "auto",
}});

const clock = replicants.scoreboard.clock;
const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.time.value / 60000).toString();
	let seconds = Math.floor((clock.time.value % 60000) / 1000).toString();
	const millis = Math.floor((clock.time.value % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
});


const scaleTextToFit = () => {
	const div = scalingDiv.value;
	const text = scalingText.value;

	if (!div || !text) return;

	const divWidth = div.clientWidth;
	let fontSize = 2.36; // Default starting font size
	text.style.fontSize = fontSize + "vh"

	// Adjust font size only if the text exceeds the width
	while (text.offsetWidth > divWidth) {
		fontSize -= 0.2;
		text.style.fontSize = `${fontSize}vh`;

		if (fontSize <= 1) break; // Prevent infinite loop
	}
};

// Watch for changes in the text prop
watch([replicantScoreboard.description.text, replicants.scoreboard.clock.time, replicantScoreboard.description.autoFit,
			replicantScoreboard.description.fontSize, replicantScoreboard.description.timer],
	async () => {
		if (!replicantScoreboard.description.autoFit.value) {
			const text = scalingText.value;
			if (!text) return;
			text.style.fontSize = replicantScoreboard.description.fontSize.value + 2.36 + "vh";
			return;
		}
		await nextTick();
		scaleTextToFit();
	}
);

// Handle scaling on mount and cleanup on unmount
onMounted(() => {
	scaleTextToFit();
	window.addEventListener("resize", scaleTextToFit);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", scaleTextToFit);
});

</script>

<style scoped>
.scaling-text {
	white-space: nowrap;
	display: inline-block;
}

@font-face {
	font-family: "swiss721_heavy";
	src: url('../../../../../assets/espn/Swiss721Heavy.ttf')
}

div {
	position: absolute;
	font-family: "swiss721_heavy";
	text-align: center;
}
img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	transition: opacity 1s;
}
.colors {
	height: 9.6vh;
	bottom: 21.8vh;
}
</style>
