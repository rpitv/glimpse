<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<ImageEditor />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">

import {NConfigProvider, darkTheme} from "naive-ui";
import ImageEditor from "./ImageEditor.vue";
</script>

<style scoped lang="scss">
</style>
