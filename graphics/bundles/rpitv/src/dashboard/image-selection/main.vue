<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<ImageSelector />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">

import {NConfigProvider, darkTheme} from "naive-ui";
import ImageSelector from "./ImageSelector.vue";
</script>

<style scoped lang="scss">
</style>
