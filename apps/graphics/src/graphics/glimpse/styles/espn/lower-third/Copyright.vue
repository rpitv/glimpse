<template>
	<div :style="copyrightContainer">
		<img :style="copyrightImage" :src="ESPN_Copyright">
		<div :style="copyrightTextContainer">
			<p :style="copyrightText" id="ESPNCopyrightText">
				{{ replicantCopyright.text.value || (`${new Date().getFullYear()} ESPN, Inc. All Rights Reserved. ESPN.`) }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import ESPN_Copyright from "../../../../../assets/espn/ESPN_Copyright.png"
import { loadReplicants } from "../../../../../browser-common/replicants";
import type { CSSProperties } from "vue";
import { computed } from "vue";

const replicants = await loadReplicants();
const replicantCopyright = replicants.lowerThird.copyright;

const copyrightContainer = computed((): CSSProperties => {
	return {
		left: replicantCopyright.offsetX.value + "vw",
		bottom: replicantCopyright.offsetY.value + "vh",
		position: "absolute",
		height: "100vh",
		width: "100vw"
	}
});
const copyrightImage = computed((): CSSProperties => {
	return {
		height: "100vh",
		width: "100vw"
	}
});
const copyrightTextContainer = computed((): CSSProperties => {
	return {
		alignItems: "center",
		bottom: "6.2vh",
		display: "flex",
		height: "7.9vh",
		left: "7.3vw",
		position: "absolute",
		width: "41.4vw",
	}
})
const copyrightText = computed((): CSSProperties => {
	return {
		color: replicantCopyright.textColor.value,
		fontSize: replicantCopyright.textSize.value + 3.3 + "vh",
	}
});

</script>

<style scoped lang="scss">

@font-face {
	font-family: "swiss721_bold";
	src: url('../../../../../assets/espn/Swiss721Bold.ttf')
}

#ESPNCopyrightText {
	font-family: "swiss721_bold";
}
</style>
