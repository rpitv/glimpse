<template>
	<h1 @click="openApiLink" title="Open API Docs" id="h1ApiLabel">API</h1>
	<label>Enable API? </label>
	<n-checkbox v-model:checked="replicants.gameSettings.api.enabled.value"/>
	<div v-if="replicants.gameSettings.api.enabled.value">
		<label class="mt-10">API KEY (DO NOT SHARE)</label>
		<br>
		<n-input :default-value="replicants.gameSettings.api.key.value"
				 :value="replicants.gameSettings.api.key.value"
				 :style="{background: (displayKey ? '' : 'white')}"
				 @focus="onApiInputFocus"
				 @blur="displayKey = false"
				 readonly="true"
				 id="apiKeyInput"
				 title="Click to Copy"
				 placeholder="Enter an API Key"/>
		<br>
		<n-button type="error" class="mt-10" @click="regenerateApiKey">Regenerate API Key</n-button>
	</div>
</template>

<script setup lang="ts">
import {NButton, NCheckbox, NInput, useDialog, useMessage} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {v4} from "uuid";
import {ref, Ref} from "vue";

const replicants = await loadReplicants();
const msg = useMessage();
const dialog = useDialog();

const displayKey: Ref<boolean> = ref(false);

function openApiLink() {
	const key = replicants.gameSettings.api.key.value;
	const wl = window.location
	window.open(`${wl.protocol}//${wl.host}/glimpse-graphics-api/v1/${key}/docs`, "_blank");
}

function onApiInputFocus(e: Event): void {
	displayKey.value = true;
	copyApiKeyToClipboard();

	// attempts to select the text within the input box
	try {
		// @ts-ignore ts compiler warns here, can be ignored
		e.target.select();
	} catch (e) {
		console.error(e);
	}
}

function regenerateApiKey(): void {
	dialog.warning({
		title: "Are you sure about resting the API key?",
		content: "This will cause all current applications using the API to stop working" +
			"You will need to go into every application and update the key it is using.",
		positiveText: "Yes",
		negativeText: "No",
		onPositiveClick: () => {
			dialog.warning({
				title: "Are you certain?",
				positiveText: "Yes",
				negativeText: "No",
				onPositiveClick: () => {
					replicants.gameSettings.api.key.value = v4();
					msg.success("API Key has been reset.");
					copyApiKeyToClipboard();
				},
				onNegativeClick: () => {
					msg.error("Did not reset the API key.");
				}
			});
		},
		onNegativeClick: () => {
			msg.error("Did not reset the API key.")
		}
	});
}

// copies the API key to user clipboard
function copyApiKeyToClipboard(): void {
	navigator.clipboard.writeText(replicants.gameSettings.api.key.value)
	msg.info("API Key has been copied to clipboard.")
}
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}

#apiKeyInput {
	width: 30vw;
}

h1 {
	cursor: pointer;
}
</style>
