<template>
    <div :class="bottomTextBar.show.value || preview ? 'show' : 'hide'">
        <div class="container">
            <div :class="bottomTextBar.greyText.show.value || preview ? 'show' : 'hide'">
                <span class="abs top-text" :style="greyTextStyle">{{ bottomTextBar.greyText.text.value }}</span>
            </div>
            <div>
                <img class="abs" :src="redBar" :style="redBarStyle">
                <span class="abs red-text" :style="redTextStyle">{{ bottomTextBar.redText.text.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../browser-common/replicants";
import redBar from "../../../assets/rpitv-modern/red_bar.png";
import {computed, type CSSProperties} from "vue";

defineProps({
    preview: {
        type: Boolean,
        required: false,
        default: false
    }
});


const replicants = await loadReplicants();
const bottomTextBar = replicants.lowerThird.bottomTextBar;


const greyTextStyle = computed((): CSSProperties => {
    return {
        opacity: bottomTextBar.greyText.text.value?.length === 0 ? 0 : 1,
        background: bottomTextBar.greyText.bgColor.value || "#54585AFF",
        top: "auto",
        marginLeft: bottomTextBar.greyText.offsetX.value + "vw",
        paddingLeft: "4vw",
        marginRight: "4vw",
        marginBottom: bottomTextBar.greyText.offsetY.value + "vw",
        left: "42.6vh",
        bottom: "15vh",
        width: "70.2vw",
        padding: "0.5vh",
        fontSize: 3 + bottomTextBar.greyText.textSize.value + "vh",
        textAlign: bottomTextBar.greyText.alignment.value,
        color: bottomTextBar.greyText.textColor.value,
    }
});

const redBarStyle = computed((): CSSProperties => {
    return {
        marginLeft: bottomTextBar.redText.offsetX.value + "vw",
        marginBottom: bottomTextBar.redText.offsetY.value + "vw",
    }
});

const redTextStyle = computed((): CSSProperties => {
    // auto adjust sizing if enabled
    if (bottomTextBar.redText.autoResize.value) {
        switch (bottomTextBar.redText.text.value.trim().split("\n").length) {
            case 1:
                bottomTextBar.redText.textSize.value = 3
                break;
            case 2:
                bottomTextBar.redText.textSize.value = 0
                break;
            default:
                break
        }
    }

    return {
        whiteSpace: "pre-wrap",
        top: "auto",
        marginLeft: 4 + bottomTextBar.redText.offsetX.value + "vw",
        marginRight: "4vw",
        marginBottom: bottomTextBar.redText.offsetY.value + "vw",
        left: "20vw",
        bottom: "6vh",
        width: "64.5vw",
        fontSize: 3.3 + bottomTextBar.redText.textSize.value + "vh",
        textAlign: bottomTextBar.redText.alignment.value,
        color: bottomTextBar.redText.textColor.value,
    }
});
</script>

<style scoped lang="scss">
@font-face {
    font-family: "Malgun Gothic Bold";
    src: url("../../../assets/rpitv-modern/MalgunGothicBold.ttf") format('truetype');
}

.container {
    font-family: "Malgun Gothic Bold";
}

.abs {
    position: absolute;
    top: 0;
    left: 0;
}

.top-text:before, .top-text:after {
    content: "\00a0\00a0\00a0\00a0"
}

img {
    width: 100vw;
    height: 100vh;
}
</style>
