<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<ClockControl />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import ClockControl from "./ClockControl.vue";
import {NConfigProvider, darkTheme} from "naive-ui";
</script>

<style scoped lang="scss">
</style>
