<template>
    <div class="container">
        <div class="wrapper">
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
        </div>
        <img class="notch vertical top left" :src="notch" alt="">
        <img class="notch vertical top right" :src="notch" alt="">
        <img class="notch vertical bottom left" :src="notch" alt="">
        <img class="notch vertical bottom right" :src="notch" alt="">
        <img class="notch horizontal top left" :src="notch" alt="">
        <img class="notch horizontal top right" :src="notch" alt="">
        <img class="notch horizontal bottom left" :src="notch" alt="">
        <img class="notch horizontal bottom right" :src="notch" alt="">
    </div>
</template>

<script setup lang="ts">
import notch from "../../../../../assets/espn/notch.svg"
import {loadReplicants} from "../../../../../browser-common/replicants";
import {StandingsTeam} from "../../../../../extension/util/StandingsTeam";

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

.wrapper {
    border: 2px #fbfbfc solid;
    padding: 2px;
    color: black;
}

.container {
    font-family: "swiss721_med";
    background: #ececee;
    bottom: 7vh;
    left: 5vw;
    width: 36vw;
    position: absolute;
    margin: 0.5vw;
    padding: 0.2vw;

    outline: 2px #e9e9ea solid;
    background-clip: content-box;
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


.notch {
    position: absolute;
    transform: translate(-50%, -50%);
    height: 2vh;

    &.vertical {
        &.top {
            top: 0;
        }

        &.bottom {
            bottom: 0;
            transform: translate(-50%, 50%);
        }
    }

    &.horizontal {
        transform: rotate(90deg) translate(50%, 50%);

        &.top {
            top: 10%;
        }

        &.bottom {
            bottom: 10%;
        }

        &.left {
            left: 0;
        }

        &.right {
            right: 0;
            transform: rotate(90deg) translate(50%, -50%);
        }
    }

    &.left {
        left: 10%;
    }

    &.right {
        right: 10%;
    }
}
</style>
