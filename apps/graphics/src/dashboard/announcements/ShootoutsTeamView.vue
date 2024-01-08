<template>
	<div class="team-name">
		<h2>
			<span v-if="!disable"> Current School: </span> {{replicants.teams[props.teamIndex].schoolName.value}}
		</h2>
	</div>
	<div>
		<h4>
			Current Results: {{replicants.teams[props.teamIndex].shootouts.value}}
		</h4>
	</div>
	<div>
		<v-btn class="ma-3" @click="addValue('✅')" variant="outlined" :disabled="disable">Add ✅</v-btn>
		<v-btn class="ma-3" @click="addValue('❌')" variant="outlined" :disabled="disable">Add ❌</v-btn>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {PropType} from "vue";

const replicants = await loadReplicants();

const props = defineProps({
	teamIndex: {
		type: Number,
		required: true,
	},
	disable: {
		type: Boolean,
		required: true,
	}
});

const emit = defineEmits({
	addVal(value: string, team: number) {
		return true;
	}
})

function addValue(value: string) {
	// First we'll check

	emit('addVal', value, props.teamIndex);
}


</script>

<style scoped lang="scss">
.team-name {
	text-align: center;
}
</style>
