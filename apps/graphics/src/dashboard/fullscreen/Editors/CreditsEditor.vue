<template>
	<v-expansion-panels>
		<v-expansion-panel title="Credits">
			<v-expansion-panel-text>
				<div class="btns">
					<v-btn @click="fullscreenCredits.credit.value = [...fullscreenCredits.credit.value, new Credit()]">Add Credit</v-btn>
					<v-spacer />
					<v-btn @click="fullscreenCredits.credit.value = []" color="red" :disabled="fullscreenCredits.credit.value.length === 0">Delete All Credits</v-btn>
				</div>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel v-for="(credit, i) in fullscreenCredits.credit.value" :key="i" :title="`Credit ${i + 1}`">
			<v-expansion-panel-text>
				<v-combobox label="Title" :items="titles" v-model="credit.title" />
				<v-number-input label="Title Size" v-model="credit.titleSize" />
				<GlimpseColorPicker v-model="credit.titleColor" label="Title Color" />
				<v-divider />
				<br>
				<v-combobox label="People" multiple chips v-model="credit.people" />
				<v-number-input label="People Size" v-model="credit.peopleSize" />
				<GlimpseColorPicker v-model="credit.peopleColor" label="People Color" />
				<v-btn color="red" @click="fullscreenCredits.credit.value = fullscreenCredits.credit.value.toSpliced(i, 1)" >Delete Credit</v-btn>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import GlimpseColorPicker from "../../components/GlimpseColorPicker.vue";
import { loadReplicants } from "../../../browser-common/replicants";
import { Credit } from "../../../common/Credit";

const replicants = await loadReplicants();
const fullscreenCredits = replicants.fullscreen.credits;
const titles = ["Director", "Producer", "Replay", "Graphics", "Camera Operator"];
</script>

<style scoped lang="scss">
.btns {
	display: flex;
}
</style>
