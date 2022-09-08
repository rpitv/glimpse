<template>
	<div>
		<div>
			<label :for="enabledId">Enable {{ name }}?</label>
			<n-switch class="switch" :id="enabledId" v-model:value="dummyEnabledValue"/>
		</div>
		<div v-if="enabled" class="synced-section">
			<label :for="syncedId">Sync {{ name }}?</label>
			<n-switch disabled title="Coming Soon" class="switch" :id="syncedId" v-model:value="dummySyncedValue"/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {v4} from "uuid";
import {computed, defineProps} from "vue";
import {NSwitch} from "naive-ui";

const enabledId = v4();
const syncedId = v4();

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	enabled: {
		type: Boolean,
		required: true
	},
	synced: {
		type: Boolean,
		required: true
	}
})

const emit = defineEmits(['update:enabled', 'update:synced']);

const dummyEnabledValue = computed<boolean>({
	get() {
		return props.enabled;
	},
	set(newValue) {
		emit('update:enabled', newValue);
	}
})
const dummySyncedValue = computed<boolean>({
	get() {
		return props.synced
	},
	set(newValue) {
		emit('update:synced', newValue);
	}
})
</script>

<style scoped lang="scss">
	.synced-section {
		margin-top: 10px;
	}
	.switch {
		margin-left: 10px;
	}
</style>
