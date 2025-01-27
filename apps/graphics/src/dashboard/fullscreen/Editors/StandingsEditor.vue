<template>
    <v-expansion-panels>
        <v-expansion-panel title="Header Configuration">
            <v-expansion-panel-text>
                <v-combobox :items="itemsTitle" label="Title" v-model="standings.title.value"/>
                <v-text-field label="Subtitle" v-model="standings.subtitle.value"/>
                <v-combobox :items="itemsLinks" label="Header Logo Link" v-model="standings.headerLogoLink.value"/>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Team Configuration">
            <v-expansion-panel-text>
                <div class="btns">
                    <v-btn @click="fetchECACMenHockey">Fetch ECAC Hockey Men"s</v-btn>
                    <v-btn @click="fetchECACWomenHockey">Fetch ECAC Hockey Women"s</v-btn>
                    <v-btn @click="standings.teams.value = [...standings.teams.value, new StandingsTeam()]">
                        Manually Add Team
                    </v-btn>
                    <v-btn @click="standings.teams.value.sort(sortByPosition)">Sort Teams in Editor</v-btn>
                    <v-btn @click="confirmReset" color="red"
                           :disabled="standings.teams.value.length === 0">
                        Delete All Teams
                    </v-btn>
                    <span>If position is 0, the team will not be displayed.</span>
                </div>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel v-for="(team, i) in standings.teams.value" :key="i"
                           :title="`#${team.position} █ ${team.teamName} █ ${team.record}`">
            <v-expansion-panel-text>
                <v-text-field label="Team Name" v-model="team.teamName"/>
                <v-number-input label="Position" :min="0" :step="1" v-model="team.position"/>
                <v-text-field label="Team Record" v-model="team.record"/>
                <GlimpseColorPicker v-model="team.teamColor" label="Team Color"/>
                <v-text-field label="Logo Link" v-model="team.logoLink"/>
                <v-btn color="red" @click="standings.teams.value = standings.teams.value.toSpliced(i, 1)">
                    Delete Team
                </v-btn>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../browser-common/replicants";
import {StandingsTeam} from "../../../extension/util/StandingsTeam";
import GlimpseColorPicker from "../../../dashboard/components/GlimpseColorPicker.vue";

const replicants = await loadReplicants();
const standings = replicants.fullscreen.standings;
const ECAC_MENS_HOCKEY_URL = "https://ecachockey.com/standings.aspx?path=mhockey";
const ECAC_WOMENS_HOCKEY_URL = "https://ecachockey.com/standings.aspx?path=whockey";


const itemsTitle = ["ECAC Standings"]
const itemsLinks = ["https://dbukjj6eu5tsf.cloudfront.net/ecachockey.com/images/responsive_2022/main_logo.svg"]


function sortByPosition(a: StandingsTeam, b: StandingsTeam) {
    if (a.position < b.position)
        return -1;
    if (a.position > b.position)
        return 1;
    return 0;
}


function confirmReset() {
    const response = confirm("Are you sure you want to remove all standings?");
    if (response)
        standings.teams.value = []
}


function fetchECACHockeyRankings(men: boolean, link: string) {
    interface Team {
        name?: string | null;
        logo?: string | null;
        conference: {
            pts?: string | null;
            gp?: string | null;
            wlt?: string | null;
            otw_otl?: string | null;
            so_wl?: string | null;
            gf_ga?: string | null;
        };
        overall: {
            gp?: string | null;
            wlt?: string | null;
            gf_ga?: string | null;
        };
    }

    fetch("/glimpse-graphics-fetch/v1?url=" + encodeURIComponent(link))
        .then(res => res.text())
        .then(data => {
            const parser = new DOMParser();
            const resDom = parser.parseFromString(data, "text/html");

            let teams_raw: Team[] = [];
            resDom.querySelectorAll("#main-content > article > div.sidearm-table-overflow > table > tbody > tr")
                .forEach(row => {
                    const cols = row.children
                    let logoLink = (cols[0]?.querySelector(".sidearm-standings-school-logo img") as HTMLImageElement | null)?.src ?? ""

                    try {
                        const url = new URL(logoLink)
                        logoLink = "https://ecachockey.com/" + url.pathname
                    } catch (e) {
                    }

                    let team = {
                        "name": cols[0]?.textContent?.trim(),
                        "logo": logoLink,
                        "conference": {
                            "pts": cols[2]?.textContent ?? "",
                            "gp": cols[4]?.textContent ?? "",
                            "wlt": cols[6]?.textContent ?? "",
                            "otw_otl": cols[8]?.textContent ?? "",
                            "so_wl": cols[9]?.textContent ?? "",
                            "gf_ga": cols[10]?.textContent ?? "",
                        },
                        "overall": {
                            "gp": cols[11]?.textContent ?? "",
                            "wlt": cols[12]?.textContent ?? "",
                            "gf_ga": cols[13]?.textContent ?? "",
                        }
                    }
                    teams_raw.push(team)
                })

            const teamBuilder = []
            for (const i in teams_raw) {
                const team = new StandingsTeam()
                team.position = parseInt(i) + 1
                team.teamColor = ""
                team.logoLink = teams_raw[i].logo ?? ""
                team.teamName = teams_raw[i].name ?? ""
                team.record = teams_raw[i].conference.wlt ?? ""
                teamBuilder.push(team)
            }
            standings.teams.value = [...standings.teams.value, ...teamBuilder]
        })
        .catch(e => {
            console.error(e)
            const newTab = confirm(`Failed to fetch ECAC ${men ? "M" : "Wom"}en"s Hockey Rankings Automatically!\n` +
                `REASON >>> "${e}"\n\nDo you want to open the link in new tab and manually input the teams?`)
            if (newTab)
                window?.open(link, "_blank")?.focus();
        });
}


function fetchECACMenHockey() {
    standings.show.value = false
    setTimeout(() => fetchECACHockeyRankings(true, ECAC_MENS_HOCKEY_URL), 1500)
}

function fetchECACWomenHockey() {
    standings.show.value = false
    setTimeout(() => fetchECACHockeyRankings(false, ECAC_WOMENS_HOCKEY_URL), 1500)
}
</script>

<style scoped lang="scss">
.btns {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
}
</style>
