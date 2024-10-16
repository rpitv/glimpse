<template>
	<div>
		<v-text-field label="Search for a player" v-model="searchInput" @update:modelValue="search" />
	</div>
	<div class="people">
		<div v-for="(person, i) in searchRoster" :key="i + additionalPlayers">
			<v-item :value="{ person, teamSide }" v-slot="{ isSelected, selectedClass, toggle}">
				<v-card width="200" @click="toggle">
					<v-img :gradient="isSelected ? 'to top right, rgba(0,0,255,.2), rgba(0,0,255,.2)' : ''" :src="person.image?.url" />
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
	"@type": string,
	"@context": string,
	gender: string,
	image: {
		"@type": string,
		height: number,
		url: string,
		width: number
	},
	name: string,
	uni?: string,
	url: string
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

function search() {
	searchRoster.value = props.roster.filter((person) => {
		if (!searchInput.value) return true;
		if (parseInt(searchInput.value))
			return parseInt(person.uni) === parseInt(searchInput.value);
		return person.name.toLowerCase().includes(searchInput.value.toLowerCase());
	});
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
