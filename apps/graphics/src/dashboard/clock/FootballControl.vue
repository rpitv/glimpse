<template>
	<div v-if="replicants.gameSettings.style.value === 'football'">
		<hr>
		<h1>Football Controls</h1>
		<h3>Current Down: {{ replicants.scoreboard.down.value }} </h3>
		<br>
		<div>
			<v-text-field label="Down" class="inputs" clearable variant="outlined" type="number"
						  v-model="down"/>
		</div>
		<h3>Current Yards To Go: {{ replicants.scoreboard.yardsToGo.value }}</h3>
		<br>
		<div>
			<v-text-field label="Yards To Go" class="inputs" clearable variant="outlined"
						  v-model="yardsToGo"/>
		</div>
		<h3>Current Possession: {{ replicants.scoreboard.possession.value }}</h3>
		<br>
		<div>
			<v-combobox label="Possession"
						density="comfortable"
						:items="items"
						v-model="possession"
						variant="outlined"
						hint="'<' is Home Team, '>' is Away Team, '<Blank>' is No Possession"
						persistent-hint />
		</div>
		<br>
		<v-btn class="text-none" variant="outlined" @click="submitChanges" :disabled="!checkForChanges">Submit Changes</v-btn>
		<br>
		<br>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants } from "../../browser-common/replicants";
import {computed, ref, watch} from "vue";

const replicants = await loadReplicants();

const items = ref(["<", ">", ""]);
const down = ref(replicants.scoreboard.down.value);
const possession = ref(replicants.scoreboard.possession.value);
const yardsToGo = ref(replicants.scoreboard.yardsToGo.value);

function submitChanges() {
	replicants.scoreboard.yardsToGo.value = yardsToGo.value;
	replicants.scoreboard.possession.value = possession.value;
	replicants.scoreboard.down.value = down.value;
}

const checkForChanges = computed(() => {
	if (down.value != replicants.scoreboard.down.value)
		return true;
	if (yardsToGo.value != replicants.scoreboard.yardsToGo.value)
		return true;
	if (possession.value != replicants.scoreboard.possession.value)
		return true;
})

</script>

<style scoped lang="scss">
.inputs {
}
</style>
