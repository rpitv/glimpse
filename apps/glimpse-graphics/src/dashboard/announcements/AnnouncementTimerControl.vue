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

const newLengthInput = ref<string>('');

const announcement = computed(() => {
	const allAnnouncements = [
		...replicants.announcements.team1.value,
		...replicants.announcements.team2.value,
		...replicants.announcements.global.value
	];
	return allAnnouncements.find(a => a.id === props.announcementId);
})

function decrementSecond() {
	if (!announcement.value?.timer) {
		return;
	}
	announcement.value.timer.length -= 1000;
}

function incrementSecond() {
	if (!announcement.value?.timer) {
		return;
	}
	announcement.value.timer.length += 1000;
}

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
