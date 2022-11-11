<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<div>
				<TeamsDisplay />
				<TeamsControl />
				<hr />
				<TeamsSettings />
			</div>
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import TeamsDisplay from "./TeamsDisplay.vue";
import TeamsControl from "./TeamsControl.vue";
import TeamsSettings from "./TeamsSettings.vue";
</script>

<style scoped lang="scss">
</style>
