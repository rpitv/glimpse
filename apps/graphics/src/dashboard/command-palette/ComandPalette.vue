<template>
	<div>
		<n-button
			size="large"
			class="show-scoreboard-button"
			:type="isScoreboardShown ? 'error' : 'success'"
			@click="isScoreboardShown = !isScoreboardShown"
		>
			{{ isScoreboardShown ? 'Hide' : 'Show' }} Scoreboard
		</n-button>
		<hr>
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
					<tr v-for="command in visibleCommands">
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
import {computed, ref, watchEffect} from "vue";
import {NTable, NCollapse, NCollapseItem, NButton} from "naive-ui";

const replicants = await loadReplicants();

const palette = ref<HTMLElement|null>(null);

const isScoreboardShown = replicants.scoreboard.visible;

type Command = {
	displayedChar: string,
	title: string,
	fn: () => void,
	enabled: () => boolean
}

function areClockCommandsEnabled(): boolean {
	return replicants.gameSettings.clock.enabled.value && !replicants.sync.values.clock.value;
}

const commands: Record<string, Command> = {
	' ': {
		displayedChar: 'Space',
		title: 'Show/Hide Scoreboard',
		fn() {
			replicants.scoreboard.visible.value = !replicants.scoreboard.visible.value;
		},
		enabled() {
			return true;
		}
	},
	'k': {
		displayedChar: 'K',
		title: 'Play/Pause Clock',
		fn() {
			replicants.scoreboard.clock.isRunning.value = !replicants.scoreboard.clock.isRunning.value
		},
		enabled: areClockCommandsEnabled
	},
	'j': {
		displayedChar: 'J',
		title: 'Subtract 0.1s',
		fn() {
			replicants.scoreboard.clock.time.value -= 100;
		},
		enabled: areClockCommandsEnabled
	},
	'J': {
		displayedChar: 'Shift + J',
		title: 'Subtract 1.0s',
		fn() {
			replicants.scoreboard.clock.time.value -= 1000;
		},
		enabled: areClockCommandsEnabled
	},
	'l': {
		displayedChar: 'L',
		title: 'Add 0.1s',
		fn() {
			replicants.scoreboard.clock.time.value += 100;
		},
		enabled: areClockCommandsEnabled
	},
	'L': {
		displayedChar: 'Shift + L',
		title: 'Add 1.0s',
		fn() {
			replicants.scoreboard.clock.time.value += 1000;
		},
		enabled: areClockCommandsEnabled
	},
	'Tab': {
		displayedChar: 'Tab',
		title: 'Exit Command Palette',
		fn() {
			return; // Handled externally
		},
		enabled() {
			return true;
		}
	}

}

const visibleCommands = computed<Record<string, Command>>(() => {
	const result: Record<string, Command> = {};
	for (const key of Object.keys(commands)) {
		if (commands[key].enabled()) {
			result[key] = commands[key];
		}
	}
	return result;
})

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
	if(event.key === "Tab") {
		// Tab is treated as normal to allow escaping the palette
		return;
	}

	event.preventDefault();
	if(commands[event.key] !== undefined && commands[event.key].enabled()) {
		console.log(`Running ${commands[event.key].title}`);
		commands[event.key].fn();
	}
}

</script>

<style scoped lang="scss">
.show-scoreboard-button {
	width: 100%;
}
.palette {
	display: flex;
	align-items: center;
	text-align: center;

	padding: 1em;

	height: 8em;
	width: 88%;

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
