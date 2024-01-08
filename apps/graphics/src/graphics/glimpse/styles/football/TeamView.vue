<template>
	<div class="team">
		<div class="team-info">
			<img :src="team.logo.value" class="logo">
			<div class="team-name">
				{{ team.abbreviation.value }}
			</div>
		</div>
		<div class="team-score">
			{{ score.toFixed(0) }}
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, defineProps, ref, watch} from "vue";
import {loadReplicants} from "../../../../browser-common/replicants";
import { isLightColor } from "../../../../dashboard/util";
import { calcLinearGrad, isLighter } from "../../../../dashboard/util";
import gsap from "gsap";

const props = defineProps({
	teamId: {
		type: Number,
		required: true
	}
})

const replicants = await loadReplicants();
const team = replicants.teams[props.teamId];

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

const color3 = computed(() => {
	const linearGradient = calcLinearGrad(team.secondaryColor.value);
	if (!isLighter(team.secondaryColor.value, linearGradient))
		return linearGradient;
	return team.secondaryColor.value;
})

const color4 = computed(() => {
	const linearGradient = calcLinearGrad(team.secondaryColor.value);
	if (!isLighter(team.secondaryColor.value, linearGradient))
		return team.secondaryColor.value;
	return linearGradient;
})

const nameColor = computed(() => isLightColor(team.primaryColor.value) ? "white" : "black");
const scoreColor = computed(() => isLightColor(team.secondaryColor.value) ? "white" : "black");

const score = ref(team.score.value);
watch(team.score, (n, o) => {
	const t1 = gsap.timeline();
	t1.to(score, { duration: 1, value: Number(n), ease: "power1.out"}, "+=8")
})

</script>

<style scoped lang="scss">

.team {
	display: grid;
	grid-template-columns: 2fr 1fr;
	align-items: center;
	align-content: center;
	//position: fixed;
	background: linear-gradient(v-bind(color1), v-bind(color2));
	width: 16vw;
	height: 6.2vh;
	left: 8.2vw;
}

.team-info {
	display: grid;
	grid-template-columns: 4fr 9fr;
	align-items: center;
}

.team-name {
	color: v-bind(nameColor);
	text-align: center;
	font-family: "Malgun Gothic";
	font-weight: bolder;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
	font-size: 4.63vh;
}

.team-score {
	text-align: center;
	height: 6.2vh;
	background: linear-gradient(v-bind(color3), v-bind(color4));
	font-size: 4.63vh;
	color: v-bind(scoreColor);
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
	font-family: "Malgun Gothic";
	font-weight: bold;

}

.logo {
	max-width: 3vw;
	max-height: 5vh;
	filter: drop-shadow(0.5vh 0.3vh 0.3vh #292929);
	padding-left: 0.3vw;
}
</style>
