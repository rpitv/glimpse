<template>
	<h1>{{ name }} Team</h1>

	<div>
		<label :for="teamEnabledId">Enabled?</label>
		<n-switch class="ml-10" :id="teamEnabledId" v-model:value="teamEnabledRep"/>

		<div v-if="teamEnabledRep">
			<div class="mt-10">
				<label :for="teamNameId">Team Name</label>
				<n-input :id="teamNameId" v-model:value="teamNameRep"/>
			</div>


			<n-alert v-if="teamAbbrRep.length > 3" title="Danger!" type="warning" class="mt-10">
				The scoreboard is designed for team abbreviations to be 3 characters or less in length. Check the
				scoreboard to make sure it looks okay before going live.
			</n-alert>
			<div class="mt-10">
				<label :for="teamAbbrId">Team Abbreviation</label>
				<n-input :id="teamAbbrId" v-model:value="teamAbbrRep"/>
			</div>

			<div class="mt-10">
				<label :for="schoolNameId">School Name</label>
				<n-input :id="schoolNameId" v-model:value="schoolNameRep"/>
			</div>

			<div class="mt-10">
				<label :for="teamColorsId">Team Colors</label>
				<n-input-group :id="teamColorsId">
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamPrimaryColorRep" />
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamSecondaryColorRep" />
				</n-input-group>
			</div>

			<div class="mt-10">
				<label :for="teamLogoId">Team Logo <small>(Only input trusted URLs.)</small></label>
				<n-input :id="teamLogoId" v-model:value="teamLogoRep"/>
			</div>

			<div class="team-logo-container">
				<img class="team-logo mt-10" v-if="teamLogoRep?.length > 0" :src="teamLogoRep" alt="Team Logo" />
			</div>
		</div>

	</div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";
import {v4} from "uuid";
import {NSwitch, NInput, NInputGroup, NColorPicker, NAlert} from "naive-ui";
import {replicant} from "../../browser-common/replicant";


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

const teamEnabledRep = await replicant<boolean>("teamEnabled", `glimpse-graphics.game-settings.team${props.id}`);
const teamNameRep = await replicant<string>("name", `glimpse-graphics.game-settings.team${props.id}`);
const teamAbbrRep = await replicant<string>("abbr", `glimpse-graphics.game-settings.team${props.id}`);
const teamPrimaryColorRep = await replicant<string>("primaryColor", `glimpse-graphics.game-settings.team${props.id}`);
const teamSecondaryColorRep = await replicant<string>("secondaryColor", `glimpse-graphics.game-settings.team${props.id}`);
const schoolNameRep = await replicant<string>("schoolName", `glimpse-graphics.game-settings.team${props.id}`);
const teamLogoRep = await replicant<string>("logoUrl", `glimpse-graphics.game-settings.team${props.id}`);
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
