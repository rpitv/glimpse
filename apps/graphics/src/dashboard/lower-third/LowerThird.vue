<template>
	<div>
		<v-table :hover="true">
			<thead>
			<tr>
				<th>Name</th>
				<th>Preview</th>
				<th>Editor</th>
				<th>Action</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td><h2>Bug</h2></td>
				<td><iframe :src="previewLocation + '?bug'" /></td>
				<td><BugEditor /></td>
				<td><v-switch v-model="replicants.lowerThird.bug.show.value" /></td>
			</tr>
			<tr v-if="replicants.gameSettings.style.value === 'espn'">
				<td><h2>Commentators</h2></td>
				<td><iframe :src="previewLocation + '?commentators'" /></td>
				<td><CommentatorsEditor /></td>
				<td><v-switch v-model="replicants.lowerThird.commentators.show.value" /></td>
			</tr>
			<tr>
				<td><h2>Copyright</h2></td>
				<td><iframe :src="previewLocation + '?copyright'" /></td>
				<td><CopyrightEditor /></td>
				<td><v-switch v-model="replicants.lowerThird.copyright.show.value" /></td>
			</tr>
			<tr>
				<td><h2>Locator</h2></td>
				<td><iframe :src="previewLocation + '?locator'" /></td>
				<td><LocatorEditor /></td>
				<td><v-switch v-model="replicants.lowerThird.locator.show.value" /></td>
			</tr>
			<tr>
				<td><h2>Break Scoreboard</h2></td>
				<td><iframe :src="previewLocation + '?lowerThirdScoreboard'" /></td>
				<td><ScoreboardEditor /></td>
				<td><v-switch v-model="replicants.lowerThird.scoreboard.show.value" /></td>
			</tr>
			</tbody>
		</v-table>
		<br>
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import { computed, ref } from "vue";
import BugEditor from "./Editors/BugEditor.vue";
import CommentatorsEditor from "./Editors/CommentatorsEditor.vue";
import CopyrightEditor from "./Editors/CopyrightEditor.vue";
import LocatorEditor from "./Editors/LocatorEditor.vue";
import ScoreboardEditor from "./Editors/ScoreboardEditor.vue";

const replicants = await loadReplicants();
const previewLocation = `/bundles/graphics/graphics/preview.html`;
</script>

<style scoped lang="scss">
iframe {
	border: none;
	aspect-ratio: 16/9;
	width: 550px;
	background-color: white;
}
</style>
