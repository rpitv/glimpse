<template>
	<v-expansion-panels>
		<v-expansion-panel title="Description">
			<v-expansion-panel-text>
				<v-combobox :items="scoreboardDescriptions" label="Description" v-model="replicantScoreboard.description.text.value" />
				<v-checkbox label="Show Timer (If Applicable)" v-model="replicantScoreboard.description.timer.value" />
				<v-checkbox label="Autofit Description to Box" v-model="replicantScoreboard.description.autoFit.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.description.fontSize.value" />
				<GlimpseColorPicker v-model="replicantScoreboard.description.fontColor.value" label="Font Color"/>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Visuals">
			<v-expansion-panel-text>
				<GlimpseColorPicker v-model="replicantScoreboard.leftTeam.primaryColor.value" label="Primary Color"/>
				<GlimpseColorPicker v-model="replicantScoreboard.leftTeam.secondaryColor.value" label="Secondary Color"/>
				<v-text-field label="Logo Link" v-model.trim="replicantScoreboard.leftTeam.logo.value" />
				<v-number-input label="Logo Size" v-model="replicantScoreboard.leftTeam.logoSize.value" :max="100" :min="0" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Name">
			<v-expansion-panel-text>
				<v-text-field label="Team Name" v-model.trim="replicantScoreboard.leftTeam.name.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.leftTeam.nameSize.value" />
				<GlimpseColorPicker v-model="replicantScoreboard.leftTeam.nameColor.value" label="Font Color"/>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Score">
			<v-expansion-panel-text>
				<v-text-field label="Score" v-model.trim="replicantScoreboard.leftTeam.score.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.leftTeam.scoreSize.value" />
				<GlimpseColorPicker v-model="replicantScoreboard.leftTeam.scoreColor.value" label="Score Color"/>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Visuals">
			<v-expansion-panel-text>
				<GlimpseColorPicker v-model="replicantScoreboard.rightTeam.primaryColor.value" label="Primary Color"/>
				<GlimpseColorPicker v-model="replicantScoreboard.rightTeam.secondaryColor.value" label="Secondary Color"/>
				<v-text-field label="Logo Link" v-model="replicantScoreboard.rightTeam.logo.value" />
				<v-number-input label="Logo Size" v-model="replicantScoreboard.rightTeam.logoSize.value" :max="100" :min="0" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Name">
			<v-expansion-panel-text>
				<v-text-field label="Team Name" v-model.trim="replicantScoreboard.rightTeam.name.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.rightTeam.nameSize.value" />
				<GlimpseColorPicker v-model="replicantScoreboard.rightTeam.nameColor.value" label="Font Color"/>
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Score">
			<v-expansion-panel-text>
				<v-text-field label="Score" v-model.trim="replicantScoreboard.rightTeam.score.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.rightTeam.scoreSize.value" />
				<GlimpseColorPicker v-model="replicantScoreboard.rightTeam.scoreColor.value" label="Score Color"/>
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";
import {ref} from "vue";
import GlimpseColorPicker from "../../components/GlimpseColorPicker.vue";

const replicants = await loadReplicants();
const replicantScoreboard = replicants.lowerThird.scoreboard;

const scoreboardDescriptions = ref<string[]>([
	"Halftime",
	"End of 1st",
	"1st Intermission",
	"Start of 2nd",
	"End of 2nd",
	"2nd Intermission",
	"Start of 3rd",
	"End of 3rd",
	"3rd Intermission",
	"Start of 4th",
	"End of 4th",
	"4th Intermission",
	"End of Reg.",
	"Overtime",
	"End 1st OT",
	"End 2nd OT",
	"End of OT",
	"Final OT",
	"Final SO",
	"Final",
]);
</script>

<style scoped lang="scss">
</style>
