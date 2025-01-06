<template>
	<v-expansion-panels>
		<v-expansion-panel title="General">
			<v-expansion-panel-text>
				<v-number-input label="X Offset" v-model="replicantBug.offsetX.value" />
				<v-number-input label="Y Offset" v-model="replicantBug.offsetY.value" />
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";

const replicants = await loadReplicants();
const replicantBug = replicants.lowerThird.bug;
</script>

<style scoped lang="scss">

</style>
