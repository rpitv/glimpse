<template>
	<v-expansion-panels style="width: 400px" variant="accordion">
		<v-expansion-panel title="General">
			<v-expansion-panel-text>
				<v-number-input label="X Offset" v-model="replicantCopyright.offsetX.value" />
				<v-number-input label="Y Offset" v-model="replicantCopyright.offsetY.value" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Contents">
			<v-expansion-panel-text>
				<v-text-field label="Copyright Text" v-model="replicantCopyright.text.value" />
				<v-number-input label="Font Size" v-model="replicantCopyright.textSize.value" />
				<v-color-picker v-model="replicantCopyright.textColor.value" />
				<v-text-field label="Font Color" v-model="replicantCopyright.textColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";

const replicants = await loadReplicants();
const replicantCopyright = replicants.lowerThird.copyright;
</script>

<style scoped lang="scss">

</style>
