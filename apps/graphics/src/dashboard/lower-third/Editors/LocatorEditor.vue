<template>
	<v-expansion-panels>
		<v-expansion-panel title="Location">
			<v-expansion-panel-text>
				<v-combobox :items="locations" label="Location Name" v-model="replicantLocator.location.name.value" />
				<v-number-input label="Font Size" v-model="replicantLocator.location.nameSize.value" />
				<GlimpseColorPicker v-model="replicantLocator.location.nameColor.value" label="Font Color" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Visuals">
			<v-expansion-panel-text>
				<GlimpseColorPicker v-model="replicantLocator.leftTeam.primaryColor.value" label="Primary Color" />
				<GlimpseColorPicker v-model="replicantLocator.leftTeam.secondaryColor.value" label="Secondary Color" />
				<v-text-field label="Logo Link" v-model.trim="replicantLocator.leftTeam.logo.value" />
				<v-number-input label="Logo Size" v-model="replicantLocator.leftTeam.logoSize.value" :max="100" :min="0" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Name">
			<v-expansion-panel-text>
				<v-text-field label="Team Name" v-model.trim="replicantLocator.leftTeam.name.value" />
				<v-number-input label="Font Size" v-model="replicantLocator.leftTeam.nameSize.value" />
				<GlimpseColorPicker v-model="replicantLocator.leftTeam.nameColor.value" label="Font Color" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Visuals">
			<v-expansion-panel-text>
				<GlimpseColorPicker v-model="replicantLocator.rightTeam.primaryColor.value" label="Primary Color"/>
				<GlimpseColorPicker v-model="replicantLocator.rightTeam.secondaryColor.value" label="Secondary Color"/>
				<v-text-field label="Logo Link" v-model="replicantLocator.rightTeam.logo.value" />
				<v-number-input label="Logo Size" v-model="replicantLocator.rightTeam.logoSize.value" :max="100" :min="0" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Name">
			<v-expansion-panel-text>
				<v-text-field label="Team Name" v-model.trim="replicantLocator.rightTeam.name.value" />
				<v-number-input label="Font Size" v-model="replicantLocator.rightTeam.nameSize.value" />
				<GlimpseColorPicker v-model="replicantLocator.rightTeam.nameColor.value" label="Font Color"/>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";
import {ref} from "vue";
import GlimpseColorPicker from "../../components/GlimpseColorPicker.vue";

const replicants = await loadReplicants();
const replicantLocator = replicants.lowerThird.locator;
const locations = ref<string[]>([
	"Houston Field House",
	"ECAV Stadium",
	"ECAV Arena",
]);
</script>

<style scoped lang="scss">
</style>
