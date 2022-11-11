<template>
	<div>
		<div v-if="synced">
			<n-alert type="info">
				Score cannot be manually controlled while Daktronics RTD sync is enabled.
			</n-alert>
		</div>
		<div v-else class="score-input-group">
			<div>
				<n-input-group>
					<n-button
						v-for="increment in [...scoreIncrements].reverse()"
						type="error"
						@click="emit('update:score', score - increment)"
					>
						-{{ increment }}
					</n-button>
					<n-input-number v-model:value="scoreTextInput"
									@blur="emit('update:score', scoreTextInput)"
									:show-button="false"
					/>
					<n-button
						v-for="increment in scoreIncrements"
						type="success"
						@click="emit('update:score', score + increment)"
					>
						+{{ increment }}
					</n-button>
				</n-input-group>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {NButton, NInputNumber, NInputGroup, NAlert} from "naive-ui";
import {ref} from "vue";

const props = defineProps({
	score: {
		type: Number,
		required: true
	},
	synced: {
		type: Boolean,
		default: false
	}
});
const emit = defineEmits(["update:score"]);

const scoreIncrements = [1,2,3,6];

const scoreTextInput = ref(props.score);
</script>

<style scoped lang="scss">
.score-input-group {
	display: flex;
	justify-content: center;
	text-align: center;
	margin-top: 20px;
}
</style>
