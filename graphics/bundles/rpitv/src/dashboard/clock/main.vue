<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<div>
				<ClockPeriodDisplay />
				<hr />
				<ClockPeriodControl />
				<FootballControl />
				<hr />
				<n-collapse>
					<n-collapse-item title="Settings">
						<ClockPeriodSettings />
					</n-collapse-item>
				</n-collapse>
			</div>
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme, NCollapse, NCollapseItem} from "naive-ui";
import ClockPeriodDisplay from "./ClockPeriodDisplay.vue";
import ClockPeriodSettings from "./ClockPeriodSettings.vue";
import ClockPeriodControl from "./ClockPeriodControl.vue";
import FootballControl from "./FootballControl.vue";

</script>

<style scoped lang="scss">
</style>
