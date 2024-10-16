<template>
	<n-config-provider :theme="darkTheme">
		<Suspense>
			<Players />
			<template #fallback>
				Loading...
			</template>
		</Suspense>
	</n-config-provider>
</template>

<script setup lang="ts">
import {NConfigProvider, darkTheme} from "naive-ui";
import Players from "./Players.vue";

</script>

<style scoped>

</style>
