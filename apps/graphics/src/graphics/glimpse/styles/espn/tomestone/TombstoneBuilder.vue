<template>
    <div class="container">
        <div class="wrapper">
            <slot/>
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

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
@font-face {
    font-family: "swiss721_bold";
    src: url('../../../../../assets/espn/Swiss721Medium.ttf')
}

.wrapper {
    border: 0.5vh #fbfbfc solid;
    padding: 0.5vh;
    color: black;
}

.container {
    font-family: "swiss721_med";
    background: #ececee;
    position: absolute;
    padding: 0.2vw;

    outline: 0.5vh #e9e9ea solid;
    background-clip: content-box;
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
