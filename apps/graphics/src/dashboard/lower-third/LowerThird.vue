<template>
	<div>
		<v-table :hover="true">
			<thead>
			<tr>
				<th>Name</th>
				<th>Preview</th>
				<th>Action</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>Bug</td>
				<td><iframe :src="previewLocation + '?bug'" /></td>
				<td><v-switch v-model="replicants.lowerThird.bug.value" /></td>
			</tr>
			<tr>
				<td>Commentators</td>
				<td><iframe :src="previewLocation + '?commentators'" /></td>
				<td><v-switch v-model="replicants.lowerThird.commentators.show.value" /></td>
			</tr>
			<tr>
				<td>Copyright</td>
				<td><iframe :src="previewLocation + '?copyright'" /></td>
				<v-switch v-model="replicants.lowerThird.showCopyright.value" />
			</tr>
			<tr>
				<td>Locator</td>
				<td><iframe :src="previewLocation + '?locator'" /></td>
				<v-switch v-model="replicants.lowerThird.locator.value" />
			</tr>
			<tr>
				<td>Lower Third Scoreboard</td>
				<td><iframe :src="previewLocation + '?lowerThirdScoreboard'" /></td>
				<v-switch v-model="replicants.lowerThird.scoreboard.value" />
			</tr>
			</tbody>
		</v-table>
		<br>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {computed, ref, watch} from "vue";

const replicants = await loadReplicants();
const lowerThirdScoreboardDescription = ref<string>("");
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


const previewLocation = `/bundles/graphics/graphics/preview.html`;

const availableCreditsOptions = computed<{ title: string, value: string }[]>(() => {
	return [
		{title: "Box", value: "box"},
		{title: "Scroll", value: "scroll"}
	]
});

function showBug() {
	if (replicants.gameSettings.style.value === "football" && replicants.scoreboard.visible.value)
		replicants.scoreboard.visible.value = false;
	replicants.lowerThird.bug.value = !replicants.lowerThird.bug.value
}

watch(replicants.lowerThird.scoreboardDescription, (newValue, oldValue) => {
	lowerThirdScoreboardDescription.value = newValue;
});
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}

iframe {
	border: none;
	aspect-ratio: 16/9;
	width: 100%;
}
</style>
