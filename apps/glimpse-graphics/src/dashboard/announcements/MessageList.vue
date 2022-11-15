<template>
	<ul>
		<li v-for="msg in announcements" :class="'message message-' + msg.type">
			<p :class="'message-' + msg.type">{{computedMessage(msg).value}}</p>
			<n-button class="message-remove-btn" type="error" circle quaternary @click="removeMessage(msg)">&#x2716;</n-button>
		</li>
	</ul>
</template>

<script setup lang="ts">

import {computed, defineProps, PropType} from "vue";
import {Announcement} from "../../common/Announcement";
import {NButton} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {millisToString} from "../util";

const replicants = await loadReplicants();

const props = defineProps({
	announcements: {
		type: Object as PropType<Announcement[]>,
		required: true
	}
});

const emit = defineEmits(['update:messages']);

function removeMessage(message: Announcement) {
	const messageIndex = props.announcements.indexOf(message);
	if(messageIndex < 0) {
		return;
	}

	const messagesCopy = [...props.announcements];
	messagesCopy.splice(messageIndex, 1);
	emit('update:messages', messagesCopy);
}

function computedMessage(message: Announcement) {
	return computed(() => {
		if(!message.timer || !message.timer.visible) {
			return message.message;
		} else {
			const timeRemaining = message.timer.length - (message.timer.startedAt - replicants.scoreboard.clock.time.value);
			if(timeRemaining <= 0) {
				removeMessage(message);
				return message.message;
			}
			return message.message + ' ' + millisToString(timeRemaining);
		}
	})
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
