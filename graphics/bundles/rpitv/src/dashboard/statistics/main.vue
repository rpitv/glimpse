<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<Statistics />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import Statistics from "./Statistics.vue";

</script>

<style scoped>

</style>
