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
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncShots">Sync Shots</n-checkbox>
			</n-grid-item>
			<div v-if="replicants.gameSettings.style.value === 'football'">
				<n-grid-item>
					<n-checkbox class="ml-10" v-model:checked="syncTimeouts">Sync T/Os</n-checkbox>
				</n-grid-item>
			</div>
		</n-grid>

		<div v-if="isTeamEnabled">
			<v-card v-show="subtitle" class="mt-10" :subtitle="subtitle" :text="msg" variant="tonal" :color="color"></v-card>
			<div class="mt-10">
				<label :for="teamNameId">Team Name</label>
				<v-text-field clearable variant="outlined" :id="teamNameId" :disabled="syncName" v-model="teamName"/>
			</div>

			<div class="mt-10">
				<label :for="teamAbbrId">Team Abbreviation</label>
				<v-text-field clearable variant="outlined" :id="teamAbbrId" :disabled="syncAbbreviation" v-model="teamAbbr"/>
			</div>

			<div class="mt-10">
				<label :for="schoolNameId">School Name</label>
				<v-text-field clearable variant="outlined" :id="schoolNameId" v-model="teamSchoolName"/>
			</div>

			<div class="mt-10">
				<label :for="teamColorsId">Team Colors</label>
				<n-input-group :id="teamColorsId">
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamPrimaryColor" />
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamSecondaryColor" />
				</n-input-group>
			</div>
		</div>

			<div class="mt-10">
				<label :for="teamLogoId">Team Logo <small>(Only input trusted URLs.)</small></label>
				<v-text-field clearable variant="outlined" :id="teamLogoId" v-model="teamLogo"/>
			</div>

			<div class="team-logo-container">
				<img class="team-logo mt-10" v-if="teamLogo?.length > 0" :src="teamLogo" alt="Team Logo"/>
			</div>
	</div>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import {v4} from "uuid";
import {NCheckbox, NInputGroup, NColorPicker, NGrid, NGridItem, NButton} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";

const subtitle = ref<string>();
const color = ref<string>();
const msg = ref<string>();
const schoolNames = ref<string[]>([]);

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
const syncShots = replicants.sync.values.teams[props.id].shots;
const syncTimeouts = replicants.sync.values.teams[props.id].timeouts;

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
.school-btns {
	font-size: 10px;
}
</style>
