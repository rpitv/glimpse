<template>
	<div class="table">
		<v-table>
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
					<td><h2>Credits</h2></td>
					<td><iframe :src="previewLocation + '?credits'" /></td>
					<td><CreditsEditor /></td>
					<td><v-switch v-model="replicants.fullscreen.credits.show.value" /></td>
				</tr>
			</tbody>
		</v-table>
		<br>
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../browser-common/replicants";
import { computed, ref } from "vue";
import CreditsEditor from "./Editors/CreditsEditor.vue";

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
