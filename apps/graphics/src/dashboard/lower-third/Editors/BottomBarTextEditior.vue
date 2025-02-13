<template>
    <v-expansion-panels>
        <v-expansion-panel title="Top Bar">
            <v-expansion-panel-text>
                <v-text-field label="Text" v-model.trim="bottomTextBar.greyText.text.value" />
                <v-number-input label="Text Size" v-model="bottomTextBar.greyText.textSize.value" :step="0.1" />
                <v-select label="Text Align" :items="['left', 'center', 'right']" v-model="bottomTextBar.greyText.alignment.value" />
                <v-number-input label="X Offset" v-model="bottomTextBar.greyText.offsetX.value" />
                <v-number-input label="Y Offset" v-model="bottomTextBar.greyText.offsetY.value" />
                <GlimpseColorPicker v-model="bottomTextBar.greyText.textColor.value" label="Font Color" />
                <GlimpseColorPicker v-model="bottomTextBar.greyText.bgColor.value" label="Background Color" />
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel title="Red Bar">
            <v-expansion-panel-text>
                <v-textarea label="Text" v-model.trim="bottomTextBar.redText.text.value" />
                <v-number-input label="Text Size" v-model="bottomTextBar.redText.textSize.value" :step="0.1" :disabled="bottomTextBar.redText.autoResize.value" />
                <v-checkbox label="Auto Resize Text When One/Two Lines" v-model="bottomTextBar.redText.autoResize.value" />
                <v-select label="Text Align" :items="['left', 'center', 'right']" v-model="bottomTextBar.redText.alignment.value" />
                <v-number-input label="X Offset" v-model="bottomTextBar.redText.offsetX.value" />
                <v-number-input label="Y Offset" v-model="bottomTextBar.redText.offsetY.value" />
                <GlimpseColorPicker v-model="bottomTextBar.redText.textColor.value" label="Font Color" />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../browser-common/replicants";
import GlimpseColorPicker from "../../components/GlimpseColorPicker.vue";

const replicants = await loadReplicants();
const bottomTextBar = replicants.lowerThird.bottomTextBar;
</script>

<style scoped lang="scss">

</style>
