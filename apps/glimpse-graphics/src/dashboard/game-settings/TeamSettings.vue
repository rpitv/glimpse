<template>
	<div>
		<n-grid :cols="2">
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="isTeamEnabled">Enabled</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncScore">Sync Score</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncName">Sync Name</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncAbbreviation">Sync Abbr.</n-checkbox>
			</n-grid-item>
		</n-grid>

		<div v-if="isTeamEnabled">
			<div class="mt-10">
				<label :for="teamNameId">Team Name</label>
				<n-input :id="teamNameId" :disabled="syncName" v-model:value="teamName"/>
			</div>

			<div class="mt-10">
				<label :for="teamAbbrId">Team Abbreviation</label>
				<n-input :id="teamAbbrId" :disabled="syncAbbreviation" v-model:value="teamAbbr"/>
			</div>

			<div class="mt-10">
				<label :for="schoolNameId">School Name</label>
				<n-input :id="schoolNameId" v-model:value="teamSchoolName"/>
			</div>

			<div class="mt-10">
				<label :for="teamColorsId">Team Colors</label>
				<n-input-group :id="teamColorsId">
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamPrimaryColor" />
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamSecondaryColor" />
				</n-input-group>
			</div>

			<div class="mt-10">
				<label :for="teamLogoId">Team Logo <small>(Only input trusted URLs.)</small></label>
				<n-input :id="teamLogoId" v-model:value="teamLogo"/>
			</div>

			<div class="team-logo-container">
				<img class="team-logo mt-10" v-if="teamLogo?.length > 0" :src="teamLogo" alt="Team Logo" />
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {v4} from "uuid";
import {NCheckbox, NInput, NInputGroup, NColorPicker, NGrid, NGridItem} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";


const teamNameId = v4();
const teamAbbrId = v4();
const teamColorsId = v4();
const schoolNameId = v4();
const teamLogoId = v4();

const props = defineProps({
	id: {
		type: Number,
		required: true
	}
})

const replicants = await loadReplicants();
const team = replicants.teams[props.id];

const isTeamEnabled = team.enabled;
const teamName = team.name;
const teamAbbr = team.abbreviation;
const teamSchoolName = team.schoolName;
const teamPrimaryColor = team.primaryColor;
const teamSecondaryColor = team.secondaryColor;
const teamLogo = team.logo;

const syncName = replicants.sync.values.teams[props.id].name;
const syncAbbreviation = replicants.sync.values.teams[props.id].abbreviation;
const syncScore = replicants.sync.values.teams[props.id].score;

</script>

<style scoped lang="scss">
	.mt-10 {
		margin-top: 10px;
	}
	.ml-10 {
		margin-left: 10px;
	}
	.team-logo-container {
		display: flex;
		justify-content: center;
	}
	.team-logo {
		max-width: 50%;
	}
</style>
