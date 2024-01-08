<template>
	<div :class="replicants.scoreboard.visible.value ? 'show' : 'hide'">
		<div class="scoreboard">
			<div class="game-info">
				<div class="logo game-info-child">
					<img id="logoImg" :src="rpitvLogo">
				</div>
				<div class="clock game-info-child">
					{{ formattedClockTime }}
				</div>
				<div class="period game-info-child">
					{{ formattedPeriod }}
				</div>
			</div>
			<div class="teams">
				<TeamView :teamId="1" class="team-view-1" />
				<TeamView :teamId="0" class="team-view-2" />
			</div>
			<div class="animation">
				<div class="animation-text text1">

				</div>
				<div class="animation-text text2">
					{{ scorer.toUpperCase() }}
				</div>
			</div>
		</div>
		<div class="global-announcements">
			<p v-if="replicants.announcements.global.value.length > 0">
				{{ computedMessage(replicants.announcements.global.value[0]).value }}
			</p>

			<p v-else-if="announcementType === 'global'">
				{{ powerPlayStatus }} {{ powerPlayClock }}
			</p>
		</div>
		<div class="team-announcements team2">
			<p v-if="replicants.announcements.team2.value.length > 0">
				{{ computedMessage(replicants.announcements.team2.value[0]).value}}
			</p>
			<p v-else-if="announcementType === 'away'">
				{{ powerPlayStatus }} {{ powerPlayClock }}
			</p>
			<p v-else-if="replicants.gameSettings.showShootouts.value">
				{{replicants.teams[1].shootouts.value}}
			</p>
		</div>
		<div class="team-announcements team1">
			<p v-if="replicants.announcements.team1.value.length > 0">
				{{ computedMessage(replicants.announcements.team1.value[0]).value}}
			</p>
			<p v-else-if="announcementType === 'home'">
			{{ powerPlayStatus }} {{ powerPlayClock }}
		</p>
			<p v-else-if="replicants.gameSettings.showShootouts.value">
				{{replicants.teams[0].shootouts.value}}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import rpitvLogo from "../../../../assets/football/rpitv_logo.png";
import { loadReplicants } from "../../../../browser-common/replicants";
import {computed, onMounted, ref, watch} from "vue";
import type {Ref} from "vue";
import TeamView from "./TeamView.vue";
import {Announcement} from "../../../../common/Announcement";
import gsap from "gsap";
import {calcLinearGrad, isLighter} from "../../../../dashboard/util";
import { CustomEase } from "gsap/CustomEase";
import { isLightColor } from "../../../../dashboard/util";

gsap.registerPlugin(CustomEase);

const replicants = await loadReplicants();

const clock = replicants.scoreboard.clock;
const period = replicants.scoreboard.period;
const announcementsPos = ref("21vw");
const team1Pos = ref("11.5vh");
const team2Pos = ref("11.5vh");
const scoreboardColor = ref("black");
const animationText = ref("");
const scorer = ref("");

let team1Open = false;
let team2Open = false;
let globalOpen = false;

// Animation
function showGlobal() {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(".global-announcements", {opacity: 1, duration: 1});
	t2.to(announcementsPos, {value: "29vw", duration: 1.5});
}

function hideGlobal() {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(".global-announcements", {opacity: 0, duration: 1});
	t2.to(announcementsPos, {value: "21vw", duration: 1.5});
}

function showTeam(teamPos: Ref<string>, element: string) {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(teamPos, {value: "15vh", duration: 1});
	t2.to(element, {opacity: 1, duration: 1})
}

function hideTeam(teamPos: Ref<string>, element: string) {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(teamPos, {value: "11.5vh", duration: 1});
	t2.to(element, {opacity: 0, duration: 1})
}

function runAnimation(team: number) {
	scoreboardColor.value = replicants.teams[team].primaryColor.value;
	animationText.value = isLightColor(scoreboardColor.value) ? "white" : "black";
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	const t3 = gsap.timeline();
	const t4 = gsap.timeline();
	const t5 = gsap.timeline();
	const t6 = gsap.timeline();
	const disappearance = 1.5;
	t1.to(".game-info", {top: "-4vh", duration: disappearance});
	t2.to(".team-view-1", {top: "5vh", left: "-10.5vw", duration: disappearance});
	t3.to(".team-view-2", {top: "5vh", left: "21vw", duration: disappearance});
	t4.fromTo(".text1",{left: "", filter: "", letterSpacing: 0, fontSize: "100vh"}, {fontSize: "8vh", duration: 2});
	t4.to(".text1", {fontSize: "9vh", duration: 0.5});
	t5.to(".text1", {letterSpacing: "1vw", duration: 2}, "+=2");
	t6.to(".text1", {
		innerText: "GOAL"
	})
	t4.to(".text1", {left: "75vw", duration: 1}, "+=1");
	t5.to(".text1", {filter: "blur(5vh)", duration: 1}, "-=0.5");
	scorer.value = replicants.teams[team].name.value;
	t4.fromTo(".text2", {left: "75vw", letterSpacing: 0}, {left: "0vw", duration: 1, ease: "power3.out"}, "-=1.25");
	t1.to(".game-info", {top: "0vh", duration: disappearance}, "+=4");
	t2.to(".team-view-1", {top: "0vh", left: "0vw", duration: disappearance}, "+=4");
	t3.to(".team-view-2", {top: "0vh", left: "12.5vw", duration: disappearance}, "+=4");
}

watch(replicants.teams[0].score, (n, o) => {
	if (n - o === 1)
		runAnimation(0);
});

watch(replicants.teams[1].score, (n, o) => {
	if (n - o === 1)
		runAnimation(1);
});

// Announcements
const team1FontColor = ref("black");
const team2FontColor = ref("black");

const team1Color1 = computed(() => {
	const linearGradient = calcLinearGrad(replicants.teams[0].secondaryColor.value);
	if (!isLighter(replicants.teams[0].secondaryColor.value, linearGradient))
		return linearGradient;
	return replicants.teams[0].secondaryColor.value;
});

const team1Color2 = computed(() => {
	const linearGradient = calcLinearGrad(replicants.teams[0].secondaryColor.value);
	if (!isLighter(replicants.teams[0].secondaryColor.value, linearGradient))
		return replicants.teams[0].secondaryColor.value;
	return linearGradient;
});

const team2Color1 = computed(() => {
	const linearGradient = calcLinearGrad(replicants.teams[1].secondaryColor.value);
	if (!isLighter(replicants.teams[1].secondaryColor.value, linearGradient))
		return linearGradient;
	return replicants.teams[1].secondaryColor.value;
});

const team2Color2 = computed(() => {
	const linearGradient = calcLinearGrad(replicants.teams[1].secondaryColor.value);
	if (!isLighter(replicants.teams[1].secondaryColor.value, linearGradient))
		return replicants.teams[1].secondaryColor.value;
	return linearGradient;
});

if (isLightColor(team1Color1.value)) team1FontColor.value = "white";
else team1FontColor.value = "black";

if (isLightColor(team2Color1.value)) team2FontColor.value = "white";
else team2FontColor.value = "black";

watch(team1Color1, (n, o) => {
	if (isLightColor(n)) team1FontColor.value = "white";
	else team1FontColor.value = "black";
});

watch(team2Color1, (n, o) => {
	if (isLightColor(n)) team2FontColor.value = "white";
	else team2FontColor.value = "black";
});
/*
	For all of these watchers below, we're adding these if statements
	because we don't want a situation where if a powerplay ends,
	the whole thing goes down while an announcement was up. Likewise, if someone
	turns off an announcement whilst there's a powerplay, we
	don't want the powerplay to go down.
 */

watch(replicants.announcements.global, (n, o) => {
	if (n.length === 0 && announcementType.value !== "global")
		hideGlobal();
	else
		showGlobal();
})

watch(replicants.announcements.team1, (n, o) => {
	if (!n.length && announcementType.value !== "away")
		hideTeam(team1Pos, ".team1");
	else
		showTeam(team1Pos, ".team1");
})

watch(replicants.announcements.team2, (n, o) => {
	if (!n.length && announcementType.value !== "home")
		hideTeam(team2Pos, ".team2");
	else
		showTeam(team2Pos, ".team2");
})

watch(replicants.gameSettings.showShootouts, (n, o) => {
	if (!replicants.gameSettings.showShootouts.value) {
		hideTeam(team1Pos, ".team1");
		hideTeam(team2Pos, ".team2");
	} else {
		showTeam(team1Pos, ".team1");
		showTeam(team2Pos, ".team2");
	}
})

function forHome() {
	if (!team1Open) {
		showTeam(team1Pos, ".team1");
		team1Open = !team1Open;
	}
	if (team2Open && !replicants.announcements.team1.value.length) {
		hideTeam(team2Pos, ".team2");
		team2Open = !team2Open;
	}
	if (globalOpen && !replicants.announcements.global.value.length) {
		hideGlobal();
		globalOpen = !globalOpen;
	}
}

function forAway() {
	if (team1Open && !replicants.announcements.team2.value.length) {
		hideTeam(team1Pos, ".team1");
		team1Open = !team1Open;
	}
	if (!team2Open) {
		showTeam(team2Pos, ".team2");
		team2Open = !team2Open;
	}
	if (globalOpen && !replicants.announcements.global.value.length) {
		hideGlobal();
		globalOpen = !globalOpen;
	}
}

function forGlobal() {
	if (team1Open && !replicants.announcements.team1.value.length) {
		hideTeam(team1Pos, ".team1");
		team1Open = !team1Open;
	}
	if (team2Open && !replicants.announcements.team2.value.length) {
		hideTeam(team2Pos, ".team2");
		team2Open = !team2Open;
	}
	if (!globalOpen) {
		showGlobal();
		globalOpen = !globalOpen;
	}
}

function forNone() {
	console.log(team1Open);
	if (team1Open && !replicants.announcements.team1.value.length) {
		hideTeam(team1Pos, ".team1");
		team1Open = !team1Open;
	}
	if (team2Open && !replicants.announcements.team2.value.length) {
		hideTeam(team2Pos, ".team2");
		team2Open = !team2Open;
	}
	if (globalOpen && !replicants.announcements.global.value.length) {
		hideGlobal();
		globalOpen = !globalOpen;
	}
}

const announcementType = computed(() => {
	if (!replicants.scoreboard.penalty.value) {
		forNone();
		return "";
	}
	// If we are in overtime
	if (replicants.gameSettings.periods.overtime.count.value + 3 < period.value) {
		forNone();
		return "";
	}
	if (replicants.gameSettings.periods.count.value === 4 || (replicants.gameSettings.periods.count.value === 5 &&
		replicants.gameSettings.periods.shootouts.value !== true)) {
		// If two away players are on penalty...
		if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value) {
			// If two home players are on penalty
			if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value) {
				forNone();
				return "";
			}
			if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
				forHome();
				return "home";
			}
			forHome();
			return "home";
		}
		// If two home players are on penalty...
		if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value) {
			// If two home players are on penalty
			if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value) {
				forNone();
				return "";
			}
			if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
				forAway();
				return "away";
			}
			forAway();
			return "away";
		}
		// If either away player is on a penalty...
		if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
			// If either home player is on a penalty...
			if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
				forNone();
				return "";
			}
			forHome();
			return "home";
		}
		// If either home player is on a penalty...
		if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
			// If either home player is on a penalty...
			if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
				forNone();
				return "";
			}
			forAway();
			return "away";
		}
	}
	if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value) {
		// If two home players are on penalty
		if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value) {
			forGlobal();
			return "global"
		}
		forHome();
		return "home";
	}
	// If two home players are on penalty...
	if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value) {
		// If two away players are on penalty
		if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value) {
			forGlobal();
			return "global";
		}
		forAway();
		return "away";
	}
	// If either away player is on a penalty...
	if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
		// If either home player is on a penalty...
		if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
			forGlobal();
			return "global";
		}
		forHome();
		return "home";
	}
	// If either home player is on a penalty...
	if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
		// If either home player is on a penalty...
		if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
			forGlobal();
			return "global";
		}
		forAway();
		return "away";
	}
	forNone();
	return "";
})

const powerPlayStatus = computed(() => {
	if (replicants.gameSettings.periods.count.value >= 5 && replicants.gameSettings.periods.shootouts.value)
		return "";
	// If we are in overtime
	if (replicants.gameSettings.periods.count.value === 4 || (replicants.gameSettings.periods.count.value === 5 &&
		replicants.gameSettings.periods.shootouts.value !== true)) {
		// If two away players are on penalty...
		if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value) {
			// If two home players are on penalty
			if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value)
				return "";
			if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value)
				return "4 on 3";
			return "5 on 3";
		}
		// If two home players are on penalty...
		if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value) {
			// If two home players are on penalty
			if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value)
				return "";
			if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value)
				return "4 on 3";
			return "5 on 3";
		}
		// If either away player is on a penalty...
		if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
			// If either home player is on a penalty...
			if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value)
				return "";
			return "Power Play";
		}
		// If either home player is on a penalty...
		if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
			// If either home player is on a penalty...
			if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value)
				return "";
			return "Power Play";
		}
	}
	// If two away players are on penalty...
	if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value) {
		// If two home players are on penalty
		if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value)
			return "3 on 3";
		if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value)
			return "4 on 3";
		return "5 on 3"
	}
	// If two home players are on penalty...
	if (replicants.teams[0].player1PenaltyNumber.value && replicants.teams[0].player2PenaltyNumber.value) {
		// If two home players are on penalty
		if (replicants.teams[1].player1PenaltyNumber.value && replicants.teams[1].player2PenaltyNumber.value)
			return "3 on 3";
		if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value)
			return "4 on 3";
		return "5 on 3";
	}
	// If either away player is on a penalty...
	if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value) {
		// If either home player is on a penalty...
		if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value)
			return "4 on 4";
		return "Power Play";
	}
	// If either home player is on a penalty...
	if (replicants.teams[0].player1PenaltyNumber.value || replicants.teams[0].player2PenaltyNumber.value) {
		// If either home player is on a penalty...
		if (replicants.teams[1].player1PenaltyNumber.value || replicants.teams[1].player2PenaltyNumber.value)
			return "4 on 4";
		return "Power Play";
	}
})

const powerPlayClock = computed(() => {
	let smallestTime = "";
	const times = [replicants.teams[0].player1PenaltyClock.value, replicants.teams[0].player2PenaltyClock.value,
		replicants.teams[1].player1PenaltyClock.value, replicants.teams[1].player2PenaltyClock.value];

	for (const time of times) {
		if (!time)
			continue;
		if (!smallestTime) {
			smallestTime = time;
			continue;
		}
		// If the minutes of the "smallest time" is less than the minute of the time, ignore it
		if (smallestTime.split(":")[0] < time.split(":")[0])
			continue;

		// If the minutes of the "smallest time" is equal to the minute of the time...
		if (smallestTime.split(":")[0] == time.split(":")[0]) {
			// If the seconds of the "smallest time" is less than the seconds of the time, ignore it
			if (smallestTime.split(":")[1] < time.split(":")[1] && smallestTime.split(":")[1] != "0")
				continue;
			smallestTime = time;
			continue;
		}
		smallestTime = time;
	}
	return smallestTime;
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

const formattedPeriod = computed<string>(() => {
	if(period.value > replicants.gameSettings.periods.count.value) {
		const overtimePeriod = period.value - replicants.gameSettings.periods.count.value;
		if (period.value > replicants.gameSettings.periods.overtime.count.value + 3)
			return 'S/O';
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
	if(lastNumberOfPeriod === 1) {
		return `${period.value}st`;
	} else if(lastNumberOfPeriod === 2) {
		return `${period.value}nd`;
	} else if(lastNumberOfPeriod === 3) {
		return `${period.value}rd`;
	} else {
		return `${period.value}th`;
	}
});

function computedMessage(message: Announcement) {
	return computed(() => {
		if(!message.timer || !message.timer.visible) {
			return message.message;
		} else {
			const timeRemaining = message.timer.length - (message.timer.startedAt - replicants.scoreboard.clock.time.value);

			const minutes = Math.max(0, Math.floor(timeRemaining / 60000)).toString();
			// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
			let seconds = Math.max(0, Math.floor((timeRemaining % 60000) / 1000)).toString().padStart(2, '0');

			if(minutes === '0') {
				return message.message + ' :' + seconds
			} else {
				return message.message + ' ' + minutes + ':' + seconds
			}
		}
	})
}


onMounted(() => {
	if (announcementType.value === "global" || replicants.announcements.global.value.length > 0) {
		globalOpen = true;
		showGlobal();
	}
	if (announcementType.value === "home" || replicants.announcements.team1.value.length > 0) {
		team2Open = true;
		showTeam(team1Pos, ".team1");
	}
	if (announcementType.value === "away" || replicants.announcements.team2.value.length > 0) {
		team1Open = true;
		showTeam(team2Pos, ".team2");
	}
})

</script>

<style scoped scss>
@font-face {
	font-family: "Malgun Gothic Bold";
	src: url("../../../../assets/rpitv-modern/MalgunGothicBold.ttf") format('truetype');
}

@font-face {
	font-family: "Roboto Condensed";
	src: url("../../../../assets/football/RobotoCondensed-Bold.ttf") format('truetype');
}

.scoreboard {
	position: absolute;
	top: 6vh;
	left: 4vw;
	height: 9vh;
	width: 25vw;
	background: v-bind(scoreboardColor);
	font-family: "Malgun Gothic Bold";
	font-weight: bold;
	z-index: 1;
	overflow: hidden;
}

.game-info {
	position: absolute;
	text-align: center;
	width: 25vw;
	height: 4vh;
	background: linear-gradient(#767676 1%, #000000);
	display: flex;
	justify-content: space-around;
	align-items: center;
	color: white;
	z-index: 100;
}
.game-info-child {
	font-size: 3.3vh;
	width: 7vw;
}

.logo {
	display: flex;
	align-items: center;
	justify-content: center;
}

#logoImg {
	height: 2.5vh;
}

.teams {
	position: absolute;
	display: flex;
	justify-content: space-evenly;
	height: 5vh;
	top: 4vh;
	z-index: 1;
}

.team-view-1 {
	width: 12.5vw;
	position: absolute;
	left: 0vw;
	height: 5vh;
}

.team-view-2 {
	position: absolute;
	left: 12.5vw;
	width: 12.5vw;
	height: 5vh;
}

.global-announcements {
	left: v-bind(announcementsPos);
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-family: "Malgun Gothic Bold";
	position: absolute;
	top: 6vh;
	background: linear-gradient(#FFEF16, #807701);
	height: 9vh;
	width: 8vw;
	font-size: 3.3vh;
	z-index: 0;
	opacity: 0;
	text-shadow: 0 0 0.2vh black;
}
.team-announcements {
	text-shadow: 0 0 0.2vh black;
	position: absolute;
	width: 12.5vw;
	height: 3.5vh;
	background-color: darkgray;
	z-index: 0;
	font-size: 2.3vh;
	font-family: "Malgun Gothic Bold";
	opacity: 0;
}

.team1 {
	top: v-bind(team1Pos);
	display: flex;
	justify-content: center;
	align-items: center;
	left: 16.5vw;
	background: linear-gradient(v-bind(team1Color1), v-bind(team1Color2));
	color: v-bind(team1FontColor);
}

.team2 {
	top: v-bind(team2Pos);
	display: flex;
	justify-content: center;
	align-items: center;
	left: 4vw;
	background: linear-gradient(v-bind(team2Color1), v-bind(team2Color2));
	color: v-bind(team2FontColor);
}

.animation {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 9vh;
	width: 25vw;
}

.animation-text {
	text-align: center;
	color: black;
	position: absolute;
	z-index: 0;
	height: 9vh;
	bottom: 0.5vh;
	font-family: "Roboto Condensed";
	color: v-bind(animationText);
}

.text2 {
	top: 2.25vh;
	font-size: 4vh;
	white-space: nowrap;
	text-align: center;
	overflow: visible;
	width: 25vw;
}

.show {
	opacity: 1;
	transition: 1s;
}
.hide {
	opacity: 0;
	transition: 1s;
}
</style>
