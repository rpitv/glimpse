<template>
<div>
	<div class="display-text">
		{{ formattedCurrentTime }}
	</div>

	<div class="display-text">
		{{ formattedPeriod }}
	</div>
</div>
</template>

<script setup lang="ts">

import {computed} from "vue";
import {millisToString} from "../util";
import {loadReplicants} from "../../browser-common/replicants";
import {formatPeriod} from "../util";

const replicants = await loadReplicants();

const isClockEnabled = replicants.gameSettings.clock.enabled;
const currentTime = replicants.scoreboard.clock.time;

const arePeriodsEnabled = replicants.gameSettings.periods.enabled;
const currentPeriod = replicants.scoreboard.period;
const periodCount = replicants.gameSettings.periods.count;
const overtimeCount = replicants.gameSettings.periods.overtime.count;
const isOvertimeInfinite = replicants.gameSettings.periods.overtime.isInfinite;
const areShootoutsEnabled = replicants.gameSettings.periods.shootouts;


const formattedCurrentTime = computed<string>(() => {
	if (isClockEnabled.value) {
		return millisToString(currentTime.value);
	} else {
		return "Clock Disabled";
	}
});

const formattedPeriod = computed<string>(() => {
	if (!arePeriodsEnabled.value) {
		return "Periods Disabled";
	}
	const realOvertimeCount = isOvertimeInfinite.value ? Number.MAX_SAFE_INTEGER : overtimeCount.value;
	return formatPeriod(currentPeriod.value || 1, periodCount.value, realOvertimeCount, areShootoutsEnabled.value);
});
</script>

<style scoped lang="scss">
.display-text {
	text-align: center;
	font-size: 3em;
	font-weight: bold;
}
</style>
