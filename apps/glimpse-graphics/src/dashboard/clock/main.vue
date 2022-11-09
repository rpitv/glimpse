<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<div>
				<ClockControl />
				<PeriodControl />
			</div>
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import ClockControl from "./ClockControl.vue";
import {NConfigProvider, darkTheme} from "naive-ui";
import PeriodControl from "./PeriodControl.vue";
</script>

<style scoped lang="scss">
</style>
