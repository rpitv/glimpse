<template>
	<v-expansion-panels>
		<v-expansion-panel title="General">
			<v-expansion-panel-text>
				<v-text-field label="Image Source" v-model="newsImages!.data![index].source"
					@update:modelValue="(val: string) => changeImageString(val, 'source')" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Position">
			<v-expansion-panel-text>
				<v-row>
					<v-col cols="6">
						<v-number-input label="X" v-model="newsImages!.data![index].x"
							@update:modelValue="(val: number) => changeImageNumber(val, 'x')" />
					</v-col>
					<v-col cols="6">
						<v-number-input label="Y" v-model="newsImages!.data![index].y"
							@update:modelValue="(val: number) => changeImageNumber(val, 'y')" />
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<v-checkbox label="Center Image Horizontally" v-model="newsImages!.data![index].centerX"
							@update:modelValue="(val: boolean | null) => changeImageBool(val as boolean, 'centerX')"/>
					</v-col>
					<v-col cols="6">
						<v-checkbox label="Center Image Vertically" v-model="newsImages!.data![index].centerY"
							@update:modelValue="(val: boolean | null) => changeImageBool(val as boolean, 'centerY')"/>
					</v-col>
				</v-row>
				Note: The x and y position refer to the bottom left of the image. Their positions also change depending on if they're centered or not.
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Size">
			<v-expansion-panel-text>
				<v-number-input label="Size" v-model="newsImages!.data![index].size"
					@update:modelValue="(val: number) => changeImageNumber(val, 'size')" />
			</v-expansion-panel-text>
		</v-expansion-panel>
		<v-expansion-panel title="Transitions">

		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script setup lang="ts">

import { useReplicant } from "nodecg-vue-composable";
import type { NewsImage } from "@news/types/schemas";

const props = defineProps({
	index: {
		type: Number,
		required: true
	}
});

const newsImages = useReplicant<NewsImage[]>("newsImages", "news");

function changeImageNumber(newValue: number, field: "x" | "y" | "size") {
	newsImages!.data![props.index][field] = newValue;
	newsImages?.save();
}

function changeImageString(newValue: string, field: "source") {
	newsImages!.data![props.index][field] = newValue;
	newsImages?.save();
}

function changeImageBool(newValue: boolean, field: "centerX" | "centerY") {
	newsImages!.data![props.index][field] = newValue;
	newsImages?.save();
}
</script>

<style scoped>

</style>
