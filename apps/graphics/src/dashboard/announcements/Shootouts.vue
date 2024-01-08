<template>
	<v-card class="shootouts" >
		<div v-if="block" >
			<h1 v-if="replicants.scoreboard.period.value !==
				replicants.gameSettings.periods.count.value +
				replicants.gameSettings.periods.overtime.count.value + 1">
				Shootouts are currently not ready yet
			</h1>
			<div v-else-if="!teamChosen" class="text-center">
				<h1>Shootouts detected</h1>
				<h2>Which team is first? (The graphic will not show up)</h2>
				<v-btn class="text-none ma-5" @click="chooseTeam(1)" variant="outlined">
					{{replicants.teams[1].schoolName.value}}
				</v-btn>
				<v-btn class="text-none ma-5" @click="chooseTeam(0)" variant="outlined">
					{{replicants.teams[0].schoolName.value}}
				</v-btn>
			</div>
			<div v-else class="text-none text-center mt-5" >
				<h2>Shootout Graphic is Ready</h2>
				<v-btn @click="startShootouts" variant="outlined">Start</v-btn>
			</div>
		</div>
		<div v-else class="text-center">
			<v-row>
				<v-col v-if="currentTeam === 1 || finished">
					<ShootoutsTeamView :teamIndex="1" @addVal="addVal" :disable="finished" />
				</v-col>
				<v-col v-if="currentTeam === 0 || finished">
					<ShootoutsTeamView :teamIndex="0" @addVal="addVal" :disable="finished"/>
				</v-col>
			</v-row>
			<footer v-if="gameState">{{gameState}}</footer>
			<v-btn v-if="!block" @click="finishShootouts" variant="outlined" >Finish</v-btn>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import ShootoutsTeamView from "./ShootoutsTeamView.vue";
import {loadReplicants} from "../../browser-common/replicants";
import {ref} from "vue";

const replicants = await loadReplicants();

const block = ref<boolean>(true);
const teamChosen = ref<boolean>(false);
const finished = ref<boolean>(false);

const team1Index = ref(0);
const team2Index = ref(0);
const currentTeam = ref();
const gameState = ref<string>();

function chooseTeam(index: number) {
	teamChosen.value = true;
	currentTeam.value = index;
}

function startShootouts() {
	block.value = false;
	finished.value = false;
	gameState.value = "";
	replicants.gameSettings.showShootouts.value = true;
	replicants.teams[0].shootouts.value = "---";
	replicants.teams[1].shootouts.value = "---";
}

function finishShootouts() {
	block.value = true;
	teamChosen.value = false;
	currentTeam.value = -1;
	replicants.gameSettings.showShootouts.value = false;
	replicants.teams[0].shootouts.value = "";
	replicants.teams[1].shootouts.value = "";
	team1Index.value = 0;
	team2Index.value = 0;
}

function addVal(value: string, team: number) {
	let teamShootout = replicants.teams[team].shootouts.value.split('');

	if (team === 0) {
		teamShootout[team1Index.value] = value;
		replicants.teams[team].shootouts.value = teamShootout.join('');
		team1Index.value++;
	}
	else if (team === 1) {
		teamShootout[team1Index.value] = value;
		replicants.teams[team].shootouts.value = teamShootout.join('');
		team2Index.value++;
	}

	// ????????? IT WORKS IF THERES A TIMEOUT
	setTimeout(() => {
		checkForHyphens();
	}, 100);

	// Alternate Teams
	if (currentTeam.value === 0) currentTeam.value = 1;
	else if (currentTeam.value === 1) currentTeam.value = 0;
}

function checkForHyphens() {
	let team1Hyphens = 0;
	let team2Hyphens = 0;
	let team1Checks = 0;
	let team2Checks = 0;

	for (let i = 0; i < replicants.teams[0].shootouts.value.length; i++) {
		if (replicants.teams[0].shootouts.value[i] === '-')
			team1Hyphens++;
		if (replicants.teams[0].shootouts.value[i] === '✅')
			team1Checks++;
	}
	for (let i = 0; i < replicants.teams[1].shootouts.value.length; i++) {
		if (replicants.teams[1].shootouts.value[i] === '-')
			team2Hyphens++;
		if (replicants.teams[1].shootouts.value[i] === '✅')
			team2Checks++;
	}
	// Check if in the first shots, a team has already scored twice while the other team hasn't scored...
	if (replicants.teams[0].shootouts.value.length === 3 &&
		replicants.teams[1].shootouts.value.length === 3 &&
		team1Hyphens === team2Hyphens) {
		if (team1Checks - team2Checks === 2) {
			replicants.teams[0].score.value++;
			gameState.value = "The last shot doesn't matter so the buttons will now be disabled."
			finished.value = true;
			return;
		}
		if (team2Checks - team1Checks === 2) {
			replicants.teams[1].score.value++;
			gameState.value = "The last shot doesn't matter so the buttons will now be disabled."
			finished.value = true;
			return;
		}
	}

	// Check if a team has scored while the other one hasn't & both teams have 0 hyphens
	if (team2Hyphens === 0 && team1Hyphens === 0) {
		if (team1Checks > team2Checks) {
			replicants.teams[0].score.value++;
			gameState.value = "The game has concluded."
			finished.value = true;
			return;
		}
		if (team2Checks > team1Checks) {
			replicants.teams[1].score.value++;
			gameState.value = "The game has concluded."
			finished.value = true;
			return;
		}
	}



	// Check if either team has a hyphen that is within the 3 default shots
	if (team1Hyphens >= 1 && replicants.teams[0].shootouts.value.length <= 3 ||
		team2Hyphens >= 1 && replicants.teams[1].shootouts.value.length <= 3)
		return;

	// Both teams have the same amount of shots
	if (team1Hyphens === 0 && team2Hyphens === 0) {
		replicants.teams[0].shootouts.value += '-';
		replicants.teams[1].shootouts.value += '-';
	}
}
</script>

<style scoped lang="scss">
.shootouts {
	height: 200px;
}
</style>
