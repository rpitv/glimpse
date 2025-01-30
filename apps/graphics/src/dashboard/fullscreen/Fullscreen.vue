<template>
		<v-table>
			<thead>
				<tr>
					<th class="col1">Name</th>
					<th class="col2">Preview</th>
					<th class="col3">Editor</th>
					<th class="col4">Action</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><h2>Credits</h2></td>
					<td><iframe :src="previewLocation + '?credits'" /></td>
					<td><CreditsEditor /></td>
					<td><v-switch v-model="replicants.fullscreen.credits.show.value" /></td>
				</tr>
                <tr>
                    <td><h2>Standings</h2></td>
                    <td><iframe :src="previewLocation + '?tombstoneStandings'" /></td>
                    <td><StandingsEditor /></td>
                    <td><v-switch v-model="replicants.fullscreen.standings.show.value" /></td>
                </tr>
			</tbody>
		</v-table>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import CreditsEditor from "./Editors/CreditsEditor.vue";
import StandingsEditor from "./Editors/StandingsEditor.vue";

const replicants = await loadReplicants();
const previewLocation = `/bundles/graphics/graphics/preview.html`;
</script>

<style scoped lang="scss">
iframe {
	border: none;
	aspect-ratio: 16/9;
	width: 100%;
	background-color: white;
}

.col1 {
    width: 13%;
}
.col2 {
    width: 45%;
}
.col3 {
    width: 30%;
}
.col4 {
    width: 8%;
}
</style>
