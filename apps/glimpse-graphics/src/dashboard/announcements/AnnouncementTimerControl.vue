<template>
	<div>
		<n-grid :cols="2" :x-gap="10">
			<n-grid-item class="vertical-center">
				<n-input-group>
					<n-button @click="decrementSecond">-1s</n-button>
					<n-button @click="incrementSecond">+1s</n-button>
					<n-input v-model:value="newLengthInput" placeholder="mm:ss.S"/>
					<n-button @click="setNewLength">Save</n-button>
				</n-input-group>
			</n-grid-item>
			<n-grid-item v-if="announcement?.timer" class="vertical-center">
				<p>When timer ends...</p>
				<n-radio
					value="removeAnnouncement"
					:checked="announcement?.timer?.timerEndsAction ==='removeAnnouncement'"
					@change="timerEndsActionChanged"
				>
					Remove announcement
				</n-radio>
				<n-radio
					value="removeTimer"
					:checked="announcement?.timer?.timerEndsAction ==='removeTimer'"
					@change="timerEndsActionChanged"
				>
					Remove timer
				</n-radio>
				<n-radio
					value="nothing"
					:checked="announcement?.timer?.timerEndsAction ==='nothing'"
					@change="timerEndsActionChanged"
				>
					Do nothing
				</n-radio>
			</n-grid-item>
		</n-grid>
	</div>
</template>

<script setup lang="ts">
import {NButton, NInput, NInputGroup, NGrid, NGridItem, NRadio, useMessage} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import {computed, ref} from "vue";
import {parseTimeString} from "../util";

const replicants = await loadReplicants();
const message = useMessage();

const props = defineProps({
	announcementId: {
		type: String,
		required: true
	}
});

// Placeholder variable for the value input by the user, which is applied when they blur the input.
const newLengthInput = ref<string>('');

// Find the announcement that this control is for by looking at all announcements and finding the one
//  with the matching ID.
const announcement = computed(() => {
	const allAnnouncements = [
		...replicants.announcements.team1.value,
		...replicants.announcements.team2.value,
		...replicants.announcements.global.value
	];
	return allAnnouncements.find(a => a.id === props.announcementId);
})

/**
 * Decrement this announcement's timer by one second. This is accomplished by decreasing the length
 *   by 1000ms.
 */
function decrementSecond() {
	if (!announcement.value?.timer) {
		return;
	}
	announcement.value.timer.length -= 1000;
}

/**
 * Increment this announcement's timer by one second. This is accomplished by increasing the length
 *   by 1000ms.
 */
function incrementSecond() {
	if (!announcement.value?.timer) {
		return;
	}
	announcement.value.timer.length += 1000;
}

/**
 * Set the length of this announcement's timer to the value in the input field. This is accomplished
 *   by parsing the input field's value, setting the start time to the current time, and setting the
 *   length to the parsed value.
 */
function setNewLength() {
	if (!announcement.value?.timer) {
		return;
	}
	try {
		const newLength = parseTimeString(newLengthInput.value);
		if (newLength) {
			announcement.value.timer.length = newLength;
			announcement.value.timer.startedAt = replicants.scoreboard.clock.time.value;
		}
	} catch (e) {
		console.warn(e);
		message.error('Invalid time format');
	}
}

/**
 * Callback for when the user changes the "When timer ends..." radio button. Simply updates the value
 *   stored in the replicant.
 * @param event Event that triggered this method call.
 */
function timerEndsActionChanged(event: Event) {
	if(!announcement.value || !announcement.value.timer) {
		return;
	}
	// Casting because .value is of type string, but we know it's one of the three options
	announcement.value.timer.timerEndsAction = <any>(event.target as HTMLInputElement).value
}
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}

.vertical-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>
