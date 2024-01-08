<template>
	<div>
		<n-grid :cols="2">
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="isTeamEnabled">Enabled</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncScore">Sync Score</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncName">Sync Name</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncAbbreviation">Sync Abbr.</n-checkbox>
			</n-grid-item>
			<n-grid-item>
				<n-checkbox class="ml-10" v-model:checked="syncShots">Sync Shots</n-checkbox>
			</n-grid-item>
			<div v-if="replicants.gameSettings.style.value === 'football'">
				<n-grid-item>
					<n-checkbox class="ml-10" v-model:checked="syncTimeouts">Sync T/Os</n-checkbox>
				</n-grid-item>
			</div>
		</n-grid>

		<div v-if="isTeamEnabled">
			<v-combobox label="Enter a school name"
						class="mt-10" density="comfortable"
						:items="schoolNames"
						item-title="name"
						v-model="availableSchools" variant="outlined"
			/>
			<v-row>
				<v-col cols="4">
					<v-btn class="text-none school-btns" @click="saveSchool" color="#121212">Save School</v-btn>
				</v-col>
				<v-col cols="4">
					<v-btn class="text-none school-btns" @click="loadSchool" color="#121212">Load School</v-btn>
				</v-col>
				<v-col cols="4">
					<v-btn class="text-none school-btns" @click="deleteSchool" color="#121212">Delete School</v-btn>
				</v-col>
			</v-row>
			<v-card v-show="subtitle" class="mt-10" :subtitle="subtitle" :text="msg" variant="tonal" :color="color"></v-card>
			<div class="mt-10">
				<label :for="teamNameId">Team Name</label>
				<v-text-field clearable variant="outlined" :id="teamNameId" :disabled="syncName" v-model="teamName"/>
			</div>

			<div class="mt-10">
				<label :for="teamAbbrId">Team Abbreviation</label>
				<v-text-field clearable variant="outlined" :id="teamAbbrId" :disabled="syncAbbreviation" v-model="teamAbbr"/>
			</div>

			<div class="mt-10">
				<label :for="schoolNameId">School Name</label>
				<v-text-field clearable variant="outlined" :id="schoolNameId" v-model="teamSchoolName"/>
			</div>

			<div class="mt-10">
				<label :for="teamColorsId">Team Colors</label>
				<n-input-group :id="teamColorsId">
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamPrimaryColor" />
					<n-color-picker :show-alpha="false" :show-preview="true" :modes="['hex']" v-model:value="teamSecondaryColor" />
				</n-input-group>
			</div>
		</div>

			<div class="mt-10">
				<label :for="teamLogoId">Team Logo <small>(Only input trusted URLs.)</small></label>
				<v-text-field clearable variant="outlined" :id="teamLogoId" v-model="teamLogo"/>
			</div>

			<div class="team-logo-container">
				<img class="team-logo mt-10" v-if="teamLogo?.length > 0" :src="teamLogo" alt="Team Logo"/>
			</div>
	</div>
</template>

<script setup lang="ts">
import {defineProps, ref} from "vue";
import {v4} from "uuid";
import {NCheckbox, NInputGroup, NColorPicker, NGrid, NGridItem, NButton} from "naive-ui";
import {loadReplicants} from "../../browser-common/replicants";
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const subtitle = ref<string>();
const color = ref<string>();
const msg = ref<string>();
const schoolNames = ref<string[]>([]);
const schools = ref<any[]>([]);

const emit = defineEmits(['save, load, delete']);


// Get the schools from the database
try {
	const schoolsRef = collection(db, "schools");
	const q = query(schoolsRef);
	const querySnapshot = await getDocs(q);
	querySnapshot.docs.forEach(async (document) => {
		schoolNames.value.push(document.id);
		const schoolRef = doc(db, "schools", document.id);
		const schoolSnap = await getDoc(schoolRef);
		schools.value.push(schoolSnap.data());
	});
	localStorage.setItem("schools", JSON.stringify(schools.value));
// If the fetch fails, fallback to the local storage
} catch(e) {
	let schoolsJSON = localStorage.getItem("schools") as string;
	if (!schoolsJSON) {
		localStorage.setItem("schools", JSON.stringify([{
			abbr: "RPI",
			abbr14: "Rensselaer",
			logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/RPI_Engineers.svg/1200px-RPI_Engineers.svg.png",
			lowerThirdLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Rensselaer_at_Hartford_Seal.svg/1200px-Rensselaer_at_Hartford_Seal.svg.png",
			name: "Rensselaer Polytechnic Institute",
			primaryColor: "#d6001c",
			secondaryColor: "#ab2328",
			teamName: "Engineers"
		}]));
		schoolsJSON = localStorage.getItem("schools") as string;
	}

	schools.value = JSON.parse(schoolsJSON);

	for (const school of schools.value)
		schoolNames.value.push(school.name);
}

const teamNameId = v4();
const teamAbbrId = v4();
const teamColorsId = v4();
const schoolNameId = v4();
const teamLogoId = v4();

const props = defineProps({
	id: {
		type: Number,
		required: true
	}
})

const replicants = await loadReplicants();
const team = replicants.teams[props.id];

const isTeamEnabled = team.enabled;
const teamName = team.name;
const teamAbbr = team.abbreviation;
const teamSchoolName = team.schoolName;
const teamPrimaryColor = team.primaryColor;
const teamSecondaryColor = team.secondaryColor;
const teamLogo = team.logo;

const syncName = replicants.sync.values.teams[props.id].name;
const syncAbbreviation = replicants.sync.values.teams[props.id].abbreviation;
const syncScore = replicants.sync.values.teams[props.id].score;
const syncShots = replicants.sync.values.teams[props.id].shots;
const syncTimeouts = replicants.sync.values.teams[props.id].timeouts;

const availableSchools = ref();

const lowerThirdSchool = (props.id === 0) ? replicants.lowerThird.school1Logo : replicants.lowerThird.school2Logo;

async function saveSchool() {
	if (!availableSchools.value || !teamAbbr.value || !teamSchoolName.value ||
		!teamLogo.value || !teamPrimaryColor.value || !teamSecondaryColor.value || !teamName.value) {
		subtitle.value = "Error";
		color.value = "red";
		msg.value = "One of the fields is empty. Make sure all the fields are filled in order to save."
		return;
	}
	if (!lowerThirdSchool.value) {
		subtitle.value = "Error";
		color.value = "red";
		msg.value = "The lower third logo for this team is empty"
	}
	// If we can reach the database...
	try {
		// Add it to database
		const schoolRef = doc(db, "schools", availableSchools.value);
		await setDoc(schoolRef, {
			abbr: teamAbbr.value,
			abbr14: teamSchoolName.value,
			logo: teamLogo.value,
			lowerThirdLogo: lowerThirdSchool.value,
			name: availableSchools.value,
			primaryColor: teamPrimaryColor.value,
			secondaryColor: teamSecondaryColor.value,
			teamName: teamName.value
		});

	} finally {
		// Add it to local storage
		let left = 0;
		let right = schools.value.length - 1;
		// Check if the school is in the JSON
		while (left <= right) {
			let middle = Math.floor((left + right) / 2);
			if (availableSchools.value === schools.value[middle].name) {
				schools.value[middle].abbr = teamAbbr.value;
				schools.value[middle].abbr14 = teamSchoolName.value;
				schools.value[middle].logo = teamLogo.value;
				schools.value[middle].lowerThirdLogo = lowerThirdSchool.value;
				schools.value[middle].primaryColor = teamPrimaryColor.value;
				schools.value[middle].secondaryColor = teamSecondaryColor.value;
				schools.value[middle].teamName = teamName.value;
				localStorage.setItem("schools", JSON.stringify(schools.value));
				subtitle.value = "Success";
				color.value = "green";
				msg.value = "School exists, successfully replaced its values.";
				return;
			}
			if (schools.value[middle].name < availableSchools.value)
				left = middle + 1;
			else
				right = middle - 1;
		}
		// If it isn't in the JSON, add it
		left = 0;
		right = schools.value.length - 1;

		while (left <= right) {
			let middle = Math.floor((left + right) / 2);
			if (schools.value[middle].name === availableSchools.value)
				break;
			if (schools.value[middle].name < availableSchools.value)
				left = middle + 1;
			else
				right = middle - 1;
		}
		schools.value.splice(left, 0, {
			abbr: teamAbbr.value,
			abbr14: teamSchoolName.value,
			logo: teamLogo.value,
			lowerThirdSchool: lowerThirdSchool.value,
			name: availableSchools.value,
			primaryColor: teamPrimaryColor.value,
			secondaryColor: teamSecondaryColor.value,
			teamName: teamName.value
		})
		localStorage.setItem("schools", JSON.stringify(schools.value));
		subtitle.value = "Success";
		color.value = "green";
		msg.value = "Successfully added school.";
		if (db) {
			const schoolsRef = collection(db, "schools");
			const q = query(schoolsRef);
			const querySnapshot = await getDocs(q);
			querySnapshot.docs.forEach((document) => {
				if (schoolNames.value.indexOf(document.id) === -1)
					schoolNames.value.push(document.id);
			});
		} else {
			schoolNames.value.splice(left, 0, availableSchools.value);
		}
	}
}

function loadSchool() {
	if (!availableSchools.value) {
		subtitle.value = "Error";
		color.value = "red";
		msg.value = "School field is empty, select one of schools available to load it.";
		return;
	}
	let left = 0;
	let right = schools.value.length - 1;
	while (left <= right) {
		let middle = Math.floor((left + right) / 2);
		if (availableSchools.value === schools.value[middle].name) {
			teamAbbr.value = schools.value[middle].abbr;
			teamSchoolName.value = schools.value[middle].abbr14;
			teamLogo.value = schools.value[middle].logo;
			teamPrimaryColor.value = schools.value[middle].primaryColor;
			teamSecondaryColor.value = schools.value[middle].secondaryColor;
			teamName.value = schools.value[middle].teamName;
			lowerThirdSchool.value = schools.value[middle].lowerThirdLogo;
			subtitle.value = "Success";
			color.value = "green";
			msg.value = "School exists, successfully loaded its values.";
			return;
		}
		if (schools.value[middle].name < availableSchools.value)
			left = middle + 1;
		else
			right = middle - 1;
	}
	if (!availableSchools.value) {
		subtitle.value = "Error";
		color.value = "red";
		msg.value = "School does not exist, select one of schools available to load it.";
		return;
	}
}

async function deleteSchool() {
	if (!availableSchools.value) {
		if (!availableSchools.value) {
			subtitle.value = "Error";
			color.value = "red";
			msg.value = "School field is empty, select one of the schools available to load it.";
			return;
		}
	}
	try {
		const schoolRef = doc(db, "schools", availableSchools.value);
		const schoolDoc = await getDoc(schoolRef);
		if (!schoolDoc.exists()) {
			if (!availableSchools.value) {
				subtitle.value = "Error";
				color.value = "red";
				msg.value = "School does not exist, select one of the schools available to delete it.";
				return;
			}
			return;
		}
		const index = schoolNames.value.indexOf(availableSchools.value);
		await deleteDoc(schoolRef);
		subtitle.value = "Success";
		color.value = "green";
		msg.value = "School exists, successfully deleted it.";

		schoolNames.value.splice(index, 1);
		// The line below is trivial since you cannot select it as a value
		schools.value.splice(index, 1);
		localStorage.setItem("schools", JSON.stringify(schools.value));
	} catch (e) {
		subtitle.value = "Error";
		color.value = "red";
		msg.value = "Due to how the database works, there is no reason to delete the school " +
						"while there is no internet connection.";
	}
}

</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}
.ml-10 {
	margin-left: 10px;
}
.team-logo-container {
	display: flex;
	justify-content: center;
}
.team-logo {
	max-width: 50%;
}
.school-btns {
	font-size: 10px;
}
</style>
