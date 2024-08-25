<template>
	<v-expansion-panels>
		<v-expansion-panel title="Credits">
			<v-expansion-panel-text>
				<v-btn @click="fullscreenCredits.credit.value = [...fullscreenCredits.credit.value, new Credit()]">Add Credit</v-btn>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel v-for="(credit, i) in fullscreenCredits.credit.value" :key="i" :title="`Credit ${i + 1}`">
			<v-expansion-panel-text>
				<v-combobox label="Title" :items="titles" v-model="credit.title" />
				<v-number-input label="Title Size" v-model="credit.titleSize" />
				<v-color-picker v-model="credit.titleColor" />
				<v-text-field label="Title Color" v-model="credit.titleColor" width="300" />
				<v-divider />
				<br>
				<v-combobox label="People" multiple chips v-model="credit.people" />
				<v-number-input label="People Size" v-model="credit.peopleSize" />
				<v-color-picker v-model="credit.peopleColor" />
				<v-text-field label="People Color" v-model="credit.peopleColor" width="300" />
				<v-btn color="red" @click="fullscreenCredits.credit.value = fullscreenCredits.credit.value.toSpliced(i, 1)" >Delete Credit</v-btn>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";
import { Credit } from "../../../common/Credit";

const replicants = await loadReplicants();
const fullscreenCredits = replicants.fullscreen.credits;
console.log(fullscreenCredits);
const titles = ["Director", "Producer", "Cameraman"];
</script>

<style scoped lang="scss">

</style>
