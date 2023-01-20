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
		<v-alert title="Packet Information" type="info">
			<p>
				If the data you input is less than the expected length, it will be padded with spaces according
				to its justification. If the data you input is greater than the expected length, it will all be
				sent, however the backend will likely trim it to the expected length.
			</p>
			<div v-if="selectedMockPacketInfo">
				<h3>Properties</h3>
				<ul>
					<li>Justification: {{selectedMockPacketInfo.justification === 'L' ? 'Left' : 'Right'}}</li>
					<li>Expected Length: {{selectedMockPacketInfo.length}} bytes</li>
				</ul>

				<h3>Data to be submitted</h3>
				<ul>
					<li>ASCII: "<kbd>{{ mockPacketPaddedDataInputAsciiDisplay }}</kbd>"</li>
					<li>Hexadecimal: <kbd>{{ mockPacketPaddedDataInputHexDisplay }}</kbd></li>
				</ul>
			</div>
		</v-alert>
		<div class="mt-10">
			<label :for="mockPacketId">Packet</label>
			<n-select :id="mockPacketId" v-model:value="mockPacketSelection" :options="mockPacketOptions" />
		</div>
		<div class="mt-10">
			<label :for="mockPacketDataId">Data</label>
			<n-input :id="mockPacketDataId" v-model:value="mockPacketDataInput" />
		</div>
		<n-button class="mt-10" @click="submitMockPacket">Submit</n-button>

		<h2>Bulk Upload</h2>
		<v-alert type="warning" v-if="mockBulkErrorMsg">{{ mockBulkErrorMsg }}</v-alert>
		<n-upload ref="mockBulkUploadElem" @change="uploadChangedEvent" :max="1" class="mt-10">
			<n-upload-dragger>
				<p>Click or drag a file to this area to upload.</p>
			</n-upload-dragger>
		</n-upload>
		<label>Bitrate (approximate)</label>
		<n-slider :min="100" :max="100000" v-model:value="mockBulkDataSliderValue" :step="100" :format-tooltip="(val) => `${val / 1000} Kbps`" />
		<n-input-number
			class="mt-10"
			min="0"
			v-model:value="mockBulkDataSliderValue"
			size="small"
			:step="100"
			:format="(val) => `${(val || 0) / 1000} Kbps`"
			:parse="(val) => parseFloat(val) * 1000"
		/>

		<v-alert v-if="mockBulkDataSliderValue > 19200" class="mt-10" title="Impossible Bitrate" type="info">
			<p>In real-world scenarios, bitrate will never exceed 19.2 Kbps (i.e., the baud rate).</p>
		</v-alert>

		<n-button
			class="mt-10"
			@click="mockBulkButtonClicked"
			:disabled="mockBulkData === null"
			:type="mockBulkCurrentlyUploading ? 'error' : 'success'">
			{{ mockBulkCurrentlyUploading ? "Stop" : "Start" }}
		</n-button>
		<p>Upload Progress</p>
		<n-progress :color="themeVars.successColor" :percentage="mockBulkData ? (Math.round(mockBulkUploadProgress / mockBulkData.byteLength * 1000) / 1000) * 100 : 0"  />
	</div>
</div>
</template>

<script setup lang="ts">
import {
	NSlider,
	NInputNumber,
	NInput,
	NSelect,
	NCheckbox,
	NButton,
	NUpload,
	NUploadDragger,
	NProgress,
	useThemeVars
} from "naive-ui";
import {v4} from "uuid";
import {MessageComposable} from "../../common/MessageComposable";
import {computed, ref} from "vue";
import { loadReplicants } from "../../browser-common/replicants";
import {SettledFileInfo} from "naive-ui/es/upload/src/interface";

const themeVars = useThemeVars();
const replicants = await loadReplicants();

// Unique IDs for pairing labels with inputs
const syncPathId = v4();
const sportId = v4();
const mockPacketId = v4();
const mockPacketDataId = v4();

const showAdvancedSettings = ref<boolean>(false);

type PacketDefinition = {title: string, justification: 'L'|'R', length: number}
// List of sports to choose from, along with their packet definitions. Sport selection is to tell the
//  backend which packet definitions to use when parsing the data. Individual names and lengths of packets
//  are used by the frontend exclusively for mock data submission.
const sports = ref<{[key: string]: {[key: number]: PacketDefinition}}|null>(null);
new MessageComposable("sports-request", "glimpse-graphics.daktronics")
	.send('feed me') // Data can be anything here, server is only listening for a message.
	.then((sportsData: any) => {
		sports.value = sportsData;
	});

// Mock data packet upload values
const mockPacketSelection = ref<string | null>('');
const mockPacketDataInput = ref<string>('');

// Mock data bulk upload values
const mockBulkUploadElem = ref<typeof NUpload|null>(null);
const mockBulkErrorMsg = ref<string|null>();
const mockBulkData = ref<Uint8Array|null>(null);
const mockBulkDataSliderValue = ref<number>(1500);
const mockBulkUploadProgress = ref<number>(0);
const mockBulkCurrentlyUploading = ref<boolean>(false);

// Options for the dropdown to select which packet ID to mock data for.
const mockPacketOptions = computed<{label: string, value: string}[]>(() => {
	const selectedSport = replicants.sync.selectedSport.value;
	// If we don't have the list of sports (yet), or the selected sport isn't in the list, or no sport is selected,
	//   return an empty array as we can't provide a list of packets to mock.
	if(!sports.value || !selectedSport || !sports.value[selectedSport]) {
		return [];
	}

	const packetIds = Object.keys(sports.value[selectedSport]);
	const options = [];
	for(const packetId of packetIds) {
		options.push({
			// @ts-ignore - FIXME Not sure why this is producing a TypeScript error.
			label: `${sports.value[selectedSport][packetId].title} (ID: ${packetId})`,
			value: packetId
		});
	}
	return options;
});

// Options for the dropdown to select which serial port to connect to.
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

// Options for the dropdown to select which sport the Daktronics connection is sending data for. This tells the
//   backend which packet definitions to use when parsing the data.
const availableSportsOptions = computed<{label: string, value: string}[]>(() => {
	if(!sports.value) {
		return [];
	}

	return Object.keys(sports.value).map((sport) => {
		return {label: sport, value: sport};
	});
});

// The color of the "light" on the serial port connection status indicator.
const connLightColor = computed<string>(() => {
	if (replicants.sync.status.value.error) {
		return "#db9a4f";
	} else if (replicants.sync.status.value.connected) {
		return "#93db4f";
	} else {
		return "#eb7434";
	}
});

// The text to display on the serial port connection status indicator.
const connectedText = computed<string>(() => {
	if (replicants.sync.status.value.error) {
		return replicants.sync.status.value.errorMsg;
	} else if(replicants.sync.status.value.connected) {
		return 'Connected';
	} else if(replicants.sync.selectedPort.value) {
		return 'Connecting...';
	} else {
		return 'Disconnected';
	}
});

const selectedMockPacketInfo = computed<PacketDefinition|null>(() => {
	const selectedSport = replicants.sync.selectedSport.value;
	const selectedPacket = mockPacketSelection.value;
	// @ts-ignore - FIXME Not sure why this is producing a TypeScript error.
	if(!sports.value || !selectedSport || !selectedPacket || !sports.value[selectedSport][selectedPacket]) {
		return null;
	}
	// @ts-ignore - FIXME Not sure why this is producing a TypeScript error.
	return sports.value[selectedSport][selectedPacket];
});

const mockPacketPaddedDataInput = computed<string>(() => {
	const selectedPacketInfo = selectedMockPacketInfo.value;
	if(!selectedPacketInfo) {
		return '';
	}

	const input = mockPacketDataInput.value;
	const length = selectedPacketInfo.length;
	const justification = selectedPacketInfo.justification;

	if(input.length >= length) {
		return input;
	}

	if(justification === 'L') {
		return input.padEnd(length, ' ');
	} else {
		return input.padStart(length, ' ');
	}
});

const mockPacketPaddedDataInputAsciiDisplay = computed<string>(() => {
	const paddedInput = mockPacketPaddedDataInput.value;
	// Replace all spaces with &nbsp;. Could use replaceAll, but that's still a relatively young feature.
	return paddedInput.split('').map((char) => {
		if(char === ' ') {
			return '\u00A0'; // &nbsp;
		} else {
			return char;
		}
	}).join('');
});

const mockPacketPaddedDataInputHexDisplay = computed<string>(() => {
	const paddedInput = mockPacketPaddedDataInput.value;
	// Convert all characters to hexadecimal then add spaces between each one.
	return paddedInput.split('').map((char) => {
		return char.charCodeAt(0).toString(16).padStart(2, '0');
	}).join(' ');
});

// When the open serial port is set to "MOCK", data can be sent to this channel for it to be echoed back on
//   the backend as if it were coming from a real serial port. Useful for testing and development.
const mockChannel = new MessageComposable("mock", "glimpse-graphics.daktronics");

/**
 * Confirm that the user wants to show advanced settings, and if so, set the showAdvancedSettings flag to true.
 */
function confirmShowAdvanced(): void {
	if(
		showAdvancedSettings.value &&
		!confirm("Do not modify these settings unless you know what you are doing. Are you sure you want to continue?")
	) {
		showAdvancedSettings.value = false;
	}
}

/**
 * If there is no mock bulk upload currently happening, then this submits the file which the user has selected to be
 *   uploaded as mock data. Useful for rapid testing of many types of packets split across multiple incoming data
 *   chunks, much like a real-world scenario. If there is already a mock bulk upload happening, then this cancels it.
 */
async function mockBulkButtonClicked(): Promise<void> {
	if(mockBulkCurrentlyUploading.value) {
		mockBulkCurrentlyUploading.value = false;
		return;
	}

	mockBulkCurrentlyUploading.value = true;
	let bytes: number[] = [];
	let lastSentByteNumber = 0;
	for(mockBulkUploadProgress.value = 0; mockBulkUploadProgress.value < (mockBulkData.value?.length || 0); mockBulkUploadProgress.value++) {
		const selectedBitsPerSecond = mockBulkDataSliderValue.value / 8
		if(!mockBulkCurrentlyUploading.value) {
			return;
		}
		if(!mockBulkData.value || mockBulkData.value.at(mockBulkUploadProgress.value) === undefined) {
			continue;
		}
		bytes.push(<number>mockBulkData.value.at(mockBulkUploadProgress.value));
		if(mockBulkUploadProgress.value - lastSentByteNumber >= selectedBitsPerSecond / 10) {
			mockChannel.send(bytes);
			lastSentByteNumber = mockBulkUploadProgress.value;
			bytes = [];
			await new Promise(resolve => setTimeout(resolve, 100));
		}
	}
	mockBulkCurrentlyUploading.value = false;
}

/**
 * Submit a single packet of mock data which the user has entered into the input field. Useful for testing
 *   a single type of packet during development or testing.
 */
async function submitMockPacket(): Promise<void> {
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
		...new TextEncoder().encode(mockPacketPaddedDataInput.value), // Message data
		0x04 // End byte?
    ];

	const checksum = payload.reduce((a, b) => a + b, 0) % 256;
	const checksumAscii = new TextEncoder().encode(checksum.toString(16).padStart(2, '0'));

	const fullPacket = [
		0x16, // Packet start
		...payload, // Payload
		...Uint8Array.from(checksumAscii), // Checksum
		0x17 // Packet end
	];

	mockChannel.send(fullPacket);
}

/**
 * Callback for when the user selects a file to upload as mock data. The data is not actually uploaded to the
 *   mock channel until the user clicks the "Submit" button. This is also the callback for when the user removes
 *   a file from the input field.
 * @param uploadEvent Event containing the file data, and the native DOM event. If the user is removing a file,
 *   then `uploadEvent.file` will contain the file that was removed, but `uploadEvent.event` will be undefined.
 */
function uploadChangedEvent(uploadEvent:{file: SettledFileInfo, event?: Event}): void {
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
