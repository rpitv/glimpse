<template>
	<div class="scoreboard-container">
		<div :class="'scoreboard ' + (replicants.scoreboard.visible.value ? 'show' : 'hidden')">
			<div class="rpitv">
				<img :src="rpitvBug" class="logo">
			</div>
			<TeamView class="team" :team-id="0"/>
			<TeamView class="team" :team-id="1" />
			<div class="clock-period">
				<div class="period">
					{{ formattedPeriod.toUpperCase() }}
				</div>
				<div class="clock">
					{{ formattedClockTime }}
				</div>
			</div>
			<div class="play-clock">{{replicants.scoreboard.playClock.value}}</div>
			<div :class="'down-counter-announcements ' + (announcement.length ? 'announcement' : 'down')">
				{{announcement ? announcement :
					(replicants.scoreboard.possession.value === '' ? '' :
						`${getSuffix(replicants.scoreboard.down.value)} & ${replicants.scoreboard.yardsToGo.value}`)}}
			</div>
		</div>
	</div>
	<div class="animation-container">
		<div :class="'animation'">
			<div class="animation-text">
			</div>
			<div class="image-container">
				<img v-for="(i) in 10" :class="'animation-image ' + `image${i}`" :src="scoreImage">
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TeamView from "./TeamView.vue";
import { loadReplicants } from "../../../../browser-common/replicants";
import rpitvBug from "../../../../assets/football/rpitv_logo.png";
import {computed, ref, watch} from "vue";
import {calcLinearGrad, isLighter} from "../../../../dashboard/util";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { isLightColor } from "../../../../dashboard/util";

gsap.registerPlugin(CustomEase);
const replicants = await loadReplicants();

const clock = replicants.scoreboard.clock;
const period = replicants.scoreboard.period;

// Resets the period and down when it loads
period.value = 1;
replicants.scoreboard.down.value = 1;

const backgroundColor1 = ref<string>("#FFF700");
const backgroundColor2 = ref<string>("#807C00");
const announcementTextColor = ref<string>("white");

const announcement = computed(() => {
	let currentState = "";
	let linearGrad: string;
	if (replicants.announcements.team1.value[0]?.message) {
		currentState = replicants.announcements.team1.value[0].message;
		linearGrad = calcLinearGrad(replicants.teams[0].primaryColor.value);
		if (isLighter(replicants.teams[0].primaryColor.value, linearGrad)) {
			backgroundColor1.value = replicants.teams[0].primaryColor.value;
			backgroundColor2.value = linearGrad;
		} else {
			backgroundColor1.value = linearGrad;
			backgroundColor2.value = replicants.teams[0].primaryColor.value;
		}
	} else if (replicants.announcements.team2.value[0]?.message) {
		currentState = replicants.announcements.team2.value[0].message;
		linearGrad = calcLinearGrad(replicants.teams[1].primaryColor.value);
		if (isLighter(replicants.teams[1].primaryColor.value, linearGrad)) {
			backgroundColor1.value = replicants.teams[1].primaryColor.value;
			backgroundColor2.value = linearGrad;
		} else {
			backgroundColor1.value = linearGrad;
			backgroundColor2.value = replicants.teams[1].primaryColor.value;
		}
	} else {
		backgroundColor1.value = "#FFF700";
		backgroundColor2.value = "#807C00";
	}
	if (replicants.announcements.global.value[0]?.message) {
		currentState = replicants.announcements.global.value[0].message;
		backgroundColor1.value = "#FFF700";
		backgroundColor2.value = "#807C00";
	}
	console.log("THE FK")
	announcementTextColor.value = isLightColor(backgroundColor1.value) ? "white" : "black";
	return currentState;
})

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
})

function getSuffix(n: number) {
	if(n == 1) {
		return `${n}ST`;
	} else if(n == 2) {
		return `${n}ND`;
	} else if(n == 3) {
		return `${n}RD`;
	} else {
		return `${n}TH`;
	}
}

const formattedPeriod = computed<string>(() => {
	if(period.value > replicants.gameSettings.periods.count.value) {
		const overtimePeriod = period.value - replicants.gameSettings.periods.count.value;
		if(overtimePeriod === 1) {
			return 'OT';
		} else {
			return `OT${overtimePeriod}`;
		}
	}

	if(period.value === undefined) {
		return '1st';
	}

	// Teens for some reason all end in "th" in English.
	if(period.value > 10 && period.value < 20) {
		return period.value + 'th';
	}

	// For all other numbers, we need to figure out the suffix.
	const lastNumberOfPeriod = period.value % 10;
	return getSuffix(lastNumberOfPeriod);
});

function grabScoreType (n: number, teamNumber: number) {
	const animationText = ["", ""];
	if (n == 6)
		animationText[0] = "TOUCHDOWN";
	if (n == 3)
		animationText[0] = "FIELD GOAL"
	animationText[1] = replicants.teams[teamNumber].name.value;
	return animationText;
}

const stagger = 0.3;
function runAnimation() {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	const t3 = gsap.timeline();
	// Element goes from hidden to shown for 1 second
	t1.fromTo(".animation", {opacity: 0}, {duration: 1, opacity: 1});
	// Gets goal type (touchdown or field goal) and slowly spaces it out
	t1.fromTo(".animation-text", {letterSpacing: "normal", opacity: 0}, {
		duration: 3,
		innerText: String(scoreType.value[0]).toUpperCase(),
		letterSpacing: "4vw",
		ease: CustomEase.create("custom", "M0,0 C0.04,0.122 0.043,0.235 0.07,0.338 0.125,0.554 0.194,0.721 0.302,0.822 0.494,1.002 0.818,1.001 1,1 "),
		opacity: 1
	}, "-=0.25");
	// Text disappears before the animation fully ends
	t1.to(".animation-text", { duration: 1, opacity: 0}, "-=0.25");
	// Gets the team name and slowly spaces it out
	t1.fromTo(".animation-text", {letterSpacing: "1vw"}, {
		duration: 2,
		innerText: String(scoreType.value[1]).toUpperCase(),
		opacity: 1,
		letterSpacing: "2vw",
		ease: CustomEase.create("custom", "M0,0 C0.04,0.122 0.043,0.235 0.07,0.338 0.125,0.554 0.194,0.721 0.302,0.822 0.494,1.002 0.818,1.001 1,1 ")
	}, "-=0.15");
	// Whilst t1 is happening, we can have another element change, which will have the images go up and down
	t2.fromTo(".animation-image", {top: "6.6vh"},
		{duration: 3, top: "0.5vh", stagger: stagger, ease: CustomEase.create("custom", "M0,0 C0.104,0.204 0.456,2.144 1,0 ")}, "+=1");
	t1.to(".animation", {duration: 1, opacity: 0}, "+=0.75");
	t3.fromTo(".animation-image", {"--rotate": "0deg"}, {duration: 6, "--rotate": "720deg", stagger: stagger}, "+=1");
}

const scoreType = ref<string[]>([]);
const scoreImage = ref<string>("");

const teamColor1 = ref<string>("");
const teamColor2 = ref<string>("");

const nameColor = ref<string>("");

watch(replicants.teams[0].score, (n, o) => {
	scoreType.value = grabScoreType(n - o, 0);
	if (!scoreType.value[0])
		return;
	scoreImage.value = replicants.teams[0].logo.value;
	const linearGradient = calcLinearGrad(replicants.teams[0].primaryColor.value);
	if (!isLighter(replicants.teams[0].primaryColor.value, linearGradient)) {
		teamColor2.value = replicants.teams[0].primaryColor.value;
		teamColor1.value = linearGradient;
		nameColor.value =  isLightColor(teamColor2.value) ? "white" : "black";
	} else {
		teamColor1.value = replicants.teams[0].primaryColor.value;
		teamColor2.value = linearGradient;
		nameColor.value =  isLightColor(teamColor1.value) ? "white" : "black";
	}
	runAnimation();
})

watch(replicants.teams[1].score, (n, o) => {
	scoreType.value = grabScoreType(n - o, 1);
	if (!scoreType.value[0])
		return;
	scoreImage.value = replicants.teams[1].logo.value;
	const linearGradient = calcLinearGrad(replicants.teams[1].primaryColor.value);
	if (!isLighter(replicants.teams[1].primaryColor.value, linearGradient)) {
		teamColor2.value = replicants.teams[1].primaryColor.value;
		teamColor1.value = linearGradient;
		nameColor.value =  isLightColor(teamColor2.value) ? "white" : "black";
	} else {
		teamColor1.value = replicants.teams[1].primaryColor.value;
		teamColor2.value = linearGradient;
		nameColor.value =  isLightColor(teamColor1.value) ? "white" : "black";
	}
	runAnimation();
});

const possessionColors = computed(() => {
	const colors = ["#2b2b2b", "#dfdfdf", "black"];
	if (replicants.scoreboard.possession.value === '<') {
		const linearGradient = calcLinearGrad(replicants.teams[0].primaryColor.value);
		if (!isLighter(replicants.teams[0].primaryColor.value, linearGradient)) {
			colors[0] = replicants.teams[0].primaryColor.value;
			colors[1] = linearGradient;
			colors[2] = isLightColor(colors[0]) ? "white" : "black";
		} else {
			colors[1] = replicants.teams[0].primaryColor.value;
			colors[0] = linearGradient;
			colors[2] =  isLightColor(colors[1]) ? "white" : "black";
		}
	} else if (replicants.scoreboard.possession.value === '>') {
		const linearGradient = calcLinearGrad(replicants.teams[1].primaryColor.value);
		if (!isLighter(replicants.teams[1].primaryColor.value, linearGradient)) {
			colors[0] = replicants.teams[1].primaryColor.value;
			colors[1] = linearGradient;
			colors[2] = isLightColor(colors[0]) ? "white" : "black";
		} else {
			colors[1] = replicants.teams[1].primaryColor.value;
			colors[0] = linearGradient;
			colors[2] =  isLightColor(colors[1]) ? "white" : "black";
		}
	}
	return colors;
})

</script>

<style scoped lang="scss">
@font-face {
	font-family: "Malgun Gothic";
	src: url("../../../../assets/football/malgun.ttf") format('truetype');
}
@font-face {
	font-family: "Roboto Condensed";
	src: url("../../../../assets/football/RobotoCondensed-Bold.ttf") format('truetype');
}

.scoreboard-container {
	display: flex;
	justify-content: center;
}

.scoreboard {
	filter: drop-shadow(1vh 1vh 1vh #111111);
	position: fixed;
	top: 84.07vh;
	width: 77.35vw;
	height: 6.2vh;
	display: flex;
}

.show {
	opacity: 1;
	transition: 1s;
}

.hidden {
	opacity: 0;
	transition: 1s;
}

.rpitv {
	width: 8.2vw;
	height: 6.2vh;
	background: linear-gradient(#4E4E4E, #181818);
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 2vh 0 0 2vh;
}

.logo {
	width: 6.7vw;
	height: 4.56vh;
}

.clock-period {
	display: flex;
	width: 12vw;
	height: 6.2vh;
	background: linear-gradient(#9D9595, #2E2D2D);
	font-size: 4.56vh;
	color: white;
	justify-content: space-around;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
	text-align: center;
	font-family: "Malgun Gothic";
	font-weight: bold;
}


.play-clock {
	width: 4.45vw;
	height: 6.2vh;
	background: linear-gradient(#C5C5C5, #636363);
	font-size: 4.56vh;
	text-align: center;
	font-family: "Malgun Gothic";
	font-weight: bold;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
}



.down-counter-announcements {
	width: 20.7vw;
	height: 6.2vh;
	font-family: "Malgun Gothic";
	font-weight: bold;
	font-size: 4.3vh;
	text-align: center;
	border-radius: 0 2vh 2vh 0;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
}

.announcement {
	background: linear-gradient(v-bind(backgroundColor1), v-bind(backgroundColor2));
	color: v-bind(announcementTextColor);
}

.down {
	--color1: v-bind(possessionColors[0]);
	--color2: v-bind(possessionColors[1]);
	--color3: v-bind(possessionColors[2]);
	background: linear-gradient(var(--color2), var(--color1));
	color: var(--color3);
}

.animation-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.animation {
	display: flex;
	opacity: 1;
	top: 84.07vh;
	width: 77.35vw;
	height: 6.2vh;
	position: fixed;
	color: v-bind(nameColor);
	text-align: center;
	font-weight: bolder;
	text-shadow: 2px 2px 4px #292929;
	border-radius: 2vh 2vh 2vh 2vh;
	background: linear-gradient(v-bind(teamColor1), v-bind(teamColor2));
}

.animation-text {
	width: 77.35vw;
	position: fixed;
	bottom: 9vh;
	font-size: 6.2vh;
	font-family: 'Roboto Condensed', sans-serif;
}

.image-container {
	display: flex;
	justify-content: space-around;
	width: 77.35vw;
	height: 6.2vh;
	overflow: hidden;
}

.animation-image {
	--rotate: 0deg;
	position: relative;
	height: 3.1vh;
	top: 6vh;
	z-index: -5;
	filter: drop-shadow(0.2vh 0.2vw 0.2vw black);
	rotate: var(--rotate);
}

</style>
