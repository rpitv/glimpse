<template>
	<div>
		<div class="player-bio">
			<iframe :src="previewLocation + '?playerBio'"></iframe>
			<div class="actions">
				<v-combobox :items="possiblePlays" style="width: 100%" label="Description" v-model="replicants.lowerThird.playerBio.action.description.value" />
				<v-number-input label="Font Size" v-model="replicants.lowerThird.playerBio.action.fontSize.value" />
				<v-checkbox v-model="replicants.lowerThird.playerBio.image.syncTeamColor.value"  label="Sync Team Colors"/>
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
	custom1: string | null
	custom2: string | null
	height: string
	hometown: string
	image: string
	name: string
	number: string
	position: string
	previousTeam: string
	weight: string
	year: string
}

const replicants = await loadReplicants();

const leftTeamRoster = ref<HTMLDivElement>();
const leftTeamJersey = ref<HTMLDivElement>();
const rightTeamRoster = ref<HTMLDivElement>();
const rightTeamJersey = ref<HTMLDivElement>();
const selectedPerson = ref<{
	person: Person,
	teamSide: "leftTeam" | "rightTeam"
}>();

const rosters = ref<{
	leftTeam: Person[],
	rightTeam: Person[],
}>({
	leftTeam: [],
	rightTeam: []
})

function fetchRoster(team: "leftTeam" | "rightTeam") {
	replicants.http.roster[team].fetch.value = !replicants.http.roster[team].fetch.value;
}

function renderRoster(team: "leftTeam" | "rightTeam") {
	let roster;
	if (team === "leftTeam")
		roster = leftTeamRoster.value;
	else if (team === "rightTeam")
		roster = rightTeamRoster.value;
	
	const players = roster!.querySelectorAll(".sidearm-roster-player");
	const coaches = roster!.querySelectorAll(".sidearm-roster-coaches");
	
	rosters.value[team] = [];
	const baseURL = replicants.http.roster[team].url.value.match(/https:\/\/[^/]+/)![0];
	
	players.forEach((player) => {
		const imageLink = (baseURL + player.querySelector("img")?.dataset.src)
				.replace(/(width=)\d+/, '$1300')
				.replace(/(quality=)\d+/, '$1100');
		rosters.value[team].push({
			custom1: player.querySelector(".sidearm-roster-player-custom1")?.textContent?.trim() ?? null,
			custom2: player.querySelector(".sidearm-roster-player-custom2")?.textContent?.trim() ?? null,
			height: player.querySelector(".sidearm-roster-player-height")?.textContent?.trim() as string,
			hometown: player.querySelector(".sidearm-roster-player-hometown")?.textContent?.trim() as string,
			image: imageLink,
			name: player.querySelector("h3")?.textContent?.trim() as string,
			number: player.querySelector(".sidearm-roster-player-jersey-number")?.textContent?.trim() as string,
			position: player.querySelector(".sidearm-roster-player-position-long-short")?.textContent?.trim() as string,
			previousTeam: player.querySelector(".sidearm-roster-player-highschool")?.textContent?.trim() as string,
			weight: player.querySelector(".sidearm-roster-player-weight")?.textContent?.trim() as string,
			year: player.querySelector(".sidearm-roster-player-academic-year")?.textContent?.trim() as string,
		});
	});
}

function playerBio() {
	if (selectedPerson.value) {
		replicants.lowerThird.playerBio.action.player.name.value = selectedPerson.value.person.name;
		replicants.lowerThird.playerBio.action.player.number.value = selectedPerson.value.person.number;
		replicants.lowerThird.playerBio.image.url.value = selectedPerson.value.person.image;
		replicants.lowerThird.playerBio.action.player.teamSide.value = selectedPerson.value.teamSide;
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
