<template>
	<div class="preview-container">
		<ImageView :preview="image" />
		<WeatherView />
	</div>
</template>

<script setup lang="ts">
import ImageView from "@news/graphics/views/ImageView.vue";
import { ref } from "vue";
import WeatherView from "@news/graphics/views/WeatherView.vue";

const image = ref(false);

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('image'))
	image.value = true;

</script>

<style scoped>
.preview-container {
	position: absolute;
	height: 100vh;
	left: 0;
	top: 0;
	width: 100vw;
	overflow: hidden;
}

</style>
