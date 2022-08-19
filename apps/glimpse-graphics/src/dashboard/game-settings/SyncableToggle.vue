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
import {replicant} from "../../browser-common/replicant";

const enabledId = v4();
const syncedId = v4();

const props = defineProps({
	name: {
		type: String,
		required: true
	},
	replicantNamespace: {
		type: String
	},
	enabledDefault: {
		type: Boolean,
		default: false
	},
	syncedDefault: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(['updateEnabled', 'updateSynced']);

const enabled = await replicant<boolean>("enabled", props.replicantNamespace, props.enabledDefault);
const synced = await replicant<boolean>("synced", props.replicantNamespace, props.syncedDefault);
emit('updateEnabled', enabled.value);
emit('updateSynced', synced.value);

const dummyEnabledValue = computed<boolean>({
	get() {
		return enabled.value;
	},
	set(newValue) {
		enabled.value = newValue;
		emit('updateEnabled', newValue);
	}
})
const dummySyncedValue = computed<boolean>({
	get() {
		return synced.value
	},
	set(newValue) {
		synced.value = newValue;
		emit('updateSynced', newValue);
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
