<template>
	<div>
		<div v-if="selectedRows.length > 0 && tableData.filter(row => row.id !== 'empty').length > 0" class="remove-selected-section">
			<n-button type="error" round secondary @click="removeSelectedAnnouncements">Remove Selected</n-button>
		</div>
		<n-data-table
			:columns="tableCols"
			:data="tableData"
			:row-key="(row) => row.id"
			:summary="createFooter"
			@update:checked-row-keys="(newSelectedRows) => selectedRows = newSelectedRows"/>
	</div>
	<h4>Quickplay Buttons</h4>
	<div v-if="!globalAnnouncements" class="quickplay">
		<!--Hockey-->
		<span v-if="replicants.gameSettings.style.value === 'espn' || replicants.gameSettings.style.value === 'rpitv-style7'">
			<NButton @click="addAnnouncement('Power Play', '2:00')">2:00 Power Play</NButton>
			<NButton @click="addAnnouncement('Power Play', '5:00')">5:00 Power Play</NButton>
			<NButton @click="addAnnouncement('Man Up', '0:30')">0:30 Man Up</NButton>
			<NButton @click="addAnnouncement('Man Up', '1:00')">1:00 Man Up</NButton>
			<NButton @click="addAnnouncement('Man Up', '2:00')">2:00 Man Up</NButton>
			<NButton @click="addAnnouncement('Man Up', '3:00')">3:00 Man Up</NButton>
			<NButton @click="addAnnouncement('Man Up', '5:00')">5:00 Man Up</NButton>
		</span>
		<!--Football-->
		<span v-if="replicants.gameSettings.style.value === 'football'">
			<NButton @click="addAnnouncement('Flag', '')">Flag</NButton>
		</span>
		<NButton @click="addAnnouncement('Timeout', '')">Timeout</NButton>
	</div>
	<div v-else>
		<span v-if="replicants.gameSettings.style.value === 'espn' || replicants.gameSettings.style.value === 'rpitv-style7'">
			<NButton @click="addAnnouncement('Official Review', '')">Official Review</NButton>
			<NButton @click="addAnnouncement('Delayed Penalty', '')">Delayed Penalty</NButton>
			<NButton @click="addAnnouncement('Empty Net', '')">Empty Net</NButton>
		</span>
		<!--Football-->
		<span v-if="replicants.gameSettings.style.value === 'football'">
			<NButton @click="addAnnouncement('Play Under Review', '')">PUR</NButton>
			<NButton @click="addAnnouncement('Flag', '')">Flag</NButton>
		</span>
		<NButton @click="addAnnouncement('Timeout', '')">Timeout</NButton>
	</div>
</template>

<script setup lang="ts">
import {DataTableColumns, NButton, NDataTable, NInput, useMessage} from "naive-ui";
import {computed, defineEmits, defineProps, h, PropType, ref, VNode} from "vue";
import {Announcement} from "../../common/Announcement";
import {v4} from "uuid";
import {loadReplicants} from "../../browser-common/replicants";
import {millisToString, parseTimeString} from "../util";
import {RowKey} from "naive-ui/lib/data-table/src/interface";
import AnnouncementTimerControl from "./AnnouncementTimerControl.vue";

const replicants = await loadReplicants();
const message = useMessage();

const props = defineProps({
	announcements: {
		type: Array as PropType<Announcement[]>,
		required: true,
	},
	globalAnnouncements: Boolean
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
	message: VNode | string,
	timer: VNode | string,
	actions?: VNode
}

const selectedRows = ref<RowKey[]>([]);

// When the user inputs a new message, it shouldn't be applied until after they click out of the input
//   To do this we need to store the input value in
const messageEditInputs = ref<{ [id: string]: string }>({});
// Casting because the type for the expand column seems to break things for me.
const tableCols: DataTableColumns<AnnouncementRow> = <DataTableColumns<AnnouncementRow>>[
	// Announcements can be selected and then deleted in bulk
	{
		type: "selection",
		disabled: (row: AnnouncementRow) => row.id === "empty",
	},
	// Announcements with timers can be expanded to show timer controls
	{
		type: "expand",
		expandable: (row: AnnouncementRow) => row.timer !== '-' && row.id !== "empty",
		renderExpand: (row: AnnouncementRow) => {
			return h(AnnouncementTimerControl, {
				announcementId: row.id
			})
		}
	},
	{
		title: "Message",
		key: "message",
		// If this is the empty row, timer and actions columns should be hidden
		colSpan: (row: AnnouncementRow) => row.id === "empty" ? 3 : 1,
		render: (row: AnnouncementRow) => {
			// If message isn't just a string (i.e., it's a VNode), just return that VNode.
			//   Otherwise, we can overwrite that string with our own NInput VNode which allows
			//   the user to edit the string.
			if (typeof row.message !== 'string') {
				return row.message;
			}

			// Apply the current value to the input if it's not already set
			if (!messageEditInputs.value[row.id]) {
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
					if (announcement) {
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
			// If this row already has its own actions, just return those actions
			//   This is the case only for the "Add Announcement" row
			if (row.actions) {
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
					secondary: true,
					circle: true
				},
				{default: () => "✕"},
			)
		}
	},
];

const tableData = computed<AnnouncementRow[]>(() => {
	// If there are no announcements, we add a special row that tells the user
	//   there are no announcements. This is better than the default empty table look, and
	//   also allows us to use the "Summary" tool of <n-data-table> to be used as a footer which
	//   contains the add message controls.
	if(props.announcements.length === 0) {
		return [{
			id: "empty",
			message: h("div", {"class": "no-announcements-text"}, {default: () => "No announcements"}),
			timer: "-",
			actions: h("div", {
			}, {default: () => ""})
		}];
	}

	// Create a row for each announcement
	return props.announcements.map((announcement: Announcement): AnnouncementRow => {
		let timerToDisplay = null;
		try {
			if (announcement.timer) {
				const timeRemaining = announcement.timer.length - (announcement.timer.startedAt - replicants.scoreboard.clock.time.value);
				timerToDisplay = millisToString(timeRemaining);
			}
		} catch(e) {
			console.warn(e);
			message.error('Invalid timer input');
		}
		return {
			id: announcement.id,
			message: announcement.message,
			timer: timerToDisplay ?? '-'
		}
	});
})

/**
 * Add a new announcement to the list of announcements. Emits an update to the parent.
 * @param messageInput Message of the announcement to add
 * @param timerInput Timer text input of the announcement to add. Should be in the form "mm.ss.S". Any other forms
 *   are not guaranteed to successfully be parsed and may result in undesired output or errors being displayed to
 *   the user.
 */
function addAnnouncement(messageInput: string, timerInput: string | null) {
	try {
		const newAnnouncement: Announcement = {
			id: v4(),
			message: messageInput,
			type: "info", // TODO allow user to select type
			timer: timerInput ? {
				visible: true,
				startedAt: replicants.scoreboard.clock.time.value,
				length: parseTimeString(timerInput),
				timerEndsAction: "removeAnnouncement"
			} : null,
		}

		emit("update:announcements", [...props.announcements, newAnnouncement]);
	} catch (e) {
		// Failed to parse timer string
		console.error(e);
		message.error('Invalid timer input');
	}
}

/**
 * Remove all the announcements that are currently selected in the checkboxes along the left side of the table.
 *   Emits an update to the parent. If no announcements are selected, does nothing.
 */
function removeSelectedAnnouncements() {
	const selectedAnnouncementIds: string[] = tableData.value
		.filter((row: AnnouncementRow) => selectedRows.value.includes(row.id))
		.map((row: AnnouncementRow) => row.id);
	const newAnnouncements = props.announcements.filter(announcement => !(selectedAnnouncementIds).includes(announcement.id));
	emit("update:announcements", newAnnouncements);
	selectedRows.value = [];
}

/**
 * Remove a specific announcement with the given ID. Emits an update to the parent.
 * @param removeId ID of the announcement to remove. If no announcement with this ID exists, does nothing.
 */
function removeAnnouncement(removeId: string) {
	const annIndex = props.announcements.findIndex((ann) => ann.id === removeId);
	if (annIndex < 0) {
		return;
	}

	const announcementsCopy = [...props.announcements];
	announcementsCopy.splice(annIndex, 1);
	emit('update:announcements', announcementsCopy);
}

let newAnnouncementMessageInput = "";
let newAnnouncementTimerInput = "";

/**
 * Creates the add announcement section within the "Summary" section of n-data-table. This is intended to be used
 *   as an area to summarize the data in the table, but we're using it as a normal footer by always displaying
 *   a row, even if the table is empty (the row just says "Empty").
 *   @returns A row-like definition explaining what to display in each column.
 */
function createFooter() {
	// noinspection TypeScriptValidateTypes - Incorrect typing?
	return {
		message: {
			value: h(
				NInput,
				{
					placeholder: "Message",
					onUpdateValue: (value) => {
						newAnnouncementMessageInput = value;
					},
				}, {}
			)
		},
		timer: {
			value: h(
				NInput,
				{
					placeholder: "mm:ss.S",
					onUpdateValue: (value) => {
						newAnnouncementTimerInput = value;
					},
				}, {}
			)
		},
		actions: {
			value: h(
				NButton,
				{
					onClick: () => addAnnouncement(newAnnouncementMessageInput, newAnnouncementTimerInput),
					circle: true,
					type: "success",
					secondary: true,
					class: "add-announcement-button"
				},
				{default: () => "+"}
			)
		}
	}
}
</script>

<style scoped lang="scss">
.remove-selected-section {
	margin-bottom: 0.5em;
}
.add-announcement-button {
	font-size: 1.5em;
}
.no-announcements-text {
	text-align: center;
	// Since we can't overwrite the checkbox, we have to offset the text in order to center it.
	transform: translateX(-35px);
	font-style: italic;
	opacity: 0.8;
}
</style>
