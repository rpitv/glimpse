<template>
	<div>
		<div class="player-bio">
			<iframe :src="previewLocation + '?playerBio'" />
			<div class="actions">
				<v-combobox :items="possiblePlays" style="width: 100%" label="Description" v-model="replicants.lowerThird.playerBio.action.description.value" />
				<v-number-input label="Font Size" v-model="replicants.lowerThird.playerBio.action.fontSize.value" />
				<v-color-picker label="Background Image Color" v-model="replicants.lowerThird.playerBio.image.backgroundColor.value" width="400"/>
				<v-text-field v-model="replicants.lowerThird.playerBio.image.backgroundColor.value" width="400" />
				<v-switch v-model="replicants.lowerThird.playerBio.show.value" label="Show Player Bio" />
			</div>
		</div>
		<br>
		<v-select label="Sidearms Configuration (IRRELEVANT)" :items="sidearmsLinks" v-model="replicants.http.sidearms.url.value" />
		<v-item-group class="roster-field" v-model="selectedPerson" @update:modelValue="playerBio">
			<v-row>
				<v-col cols="6">
					<div class="roster-field">
						<v-text-field density="compact" label="Left Team Roster URL" v-model="replicants.http.roster.leftTeam.url.value"
						  placeholder="https://rpiathletics.com/sports/womens-ice-hockey/roster/2024-25" />
						<v-btn color="green" @click="fetchRoster('leftTeam')">Fetch Roster</v-btn>
					</div>
					<PlayerView :roster="rosters.leftTeam" teamSide="leftTeam" />
				</v-col>
				<v-spacer />
				<v-col cols="6">
					<div class="roster-field">
						<v-text-field density="compact" label="Right Team Roster URL" v-model="replicants.http.roster.rightTeam.url.value"
									  placeholder="https://rpiathletics.com/sports/womens-ice-hockey/roster/2024-25" />
						<v-btn color="green" @click="fetchRoster('rightTeam')">Fetch Roster</v-btn>
					</div>
					<PlayerView :roster="rosters.rightTeam" teamSide="rightTeam" :additionalPlayers="rosters.leftTeam?.length" />
				</v-col>
			</v-row>
		</v-item-group>
		<div v-show="false" v-html="replicants.http.roster.leftTeam.body.value" ref="leftTeamRoster">
		</div>
		<div v-show="false" v-html="replicants.http.roster.leftTeam.jersey.value" ref="leftTeamJersey">
		</div>
		<div v-show="false" v-html="replicants.http.roster.rightTeam.body.value" ref="rightTeamRoster">
		</div>
		<div v-show="false" v-html="replicants.http.roster.rightTeam.jersey.value" ref="rightTeamJersey">
		</div>
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import {onMounted, ref, watch} from "vue";
import PlayerView from "./PlayerView.vue";

const possiblePlays = ["Powerplay goal by", "Save made by", "Penalty by", "Goal by", "Assisted by"];
const sidearmsLinks = ["https://www.sidearmstats.com/rpi/mhockey/1.xml", "https://www.sidearmstats.com/rpi/whockey/1.xml"];
const previewLocation = `/bundles/graphics/graphics/preview.html`;

interface Person {
	"@type": string,
	"@context": string,
	gender: string,
	image: {
		"@type": string,
		height: number,
		url: string,
		width: number
	},
	name: string,
	uni?: string,
	url: string
}

const replicants = await loadReplicants();

const leftTeamRoster = ref<HTMLDivElement>();
const leftTeamJersey = ref<HTMLDivElement>();
const rightTeamRoster = ref<HTMLDivElement>();
const rightTeamJersey = ref<HTMLDivElement>();
const selectedPerson = ref<{
	person: Person,
	selectedSide: string
}>();

const rosters = ref<{
	leftTeam: Person[],
	rightTeam: Person[],
}>({})

function fetchRoster(team: "leftTeam" | "rightTeam") {
	replicants.http.roster[team].fetch.value = !replicants.http.roster[team].fetch.value;
}

function renderRoster(team: "leftTeam" | "rightTeam") {
	let children;
	if (team === "leftTeam")
		children = leftTeamRoster.value?.childNodes;
	if (team === "rightTeam")
		children = rightTeamRoster.value?.childNodes;
	const scriptElements = [];
	if (children) {
		children.forEach((element) => {
			if (element.tagName === "SCRIPT" && element.type === "application/ld+json" && element.innerHTML !== "[]") {
				scriptElements.push(element);
			}
		});
		rosters.value[team] = [];
		rosters.value[team] = JSON.parse(scriptElements[0].innerHTML).item;
		let htmlNodes;
		if (team === "rightTeam")
			htmlNodes = rightTeamRoster.value?.querySelectorAll(".roster_jerseynum")
		if (team === "leftTeam")
			htmlNodes = leftTeamRoster.value?.querySelectorAll(".roster_jerseynum")
		for (let i = 0; i < rosters.value[team].length; i++) {
			rosters.value[team][i].uni = htmlNodes[i].innerHTML;
		}
	}
}

function playerBio() {
	if (selectedPerson.value) {
		replicants.lowerThird.playerBio.action.player.name.value = selectedPerson.value.person.name;
		replicants.lowerThird.playerBio.action.player.number.value = selectedPerson.value.person.uni;
		replicants.lowerThird.playerBio.image.url.value = selectedPerson.value.person.image.url;
		replicants.lowerThird.playerBio.action.player.teamSide.value = selectedPerson.value.selectedSide;
	} else {
		replicants.lowerThird.playerBio.action.player.name.value = "";
		replicants.lowerThird.playerBio.action.player.number.value = "";
		replicants.lowerThird.playerBio.image.url.value = "";
		replicants.lowerThird.playerBio.action.player.teamSide.value = "";
	}
}

watch((replicants.http.roster.leftTeam.body), () => {
	setTimeout(() => {
		renderRoster("leftTeam");
	}, 500)
}, { deep: true });

watch((replicants.http.roster.rightTeam.body), () => {
	setTimeout(() => {
		renderRoster("rightTeam");
	}, 500);

}, { deep: true });

onMounted(() => {
	if (replicants.http.roster.leftTeam.body.value) {
		renderRoster("leftTeam");
	}

	if (replicants.http.roster.rightTeam.body.value) {
		renderRoster("rightTeam");
	}
});
</script>

<style>
.roster-field {
	display: flex;
	gap: 10px;
}

iframe {
	border: none;
	aspect-ratio: 16/9;
	width: 100%;
	height: 100%;
	background-color: white;
}

.player-bio {
	display: flex;
	gap: 20px;
}

.actions {

	width: 100%;
}
</style>
