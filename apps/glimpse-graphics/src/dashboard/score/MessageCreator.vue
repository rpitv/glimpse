<template>
	<div>
		<n-input-group>
			<n-radio-group v-model:value="messageType">
				<n-radio-button value="info">Info</n-radio-button>
				<n-radio-button value="status">Status</n-radio-button>
			</n-radio-group>
			<n-input v-model:value="messageInput"/>
			<n-button>Add Message</n-button>
		</n-input-group>
	</div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {NInput, NRadioGroup, NRadioButton, NButton, NInputGroup} from "naive-ui";

const messageInput = ref<string>("");
const messageType = ref<string>("info");

</script>

<style scoped lang="scss">

</style>
