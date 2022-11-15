<template>
<div>

	<n-data-table :columns="tableCols" :data="tableData" />
</div>
</template>

<script setup lang="ts">
import {NButton, NDataTable} from "naive-ui";
import {computed, defineEmits, defineProps, h, PropType} from "vue";
import {Announcement} from "../../common/Announcement";
const props = defineProps({
	announcements: {
		type: Array as PropType<Announcement[]>,
		required: true,
	},
});

const emit = defineEmits(["update:announcements"])

const tableCols = [
	{
		title: "Message",
		key: "message",
	},
	{
		title: "Timer",
		key: "timer",
	},
	{
		title: "Actions",
		key: "actions",
		render: (row: Announcement) => {
			return h(
				NButton,
				{onClick: () => removeMessage(row)},
				{default: () => "Remove"},
			)
		}
	},
];

const tableData = computed(() => {
	return props.announcements.map((announcement) => {
		return {
			message: announcement.message,
			timer: announcement.timer
		}
	})
})

function removeMessage(message: Announcement) {
	const messageIndex = props.announcements.indexOf(message);
	if(messageIndex < 0) {
		return;
	}

	const messagesCopy = [...props.announcements];
	messagesCopy.splice(messageIndex, 1);
	emit('update:announcements', messagesCopy);
}
</script>

<style scoped lang="scss">

</style>
