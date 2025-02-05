<template>
    <TombstoneBuilder :style="tombstone">
        <div id="ESPNCopyrightText" :style="copyrightTextContainer">
            <span :style="copyrightText">
                {{ replicantCopyright.text.value || (`© ${new Date().getFullYear()} ESPN, Inc. All Rights Reserved`) }}
            </span>
        </div>
    </TombstoneBuilder>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";
import type {CSSProperties} from "vue";
import {computed} from "vue";
import TombstoneBuilder from "../tomestone/TombstoneBuilder.vue";

const replicants = await loadReplicants();
const replicantCopyright = replicants.lowerThird.copyright;

const leftOffset = 5;
const bottomOffset = 6;
const textPadding = 1;

const tombstone = computed((): CSSProperties => {
    return {
        left: (replicantCopyright.offsetX.value + leftOffset) + "vw",
        bottom: (replicantCopyright.offsetY.value + bottomOffset) + "vh",
        maxWidth: (100 - (textPadding + replicantCopyright.offsetX.value) * 2 - leftOffset) + "vw",
    }
});
const copyrightTextContainer = computed((): CSSProperties => {
    return {
        padding: textPadding + "vw",
    }
});
const copyrightText = computed((): CSSProperties => {
    return {
        color: replicantCopyright.textColor.value,
        fontSize: replicantCopyright.textSize.value + 3.8 + "vh",
    }
});

</script>

<style scoped lang="scss">
@font-face {
    font-family: "swiss721_bold";
    src: url('../../../../../assets/espn/Swiss721Bold.ttf')
}

#ESPNCopyrightText {
    font-family: "swiss721_bold";
}
</style>
