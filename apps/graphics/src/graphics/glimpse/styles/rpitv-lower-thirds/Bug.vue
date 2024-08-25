<template>
	<img :style="bugStyle" :src="bug">
</template>

<script setup lang="ts">
import bug from "../../../../assets/rpitv-modern/rpitvBug.png";
import { computed, type CSSProperties } from "vue";
import { loadReplicants } from "../../../../browser-common/replicants"

const replicants = await loadReplicants();
const replicantBug = replicants.lowerThird.bug;

const bugStyle = computed((): CSSProperties => {
	return {
		height: "100vh",
		left: replicantBug.offsetX.value + "vw",
		position: "absolute",
		bottom: replicantBug.offsetY.value + "vh",
		width: "100vw",
	}
});
</script>

<style scoped>
</style>
