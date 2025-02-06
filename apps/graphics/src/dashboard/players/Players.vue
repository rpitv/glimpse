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

function deleteTags() {
    // removes all <link> <script> and <style> tags from the received contents that are injected into the html
    if (fetchResponseDiv.value)
        Array.from(fetchResponseDiv.value.querySelectorAll("link, script, style")).forEach(e => {
            try {
                e.parentNode?.removeChild(e)
            } catch (e) {
            }
        })
}

function fetchRoster(team: "leftTeam" | "rightTeam", link = "") {
    fetch("/glimpse-graphics-fetch/v1?url=" + encodeURIComponent(link))
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser();
            const resDom = parser.parseFromString(data, "text/html");
            renderRoster(team, resDom);
        })

}

function renderRoster(team: "leftTeam" | "rightTeam", roster: Document) {
    const players = roster!.querySelectorAll(".sidearm-roster-player, .s-person-card");
    const coaches = roster!.querySelectorAll(".sidearm-roster-coaches");

    rosters.value[team] = [];
    const baseURL = replicants.http.roster[team].url.value.match(/https:\/\/[^/]+/)![0];


    // mapping used in new gen sidearm sites
    const newGenBioItemsMap = new Map()
    newGenBioItemsMap.set("Jersey Number", "number")
    newGenBioItemsMap.set("Position", "position")
    newGenBioItemsMap.set("Academic Year", "year")
    newGenBioItemsMap.set("Height", "height")
    newGenBioItemsMap.set("Weight", "weight")
    newGenBioItemsMap.set("Custom Field 1", "custom1")
    newGenBioItemsMap.set("Custom Field 2", "custom2")

    // note: new gen sidearm sites use progressive loading as the user scrolls so fetching is limited
    players.forEach((player) => {

        // processes image URLs into absolute URLs
        const originUrl = player.querySelector("img")?.dataset?.src || player.querySelector("img")?.src || ""
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
            .replace(/(width=)\d+/, "$1300")
            .replace(/(quality=)\d+/, "$170")
            .replace("/crop", "/convert") // converts cropping links to converter links
            .replace(/(height=)\d+/, "$1") // removes the height limiter since a width limiter exists


        const newGenSidearmsItemRetriever = (selector: string) => {
            const childNodes = player?.querySelector(selector)?.childNodes as NodeList
            for (const child in childNodes) {
                if (childNodes[child].nodeType === Node.TEXT_NODE)
                    return childNodes[child]?.textContent?.trim() || ""
            }
            return ""
        }


        let data = {
            custom1: player.querySelector(".sidearm-roster-player-custom1")?.textContent?.trim() ?? null,
            custom2: player.querySelector(".sidearm-roster-player-custom2")?.textContent?.trim() ?? null,
            height: player.querySelector(".sidearm-roster-player-height")?.textContent?.trim() as string,
            hometown: player.querySelector(".sidearm-roster-player-hometown")?.textContent?.trim() as string ||
                newGenSidearmsItemRetriever(`span[data-test-id="s-person-card-list__content-location-person-hometown"]`),
            image: imageLink,
            name: player.querySelector("h3")?.textContent?.trim() as string ||
                player.querySelector("h2")?.textContent?.trim() as string,
            number: player.querySelector(".sidearm-roster-player-jersey-number")?.textContent?.trim() as string ||
                newGenSidearmsItemRetriever(".s-stamp__text"),
            position: player.querySelector(".sidearm-roster-player-position-long-short")?.textContent?.trim() as string ||
                player.querySelector(".sidearm-roster-player-position > span.text-bold")?.textContent?.trim() as string,
            previousTeam: player.querySelector(".sidearm-roster-player-highschool")?.textContent?.trim() as string ||
                newGenSidearmsItemRetriever(`span[data-test-id="s-person-card-list__content-location-person-high-school"]`),
            weight: player.querySelector(".sidearm-roster-player-weight")?.textContent?.trim() as string,
            year: player.querySelector(".sidearm-roster-player-academic-year")?.textContent?.trim() as string,
        }

        // new gen sidearm site has the bio data slots in the same overall class name where
        // - the first child is the classification
        // - the second child or child text is the corresponding value
        player.querySelectorAll(".s-person-details__bio-stats-item").forEach(child => {
            try {
                const key = child.children[0]?.textContent?.trim() ?? ""
                if (newGenBioItemsMap.get(key)) {
                    // @ts-ignore string for indexing object
                    data[newGenBioItemsMap.get(key)] = child.textContent?.replace(key, "").trim()
                }
            } catch (e) {}
        })

        rosters.value[team].push(data)
    })
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
