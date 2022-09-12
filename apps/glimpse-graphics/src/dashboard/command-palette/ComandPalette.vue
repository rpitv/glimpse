<template>
	<div>
		<textarea class="palette" ref="palette" :placeholder="paletteText" @keydown="paletteKeyPressed" />
		<n-collapse class="command-key">
			<n-collapse-item title="Key" name="Key">
				<n-table :bordered="false" :single-line="false">
					<thead>
					<tr>
						<th>Key</th>
						<th>Command</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="command in commands">
						<td>{{command.displayedChar}}</td>
						<td>{{command.title}}</td>
					</tr>
					</tbody>
				</n-table>
			</n-collapse-item>
		</n-collapse>
	</div>
</template>

<script setup lang="ts">

import {loadReplicants} from "../../browser-common/replicants";
import {ref, watchEffect} from "vue";
import {NTable, NCollapse, NCollapseItem} from "naive-ui";

const replicants = await loadReplicants();

const palette = ref<HTMLElement|null>(null);

type Command = {
	displayedChar: string,
	title: string,
	fn: () => void
}

const commands: Record<string, Command> = {
	' ': {
		displayedChar: 'Space',
		title: 'Show/Hide Scoreboard',
		fn() {
			replicants.scoreboard.visible.value = !replicants.scoreboard.visible.value;
		}
	},
	'k': {
		displayedChar: 'K',
		title: 'Play/Pause Clock',
		fn() {
			replicants.scoreboard.clock.isRunning.value = !replicants.scoreboard.clock.isRunning.value
		}
	},
	'j': {
		displayedChar: 'J',
		title: 'Subtract 0.1s',
		fn() {
			replicants.scoreboard.clock.time.value -= 100;
		}
	},
	'J': {
		displayedChar: 'Shift + J',
		title: 'Subtract 1.0s',
		fn() {
			replicants.scoreboard.clock.time.value -= 1000;
		}
	},
	'l': {
		displayedChar: 'L',
		title: 'Add 0.1s',
		fn() {
			replicants.scoreboard.clock.time.value += 100;
		}
	},
	'L': {
		displayedChar: 'Shift + L',
		title: 'Add 1.0s',
		fn() {
			replicants.scoreboard.clock.time.value += 1000;
		}
	},
	'Tab': {
		displayedChar: 'Tab',
		title: 'Exit Command Palette',
		fn() {
			return; // Handled externally
		}
	}

}

const paletteBgColor = ref<string>('#ddaaaa');
const paletteText = ref<string>('Command palette not in focus. Click here to use command palette.');

watchEffect(() => {
	if(palette.value !== null) {
		palette.value.addEventListener('focusin', () => {
			paletteText.value = 'Command palette in focus. Ready to receive commands.';
			paletteBgColor.value = '#aaddaa';
		})
		palette.value.addEventListener('focusout', () => {
			paletteText.value = 'Command palette not in focus. Click here to use command palette.';
			paletteBgColor.value = '#ddaaaa';
		})
	}
})

function paletteKeyPressed(event: KeyboardEvent) {
	console.log(event.key);
	if(event.key === "Tab") {
		// Tab is treated as normal to allow escaping the palette
		return;
	}

	event.preventDefault();
	if(commands[event.key] !== undefined) {
		console.log(`Running ${commands[event.key].title}`);
		commands[event.key].fn();
	}
}

</script>

<style scoped lang="scss">
.palette {
	display: flex;
	align-items: center;
	text-align: center;

	padding: 1em;

	height: 8em;
	max-width: 100%;

	background-color: v-bind(paletteBgColor);
	color: black;
	caret-color: transparent;

	&::placeholder {
		color: black;
	}
}

.command-key {
	margin-top: 1em;
}
</style>
