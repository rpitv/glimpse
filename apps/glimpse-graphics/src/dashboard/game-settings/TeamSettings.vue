<template>
	<h1>{{ name }} Team</h1>

	<div>
		<label :for="teamEnabledId">Enabled?</label>
		<n-switch class="ml-10" :id="teamEnabledId" v-model:value="team.enabled.value"/>

		<div v-if="team.enabled.value">
			<div class="mt-10">
				<label :for="teamNameId">Team Name</label>
				<n-input :id="teamNameId" v-model:value="team.name.value"/>
			</div>

			<div class="mt-10">
				<label :for="teamAbbrId">Team Abbreviation</label>
				<n-input :id="teamAbbrId" v-model:value="team.abbreviation.value"/>
			</div>

			<div class="mt-10">
				<label :for="schoolNameId">School Name</label>
				<n-input :id="schoolNameId" v-model:value="team.schoolName.value"/>
			</div>

			<div class="mt-10">
				<label :for="teamColorsId">Team Colors</label>
				<n-input-group :id="teamColorsId">
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="team.primaryColor.value" />
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="team.secondaryColor.value" />
				</n-input-group>
			</div>

			<div class="mt-10">
				<label :for="teamLogoId">Team Logo <small>(Only input trusted URLs.)</small></label>
				<n-input :id="teamLogoId" v-model:value="team.logo.value"/>
			</div>

			<div class="team-logo-container">
				<img class="team-logo mt-10" v-if="team.logo.value?.length > 0" :src="team.logo.value" alt="Team Logo" />
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {v4} from "uuid";
import {NSwitch, NInput, NInputGroup, NColorPicker} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";


const teamEnabledId = v4();
const teamNameId = v4();
const teamAbbrId = v4();
const teamColorsId = v4();
const schoolNameId = v4();
const teamLogoId = v4();

const props = defineProps({
	id: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	}
})

const replicants = await loadReplicants();
const team = replicants.teams[props.id];

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
