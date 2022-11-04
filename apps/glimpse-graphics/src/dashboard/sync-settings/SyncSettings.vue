<template>
<div>

	<h1>Daktronics RTD</h1>
	<div class="conn-light"></div>
	<p class="conn-text">
		{{connectedText}} -
		{{(replicants.sync.status.value.bitrate / 1000).toFixed(2)}} Kbps
	</p>
	<div class="mt-10">
		<label :for="syncPathId">Sync Path</label>
		<n-select :id="syncPathId" clearable v-model:value="replicants.sync.selectedPort.value" :options="availablePortsOptions" />
	</div>
	<div class="mt-10">
		<label :for="sportId">Sport</label>
		<n-select :id="sportId" v-model:value="replicants.sync.selectedSport.value" :options="availableSportsOptions" />
	</div>

	<div class="mt-10">
		<n-checkbox v-model:checked="showAdvancedSettings" @click="confirmShowAdvanced">Advanced Settings</n-checkbox>
	</div>

	<div v-if="showAdvancedSettings && replicants.sync.selectedPort.value === 'MOCK'">
		<h1>Mock Data Submission</h1>

		<h2>Packet Upload</h2>
		<div class="mt-10">
			<label :for="mockPacketId">Mock Packet</label>
			<n-select :id="mockPacketId" v-model:value="mockPacketSelection" :options="mockPacketOptions" />
		</div>
		<div class="mt-10">
			<label :for="mockPacketDataId">Data</label>
			<n-input :id="mockPacketDataId" v-model:value="mockPacketDataInput" />
		</div>
		<n-button class="mt-10" @click="submitMockPacket">Submit</n-button>

		<h2>Bulk Upload</h2>
		<n-alert type="warning" v-if="mockBulkErrorMsg">{{ mockBulkErrorMsg }}</n-alert>
		<n-upload ref="mockBulkUploadElem" @change="dataFileUploaded" :max="1" class="mt-10">
			<n-upload-dragger>
				<p>Click or drag a file to this area to upload.</p>
			</n-upload-dragger>
		</n-upload>
		<n-button class="mt-10" @click="submitMockBulk" :disabled="mockBulkData === null">Submit</n-button>
		<n-progress :percentage="mockBulkData ? mockBulkUploadProgress / mockBulkData.byteLength : 0"  />
	</div>
</div>
</template>

<script setup lang="ts">
import {NInput, NSelect, NCheckbox, NButton, NUpload, NUploadDragger, NAlert, NProgress} from "naive-ui";
import {v4} from "uuid";
import {MessageComposable} from "../../common/MessageComposable";
import {computed, ref} from "vue";
import { loadReplicants } from "../../browser-common/replicants";
import {SettledFileInfo} from "naive-ui/es/upload/src/interface";

const replicants = await loadReplicants();

const syncPathId = v4();
const sportId = v4();
const mockPacketId = v4();
const mockPacketDataId = v4();

const showAdvancedSettings = ref<boolean>(false);

// List of sports to choose from, along with their packet definitions. Sport selection is to tell the
//  backend which packet definitions to use when parsing the data. Individual names and lengths of packets
//  are used by the frontend exclusively for mock data submission.
const sports = ref<{[key: string]: {[key: number]: {title: string, length: number}}}|null>(null);
new MessageComposable("sports-request", "glimpse-graphics.daktronics")
	.send('feed me') // Data can be anything here, server is only listening for a message.
	.then((sportsData: any) => {
		sports.value = sportsData;
	});

// Mock data packet upload values
const mockPacketSelection = ref<string | null>('');
const mockPacketDataInput = ref<string>('');
const mockPacketOptions = computed(() => {
	const selectedSport = replicants.sync.selectedSport.value;
	if(!sports.value || !selectedSport || !sports.value[selectedSport]) {
		return [];
	}

	const packetIds = Object.keys(sports.value[selectedSport]);
	const options = [];
	for(const packetId of packetIds) {
		options.push({
			// @ts-ignore
			label: `${sports.value[selectedSport][packetId].title} (ID: ${packetId})`,
			value: packetId
		});
	}
	return options;
});

// Mock data bulk upload values
const mockBulkUploadElem = ref<typeof NUpload|null>(null);
const mockBulkErrorMsg = ref<string|null>();
const mockBulkData = ref<Uint8Array|null>(null);
const mockBulkUploadProgress = ref<number>(0);

const availablePortsOptions = computed<{label: string, value: string}[]>(() => {
	// Map the available ports to the options that the NSelect component expects.
	const arr = replicants.sync.availablePorts.value.map((port) => {
		return {label: port, value: port};
	});

	// If the selected port is not in the list of available ports, add it to the list.
	if(
		replicants.sync.selectedPort.value !== 'MOCK' &&
		replicants.sync.selectedPort.value &&
		replicants.sync.availablePorts.value.indexOf(replicants.sync.selectedPort.value) < 0
	) {
		arr.push({label: replicants.sync.selectedPort.value + ' (Disconnected)', value: replicants.sync.selectedPort.value});
	}

	// If the selected port is MOCK, or if the user has enabled advanced settings, add MOCK to the list.
	if(replicants.sync.selectedPort.value === "MOCK" || showAdvancedSettings.value) {
		arr.push({label: "Mock", value: "MOCK"});
	}

	return arr;
});

const availableSportsOptions = computed(() => {
	if(!sports.value) {
		return [];
	}

	return Object.keys(sports.value).map((sport) => {
		return {label: sport, value: sport};
	});
});

const connLightColor = computed<string>(() => {
	if (replicants.sync.status.value.connected) {
		return "#93db4f";
	} else {
		return "#eb7434";
	}
});

const connectedText = computed<string>(() => {
	if(replicants.sync.status.value.connected) {
		return 'Connected';
	} else if(replicants.sync.selectedPort.value) {
		return 'Connecting...';
	} else {
		return 'Disconnected';
	}
});

const mockChannel = new MessageComposable("mock", "glimpse-graphics.daktronics");

function confirmShowAdvanced() {
	if(
		showAdvancedSettings.value &&
		!confirm("Do not modify these settings unless you know what you are doing. Are you sure you want to continue?")
	) {
		showAdvancedSettings.value = false;
	}
}

async function submitMockBulk() {
	let bytes: number[] = [];
	for(mockBulkUploadProgress.value = 0; mockBulkUploadProgress.value < (mockBulkData.value?.length || 0); mockBulkUploadProgress.value++) {
		if(!mockBulkData.value || mockBulkData.value.at(mockBulkUploadProgress.value) === undefined) {
			continue;
		}
		bytes.push(<number>mockBulkData.value.at(mockBulkUploadProgress.value));
		if((mockBulkUploadProgress.value+1) % 100 === 0) {
			mockChannel.send(bytes);
			bytes = [];
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	}
}

async function submitMockPacket() {
	// Get packet ID, convert to string, pad with leading zeroes, and then convert to bytes.
	const packetId = mockPacketSelection.value;
	if(!packetId) {
		return;
	}
	// noinspection TypeScriptUnresolvedFunction -- Bug with IDE?
	const packetIdStr = (parseInt(packetId) - 1).toString().padStart(5, '0');
	const packetIdBytes = new TextEncoder().encode(packetIdStr);

	const payload = [
		0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x30, 0x01, // Padding? followed by ID start byte?
		0x30, 0x30, 0x34, 0x32, 0x31, // 00421 in ASCII
		...packetIdBytes,// 5-digit packet ID
		0x02, // Message start byte?
		...new TextEncoder().encode(mockPacketDataInput.value), // Message data
		0x04 // End byte?
    ];

	const checksum = payload.reduce((a, b) => a + b, 0) % 256;
	const checksumAscii = new TextEncoder().encode(checksum.toString(16));

	const fullPacket = [
		0x16, // Packet start
		...payload, // Payload
		...Uint8Array.from(checksumAscii), // Checksum
		0x17 // Packet end
	];

	mockChannel.send(fullPacket);
}

function dataFileUploaded(uploadEvent:{file: SettledFileInfo, event?: Event}) {
	// If there is no browser attached to the NaiveUI event, then the file is being removed, not uploaded.
	if(!uploadEvent.event) {
		mockBulkData.value = null;
		return;
	}

	// Sanity check to confirm a file was actually uploaded. If not, some error occurred.
	if(!uploadEvent.file || !uploadEvent.file.file) {
		mockBulkErrorMsg.value = 'File upload failed. Try again.'
		if(mockBulkUploadElem.value) {
			mockBulkUploadElem.value.clear();
		}
		mockBulkData.value = null;
		return;
	}

	// Add handler for after reading the "uploaded" file, then read the file.
	const fr = new FileReader();
	fr.addEventListener('loadend', (readEvent) => {
		// Sanity check to confirm a file was actually read. If not, some error occurred.
		if(!readEvent.target || !readEvent.target.result) {
			mockBulkErrorMsg.value = 'File upload failed. Try again.'
			if(mockBulkUploadElem.value) {
				mockBulkUploadElem.value.clear();
			}
			mockBulkData.value = null;
			return;
		}
		// File successfully read. Check the file's contents to make sure it's a valid Daktronics RTD feed.
		const fileContents = new Uint8Array(<ArrayBuffer>readEvent.target.result);
		// First byte is always 0x16 in a valid RTD feed.
		if(fileContents.at(0) !== 0x16) {
			mockBulkErrorMsg.value = 'That file doesn\'t appear to be a valid Daktronics RTD feed.';
			if (mockBulkUploadElem.value) {
				mockBulkUploadElem.value.clear();
			}
			mockBulkData.value = null;
		} else {
			mockBulkData.value = fileContents;
			mockBulkErrorMsg.value = null;
		}
	});
	fr.readAsArrayBuffer(uploadEvent.file.file);
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
