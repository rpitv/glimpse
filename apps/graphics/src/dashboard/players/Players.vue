<template>
	<div>
		<div class="player-bio">
			<iframe :src="previewLocation + '?playerBio'"></iframe>
			<div class="actions">
				<v-combobox :items="possiblePlays" style="width: 100%" label="Description" v-model="replicants.lowerThird.playerBio.action.description.value" />
				<v-number-input label="Font Size" v-model="replicants.lowerThird.playerBio.action.fontSize.value" />
				<GlimpseColorPicker v-model="replicants.lowerThird.playerBio.image.defaultTeamColor.value" label="Default Color" />
				<v-checkbox v-model="replicants.lowerThird.playerBio.info.show.value" label="Display Player Info" />
				<v-switch v-model="replicants.lowerThird.playerBio.show.value" label="Show Player Graphic" />
			</div>
		</div>
		<br>
<!--		<v-select label="Sidearms Configuration (IRRELEVANT)" :items="sidearmsLinks" v-model="replicants.http.sidearms.url.value" />-->
		<v-item-group class="roster-field" v-model="selectedPerson" @update:modelValue="getPlayerBio">
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
        <div ref="fetchResponseDiv">
            <div v-show="false" v-html="replicants.http.roster.leftTeam.body.value" ref="leftTeamRoster"></div>
            <div v-show="false" v-html="replicants.http.roster.leftTeam.jersey.value" ref="leftTeamJersey"></div>
            <div v-show="false" v-html="replicants.http.roster.rightTeam.body.value" ref="rightTeamRoster"></div>
            <div v-show="false" v-html="replicants.http.roster.rightTeam.jersey.value" ref="rightTeamJersey"></div>
        </div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {onMounted, ref, watch} from "vue";
import PlayerView from "./PlayerView.vue";
import GlimpseColorPicker from "../components/GlimpseColorPicker.vue";

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

const fetchResponseDiv = ref<HTMLElement>();
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

function deleteTags() {
    // removes all <link> <script> and <style> tags from the received contents that are injected into the html
    if (fetchResponseDiv.value)
        Array.from(fetchResponseDiv.value.querySelectorAll("link, script, style")).forEach(e => {
            try {
                e.parentNode?.removeChild(e)
            } catch (e) {}
        })
}

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
        // processes image URLs into absolute URLs
        const originUrl = player.querySelector("img")?.dataset.src ?? ""
        let imgUrl = originUrl
        try {
            // attempts to verify url as absolute path
            imgUrl = new URL(originUrl).href;
        } catch (e) {
            // fails due to relative path, try adding domain
            try {
                imgUrl = new URL(originUrl, baseURL).href;
            } catch (e) {
                // ultimate fail so resort to whatever the original is
                imgUrl = originUrl
            }
        }

		const imageLink = imgUrl
				.replace(/(width=)\d+/, '$1300')
				.replace(/(quality=)\d+/, '$170');
		rosters.value[team].push({
            custom1: player.querySelector(".sidearm-roster-player-custom1")?.textContent?.trim() ?? null,
            custom2: player.querySelector(".sidearm-roster-player-custom2")?.textContent?.trim() ?? null,
            height: player.querySelector(".sidearm-roster-player-height")?.textContent?.trim() as string,
            hometown: player.querySelector(".sidearm-roster-player-hometown")?.textContent?.trim() as string,
            image: imageLink,
            name: player.querySelector("h3")?.textContent?.trim() as string || player.querySelector("h2")?.textContent?.trim() as string,
            number: player.querySelector(".sidearm-roster-player-jersey-number")?.textContent?.trim() as string,
            position: player.querySelector(".sidearm-roster-player-position-long-short")?.textContent?.trim() as string || player.querySelector(".sidearm-roster-player-position > span.text-bold")?.textContent?.trim() as string,
            previousTeam: player.querySelector(".sidearm-roster-player-highschool")?.textContent?.trim() as string,
            weight: player.querySelector(".sidearm-roster-player-weight")?.textContent?.trim() as string,
            year: player.querySelector(".sidearm-roster-player-academic-year")?.textContent?.trim() as string,
        });
	});

    setTimeout(deleteTags, 500)
}

function getPlayerBio() {
	const playerBio = replicants.lowerThird.playerBio;
	if (selectedPerson.value) {
		playerBio.action.player.name.value = selectedPerson.value.person.name || "";
		playerBio.action.player.number.value = selectedPerson.value.person.number || "";
		playerBio.image.url.value = selectedPerson.value.person.image || "";
		playerBio.action.player.teamSide.value = selectedPerson.value.teamSide || "";
		playerBio.info.height.value = selectedPerson.value.person.height || "";
		playerBio.info.hometown.value = selectedPerson.value.person.hometown || "";
		playerBio.info.weight.value = selectedPerson.value.person.weight || "";
		playerBio.info.year.value = selectedPerson.value.person.year || "";
	} else {
		playerBio.action.player.name.value = "";
		playerBio.action.player.number.value = "";
		playerBio.image.url.value = "";
		playerBio.action.player.teamSide.value = "";
		playerBio.info.height.value = "";
		playerBio.info.hometown.value = "";
		playerBio.info.weight.value = "";
		playerBio.info.year.value = "";
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



const leftTeamSync = ref<boolean>(true);
const rightTeamSync = ref<boolean>(true);
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
