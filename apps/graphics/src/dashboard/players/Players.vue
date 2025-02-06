<template>
    <div class="player-bio">
        <iframe :src="previewLocation + '?playerBio'"></iframe>
        <div class="actions">
            <v-combobox :items="possiblePlays" style="width: 100%" label="Description"
                        v-model="replicants.lowerThird.playerBio.action.description.value"/>
            <v-number-input label="Font Size" v-model="replicants.lowerThird.playerBio.action.fontSize.value"/>
            <GlimpseColorPicker v-model="replicants.lowerThird.playerBio.image.defaultTeamColor.value"
                                label="Default Color"/>
            <v-checkbox v-model="replicants.lowerThird.playerBio.info.show.value" label="Display Player Info"/>
            <v-switch v-model="replicants.lowerThird.playerBio.show.value" label="Show Player Graphic"/>
        </div>
    </div>
    <br>
    <!--		<v-select label="Sidearms Configuration (IRRELEVANT)" :items="sidearmsLinks" v-model="replicants.http.sidearms.url.value" />-->
    <v-item-group class="roster-field" v-model="selectedPerson" @update:modelValue="getPlayerBio">
        <v-row>
            <v-col cols="6">
                <div class="roster-field">
                    <v-text-field density="compact" label="Left Team Roster URL"
                                  v-model="replicants.http.roster.leftTeam.url.value"
                                  placeholder="https://rpiathletics.com/sports/womens-ice-hockey/roster/2024-25"/>
                    <v-btn color="green" @click="fetchRoster('leftTeam', replicants.http.roster.leftTeam.url.value)">
                        Fetch Roster
                    </v-btn>
                </div>
                <PlayerView :roster="rosters.leftTeam" teamSide="leftTeam"/>
            </v-col>
            <v-spacer/>
            <v-col cols="6">
                <div class="roster-field">
                    <v-text-field density="compact" label="Right Team Roster URL"
                                  v-model="replicants.http.roster.rightTeam.url.value"
                                  placeholder="https://rpiathletics.com/sports/womens-ice-hockey/roster/2024-25"/>
                    <v-btn color="green" @click="fetchRoster('rightTeam', replicants.http.roster.rightTeam.url.value)">
                        Fetch Roster
                    </v-btn>
                </div>
                <PlayerView :roster="rosters.rightTeam" teamSide="rightTeam"
                            :additionalPlayers="rosters.leftTeam?.length"/>
            </v-col>
        </v-row>
    </v-item-group>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {onMounted, ref} from "vue";
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


function fetchRoster(team: "leftTeam" | "rightTeam", link = "") {
    rosters.value[team] = [];
    rosters.value[team].push({
        custom1: "",
        custom2: "",
        height: "",
        hometown: "",
        image: "",
        name: "LOADING...",
        number: "",
        position: "",
        previousTeam: "",
        weight: "",
        year: "",
    })

    fetch("/glimpse-graphics-fetch/v1?url=" + encodeURIComponent(link))
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser();
            const resDom = parser.parseFromString(data, "text/html");
            renderRoster(team, resDom);
        })

}

function renderRoster(team: "leftTeam" | "rightTeam", dom: Document) {
    const players = dom!.querySelectorAll(".sidearm-roster-player, .s-person-card");
    const coaches = dom!.querySelectorAll(".sidearm-roster-coaches");

    const buffer: Person[] = [] // needed to avoid "Error: Maximum recursive updates exceeded"
    const baseURL = replicants.http.roster[team].url.value.match(/https:\/\/[^/]+/)![0];

    // scans <script> for detecting if Sidearm's running on next gen framework, if so extract the window.__INITIAL_STATE__ for object data
    const scripts = dom.querySelectorAll("script")
    for (const script in scripts) {
        const text = scripts[script].textContent
        if (text?.startsWith("window.__INITIAL_STATE__")) {
            const jsonString = text
                .substring("window.__INITIAL_STATE__='".length, text.length - 1) // remove the starting assignment and closing '
                .replace(/\\'/g, "'") // escaped single quote ' get unescaped
                .replaceAll("\\\\", "\\") // escaped \ get unescaped

            const data = JSON.parse(jsonString)
            // @ts-expect-error because making an interface for JSON format used this singular time is not worth it
            data["rostersModule"]["roster"][Object.keys(data["rostersModule"]["roster"])]["players"].forEach(player => {
                buffer.push({
                    custom1: player["custom1"] ? player["custom1"] : "",
                    custom2: player["custom2"] ? player["custom2"] : "",
                    height: (player["heightFeet"] && player["heightInches"]) ? `${player["heightFeet"]}' ${player["heightInches"]}"` : "",
                    hometown: player["hometown"] ? player["hometown"] : "",
                    image: player["image"]["absoluteUrl"],
                    name: `${player["firstName"]} ${player["lastName"]}`,
                    number: player["jerseyNumber"] ? player["jerseyNumber"] : "",
                    position: player["positionShort"] ? player["positionShort"] : "",
                    previousTeam: player["highSchool"] ? player["highSchool"] : "",
                    weight: player["weight"] ? `${player["weight"]} lbs` : "",
                    year: player["academicYearShort"] ? player["academicYearShort"] : ""
                })
            })

            rosters.value[team] = [...buffer]
            return
        }
    }

    // older sidearm sites, use document query on elements
    players.forEach((player) => {
        // processes image URLs into absolute URLs
        const originUrl = player.querySelector("img")?.dataset?.src || player.querySelector("img")?.src || ""
        let imgUrl;
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
            .replace(/(width=)\d+/, "$1300")
            .replace(/(quality=)\d+/, "$170")
            .replace("/crop", "/convert") // converts cropping links to converter links
            .replace(/(height=)\d+/, "$1") // removes the height limiter since a width limiter exists

        let data = {
            custom1: player.querySelector(".sidearm-roster-player-custom1")?.textContent?.trim() ?? null,
            custom2: player.querySelector(".sidearm-roster-player-custom2")?.textContent?.trim() ?? null,
            height: player.querySelector(".sidearm-roster-player-height")?.textContent?.trim() as string,
            hometown: player.querySelector(".sidearm-roster-player-hometown")?.textContent?.trim() as string,
            image: imageLink,
            name: player.querySelector("h3")?.textContent?.trim() as string ||
                player.querySelector("h2")?.textContent?.trim() as string,
            number: player.querySelector(".sidearm-roster-player-jersey-number")?.textContent?.trim() as string,
            position: player.querySelector(".sidearm-roster-player-position-long-short")?.textContent?.trim() as string ||
                player.querySelector(".sidearm-roster-player-position > span.text-bold")?.textContent?.trim() as string,
            previousTeam: player.querySelector(".sidearm-roster-player-highschool")?.textContent?.trim() as string,
            weight: player.querySelector(".sidearm-roster-player-weight")?.textContent?.trim() as string,
            year: player.querySelector(".sidearm-roster-player-academic-year")?.textContent?.trim() as string,
        }

        buffer.push(data)
    })
    rosters.value[team] = [...buffer]
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


onMounted(() => {
    fetchRoster("leftTeam", replicants.http.roster.leftTeam.url.value)
    fetchRoster("rightTeam", replicants.http.roster.rightTeam.url.value)
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
