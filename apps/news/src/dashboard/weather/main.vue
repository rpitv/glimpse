<template>
	<div>
	</div>
</template>

<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import type { NewsImage } from "@news/types/schemas";

const previewLink = "http://localhost:9090/bundles/news/graphics/preview.html";
const newsImagesReplicant = useReplicant<NewsImage[]>("newsImages", "news");

</script>

<style scoped>
iframe {
	border: 0;
	aspect-ratio: 16 / 9;
	height: auto;
	width: 700px;
	overflow: hidden !important;
}
</style>
