<template>
	<div class="glimpse-color-picker-v2-container">
		<div class="color-picker-v2" ref="inputRow">
			<div :class="['color', disabled ? 'disabled' : '' ]" :style="{
					'background-color': modelValue,
					'border': visible_color_selector ? '0.2vw solid white' : '0.1vw solid #7E8592'
				}"
					 @click="toggle_color_selector" tabindex="0"
					 ref="color_display"
			/>
			<v-text-field
					class="input"
					:label="props.label"
					v-model="modelValue"
					@input="updateValue($event.target.value)"
					:disabled="disabled"
					hide-details
			/>
		</div>
		<div ref="v_color_selector">
			<v-color-picker
					class="vue-picker"
					v-model="modelValue"
					:style="{
						'opacity': !visible_color_selector ? 0 : 100,
						'pointer-events': visible_color_selector ? 'auto' : 'none',
						'visibility': visible_color_selector ? 'visible' : 'hidden',
						'transform': visible_color_selector ? calcPosition() : 'scale(0)',
					}"
					:disabled="disabled || !visible_color_selector"
					@update:model-value="updateValue"
					tabindex="0"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

const props = withDefaults(defineProps<{
	modelValue: string,
	label: string,
	disabled?: boolean,
	top?: boolean,
}>(), {
	disabled: false,
	top: false
});
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
	get: () => props.modelValue,
	set: (newColor: string) => {
		emit("update:modelValue", newColor);
	},
});

const visible_color_selector = ref<boolean>(false);
const v_color_selector = ref<HTMLElement | null>(null);
const color_display = ref<HTMLElement | null>(null);
const inputRow = ref<HTMLElement | null>(null);


const calcPosition = () => {
	if (!props.top)
		return `scale(1)`

	let inputRowHeight = inputRow?.value?.scrollHeight || 0;
	return `scale(1) translateY(calc(-100% - ${inputRowHeight}px))`;
}


function updateValue(newValue: string) {
	emit('update:modelValue', newValue);
}

function toggle_color_selector() {
	if (!props.disabled)
		visible_color_selector.value = !visible_color_selector.value;
}

function closeColorSelector() {
	visible_color_selector.value = false;
}

// Function to handle clicks and detect if inside or outside
function handleClick(event: MouseEvent) {
	if (v_color_selector.value) {
		if (
				event.target == v_color_selector.value || event.composedPath().includes(v_color_selector.value) ||
				event.target == color_display.value
		) {
		} else {
			closeColorSelector()
		}
	}
}

onMounted(() => {
	document.addEventListener('click', handleClick);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleClick);
});
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
