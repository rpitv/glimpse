<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<GameSettingsControl />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import GameSettingsControl from "./GameSettingsControl.vue";
</script>

<style scoped lang="scss">
</style>
