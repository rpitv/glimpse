<template>
	<draggableComponent v-model="images" item-key="id" :disabled="replicants.slideshow.enabled.value">
		<template #item="{element}">
			<img :alt="element.base" :src="element.url">
		</template>
	</draggableComponent>
	<br>
	<br>
	<br>
	<v-row>
		<v-col cols="6">
			<v-text-field type="number" label="Interval(Seconds) between transitions"
						  v-model="replicants.slideshow.interval.value"
						  :disabled="replicants.slideshow.enabled.value"
			/>
		</v-col>
	</v-row>
	<v-btn @click="replicants.slideshow.enabled.value = !replicants.slideshow.enabled.value"
		   :color="replicants.slideshow.enabled.value ? 'red' : 'green'"
		   class="text-none"
		   :disabled="images.length === 0"
	>
		{{ replicants.slideshow.enabled.value ? "End Slideshow" : "Start Slideshow" }}
	</v-btn>
</template>

<script lang="ts" setup>
import {replicant} from "../../browser-common/replicant";
import {loadReplicants} from "../../browser-common/replicants";
import draggableComponent from "vuedraggable";


const replicants = await loadReplicants();
const images = await replicant('assets:slideshow-images');

</script>
<style scoped lang="scss">
img {
	height: 150px;
	aspect-ratio: 16/9;
}
</style>
