<template>
	<h1>API</h1>
	<label>Enable API? </label>
	<n-checkbox v-model:checked="replicants.gameSettings.api.enabled.value"/>
	<div v-if="replicants.gameSettings.api.enabled.value">
		<label class="mt-10">API KEY (DO NOT SHARE)</label>
		<br>
		<n-input :on-update:value="(string) => replicants.gameSettings.api.key.value = string"
				 :default-value="replicants.gameSettings.api.key.value"
				 :value="replicants.gameSettings.api.key.value"
				 style="width: 30vw"
				 placeholder="Enter an API Key"/>
		<!-- todo hide the api key unless input is selected -->
		<br>
		<n-button type="info" @click="copyApiKeyToClipboard" class="mt-10">Copy Key</n-button>
		<br>
		<n-button type="error" class="mt-10" @click="regenerateApiKey">Regenerate API Key</n-button>
	</div>
</template>

<script setup lang="ts">
import {NButton, NCheckbox, NInput, useDialog, useMessage} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {v4} from "uuid";

const replicants = await loadReplicants();
const msg = useMessage();
const dialog = useDialog()

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
					msg.success("API Key has been reset");
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

function copyApiKeyToClipboard(): void {
	navigator.clipboard.writeText(replicants.gameSettings.api.key.value)
	msg.info("API Key has been copied to clipboard.")
}
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
</style>
