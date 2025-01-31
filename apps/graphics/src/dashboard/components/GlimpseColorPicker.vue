<template>
	<v-text-field :label="label" v-model="modelValue">
		<template #prepend-inner>
			<v-menu open-on-hover :close-on-content-click="false" :close-delay="250" :open-delay="10">
				<template #activator="{ props }">
					<v-btn :ripple="false" variant="flat" :flat="false" :active="false" :color="modelValue" v-bind="props" />
				</template>
				<v-color-picker v-model="modelValue" />
			</v-menu>
		</template>
	</v-text-field>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";

const props = defineProps({
	label: String,
	modelValue: String,
})
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
	get: () => props.modelValue,
	set: (newColor: string) => {
		emit("update:modelValue", newColor);
	},
});

const visible_color_selector = ref<boolean>(false);
</script>


<style scoped lang="scss">

.glimpse-color-picker-v2-container {
	padding-top: 1vh;
	padding-bottom: 1.5vh;

	.vue-picker {
		position: absolute;
		z-index: 100;
	}

	.color-picker-v2 {
		display: flex;
		flex-direction: row;
		border: 0.25vw;

		.color:hover {
			cursor: pointer;
		}

		.color.disabled {
			cursor: default;
		}

		.color {
			width: 3vw;
			inset: 0.1vw;
			border-radius: 1vw;
			background-color: black;
		}

		.input {
			padding-left: 0.5vw;
		}
	}
}


</style>
