<template>
	<div>
		<div class="top-buttons">
			<v-btn color="green" prepend-icon="mdi-plus" rounded="xl" @click="addImage">Add Image</v-btn>
		</div>
		<br>
		<v-table height="1000">
			<thead>
				<tr>
					<th>Preview</th>
					<th>Editor</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(image, i) in newsImagesReplicant?.data">
					<th>
						<iframe :src="`${previewLink}?image&index=${i}`" />
					</th>
					<th><ImageEditor :index="i" /></th>
					<th>
						<div class="action-buttons">
							<v-switch @update:modelValue="(val) => showImage(val, image)" v-model="image.show"/>
							<v-btn color="red" icon="mdi-delete" rounded="xl" @click="deleteImage(i)" />
						</div>
					</th>
				</tr>
			</tbody>
		</v-table>
	</div>
</template>

<script setup lang="ts">
import { useReplicant } from 'nodecg-vue-composable';
import type { NewsImage } from "@news/types/schemas";
import ImageEditor from "./editor/main.vue";
import {watch} from "vue";

const previewLink = "http://localhost:9090/bundles/news/graphics/preview.html";
const newsImagesReplicant = useReplicant<NewsImage[]>("newsImages", "news");

function addImage() {
	newsImagesReplicant!.data?.push({
		show: false,
		size: 0,
		source: "",
		x: 0,
		y: 0,
	} as NewsImage);
	newsImagesReplicant!.save();
}

function showImage(show: unknown, image: NewsImage) {
	if (typeof show === "boolean") {
		image.show = show;
		newsImagesReplicant!.save();
	}
}

function deleteImage(index: number) {
	newsImagesReplicant!.data!.splice(index, 1);
	newsImagesReplicant!.save();
}

</script>

<style scoped>
iframe {
	border: 0;
	aspect-ratio: 16 / 9;
	height: auto;
	width: 700px;
	overflow: hidden !important;
}

.top-buttons {
	display: flex;
	justify-content: right;
}

.action-buttons {
	display: flex;
	justify-content: space-around;
}
</style>
