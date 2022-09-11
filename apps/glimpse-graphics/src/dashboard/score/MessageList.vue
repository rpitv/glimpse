<template>
	<ul>
		<li v-for="msg in messages" :class="'message message-' + msg.type">
			<p :class="'message-' + msg.type">{{msg.message}}</p>
			<n-button class="message-remove-btn" type="error" circle quaternary @click="removeMessage(msg)">&#x2716;</n-button>
		</li>
	</ul>
</template>

<script setup lang="ts">

import {defineProps, PropType} from "vue";
import {DisplayableMessage} from "../../common/DisplayableMessage";
import {NButton} from "naive-ui";

const props = defineProps({
	messages: {
		type: Object as PropType<DisplayableMessage[]>,
		required: true
	}
});

const emit = defineEmits(['update:messages']);

function removeMessage(message: DisplayableMessage) {
	const messageIndex = props.messages.indexOf(message);
	if(messageIndex < 0) {
		return;
	}

	const messagesCopy = [...props.messages];
	messagesCopy.splice(messageIndex, 1);
	emit('update:messages', messagesCopy);
}
</script>

<style scoped lang="scss">

.message {
	display: flex;
	align-items: center;
	text-align: center;

	margin-bottom: 0.5em;
	border-radius: 0.5em;

	&.message-info {
		background-color: #888;
		color: white;
	}
	&.message-status {
		background-color: #f8c840;
		color: black;
	}

	p {
		width: 100%;
	}
	.message-remove-btn {
		justify-content: center;
		margin-right: 0.5em;
	}
}
</style>
