<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<SyncSettings />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">

import {NConfigProvider, darkTheme} from "naive-ui";
import SyncSettings from "./SyncSettings.vue";
</script>

<style scoped lang="scss">
</style>
