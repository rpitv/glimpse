<template>
<div>
	<n-data-table
		:columns="tableCols"
		:data="tableData"
		:row-key="(row) => row.id"
		@update:checked-row-keys="checkedRowsUpdate" />
</div>
</template>

<script setup lang="ts">
import {DataTableColumns, NButton, NDataTable, NInput} from "naive-ui";
import {computed, defineEmits, defineProps, h, PropType, ref, VNode} from "vue";
import {Announcement} from "../../common/Announcement";
import {v4} from "uuid";
import {loadReplicants} from "../../browser-common/replicants";
import {millisToString, parseTimeString} from "../util";
import {RowKey} from "naive-ui/lib/data-table/src/interface";
import AnnouncementTimerControl from "./AnnouncementTimerControl.vue";

const replicants = await loadReplicants();

const props = defineProps({
	announcements: {
		type: Array as PropType<Announcement[]>,
		required: true,
	},
});

const emit = defineEmits(["update:announcements"])

/**
 * Definition of the data for rows within the table. While the table is intended to display
 *   announcements, that doesn't mean that the table's data strictly has to follow the same
 *   structure as {@link Announcement}. In this case, each row also has an "Actions" column,
 *   and each column can also be represented as some other type of VNode other than a plain
 *   string (e.g. an input to edit the value).
 */
type AnnouncementRow = {
	id: string, // ID is used not to display, but to identify the row
	message: VNode|string,
	timer: VNode|string,
	actions?: VNode
}

// When the user inputs a new message, it shouldn't be applied until after they click out of the input
//   To do this we need to store the input value in
const messageEditInputs = ref<{[id: string]: string}>({});
// Casting because the type for the expand column seems to break things for me.
const tableCols: DataTableColumns<AnnouncementRow> = <DataTableColumns<AnnouncementRow>> [
	{
		type: "selection",
		disabled: (row: AnnouncementRow) => row.id === "new",
	},
	{
		type: "expand",
		expandable: (row: AnnouncementRow) => row.timer !== '-' && row.id !== "new",
		renderExpand: (row: AnnouncementRow) => {
			return h(AnnouncementTimerControl, {
				announcementId: row.id
			})
		}
	},
	{
		title: "Message",
		key: "message",
		render: (row: AnnouncementRow) => {
			// If message isn't just a string (i.e., it's a VNode), just return that VNode.
			//   Otherwise, we can overwrite that string with our own NInput VNode which allows
			//   the user to edit the string.
			if(typeof row.message !== 'string') {
				return row.message;
			}

			// Apply the current value to the input if it's not already set
			if(!messageEditInputs.value[row.id]) {
				messageEditInputs.value[row.id] = row.message;
			}

			// Return an NInput that allows the user to edit the message. Changes are not
			//   applied until the NInput loses focus.
			// noinspection TypeScriptValidateTypes - Incorrect typing?
			return h(NInput, {
				value: messageEditInputs.value[row.id],
				onUpdateValue: (newValue: string) => messageEditInputs.value[row.id] = newValue,
				onBlur: () => {
					// Once blurred, find the announcement with the matching ID and update its
					//  message to the value stored in the input
					const announcement = props.announcements.find(a => a.id === row.id);
					if(announcement) {
						// We can edit the message directly since it's a property, instead of
						// having to create a copy and then emit the new array
						announcement.message = messageEditInputs.value[row.id];
					}
				}
			}, {});
		}
	},
	{
		title: "Timer",
		key: "timer",
	},
	{
		title: "Actions",
		key: "actions",
		render: (row: AnnouncementRow) => {
			// If this row already has it's own actions, just return those actions
			//   This is the case only for the "Add Announcement" row
			if(row.actions) {
				return row.actions;
			}

			// Otherwise, return the default actions for the row. This is going to just be the
			//   "Delete" button, currently.
			// noinspection TypeScriptValidateTypes - Incorrect typing?
			return h(
				NButton,
				{
					onClick: () => removeAnnouncement(row.id),
					type: "error",
					secondary:true,
					circle: true
				},
				{default: () => "✕"},
			)
		}
	},
];

const tableData = computed<AnnouncementRow[]>(() => {
	// Create a row for each announcement
	const currentAnnouncements: AnnouncementRow[] = props.announcements.map((announcement: Announcement): AnnouncementRow => {
		let timerToDisplay = null;
		if(announcement.timer) {
			const timeRemaining = announcement.timer.length - (announcement.timer.startedAt - replicants.scoreboard.clock.time.value);
			timerToDisplay = millisToString(timeRemaining);
		}
		return {
			id: announcement.id,
			message: announcement.message,
			timer: timerToDisplay ?? '-'
		}
	});

	// Add a final row that allows the user to add a new announcement
	let newAnnouncementMessageInput = "";
	let newAnnouncementTimerInput = "";
	// noinspection TypeScriptValidateTypes - Incorrect typing?
	currentAnnouncements.push({
		id: "new",
		message: h(
			NInput,
			{
				placeholder: "Message",
				onUpdateValue: (value) => {
					newAnnouncementMessageInput = value;
				},
			}, {}
		),
		timer: h(
			NInput,
			{
				placeholder: "mm:ss.S",
				onUpdateValue: (value) => {
					newAnnouncementTimerInput = value;
				},
			}, {}
		),
		actions: h(
			NButton,
			{
				onClick: () => addAnnouncement(newAnnouncementMessageInput, newAnnouncementTimerInput),
				circle: true,
				type: "success",
				secondary:true,
				class: "add-announcement-button"
			},
			{default: () => "+"}
		),
	})

	return currentAnnouncements;
})

function addAnnouncement(message: string, timer: string) {
	try {
		const newAnnouncement: Announcement = {
			id: v4(),
			message: message,
			type: "info", // TODO allow user to select type
			timer: timer ? {
				visible: true,
				startedAt: replicants.scoreboard.clock.time.value,
				length: parseTimeString(timer),
				timerEndsAction: "removeAnnouncement"
			} : null,
		}

		emit("update:announcements", [...props.announcements, newAnnouncement]);
	} catch(e) {
		// Failed to parse timer string
		console.error(e);
	}
}

function removeAnnouncement(removeId: string) {
	const annIndex = props.announcements.findIndex((ann) => ann.id === removeId);
	if(annIndex < 0) {
		return;
	}

	const announcementsCopy = [...props.announcements];
	announcementsCopy.splice(annIndex, 1);
	emit('update:announcements', announcementsCopy);
}

function checkedRowsUpdate(checkedRows: RowKey[]) {
	console.log(checkedRows);
}
</script>

<style scoped lang="scss">
.add-announcement-button {
	font-size: 1.5em;
}
</style>
