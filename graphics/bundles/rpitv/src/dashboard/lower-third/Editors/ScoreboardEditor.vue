<template>
	<v-expansion-panels>
		<v-expansion-panel title="Description">
			<v-expansion-panel-text>
				<v-combobox :items="scoreboardDescriptions" label="Description" v-model="replicantScoreboard.description.text.value" />
				<v-checkbox label="Show Timer (If Applicable)" v-model="replicantScoreboard.description.timer.value"></v-checkbox>
				<v-number-input label="Font Size" v-model="replicantScoreboard.description.fontSize.value" />
				<v-color-picker v-model="replicantScoreboard.description.fontColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.description.fontColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Visuals">
			<v-expansion-panel-text>
				<v-color-picker v-model="replicantScoreboard.leftTeam.primaryColor.value" />
				<v-text-field label="Primary Color" v-model="replicantScoreboard.leftTeam.primaryColor.value" width="300" />
				<br>
				<v-color-picker v-model="replicantScoreboard.leftTeam.secondaryColor.value" />
				<v-text-field label="Secondary Color" v-model="replicantScoreboard.leftTeam.secondaryColor.value" width="300" />
				<br>
				<v-text-field label="Logo Link" v-model.trim="replicantScoreboard.leftTeam.logo.value" />
				<v-number-input label="Logo Size" v-model="replicantScoreboard.leftTeam.logoSize.value" :max="100" :min="0" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Name">
			<v-expansion-panel-text>
				<v-text-field label="Team Name" v-model.trim="replicantScoreboard.leftTeam.name.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.leftTeam.nameSize.value" />
				<v-color-picker v-model="replicantScoreboard.leftTeam.nameColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.leftTeam.nameColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Team Score">
			<v-expansion-panel-text>
				<v-text-field label="Score" v-model.trim="replicantScoreboard.leftTeam.score.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.leftTeam.scoreSize.value" />
				<v-color-picker v-model="replicantScoreboard.leftTeam.scoreColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.leftTeam.scoreColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Visuals">
			<v-expansion-panel-text>
				<v-color-picker v-model="replicantScoreboard.rightTeam.primaryColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.rightTeam.primaryColor.value" width="300" />
				<br>
				<h5>Secondary Color</h5>
				<v-color-picker v-model="replicantScoreboard.rightTeam.secondaryColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.rightTeam.secondaryColor.value" width="300" />
				<br>
				<v-text-field label="Logo Link" v-model="replicantScoreboard.rightTeam.logo.value" />
				<v-number-input label="Logo Size" v-model="replicantScoreboard.rightTeam.logoSize.value" :max="100" :min="0" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Name">
			<v-expansion-panel-text>
				<v-text-field label="Team Name" v-model.trim="replicantScoreboard.rightTeam.name.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.rightTeam.nameSize.value" />
				<v-color-picker v-model="replicantScoreboard.rightTeam.nameColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.rightTeam.nameColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Team Score">
			<v-expansion-panel-text>
				<v-text-field label="Score" v-model.trim="replicantScoreboard.rightTeam.score.value" />
				<v-number-input label="Font Size" v-model="replicantScoreboard.rightTeam.scoreSize.value" />
				<v-color-picker v-model="replicantScoreboard.rightTeam.scoreColor.value" />
				<v-text-field label="Font Color" v-model="replicantScoreboard.rightTeam.scoreColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";
import {ref} from "vue";

const replicants = await loadReplicants();
const replicantScoreboard = replicants.lowerThird.scoreboard;

const scoreboardDescriptions = ref<string[]>([
	"Halftime",
	"End of 1st",
	"1st Intermission",
	"End of 2nd",
	"2nd Intermission",
	"End of 3rd",
	"3rd Intermission",
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
