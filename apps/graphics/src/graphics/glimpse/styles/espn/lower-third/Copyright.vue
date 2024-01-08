<template>
	<div :class="{show: replicants.lowerThird.showCopyright.value, hide: !replicants.lowerThird.showCopyright.value}">
		<img id="ESPNCopyrightImg" :src="ESPN_Copyright">
		<span id="ESPNCopyrightText">© {{ new Date().getFullYear() }} ESPN, Inc. All Rights Reserved. ESPN.</span>
	</div>
</template>

<script setup lang="ts">
import ESPN_Copyright from "../../../../../assets/espn/ESPN_Copyright.png"
import {loadReplicants} from "../../../../../browser-common/replicants";

const replicants = await loadReplicants();
</script>

<style scoped lang="scss">
@font-face {
	font-family: "swiss721_bold";
	src: url('../../../../../assets/espn/Swiss721Bold.ttf')
}

#ESPNCopyrightImg {
	position: absolute;
	top: 0;
	left: 0;

	width: 100vw;
	height: 100vh;

	transition: opacity 1s;
}

#ESPNCopyrightText {
	font-family: "swiss721_bold";
	position: absolute;
	font-size: 3.3vh;
	bottom: 8vh;
	left: 7.3vw;
}

.hide {
	opacity: 0;
	transition: 1s;
}

.show {
	opacity: 1;
	transition: 1s;
}
</style>
