<template>
	<div class="team">
		<div class="logo">
			<img :src="replicants.teams[props.teamId].logo.value" id="logoImg">
		</div>
		<div class="team-name">
			{{ replicants.teams[props.teamId].abbreviation.value }}
		</div>
		<div class="team-score">
			{{ replicants.teams[props.teamId].score.value }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { loadReplicants } from "../../../../browser-common/replicants";
import {computed, ref, watch} from "vue";
import { calcLinearGrad, isLighter } from "../../../../dashboard/util";
import { isLightColor } from "../../../../dashboard/util";

const replicants = await loadReplicants();

const props = defineProps({
	teamId: {
		type: Number,
		required: true
	}
})
const team = replicants.teams[props.teamId];
const fontColor = ref("black");


const color1 = computed(() => {
	const linearGradient = calcLinearGrad(team.primaryColor.value);
	if (!isLighter(team.primaryColor.value, linearGradient))
		return linearGradient;
	return team.primaryColor.value;
})

const color2 = computed(() => {
	const linearGradient = calcLinearGrad(team.primaryColor.value);
	if (!isLighter(team.primaryColor.value, linearGradient))
		return team.primaryColor.value;
	return linearGradient;
})

if (isLightColor(color1.value)) fontColor.value = "white";
else fontColor.value = "black";

watch(color1, (n, o) => {
	if (isLightColor(n)) fontColor.value = "white";
	else fontColor.value = "black";
})

</script>

<style scoped>
.team {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(v-bind(color1), v-bind(color2));
	font-size: 3.5vh;
	color: v-bind(fontColor);
	text-shadow: 0 0 0.2vh black;
}

.logo {
	display: flex;
	align-items: center;
}

#logoImg {
	margin-left: 0.3vw;
	max-height: 3.6vh;
	max-width: 2.5vw;
	filter: drop-shadow(0 0 0.1vw black);
}
.team-score {
	margin-right: 0.5vw;
}

.team-name {
	position: absolute;
	left: 3vw;
}
</style>
