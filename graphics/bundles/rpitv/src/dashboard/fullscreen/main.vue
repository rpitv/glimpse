<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<Fullscreen />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import Fullscreen from "./Fullscreen.vue";

</script>

<style scoped>

</style>
