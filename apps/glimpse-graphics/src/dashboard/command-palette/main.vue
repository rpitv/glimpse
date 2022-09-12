<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<CommandPalette />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import CommandPalette from "./ComandPalette.vue";
</script>

<style scoped lang="scss">

</style>
