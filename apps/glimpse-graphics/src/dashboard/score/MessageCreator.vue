<template>
	<div>
		<n-input-group>
			<n-radio-group v-model:value="messageType">
				<n-radio-button value="info">Info</n-radio-button>
				<n-radio-button value="status">Status</n-radio-button>
			</n-radio-group>
			<n-input v-model:value="messageInput" @keydown="onKeypressed"/>
			<n-button @click="addMessage">Add Message</n-button>
		</n-input-group>
	</div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {NInput, NRadioGroup, NRadioButton, NButton, NInputGroup} from "naive-ui";
import {DisplayableMessage} from "../../common/DisplayableMessage";

const messageInput = ref<string>("");
const messageType = ref<"info"|"status">("info");

const emit = defineEmits(['add'])

function addMessage() {
	if(messageInput.value.length === 0) {
		return;
	}

	const message = new DisplayableMessage(messageInput.value, messageType.value);
	messageInput.value = '';
	emit('add', message);
}

function onKeypressed(event: KeyboardEvent) {
	if(event.key === "Enter") {
		addMessage();
	}
}

</script>

<style scoped lang="scss">

</style>
