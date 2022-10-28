<template>
<div>

	<h1>Connection Status</h1>
	<div class="conn-light"></div>
	<p class="conn-text">
		{{replicants.sync.status.value.connected ? 'Connected' : 'Disconnected'}} -
		{{(replicants.sync.status.value.bitrate / 1000).toFixed(2)}} Kbps
	</p>

	<h1>Settings</h1>

	<div class="mt-10">
		<label :for="syncPathId">Sync Path</label>
		<n-input :id="syncPathId" v-model:value="pathInput" placeholder="/dev/ttyUSB0" />
	</div>

	<div class="mt-10">
		<label :for="baudRateId">Baud Rate</label>
		<n-input-number :id="baudRateId" placeholder="19200" v-model:value="baudRateInput" />
	</div>

	<div class="mt-10" v-if="showAdvancedSettings">
		<n-checkbox v-model:checked="mockInput">Mock</n-checkbox>
	</div>

	<n-button class="mt-10" @click="saveSyncSettings">Save</n-button>

	<div class="mt-10">
		<n-checkbox v-model:checked="showAdvancedSettings" @click="confirmShowAdvanced">Advanced Settings</n-checkbox>
	</div>

	<div v-if="showAdvancedSettings">
		<h1>Mock Data Submission</h1>
		<n-input type="textarea" v-model:value="mockDataInput" />
		<n-button class="mt-10" @click="submitMockData">Submit</n-button>
	</div>
</div>
</template>

<script setup lang="ts">
import {NInput, NInputNumber, NCheckbox, NButton} from "naive-ui";
import {v4} from "uuid";
import {MessageComposable} from "../../common/MessageComposable";
import {computed, ref} from "vue";
import { loadReplicants } from "../../browser-common/replicants";

const replicants = await loadReplicants();

const syncPathId = v4();
const baudRateId = v4();

const pathInput = ref<string>(replicants.sync.settings.value?.path || '');
const baudRateInput = ref<number>(replicants.sync.settings.value?.baudRate || 19200);
const mockInput = ref<boolean>(false);
const showAdvancedSettings = ref<boolean>(false);
const mockDataInput = ref<string>("");

const connLightColor = computed(() => {
	if (replicants.sync.status.value.connected) {
		return "#93db4f";
	} else {
		return "#eb7434";
	}
});

const mockChannel = new MessageComposable("mock", "glimpse-graphics.daktronics");

function saveSyncSettings() {
	if(!pathInput.value) {
		replicants.sync.settings.value = null;
	} else {
		replicants.sync.settings.value = {
			path: pathInput.value,
			baudRate: baudRateInput.value,
			mock: mockInput.value
		};
	}
}

function confirmShowAdvanced() {
	if(
		showAdvancedSettings.value &&
		!confirm("Do not modify these settings unless you know what you are doing. Are you sure you want to continue?")
	) {
		showAdvancedSettings.value = false;
	}
}

function submitMockData() {
	mockChannel.send(mockDataInput.value);
}

</script>

<style scoped lang="scss">
	.conn-light {
		display: inline-block;
		width: 10px;
		height: 10px;
		margin-right: 5px;
		border-radius: 50%;
		background-color: v-bind(connLightColor);
	}
	.conn-text {
		display: inline-block;
	}
	.mt-10 {
		margin-top: 10px;
	}
	h1 {
		margin: 0;
	}
</style>
