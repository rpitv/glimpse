<template>
	<div :style="containerStyles" class="img-container" v-for="(image, i) in images?.data" :key="i">
		<img v-if="(image.show && !preview) || (preview && urlParams.get('index') === i.toString())"
				 :style="imageStyles[i]" :src="image.source">
	</div>
</template>

<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import type { NewsImage } from "@news/types/schemas";
import { ref, computed, CSSProperties } from "vue";

defineProps({
	preview: {
		type: Boolean,
		default: false
	}
});

const imageStyles = computed((): CSSProperties[] => {
	const styles: CSSProperties[] = [];
	for (const image of images!.data!) {
		styles.push({
			bottom: image.y + "vh",
			height: image.size + 100 + "vh",
			left: image.x + "vw",
		});
	}
	return styles;
})

const containerStyles = computed((): CSSProperties[] => {
	const styles: CSSProperties[] = [];
	for (const image of images!.data!)
		styles.push({
			alignItems: image.centerY ? "center" : "",
			display: "flex",
			justifyContent: image.centerX ? "center" : "",
		});
	return styles;
})

const urlParams = new URLSearchParams(window.location.search);
const images = useReplicant<NewsImage[]>("newsImages", "news");
</script>

<style scoped>
img {
	position: relative;
}

.img-container {
	position: absolute;
	height: 100vh;
	left: 0;
	top: 0;
	width: 100vw;
}

</style>
