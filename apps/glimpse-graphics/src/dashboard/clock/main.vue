<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<div>
				<ClockPeriodDisplay />
				<hr />
				<ClockPeriodControl />
				<hr />
				<ClockPeriodSettings />
			</div>
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import ClockPeriodDisplay from "./ClockPeriodDisplay.vue";
import ClockPeriodSettings from "./ClockPeriodSettings.vue";
import ClockPeriodControl from "./ClockPeriodControl.vue";
</script>

<style scoped lang="scss">
</style>
