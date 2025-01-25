<template>
    <div class="container">
        <div class="wrapper">
            <div class="header">
                <img class="header-img" :src="headerLogo" alt="">
                <div class="header-text">
                    <span class="header-main">{{ textTitle }}</span>
                    <span class="header-sub">{{ textSubtitle}}</span>
                </div>
            </div>
            <table>
                <tbody>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  1</td><td class="record">0-10-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  2</td><td class="record">8-10-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  3</td><td class="record">9-10-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  4</td><td class="record">0-10-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  5</td><td class="record">0-12-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  6</td><td class="record">0-10-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  7</td><td class="record">3-9-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  8</td><td class="record">1-10-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer  9</td><td class="record">0-10</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer 10</td><td class="record">1-0-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer 19</td><td class="record">4-0-0</td></tr>
                    <tr><td class="logo"><img :src="rowLogo" ></td><td class="name">Rensselaer 12</td><td class="record">1-0</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
const headerLogo = "https://dbukjj6eu5tsf.cloudfront.net/ecachockey.com/images/responsive_2022/main_logo.svg"
const rowLogo = "https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/rpiathletics.com/images/responsive_2023/logo_main.svg"

const textTitle = "ECAC Standings"
const textSubtitle = "Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle Subtitle "
</script>

<style scoped lang="scss">
@font-face {
    font-family: "swiss721_bold";
    src: url('../../../../../assets/espn/Swiss721Medium.ttf')
}

.wrapper {
    //opacity: 50%;

    border: 2px #fbfbfc solid;
    padding: 2px;
}

.container {
    font-family: "swiss721_med";
    background: #ececee;
    bottom: 15vh;
    left: 11.7vw;
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
    //background: green;
    font-size: 4.2vh;
}

.header-sub {
    //background: #8a7c22;
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
    //background: yellow;
    height: 2.8vh;
}

td.logo {
    background: #4defb1;
    width: 4vw;
    height: inherit;
}

td.logo img {
    height:100%;
    width:100%;
}

td.name {
    //background: #00bfa5;
    width: 20vw;
    font-size: 2.5vh;
    padding-left: 0.5vw;
}

td.record {
    //background: #d71dff;
    width: auto;
    font-size: 2.5vh;
    padding-left: 0.5vw;
}

</style>
