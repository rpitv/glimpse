<template>
	<v-expansion-panels variant="accordion" >
		<v-expansion-panel title="General">
			<v-expansion-panel-text>
				<v-number-input label="Y Offset" v-model="replicantCommentators.offsetY.value" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Left Commentator">
			<v-expansion-panel-text>
				<v-text-field label="Name" v-model="replicantCommentators.leftPerson.name.value" />
				<v-number-input label="Font Size" v-model="replicantCommentators.leftPerson.nameSize.value" />
				<h5>Font Color:</h5>
				<v-color-picker v-model="replicantCommentators.leftPerson.nameColor.value" />
				<v-text-field label="Font Color" v-model="replicantCommentators.leftPerson.nameColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Center Commentator">
			<v-expansion-panel-text>
				<v-text-field label="Name" v-model="replicantCommentators.centerPerson.name.value" />
				<v-number-input label="Font Size" v-model="replicantCommentators.centerPerson.nameSize.value" />
				<h5>Font Color:</h5>
				<v-color-picker v-model="replicantCommentators.centerPerson.nameColor.value" />
				<v-text-field label="Font Color" v-model="replicantCommentators.centerPerson.nameColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Right Commentator">
			<v-expansion-panel-text>
				<v-text-field label="Name" v-model="replicantCommentators.rightPerson.name.value" />
				<v-number-input label="Font Size" v-model="replicantCommentators.rightPerson.nameSize.value" />
				<h5>Font Color:</h5>
				<v-color-picker v-model="replicantCommentators.rightPerson.nameColor.value" />
				<v-text-field label="Font Color" v-model="replicantCommentators.rightPerson.nameColor.value" width="300" />
			</v-expansion-panel-text>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../browser-common/replicants";

const replicants = await loadReplicants();
const replicantCommentators = replicants.lowerThird.commentators;



</script>

<style scoped lang="scss">
.pointer {
	cursor: pointer;
}
</style>
