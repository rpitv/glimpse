<template>
	<div>
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
			Display Scoreboard (Scoreboard values are updated once when the scoreboard (not lower third) is hidden)
		</h2>
		<br>
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
				v-if="replicants.gameSettings.style.value === 'rpitv-style7'"
				label="Location for the locator"
				:items="['ECAV Stadium', 'Houston Field House']"
				v-model="replicants.lowerThird.location"
				variant="outlined"
			></v-select>

		</h2>
		<br>
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
		<div v-if="replicants.gameSettings.style.value === 'espn'">
			<v-checkbox v-model="replicants.lowerThird.commentators.offset.enabled.value"
						label="Manually offset the commentators?" />
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
					<v-text-field v-model="replicants.lowerThird.commentators.leftPerson.value"
						  label="Left Person" variant="outlined"/>
				</v-col>
				<v-col cols="4">
					<v-text-field v-model="replicants.lowerThird.commentators.centerPerson.value"
						  label="Center Person" variant="outlined"/>
				</v-col>
				<v-col cols="4">
					<v-text-field v-model="replicants.lowerThird.commentators.rightPerson.value"
						  label="Right Person" variant="outlined"/>
				</v-col>
			</v-row>
		</div>
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
			<v-select v-model:value="replicants.lowerThird.endGraphics.type.value" :items="availableCreditsOptions" style="width: 20%" />
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
			<div>Home Penalty 1: #{{ replicants.teams[0].player1PenaltyNumber.value }} for {{ replicants.teams[0].player1PenaltyClock.value }}</div>
			<div>Home Penalty 2: #{{ replicants.teams[0].player2PenaltyNumber.value }} for {{ replicants.teams[0].player2PenaltyClock.value }}</div>
			<div>Away Penalty 1: #{{ replicants.teams[1].player1PenaltyNumber.value }} for {{ replicants.teams[1].player1PenaltyClock.value }}</div>
			<div>Away Penalty 2: #{{ replicants.teams[1].player2PenaltyNumber.value }} for {{ replicants.teams[1].player2PenaltyClock.value }}</div>
			<br>
		<div>FOOTBALL
		<ul>Downs: {{ replicants.scoreboard.down }}</ul>
		<ul>Possession: {{replicants.scoreboard}}</ul>
			<ul>Yards To Go: {{replicants.scoreboard.yardsToGo}}</ul>
			<ul>Play Clock: {{ replicants.scoreboard.playClock}}</ul>
			<ul>Football {{replicants.sync.values.football}}</ul>
			<ul>Timeouts Home Team {{replicants.teams[0].timeouts}}</ul>
			<ul>Timeouts Away Team {{replicants.teams[1].timeouts}}</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import {loadReplicants} from "../../browser-common/replicants";
import {computed} from "vue";

const replicants = await loadReplicants();

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
</script>

<style scoped>
.mt-10 {
	margin-top: 10px;
}
</style>
