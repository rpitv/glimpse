<template>
	<div class="copyright-main">
		<div v-if="creditsType === 'box'" :class="{show: creditsEnabled, hide: !creditsEnabled, 'center-credits': true}">
			<div class="background">
				<span class="header">{{ creditsHeader }}</span>
				<br>
				<span class="text">{{ creditsText.trimEnd() }}</span>
			</div>
		</div>

		<div :class="{show: showCopyright, hide: !showCopyright, 'center-copyright': true}">
			<span class="background">© RPI TV ALL RIGHTS RESERVED</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../../../../browser-common/replicants";

const replicants = await loadReplicants();
const showCopyright = replicants.lowerThird.showCopyright;

const creditsType = replicants.lowerThird.endGraphics.type;
const creditsEnabled = replicants.lowerThird.endGraphics.show;
const creditsHeader = replicants.lowerThird.endGraphics.title;
const creditsText = replicants.lowerThird.endGraphics.message;
</script>

<style scoped lang="scss">
@font-face {
	font-family: "Rubik";
	src: url('../../../../../assets/rpitv-modern/Rubik.ttf');
}

.copyright-main {
	font-family: "Rubik", sans-serif;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 10vh;
}

.center-credits {
	text-align: center;
	font-size: 3vh;
	display: flex;
	justify-content: center;
	white-space: pre-line;

	.background {
		background-color: #B5B5B5;
		padding: 1vh;
		border-radius: 3vh;

		.header {
			width: 100%;
			color: #d6001c;
			font-size: 4vh;
			font-weight: bold;
			padding-bottom: 1vh;
		}

		.text {
			font-size: 3vh;
		}
	}
}

.center-copyright {
	text-align: center;
	font-size: 3vh;
	font-weight: bold;
	padding-top: 6vh;

	.background {
		background: #DC001C;
		color: white;
		padding: 1vw;
		font-size: 3vh;
		border-radius: 3vh;
	}
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
