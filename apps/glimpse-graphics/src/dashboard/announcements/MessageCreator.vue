<template>
	<div>
		<n-input-group>
			<n-input v-model:value="messageInput"/>
			<n-input placeholder="00:00.0" type="text" v-model:value="timerInput"/>
			<n-button @click="addMessage('info')" :disabled="!isTimerValid">Add Info</n-button>
			<n-button @click="addMessage('status')" :disabled="!isTimerValid">Add Status</n-button>
		</n-input-group>
	</div>
</template>

<script setup lang="ts">

import {ref, watchEffect} from "vue";
import {NInput, NButton, NInputGroup} from "naive-ui";
import {Announcement} from "../../common/Announcement";
import {parseTimeString} from "../util";
import {MessageTimer} from "../../common/Announcement";
import {loadReplicants} from "../../browser-common/replicants";

const replicants = await loadReplicants()

const messageInput = ref<string>("");
const timerInput = ref<string>("");

const isTimerValid = ref<boolean>(true);
const timerRawNumber = ref<number>(0);

watchEffect(() => {
	if(timerInput.value.length === 0) {
		isTimerValid.value = true;
		timerRawNumber.value = 0;
	} else {
		try {
			timerRawNumber.value = parseTimeString(timerInput.value);
			isTimerValid.value = true;
		} catch(e) {
			isTimerValid.value = false;
		}
	}
})

const emit = defineEmits(['add'])

function addMessage(type: 'info'|'status') {
	if(messageInput.value.length === 0) {
		return;
	}

	let timerValue: MessageTimer|undefined = undefined;
	if(isTimerValid.value && timerRawNumber.value !== 0) {
		timerValue = {
			visible: true,
			startedAt: replicants.scoreboard.clock.time.value,
			length: timerRawNumber.value
		}
	}

	const message = new Announcement(messageInput.value, type, timerValue);
	emit('add', message);
}

</script>

<style scoped lang="scss">

</style>
