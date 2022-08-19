<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<ScoreControl />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import ScoreControl from "./ScoreControl.vue";
import {NConfigProvider, darkTheme} from "naive-ui";
</script>

<style scoped lang="scss">
</style>
