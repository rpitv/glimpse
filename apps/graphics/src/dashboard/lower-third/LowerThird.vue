<template>
	<div>
		<div id="previewDiv">
			<v-table>
				<thead>
				<tr>
					<th>Name</th>
					<th>Preview</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>Test</td>
					<td></td>
				</tr>
				<tr>
					<td colspan="2" class="center">
						<iframe :src="previewLocation" allowtransparency="true" class="preview"/>
					</td>
				</tr>
				</tbody>
			</v-table>
		</div>
		<h2>
			<v-btn @click="showBug"
						 :color="replicants.lowerThird.bug.value ? 'red' : 'green'"
						 class="text-none"
			>
				{{ replicants.lowerThird.bug.value ? "Hide" : "Show" }}
			</v-btn>
			Display Bug
		</h2>
		<br>
		<h2>
			<v-btn @click="replicants.lowerThird.scoreboard.value = !replicants.lowerThird.scoreboard.value"
						 :color="replicants.lowerThird.scoreboard.value ? 'red' : 'green'"
						 class="text-none"
			>
				{{ replicants.lowerThird.scoreboard.value ? "Hide" : "Show" }}
			</v-btn>
			Display Scoreboard
		</h2>
		<div style="display: flex;" class="mt-10">
			<v-combobox label="Lower Third - Scoreboard Description"
									density="comfortable"
									:items="scoreboardDescriptions"
									item-title="name"
									v-model="lowerThirdScoreboardDescription" variant="outlined"
			/>
			<v-btn @click="replicants.lowerThird.scoreboardDescription.value = lowerThirdScoreboardDescription">
				Update
			</v-btn>
		</div>
		<h2>
			<v-btn @click="replicants.lowerThird.locator.value = !replicants.lowerThird.locator.value"
						 :color="replicants.lowerThird.locator.value ? 'red' : 'green'"
						 class="text-none"
			>
				{{ replicants.lowerThird.locator.value ? "Hide" : "Show" }}
			</v-btn>
			Display Locator
			<br>
			<br>
			<v-select
					v-if="replicants.gameSettings.style.value !== 'espn'"
					label="Location for the locator"
					:items="['ECAV Stadium', 'Houston Field House']"
					v-model="replicants.lowerThird.location"
					variant="outlined"
			></v-select>
		</h2>
		<v-row>
			<v-col cols="6">
				<v-text-field label="Home/Left Team Logo (Only input trusted URLS)" variant="outlined"
											v-model="replicants.lowerThird.school1Logo.value"
				/>
			</v-col>
			<v-col cols="6">
				<v-text-field label="Away/Right Team Logo (Only input trusted URLS)" variant="outlined"
											v-model="replicants.lowerThird.school2Logo.value"/>
			</v-col>
		</v-row>
		<div>
			<v-checkbox v-model="replicants.lowerThird.commentators.offset.enabled.value"
									v-if="replicants.gameSettings.style.value === 'espn'"
									label="Manually offset the commentators?"/>
			<v-checkbox v-model="replicants.lowerThird.commentators.twoPoint5a.value"
									v-if="replicants.gameSettings.style.value === 'espn'"
									label="2.5A"/>
			<div v-if="replicants.lowerThird.commentators.offset.enabled.value">
				<h2>Set offset value:</h2>
				<v-slider
						v-model="replicants.lowerThird.commentators.offset.number.value"
						:step="0.1"
						:min="0"
						:max="100"
						thumb-label
				/>
				<br>
			</div>
			<h2>
				<v-btn
						@click="replicants.lowerThird.commentators.show.value = !replicants.lowerThird.commentators.show.value"
						:color="replicants.lowerThird.commentators.show.value ? 'red' : 'green'"
						class="text-none"
				>
					{{ replicants.lowerThird.commentators.show.value ? "Hide" : "Show" }}
				</v-btn>
				Display Commentators/Interviewer and Interviewee
			</h2>
			<br>
			<v-row>
				<v-col cols="4">
					<v-text-field v-model="replicants.lowerThird.commentators.leftPerson.name.value"
												label="Left Person" variant="outlined"/>
					<v-text-field v-model="replicants.lowerThird.commentators.leftPerson.description.value"
												label="Description" variant="outlined" v-if="replicants.gameSettings.style.value !== 'espn'"/>
				</v-col>
				<v-col cols="4">
					<v-text-field v-model="replicants.lowerThird.commentators.centerPerson.name.value"
												label="Center Person" variant="outlined"/>
					<v-text-field v-model="replicants.lowerThird.commentators.centerPerson.description.value"
												label="Description" variant="outlined" v-if="replicants.gameSettings.style.value !== 'espn'"/>
				</v-col>
				<v-col cols="4">
					<v-text-field v-model="replicants.lowerThird.commentators.rightPerson.name.value"
												label="Right Person" variant="outlined"/>
					<v-text-field v-model="replicants.lowerThird.commentators.rightPerson.description.value"
												label="Description" variant="outlined" v-if="replicants.gameSettings.style.value !== 'espn'"/>
				</v-col>
			</v-row>
		</div>
		<h2 v-if="replicants.gameSettings.style.value === 'espn'">
			<v-btn @click="replicants.lowerThird.showProduced.value = !replicants.lowerThird.showProduced.value"
						 :color="replicants.lowerThird.showProduced.value ? 'red' : 'green'"
						 class="text-none"
			>
				{{ replicants.lowerThird.showProduced.value ? "Hide" : "Show" }}
			</v-btn>
			Display Produced
		</h2>
		<h2>
			<v-btn @click="replicants.lowerThird.showCopyright.value = !replicants.lowerThird.showCopyright.value"
						 :color="replicants.lowerThird.showCopyright.value ? 'red' : 'green'"
						 class="text-none"
			>
				{{ replicants.lowerThird.showCopyright.value ? "Hide" : "Show" }}
			</v-btn>
			Display Copyright
		</h2>
		<div v-if="replicants.gameSettings.style.value !== 'espn'">
			<h2>
				<v-btn
						@click="replicants.lowerThird.endGraphics.show.value = !replicants.lowerThird.endGraphics.show.value"
						:color="replicants.lowerThird.endGraphics.disabled.value ? 'warning' : (replicants.lowerThird.endGraphics.show.value ? 'red' : 'green')"
						:disabled="replicants.lowerThird.endGraphics.disabled.value"
						class="text-none"
				>
					{{
						replicants.lowerThird.endGraphics.disabled.value ? "Wait" : (replicants.lowerThird.endGraphics.show.value ? "Hide" : "Show")
					}}
				</v-btn>
				Display End Graphics (Credits)
			</h2>
			<span>Type of End Graphic</span>
			<v-select v-model:value="replicants.lowerThird.endGraphics.type.value" :items="availableCreditsOptions"
								style="width: 20%"/>
			<div class="mt-10" id="endGraphicsSlider" v-if="replicants.lowerThird.endGraphics.type.value === 'scroll'">
				<label>Duration of One Scroll in Seconds ({{ replicants.lowerThird.endGraphics.length.value }}
					seconds)</label>
				<br>
				<v-slider
						:min="5"
						:max="60*5"
						v-model="replicants.lowerThird.endGraphics.length.value"
						:step="5"
						thumb-label
						style="width: 40%"
				/>
			</div>
			<div>
				<br>
				<v-text-field v-model="replicants.lowerThird.endGraphics.title.value" style="max-width: 40%"
											label="End Graphics Title" variant="outlined"/>
			</div>
			<div>
				<br>
				<v-textarea
						label="End Graphics Positions and Names"
						v-model="replicants.lowerThird.endGraphics.message.value"
						style="width: 40%"
				/>
			</div>
		</div>
		<br>
		<div>SOG TEAM 1: {{ replicants.teams[0].shots }}</div>
		<div>SOG TEAM 2: {{ replicants.teams[1].shots }}</div>
		<br>
		<div>Home Penalty 1: #{{ replicants.teams[0].player1PenaltyNumber.value }} for
			{{ replicants.teams[0].player1PenaltyClock.value }}
		</div>
		<div>Home Penalty 2: #{{ replicants.teams[0].player2PenaltyNumber.value }} for
			{{ replicants.teams[0].player2PenaltyClock.value }}
		</div>
		<div>Away Penalty 1: #{{ replicants.teams[1].player1PenaltyNumber.value }} for
			{{ replicants.teams[1].player1PenaltyClock.value }}
		</div>
		<div>Away Penalty 2: #{{ replicants.teams[1].player2PenaltyNumber.value }} for
			{{ replicants.teams[1].player2PenaltyClock.value }}
		</div>
		<br>
		<div>FOOTBALL
			<ul>Downs: {{ replicants.scoreboard.down }}</ul>
			<ul>Possession: {{ replicants.scoreboard }}</ul>
			<ul>Yards To Go: {{ replicants.scoreboard.yardsToGo }}</ul>
			<ul>Play Clock: {{ replicants.scoreboard.playClock }}</ul>
			<ul>Football {{ replicants.sync.values.football }}</ul>
			<ul>Timeouts Home Team {{ replicants.teams[0].timeouts }}</ul>
			<ul>Timeouts Away Team {{ replicants.teams[1].timeouts }}</ul>
		</div>
		<br/>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {computed, ref, watch} from "vue";
import ImageView from "../../graphics/glimpse/styles/espn/ImageView.vue";

const replicants = await loadReplicants();
const lowerThirdScoreboardDescription = ref<string>("");
const scoreboardDescriptions = ref<string[]>([
	"Halftime",
	"End of 1st",
	"1st Intermission",
	"End of 2nd",
	"2nd Intermission",
	"End of 3rd",
	"3rd Intermission",
	"End of 4th",
	"4th Intermission",
	"End of Reg.",
	"Overtime",
	"End 1st OT",
	"End 2nd OT",
	"End of OT",
	"Final OT",
	"Final SO",
	"Final",
]);


const previewLocation = `/bundles/graphics/graphics/glimpse.html`;

const availableCreditsOptions = computed<{ title: string, value: string }[]>(() => {
	return [
		{title: "Box", value: "box"},
		{title: "Scroll", value: "scroll"}
	]
});

function showBug() {
	if (replicants.gameSettings.style.value === "football" && replicants.scoreboard.visible.value)
		replicants.scoreboard.visible.value = false;
	replicants.lowerThird.bug.value = !replicants.lowerThird.bug.value
}

watch(replicants.lowerThird.scoreboardDescription, (newValue, oldValue) => {
	lowerThirdScoreboardDescription.value = newValue;
});
</script>

<style scoped lang="scss">
.mt-10 {
	margin-top: 10px;
}

#previewDiv {
	.show {
		opacity: 100;
	}

	.hide {
		opacity: 0;
	}

	.center {
		padding: 1vh;
	}
}

iframe {
	border: none;
	margin-left: 10%;
	margin-right: 10%;
	aspect-ratio: 16/9;
	width: 80%;
}
</style>
