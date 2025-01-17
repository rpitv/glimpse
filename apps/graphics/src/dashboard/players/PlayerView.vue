<template>
	<div @keyup="renderPlayers">
		<v-text-field label="Search for a player" placeholder="Use commas to search for multiple players"
		  v-model="searchInput" @update:modelValue="search" />
	</div>
	<div class="people">
		<div v-for="(person, i) in searchRoster" :key="i + additionalPlayers">
			<v-item :value="{ person, teamSide }" v-slot="{ isSelected, selectedClass, toggle}">
				<v-card width="200" @click="toggle">
					<v-img :gradient="isSelected ? 'to top right, rgba(0,0,255,.2), rgba(0,0,255,.2)' : ''" :src="person.image" />
					<v-card-text>
						<p>{{ person.uni ? `#${person.uni}: ` : "" }} {{ person.name }}</p>
					</v-card-text>
				</v-card>
			</v-item>
		</div>
	</div>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted, watch } from "vue";
import { loadReplicants } from "../../browser-common/replicants";

const replicants = await loadReplicants();

interface Person {
	custom1: string | null
	custom2: string | null
	height: string
	hometown: string
	image: string
	name: string
	number: string
	position: string
	previousTeam: string
	weight: string
	year: string
}


const props = defineProps({
	roster: {
		type: Object as PropType<Person[]>,
		required: true
	},
	teamSide: {
		type: String,
		required: true
	},
	additionalPlayers: {
		type: Number,
		required: false,
		default: 0
	}
});

const searchRoster = ref();
const searchInput = ref("");
const renderedPlayers = ref<Person[]>([]);
const renderIndex = ref(0);

function search() {
	if (!searchInput.value) {
		searchRoster.value = props.roster;
		return;
	}
	// Make it possible to filter multiple players
	let values = searchInput.value.split(",").map((x) => x.trim());
	if (values.length > 1)
		values = values.filter((x) => x !== "");
	searchRoster.value = props.roster.filter((person) => {
		if (values.length === 0) return true;
		for (const value of values) {
			if (parseInt(value))
				if (parseInt(person.number) === parseInt(value))
					return true;
			if (person.name.toLowerCase().includes(value.toLowerCase()))
				return true;
		}
		return false;
	});

}

function renderPlayers(event: KeyboardEvent) {
	if (event.key === "Enter") {
		replicants.lowerThird.playerBio.action.player.name.value = renderedPlayers.value[renderIndex.value].name;
		replicants.lowerThird.playerBio.action.player.number.value = renderedPlayers.value[renderIndex.value].number as string;
		replicants.lowerThird.playerBio.image.url.value = renderedPlayers.value[renderIndex.value].image;
		replicants.lowerThird.playerBio.action.player.teamSide.value = props.teamSide as ("leftTeam" | "rightTeam" | "");
		replicants.lowerThird.playerBio.show.value = !replicants.lowerThird.playerBio.show.value;

		if (replicants.lowerThird.playerBio.show.value)
			renderIndex.value++;
		if (renderIndex.value >= renderedPlayers.value.length)
			renderIndex.value = 0;
		return;
	}
	let values = searchInput.value.split(",").map((x) => x.trim());
	if (!values.length) return;
	if (values.length > 1)
		values = values.filter((x) => x !== "");
	renderedPlayers.value = [];
	renderIndex.value = 0;
	for (const value of values) {
		if (parseInt(value)) {
			for (const person of props.roster) {
				if (parseInt(value) === parseInt(person.number as string)) {
					renderedPlayers.value.push(person);
					break;
				}
			}
		}
		else {
			for (const person of props.roster) {
				if (person.name.toLowerCase().includes(value.toLowerCase())) {
					renderedPlayers.value.push(person);
					break;
				}
			}
		}

	}
}

watch((props), () => {
	searchRoster.value = props.roster;
}, { deep: true });

onMounted(() => {
	searchRoster.value = props.roster;
});

</script>

<style scoped lang="scss">
.people {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	height: 500px;
	overflow-y: scroll;
	border-style: solid;
}
</style>
