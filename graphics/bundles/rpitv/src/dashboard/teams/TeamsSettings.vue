<template>
	<n-collapse>
		<n-collapse-item title="Settings">
			<div class="teams-settings-grid">
				<n-grid :cols="2" :x-gap="45">
					<n-grid-item>
						<h3>Away Team Settings</h3>
						<TeamSettings :id="1"/>
					</n-grid-item>
					<n-grid-item>
						<h3>Home Team Settings</h3>
						<TeamSettings :id="0"/>
					</n-grid-item>
				</n-grid>
			</div>
		</n-collapse-item>
	</n-collapse>
</template>

<script setup lang="ts">
import {NGrid, NGridItem, NCollapse, NCollapseItem} from "naive-ui";
import TeamSettings from "../game-settings/TeamSettings.vue";
</script>

<style scoped lang="scss">
.increment-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 5px;
}

.teams-settings-grid {
	display: flex;
	justify-content: center;
	max-width: 80%;
	margin-left: 10%;
}
</style>
