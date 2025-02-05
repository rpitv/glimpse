<template>
    <TombstoneBuilder class="tombstone">
        <div class="header">
            <img class="header-img" :src="headerLogo" alt="">
            <div class="header-text">
                <span class="header-main">{{ textTitle }}</span>
                <span class="header-sub">{{ textSubtitle }}</span>
            </div>
        </div>
        <table>
            <tbody v-for="team in standings.teams.value.filter(team => 0 < team.position).sort(sortByPosition)">
            <tr>
                <td class="logo" :style="{'background': team.teamColor}"><img :src="team.logoLink" alt=""></td>
                <td class="name">{{ team.teamName }}</td>
                <td class="record">{{ team.record }}</td>
            </tr>
            </tbody>
        </table>
    </TombstoneBuilder>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import {StandingsTeam} from "../../../../../extension/util/StandingsTeam";
import TombstoneBuilder from "./TombstoneBuilder.vue";

const replicants = await loadReplicants();
const standings = replicants.fullscreen.standings;

const headerLogo = standings.headerLogoLink;
const textTitle = standings.title;
const textSubtitle = standings.subtitle;

function sortByPosition(a: StandingsTeam, b: StandingsTeam) {
    if (a.position < b.position)
        return -1;
    if (a.position > b.position)
        return 1;
    return 0;
}
</script>

<style scoped lang="scss">
@font-face {
    font-family: "swiss721_bold";
    src: url('../../../../../assets/espn/Swiss721Medium.ttf')
}

.tombstone {
    font-family: "swiss721_med";
    bottom: 7vh;
    left: 5vw;
    width: 36vw;
}

.header {
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0.5vw;
}

.header-img {
    height: 4vh;
}

.header-text {
    display: flex;
    flex-direction: column;
    padding-left: 1vw;
}

.header-main {
    font-size: 4.2vh;
}

.header-sub {
    font-size: 1.5vh;
}

table, th, td {
    border: 4px solid #B4B4B4;
    border-collapse: collapse;
}

table {
    width: 100%;
    background: #ececee;
}

tr {
    height: 2.8vh;
}

td.logo {
    width: 4vw;
    height: inherit;
}

td.logo img {
    height: 3.5vh;
    display: block;
    margin: auto;
}

td.name {
    width: 20vw;
    font-size: 2.5vh;
    padding-left: 0.5vw;
}

td.record {
    width: auto;
    font-size: 2.5vh;
    padding-left: 0.5vw;
}
</style>
